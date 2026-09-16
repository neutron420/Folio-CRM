# System Architecture

## 1. Overview & Architectural Philosophy

The Zelo Kanban platform is engineered as a **Modular Monolith** organized inside a high-performance **Turborepo** monorepo. It adheres to **Domain-Driven Design (DDD)** and **Clean Architecture** patterns.

The system decouples data mutation (handled via transactional HTTP REST APIs) from state synchronization (handled via real-time WebSockets). PostgreSQL serves as the persistent single source of truth.

```
+-----------------------------------------------------------------------------+
|                             Client Layer                                    |
|         Next.js 16 (React 19) App Router / Modern Desktop & Mobile          |
+------------------------------------+----------------------------------------+
                                     |
               REST API (HTTP/2)     |     WebSocket (WS / WSS)
               State Mutations       |     Live Event Streaming
                                     v
+------------------------------------+----------------------------------------+
|                          Bun API Gateway / Server                           |
|                      apps/backend (or apps/api)                             |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | Middleware Pipeline:                                                  |  |
|  | [Request ID] -> [Logger] -> [CORS] -> [Rate Limit] -> [Auth Session]  |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | Layered Domain Modules:                                               |  |
|  |  * Auth & Identity         * Workspace & RBAC      * Projects & Boards|  |
|  |  * Columns & Tasks         * Kanban Positioning    * Comments & Labels|  |
|  |  * Checklists & Deps       * Activities & Audit    * Notifications    |  |
|  |  * Analytics & Search      * Storage/Attachments   * Realtime Service |  |
|  +-----------------------------------+-----------------------------------+  |
+--------------------------------------|--------------------------------------+
                                       |
                   Internal In-Memory / Redis Event Bus
                                       |
                                       v
+--------------------------------------+--------------------------------------+
|                           Data Layer                                         |
|  +-----------------------------------+-----------------------------------+  |
|  | Prisma ORM Client (@kanban/db)                                        |  |
|  +-----------------------------------------------------------------------+  |
|  | Neon Serverless PostgreSQL Database (Connection Pooling + Direct URL) |  |
|  +-----------------------------------------------------------------------+  |
|  | Object Storage (Cloudflare R2 / AWS S3 abstraction for attachments)   |  |
+-----------------------------------------------------------------------------+
```

---

## 2. Turborepo Monorepo Architecture

The repository enforces modular code sharing through dedicated workspace packages.

```
root/
├── apps/
│   ├── web/                    # Next.js App Router frontend application
│   └── backend/                # Bun HTTP REST API & WebSocket server
│
├── packages/
│   ├── db/                     # Prisma schema, migrations, and typed client singleton
│   ├── types/                  # Shared TypeScript models, contracts, and enums
│   ├── validation/             # Zod validation schemas shared across API and Web
│   ├── config/                 # Type-safe environment parsing with @t3-oss/env or Zod
│   ├── logger/                 # Structured JSON logger with request correlation
│   ├── errors/                 # Standardized DomainError hierarchy and status codes
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── typescript-config/      # Standardized tsconfig presets
│   └── ui/                     # Shared React design system primitives
│
├── docs/                       # Complete engineering and operational documentation
├── turbo.json                  # Turborepo task pipeline definition
├── package.json                # Monorepo workspaces and developer tooling
└── bun.lock                    # Locked Bun dependency tree
```

### Workspace Dependency Graph

```
                   apps/web (Next.js)
                  /   |    \      \
                 /    |     \      \
                v     v      v      v
      @kanban/ui  @kanban/validation  @kanban/types  @kanban/config
                ^     ^      ^      ^
                 \    |     /      /
                  \   |    /      /
                   apps/backend (Bun API)
                      |
                      +---> @kanban/db ---> Neon PostgreSQL
                      |
                      +---> @kanban/logger
                      |
                      +---> @kanban/errors
```

---

## 3. Backend Clean Architecture (Modular Monolith)

Each backend module follows a strict unidirectional dependency structure. Business logic is strictly barred from routing definitions and controllers.

