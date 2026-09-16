# Security & Hardening Architecture

## 1. Threat Modeling & Core Defense Principles

The Zelo platform is engineered to defend against modern web vulnerabilities (OWASP Top 10) through layered defense-in-depth:

```
[ Inbound Request ]
         |
         v
1. Network & TLS Layer      -> TLS 1.3, Strict-Transport-Security (HSTS)
         |
         v
2. CORS & Rate Limiting     -> Whitelisted Origins, IP/User Token Bucket
         |
         v
3. Session Security         -> Opaque 256-bit Token, HttpOnly/Secure/SameSite Cookies
         |
         v
4. Zod Schema Validation    -> Strict Schema Stripping (No prototype pollution/extra keys)
         |
         v
5. Hierarchical RBAC        -> Multi-Tenant Membership Verification (Fail-Closed)
         |
         v
6. Prisma Parameterized DB  -> 100% Parameterized Queries (Zero Raw SQL Injections)
```

---

## 2. Authentication & Session Security

### 2.1 Passwordless Architecture
- Storing passwords introduces major vulnerability surfaces (credential stuffing, weak hashing, compromised reset links).
- Zelo completely eliminates local passwords: authentication is delegated solely to **Google** and **GitHub** OAuth 2.0 with email verification enforcement.

### 2.2 OAuth CSRF Defense: Cryptographic State & PKCE
- Each OAuth redirect generates a cryptographically random, unguessable `state` string stored in an ephemeral, signed cookie.
- Callbacks verify that `query.state === cookie.state`. Mismatches abort with `403 Forbidden`.
- Google flows enforce **PKCE (Proof Key for Code Exchange)** using SHA-256 code challenges (`S256`), preventing authorization code interception.

### 2.3 Session Tokens & Cookie Hardening
- **High-Entropy Tokens**: 32 cryptographically random bytes generated via `crypto.randomBytes(32)` (256 bits of entropy).
- **Hashed Persistence**: Only the SHA-256 digest of the token is stored in the PostgreSQL `sessions` table. Even with full read access to the database, attackers cannot impersonate active sessions.
- **Cookie Attributes**:
  - `HttpOnly`: Strictly inaccessible to client JavaScript (`document.cookie`), neutralizing token theft via XSS.
  - `Secure`: Transmitted only over HTTPS.
  - `SameSite=Lax`: Automatically stops cross-site request forgery while allowing top-level OAuth redirect navigations.
  - `Path=/`: Restricts scope to application root.

---

## 3. Authorization & Multi-Tenant Isolation

### 3.1 The Fail-Closed Principle
Authenticated status does not imply resource authorization. Every API handler verifies:
1. Does the requested resource belong to Workspace $W$?
2. Is the authenticated User an active member of Workspace $W$?
3. Does the member's Role (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) permit the operation?

```typescript
// Reusable fail-closed authorization check
export async function assertWorkspaceAccess(
  userId: string,
  workspaceId: string,
  allowedRoles: WorkspaceRole[] = ['OWNER', 'ADMIN', 'MEMBER']
): Promise<WorkspaceMember> {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });

  if (!membership || !allowedRoles.includes(membership.role)) {
    throw new ForbiddenError("Insufficient permissions to perform this action");
  }

  return membership;
}
```

---

## 4. Input Validation & Schema Enforcement

- Every external payload (Request Body, Path Parameters, Query Strings) is validated using **Zod** before reaching domain logic.
- Zod schemas enforce `.strict()` or parse through safe DTO mappings to strip unpermitted properties, thwarting prototype pollution or unexpected property injection.

---

## 5. Network, CORS & Rate Limiting

### 5.1 Cross-Origin Resource Sharing (CORS)
- Explicit allowed origins read from validated environment variables (`CORS_ORIGIN`).
- Wildcards (`*`) with `credentials: true` are strictly disallowed.
- Headers are restricted to necessary standards (`Content-Type`, `Authorization`, `X-Request-ID`).

### 5.2 Rate Limiting
- Rate limiting middleware tracks request budgets per client IP and authenticated User ID.
- Default limit: **100 requests per minute** for standard endpoints; **10 requests per minute** for OAuth endpoints.
- Designed with a unified `RateLimiter` interface backed by in-memory token buckets, ready to swap to Redis with no code refactoring.

---

## 6. WebSocket Security

1. **Handshake Verification**: Sockets verify the `zelo_session` cookie during the HTTP upgrade handshake before accepting the connection.
2. **Channel Authorization**: Sockets cannot subscribe to `board:{id}` or `workspace:{id}` unless the authenticated user is an authorized member.
3. **Payload Inspection**: All inbound frames are validated against Zod schemas; malformed frames trigger socket closure.
4. **Flood Protection**: Sockets sending more than 20 frames per second are disconnected.

---

## 7. Secrets Management & Logging Hygiene

- Secrets (`SESSION_SECRET`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_SECRET`, `DATABASE_URL`) are loaded and validated via `@kanban/config` at startup. Missing keys prevent server boot.
- The structured logger (`@kanban/logger`) uses automated redaction to guarantee session tokens, OAuth secrets, and authorization headers are never written to logs or disk.
