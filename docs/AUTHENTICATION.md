# Authentication & Session Architecture

## 1. Authentication Strategy: Strictly Passwordless OAuth 2.0

Zelo Kanban rejects traditional username/password authentication, credential databases, and password resets. All identity verification is federated through trusted identity providers:

- **Google OAuth 2.0** (OpenID Connect / Google Identity)
- **GitHub OAuth 2.0** (GitHub Apps / OAuth Flow)

Authenticated users receive high-entropy, opaque session identifiers stored in PostgreSQL and delivered via secure, HTTP-only browser cookies.

```
       +-----------------------------------------------------------+
       |                  Client Browser (Next.js)                 |
       +-----------------------------+-----------------------------+
                                     |
              1. Click "Login with Google" or "Login with GitHub"
                                     v
       +-----------------------------------------------------------+
       |               Backend API (apps/backend)                  |
       |  GET /api/v1/auth/{provider}                              |
       +-----------------------------+-----------------------------+
                                     |
              2. Generate State (CSRF) + PKCE Code Verifier/Challenge
              3. Redirect to Provider Authorization Screen
                                     v
       +-----------------------------------------------------------+
       |               OAuth Provider (Google / GitHub)            |
       +-----------------------------+-----------------------------+
                                     |
              4. User Consents & Authenticates
              5. Redirect back to /api/v1/auth/{provider}/callback?code=...
                                     v
       +-----------------------------------------------------------+
       |               Backend API Callback Handler                |
       |  - Validate CSRF State parameter                          |
       |  - Exchange Code for Provider Access Token via TLS        |
       |  - Fetch Verified Identity (email, name, avatar)          |
       |  - Find or Create User Record                             |
       |  - Upsert OAuthAccount Record                             |
       |  - Mint Opaque 256-bit Session Token                      |
       |  - Store Session in PostgreSQL with Expiry                |
       |  - Send Set-Cookie Header (HttpOnly, Secure, SameSite)    |
       +-----------------------------+-----------------------------+
                                     |
              6. Redirect to Frontend Dashboard (/dashboard)
                                     v
       +-----------------------------------------------------------+
       |                Subsequent API & WS Calls                  |
       | Cookie automatically attached -> Session verified in DB   |
       +-----------------------------------------------------------+
```

---

## 2. Google OAuth 2.0 Detailed Flow

### Authorization URL
`GET /api/v1/auth/google`
- Generates a cryptographically random 32-byte `state` stored in an ephemeral HTTP-only cookie (`oauth_state`).
- Computes a PKCE `code_verifier` and SHA-256 `code_challenge` (for Google OIDC).
- Builds Google authorization URI:
  ```
  https://accounts.google.com/o/oauth2/v2/auth?
    client_id=GOOGLE_CLIENT_ID&
    redirect_uri=BACKEND_URL/api/v1/auth/google/callback&
    response_type=code&
    scope=openid%20email%20profile&
    state=GENERATED_STATE&
    code_challenge=CODE_CHALLENGE&
    code_challenge_method=S256&
    access_type=offline&
    prompt=consent
  ```

### Callback & Token Exchange
`GET /api/v1/auth/google/callback?code=...&state=...`
1. Validates `state` against the `oauth_state` cookie (CSRF prevention).
2. Performs server-to-server POST to `https://oauth2.googleapis.com/token`.
3. Calls `https://www.googleapis.com/oauth2/v3/userinfo` to retrieve:
   - `sub` (Google user ID)
   - `email` (must be `email_verified: true`)
   - `name`
   - `picture`

---

## 3. GitHub OAuth 2.0 Detailed Flow

### Authorization URL
`GET /api/v1/auth/github`
- Generates state cookie `oauth_state`.
- Redirects to:
  ```
  https://github.com/login/oauth/authorize?
    client_id=GITHUB_CLIENT_ID&
    redirect_uri=BACKEND_URL/api/v1/auth/github/callback&
    scope=read:user%20user:email&
    state=GENERATED_STATE
  ```

### Callback & Token Exchange
`GET /api/v1/auth/github/callback?code=...&state=...`
1. Validates CSRF `state`.
2. Exchanges authorization code at `https://github.com/login/oauth/access_token` with `Accept: application/json`.
3. Queries `https://api.github.com/user` and `https://api.github.com/user/emails` to resolve:
   - GitHub User ID
   - Primary verified email address
   - Full name / login
   - Avatar URL

---

## 4. User Resolution & OAuth Account Linking

When an identity provider returns a verified email, the backend executes an atomic transaction:

```typescript
// Conceptual user linking workflow
const user = await prisma.$transaction(async (tx) => {
  // 1. Check if OAuthAccount already exists
  let oauthAccount = await tx.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: { user: true },
  });

  if (oauthAccount) {
    // Return existing linked user
    return oauthAccount.user;
  }

  // 2. Check if a User already exists with this verified email
  let existingUser = await tx.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    // Create new User
    existingUser = await tx.user.create({
      data: {
        email,
        name,
        avatarUrl,
      },
    });

    // Create default personal workspace
    await tx.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug: generateSlug(name),
        ownerId: existingUser.id,
        members: {
          create: {
            userId: existingUser.id,
            role: "OWNER",
          },
        },
      },
    });
  }

  // 3. Link this OAuth provider to the User
  await tx.oAuthAccount.create({
    data: {
      userId: existingUser.id,
      provider,
      providerAccountId,
    },
  });

  return existingUser;
});
```

---

## 5. Session Management

### Session Creation
- Generate a 32-byte (256-bit) cryptographically random token:
  ```typescript
  import { randomBytes } from "node:crypto";
  const sessionToken = randomBytes(32).toString("hex");
  ```
- Store session in database:
  ```typescript
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: hashToken(sessionToken), // SHA-256 hashed in DB
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14-day lifetime
    },
  });
  ```

### Cookie Configuration
The raw session token is sent via the `Set-Cookie` header:

```http
Set-Cookie: zelo_session=RAW_TOKEN; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600
```

- `HttpOnly`: Prevents JavaScript XSS access.
- `Secure`: Transmitted only over HTTPS.
- `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF).
- `Max-Age`: 14 days (1,209,600 seconds).

### Session Validation Middleware
On each incoming REST and WebSocket request:
1. Parse cookie `zelo_session`.
2. Hash token using SHA-256.
3. Lookup session in PostgreSQL with `expiresAt > now()`.
4. If expired or missing, return `401 Unauthorized`.
5. Attach `req.user` and `req.session` to request context.
6. Optional sliding window: if session expires within 3 days, extend `expiresAt` by 7 days.

### Logout (`POST /api/v1/auth/logout`)
1. Delete session from `sessions` table.
2. Clear cookie by issuing `Set-Cookie: zelo_session=; Path=/; Max-Age=0`.

---

## 6. Required Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID="xxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxx"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/v1/auth/google/callback"

# GitHub OAuth
GITHUB_CLIENT_ID="Iv1.xxxxxx"
GITHUB_CLIENT_SECRET="xxxxxx"
GITHUB_CALLBACK_URL="http://localhost:4000/api/v1/auth/github/callback"

# Session & Security
SESSION_COOKIE_NAME="zelo_session"
SESSION_SECRET="super-secure-32-byte-secret-for-signing-cookies"
FRONTEND_URL="http://localhost:3000"
```