```
[HTTP Request / WS Message]
             |
             v
     [Route Layer]              -> URL pattern matching and middleware attachment
             |
             v
   [Controller Layer]           -> Extracts DTOs, invokes validation, unwraps responses
             |
             v
   [Validation Layer]           -> Zod schema parsing; rejects malformed payloads
             |
             v
     [Service Layer]            -> Core business logic, RBAC checks, transaction boundaries
             |
             v
   [Repository Layer]           -> Data access abstractions, SQL query composition
             |
             v
       [Prisma ORM]             -> Type-safe queries, connection pool management
             |
             v
   [Neon PostgreSQL DB]         -> Relational persistence & ACID transactions
```

### Module Folder Anatomy

Every domain module under `apps/backend/src/modules/<module-name>/` maintains this clean layout:

```
src/modules/tasks/
├── task.routes.ts          # Express/Hono/Bun router declaring endpoints and middleware
├── task.controller.ts      # HTTP/WS presentation handling
├── task.service.ts         # Pure domain rules, transactions, event publishing
├── task.repository.ts      # Prisma query encapsulation
├── task.schema.ts          # Zod validation schemas for Body, Query, and Params
└── task.types.ts           # Domain-specific DTOs and internal types
```

---

## 4. Request Lifecycle

The lifecycle of an API mutation (e.g. moving a task) illustrates how transactions, security, logging, and real-time broadcasts synchronize:

```
Client (Browser)            API Gateway/Middleware            TaskService & DB               Realtime / WebSocket
      |                               |                              |                                |
      |--- 1. PATCH /api/v1/tasks --->|                              |                                |
      |    Authorization: Cookie      |                              |                                |
      |                               |--- 2. Request ID Injection ->|                                |
      |                               |--- 3. Verify Session Cookie->|                                |
      |                               |--- 4. Verify RBAC Permission-|                                |
      |                               |--- 5. Validate Zod Schema -->|                                |
      |                                                              |                                |
      |                                                              |--- 6. BEGIN DB Transaction --->|
      |                                                              |    - Fetch Task & Board        |
      |                                                              |    - Calculate New Position    |
      |                                                              |    - Update Task Record        |
      |                                                              |    - Insert Activity Log       |
      |                                                              |--- 7. COMMIT Transaction ----->|
      |                                                              |                                |
      |                                                              |--- 8. Emit Internal Event ---->|
      |                                                              |    (TASK_MOVED)                |
      |<-- 9. HTTP 200 OK Response ---|                              |                                |
      |    { success: true, ... }     |                              |                                |
      |                                                                                               |--- 10. Broadcast WS Event ---> Other Clients
      |                                                                                               |    Room: board:{boardId}       in Board Room
```

---

## 5. Authentication & Session Architecture

Authentication relies exclusively on OAuth 2.0 federated identity providers (Google and GitHub).

```
Client                      API Server                   OAuth Provider (Google/GitHub)           PostgreSQL
  |                             |                                      |                              |
  |-- 1. GET /auth/google ----->|                                      |                              |
  |                             |-- 2. Generate PKCE & State --------->|                              |
  |<-- 3. Redirect to Auth URL -|                                      |                              |
  |                                                                    |                              |
  |-- 4. User Grants Permission -------------------------------------->|                              |
  |                                                                    |                              |
  |<-- 5. Redirect to /auth/callback/google?code=XYZ&state=... --------|                              |
  |                             |                                      |                              |
  |-- 6. Pass Code & State ---->|                                      |                              |
  |                             |-- 7. Exchange Code for Access Token->|                              |
  |                             |<-- 8. Return Token & Profile Data ---|                              |
  |                             |                                                                     |
  |                             |-- 9. Find/Create User & Upsert OAuthAccount ----------------------->|
  |                             |-- 10. Generate Opaque 256-bit Session Token ------------------------>|
  |                             |-- 11. Store Session (userId, expiresAt) in DB ---------------------->|
  |<-- 12. Set-Cookie: session -|                                                                     |
  |    HttpOnly; Secure; Lax    |                                                                     |
```

- **No Passwords**: No credential stuffing, no salt/hash storage, no reset flows.
- **Opaque Session Tokens**: High-entropy 32-byte cryptographic strings hashed or stored securely in the `Session` table.
- **Revocability**: Instant logout simply deletes the session record from the database.

---

## 6. Authorization Architecture (Hierarchical RBAC)

Authentication confirms **identity**, while Authorization validates **tenancy and privileges**. The resource graph follows a strict cascade:

```
[ User ]
   |
   +---> [ WorkspaceMember (OWNER | ADMIN | MEMBER | VIEWER) ]
              |
              +---> [ Workspace ]
                         |
                         +---> [ Project ]
                                  |
                                  +---> [ ProjectMember (Optional Override) ]
                                  |
                                  +---> [ Board ]
                                           |
                                           +---> [ Column ]
                                                    |
                                                    +---> [ Task ]
```

### Authorization Rules:
1. Every API request accessing a resource scoped under a Workspace verifies membership in that Workspace.
2. Actions are evaluated against role capabilities:
   - **OWNER**: Manage billing, delete workspace, transfer ownership, assign admins.
   - **ADMIN**: Create/archive projects, invite members, manage board settings.
   - **MEMBER**: Create, edit, comment, move tasks, manage checklists, view analytics.
   - **VIEWER**: Read-only access to boards, tasks, comments; cannot mutate state.
3. Middleware helper `authorizeWorkspace(requiredRole)` guarantees fail-closed defense.

---

## 7. Realtime WebSocket Architecture

The WebSocket subsystem operates on a **Publish-Subscribe Room Hierarchy**.

```
                           +------------------------+
                           |   WebSocket Client     |
                           +-----------+------------+
                                       |
                               1. WS Connect
                             Cookie: session=...
                                       v
                           +------------------------+
                           | WebSocket Auth Guard   |
                           | Validates Session      |
                           +-----------+------------+
                                       |
                               2. Authenticated
                                       v
                           +------------------------+
                           | Connection Registry    |
                           | Maps Socket -> User    |
                           +-----------+------------+
                                       |
                               3. Subscribe:
                        "board:b42", "workspace:w1"
                                       v
                     +------------------------------------+
                     |           Room Subscriptions       |
                     |  - workspace:{id}                  |
                     |  - project:{id}                    |
                     |  - board:{id}                      |
                     |  - user:{id}                       |
                     +-----------------+------------------+
                                       ^
                                       |
                           4. Broadcast Event (TASK_MOVED)
                                       |
                     +-----------------+------------------+
                     | Realtime Broadcast Service         |
                     | Dispatched from Domain Services    |
                     +------------------------------------+
```

- **Stateless Delivery**: Sockets receive broadcast frames. When a client reconnects, it pulls state via REST query, then resumes listening.
- **Heartbeat Protocol**: Sockets transmit Ping/Pong packets every 30 seconds to terminate ghost connections and detect half-open sockets.

---

## 8. Microservice Extraction Strategy

While built as a modular monolith to maximize velocity and transactional safety, the domain boundaries are designed for future zero-cost extraction:

```
+-------------------------------------------------------------------------------+
|                       Phase A: Modular Monolith (Current)                     |
|                                                                               |
|   apps/backend:                                                               |
|   [ Auth ] | [ Workspace ] | [ Project ] | [ Task ] | [ Realtime ] | [ Audit ]|
|                                                                               |
|   Direct Module Function Calls  | Shared In-Memory DB Transactions            |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       Phase B: Extracted Microservices                        |
|                                                                               |
|   +-------------------+     +--------------------+     +------------------+   |
|   | Auth & Identity   |     | Project & Tasks    |     | Realtime Gateway |   |
|   | Microservice      |     | Microservice       |     | Microservice     |   |
|   +---------+---------+     +---------+----------+     +--------+---------+   |
|             |                         |                         |             |
|             v                         v                         v             |
|   +-----------------------------------------------------------------------+   |
|   | Distributed Event Bus (Redis Streams / Apache Kafka / RabbitMQ)       |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

### Extraction Guidelines:
1. Modules **never** execute cross-domain SQL joins outside their repository.
2. Inter-module queries are executed via well-defined Service interfaces.
3. Event payloads are immutable DTOs serialized via shared schemas in `@kanban/types`.
