# Master Implementation Plan

This implementation plan establishes the roadmap for building the Zelo Kanban platform. The plan follows a strict **Backend-First**, **Database-First** approach across 19 sequential phases (Phase 0 through Phase 18).

---

## 🗺️ Phase Roadmap Summary

| Phase | Title | Primary Focus |
| :--- | :--- | :--- |
| **Phase 0** | Repository Inspection | Monorepo audit, existing packages validation, architecture blueprint |
| **Phase 1** | Backend Foundation | Monorepo packages (`config`, `logger`, `errors`, `types`, `validation`), Bun API scaffold, middleware |
| **Phase 2** | Database Architecture | Domain modeling, entity definition, indexes, constraints, ER relationships |
| **Phase 3** | Prisma + Neon Integration | `@kanban/db` setup, Neon connection pooling, migrations, initial seed script |
| **Phase 4** | OAuth Authentication | Google & GitHub OAuth 2.0, session management, secure cookies |
| **Phase 5** | Workspace + RBAC | Multi-tenant workspace management, memberships, role guards (OWNER/ADMIN/MEMBER/VIEWER) |
| **Phase 6** | Projects + Boards | Project management, custom board creation, board membership |
| **Phase 7** | Columns + Tasks | Column creation, task CRUD, priority handling, assignees |
| **Phase 8** | Kanban Ordering & Movement | Floating-point fractional positioning, atomic reordering, same/cross-column moves |
| **Phase 9** | Comments + Labels + Checklists | Task discussions, color-coded workspace labels, checklist items |
| **Phase 10** | Activity & Audit Logging | Structured activity log stream, audit history per entity |
| **Phase 11** | Notifications | In-app notification engine, read/unread states, user subscriptions |
| **Phase 12** | WebSocket Realtime System | Native Bun WebSockets, room hierarchy, broadcast broker, connection lifecycle |
| **Phase 13** | Analytics | Velocity calculation, throughput metrics, overdue tracking, lead-time stats |
| **Phase 14** | Search | Multi-entity PostgreSQL full-text search across tasks, boards, and members |
| **Phase 15** | Attachments Architecture | File metadata storage, pre-signed upload URL abstraction (S3/R2 ready) |
| **Phase 16** | Comprehensive Testing | Vitest unit tests, integration test suites, concurrent task movement tests |
| **Phase 17** | Production Hardening | Rate limiting, CORS policies, security headers, graceful shutdown, health checks |
| **Phase 18** | Frontend Integration | Next.js 16 App Router interface, live Kanban board, drag-and-drop, WS state |

---

## Phase 0: Repository Inspection

- **Purpose**: Verify the existing monorepo configuration, dependency tree, and tooling to prevent breaking existing code.
- **Features**: Monorepo audit, workspace inspection, configuration alignment.
- **Files**:
  - `package.json`
  - `turbo.json`
  - `apps/backend/package.json`
  - `apps/web/package.json`
  - `packages/*`
- **Database Changes**: None.
- **API Changes**: None.
- **Dependencies**: Bun 1.3.x, Turborepo 2.x.
- **Testing Requirements**: Turborepo task check (`turbo run lint check-types`).
- **Completion Criteria**: Complete knowledge of all workspaces, confirmed package manager, validated docs folder layout.

---

## Phase 1: Backend Foundation

- **Purpose**: Establish core shared packages and the Bun HTTP/REST server skeleton with centralized middleware.
- **Features**:
  - Shared `@kanban/types`, `@kanban/config`, `@kanban/logger`, `@kanban/errors`, `@kanban/validation`.
  - HTTP Server with Bun native routing or modular router.
  - Middleware: Request ID correlation, Structured logging, Centralized error handling, CORS.
  - Health check endpoint (`GET /health`).
- **Files**:
  - `packages/config/src/*`
  - `packages/logger/src/*`
  - `packages/errors/src/*`
  - `packages/types/src/*`
  - `packages/validation/src/*`
  - `apps/backend/src/server.ts`
  - `apps/backend/src/app.ts`
  - `apps/backend/src/middleware/request-id.ts`
  - `apps/backend/src/middleware/error-handler.ts`
- **Database Changes**: None.
- **API Changes**:
  - `GET /health` -> `{ status: "ok", timestamp: "..." }`
- **Dependencies**: `zod`, `pino` (or custom zero-dep structured logger).
- **Testing Requirements**: Verify server launches on configured port and returns 200 OK on `/health`.
- **Completion Criteria**: Clean build across all packages, server boots with logging and error middleware.

---

## Phase 2: Database Architecture

- **Purpose**: Design the complete domain model with normalized schemas, foreign keys, compound indexes, and referential actions.
- **Features**: Complete relational mapping for 20+ entities: Users, OAuth, Sessions, Workspaces, Members, Projects, Boards, Columns, Tasks, Assignees, Labels, Checklists, Dependencies, Activities, Notifications, Attachments.
- **Files**:
  - `packages/db/prisma/schema.prisma`
- **Database Changes**: Full DDL schema definition.
- **API Changes**: None.
- **Dependencies**: `prisma`, `@prisma/client`.
- **Testing Requirements**: Prisma schema syntax validation (`prisma validate`).
- **Completion Criteria**: Schema compiles with valid cross-model relations and appropriate cascade policies.

---

## Phase 3: Prisma + Neon Integration

- **Purpose**: Establish real connectivity with Neon Serverless PostgreSQL with connection pooling and direct connection URLs.
- **Features**:
  - Prisma client factory singleton with query logging.
  - Initial migration deployment.
  - Comprehensive seed script with realistic teams, projects, and Kanban cards.
- **Files**:
  - `packages/db/src/client.ts`
  - `packages/db/prisma/migrations/*`
  - `packages/db/prisma/seed.ts`
- **Database Changes**: Apply migration `0001_init` to Neon PostgreSQL.
- **API Changes**: None.
- **Dependencies**: `@neondatabase/serverless` (optional driver adapter) or direct standard pooled connection.
- **Testing Requirements**: Execute migration and seed successfully, verify table row counts.
- **Completion Criteria**: Database tables created in Neon, seed script successfully populates demo workspace.

---

## Phase 4: OAuth Authentication

- **Purpose**: Implement secure, passwordless authentication using Google and GitHub OAuth 2.0.
- **Features**:
  - OAuth state & PKCE verification.
  - User creation & account linking.
  - Opaque 256-bit database sessions with secure HTTP-only cookies.
  - Session validation middleware.
  - Logout endpoint with session revocation.
- **Files**:
  - `apps/backend/src/modules/auth/*`
  - `apps/backend/src/middleware/auth.ts`
- **Database Changes**: Operates on `User`, `OAuthAccount`, and `Session` tables.
- **API Changes**:
  - `GET /api/v1/auth/google`
  - `GET /api/v1/auth/google/callback`
  - `GET /api/v1/auth/github`
  - `GET /api/v1/auth/github/callback`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
- **Dependencies**: Native `fetch` or Arctic/Lucia OAuth helpers.
- **Testing Requirements**: Unit test OAuth callback handlers, test session expiration and revocation.
- **Completion Criteria**: End-to-end OAuth flow works, sets secure cookie, and `/api/v1/auth/me` returns user profile.

---

## Phase 5: Workspace + RBAC

- **Purpose**: Establish multi-tenant organization boundaries and role-based access control.
- **Features**:
  - Workspace CRUD, slug generation, ownership assignment.
  - Member management (invite, update role, remove).
  - RBAC authorization middleware (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
- **Files**:
  - `apps/backend/src/modules/workspaces/*`
  - `apps/backend/src/middleware/authorization.ts`
- **Database Changes**: Operates on `Workspace`, `WorkspaceMember`, and `Invitation`.
- **API Changes**:
  - `POST /api/v1/workspaces`
  - `GET /api/v1/workspaces`
  - `GET /api/v1/workspaces/:workspaceId`
  - `PATCH /api/v1/workspaces/:workspaceId`
  - `DELETE /api/v1/workspaces/:workspaceId`
  - `POST /api/v1/workspaces/:workspaceId/members`
  - `PATCH /api/v1/workspaces/:workspaceId/members/:memberId`
  - `DELETE /api/v1/workspaces/:workspaceId/members/:memberId`
- **Dependencies**: Shared validation schemas.
- **Testing Requirements**: Verify non-members receive 403 Forbidden; verify viewers cannot mutate workspace properties.
- **Completion Criteria**: Full workspace isolation verified with RBAC enforcement.

---

## Phase 6: Projects + Boards

- **Purpose**: Manage project containers and multiple boards per project.
- **Features**:
  - Project creation, updating, archiving, color/icon tagging.
  - Multi-board support per project.
  - Default board initialization.
- **Files**:
  - `apps/backend/src/modules/projects/*`
  - `apps/backend/src/modules/boards/*`
- **Database Changes**: Operates on `Project`, `ProjectMember`, and `Board`.
- **API Changes**:
  - `POST /api/v1/workspaces/:workspaceId/projects`
  - `GET /api/v1/workspaces/:workspaceId/projects`
  - `GET /api/v1/projects/:projectId`
  - `PATCH /api/v1/projects/:projectId`
  - `DELETE /api/v1/projects/:projectId`
  - `POST /api/v1/projects/:projectId/boards`
  - `GET /api/v1/projects/:projectId/boards`
  - `GET /api/v1/boards/:boardId`
- **Dependencies**: Validation schemas, Auth middleware.
- **Testing Requirements**: Project creation within tenant boundary; board lifecycle operations.
- **Completion Criteria**: Projects and boards can be created, fetched, and scoped securely.

---

## Phase 7: Columns + Tasks

- **Purpose**: Core Kanban workflow entity management.
- **Features**:
  - Column management (Todo, In Progress, In Review, Done).
  - Task creation with title, description, priority, due date, assignees.
  - Task deletion and archiving.
- **Files**:
  - `apps/backend/src/modules/columns/*`
  - `apps/backend/src/modules/tasks/*`
- **Database Changes**: Operates on `Column`, `Task`, and `TaskAssignee`.
- **API Changes**:
  - `POST /api/v1/boards/:boardId/columns`
  - `PATCH /api/v1/columns/:columnId`
  - `DELETE /api/v1/columns/:columnId`
  - `POST /api/v1/columns/:columnId/tasks`
  - `GET /api/v1/tasks/:taskId`
  - `PATCH /api/v1/tasks/:taskId`
  - `DELETE /api/v1/tasks/:taskId`
- **Dependencies**: Database transactions, Event emitter.
- **Testing Requirements**: Task CRUD tests, verifying relations and priority validations.
- **Completion Criteria**: Tasks can be created under columns with assigned users.

---

## Phase 8: Task Ordering & Kanban Movement

- **Purpose**: High-performance, atomic card reordering and column transitions.
- **Features**:
  - Floating-point fractional positioning algorithm (`(prev + next) / 2`).
  - Automatic rebalancing triggered on dense clusters ($|a - b| < 0.001$).
  - Atomic database transactions updating task state, generating activity logs, and emitting events.
- **Files**:
  - `apps/backend/src/modules/tasks/task-movement.service.ts`
  - `apps/backend/src/utils/fractional-index.ts`
- **Database Changes**: Updates `Task.position` and `Task.columnId`.
- **API Changes**:
  - `PATCH /api/v1/tasks/:taskId/move` -> `{ targetColumnId, targetPosition }`
- **Dependencies**: Prisma transactions (`$transaction`).
- **Testing Requirements**: Concurrent move tests, position collision resolution, same-column and cross-column reordering.
- **Completion Criteria**: Sub-millisecond position calculations without full column rewrites.

---

## Phase 9: Comments + Labels + Checklists

- **Purpose**: Rich collaboration tools attached to Kanban cards.
- **Features**:
  - Task discussions with markdown comments.
  - Workspace-scoped color labels and task tag assignments.
  - Multi-item checklists with completion tracking.
- **Files**:
  - `apps/backend/src/modules/comments/*`
  - `apps/backend/src/modules/labels/*`
  - `apps/backend/src/modules/checklists/*`
- **Database Changes**: Operates on `Comment`, `Label`, `TaskLabel`, `Checklist`, `ChecklistItem`.
- **API Changes**:
  - `/api/v1/tasks/:taskId/comments`
  - `/api/v1/workspaces/:workspaceId/labels`
  - `/api/v1/tasks/:taskId/labels`
  - `/api/v1/tasks/:taskId/checklists`
- **Dependencies**: Validation schemas.
- **Testing Requirements**: Adding and deleting comments, toggle checklist items, check cascade deletes.
- **Completion Criteria**: Tasks reflect comments, labels, and checklist progress.

---

## Phase 10: Activity & Audit Logging

- **Purpose**: Immutable history and activity timeline across workspaces, projects, and tasks.
- **Features**:
  - Structured event recording (e.g. `TASK_MOVED`, `TASK_ASSIGNED`).
  - Contextual JSON metadata tracking previous and current values.
  - Activity stream queries with cursor-based pagination.
- **Files**:
  - `apps/backend/src/modules/activities/*`
- **Database Changes**: Operates on `Activity` table.
- **API Changes**:
  - `GET /api/v1/boards/:boardId/activities`
  - `GET /api/v1/tasks/:taskId/activities`
- **Dependencies**: Transactional logging hooks in Services.
- **Testing Requirements**: Confirm activities are generated whenever tasks or columns change.
- **Completion Criteria**: Complete audit trail populated for all state changes.

---

## Phase 11: Notifications

- **Purpose**: In-app notifications for task assignments, mentions, and due date warnings.
- **Features**:
  - Async notification generation on trigger events.
  - Mark as read, mark all read, unread count badge.
- **Files**:
  - `apps/backend/src/modules/notifications/*`
- **Database Changes**: Operates on `Notification` table.
- **API Changes**:
  - `GET /api/v1/notifications`
  - `PATCH /api/v1/notifications/:id/read`
  - `POST /api/v1/notifications/read-all`
- **Dependencies**: Internal Event Bus.
- **Testing Requirements**: Trigger notification on task assignment; verify user can read and dismiss.
- **Completion Criteria**: Notification service dispatches events and persists user alerts.

---

## Phase 12: WebSocket Realtime System

- **Purpose**: Instantaneous state synchronization across all connected clients.
- **Features**:
  - Native Bun WebSocket server running on same port or dedicated path (`/ws`).
  - Session cookie authentication on connection upgrade.
  - Subscription channels: `board:{boardId}`, `workspace:{workspaceId}`.
  - Broadcast of `TASK_MOVED`, `TASK_CREATED`, `COMMENT_ADDED`.
  - Heartbeat ping/pong and disconnect cleanup.
- **Files**:
  - `apps/backend/src/modules/realtime/*`
- **Database Changes**: None (In-memory registry + DB session verification).
- **API Changes**:
  - `WS /ws`
- **Dependencies**: Native Bun WebSocket engine.
- **Testing Requirements**: Multiple mock clients subscribing to board room, receiving task move event within 50ms.
- **Completion Criteria**: Real-time broadcasts reliably delivered to authorized clients.

---

## Phase 13: Analytics

- **Purpose**: Aggregate project management metrics and Kanban velocity.
- **Features**:
  - Total tasks, completion rate, average cycle time.
  - Task distribution by priority and assignee.
  - Cumulative flow diagram data aggregation.
- **Files**:
  - `apps/backend/src/modules/analytics/*`
- **Database Changes**: Read-only queries against `Task`, `Column`, `Activity`.
- **API Changes**:
  - `GET /api/v1/boards/:boardId/analytics`
  - `GET /api/v1/projects/:projectId/analytics`
- **Dependencies**: Prisma aggregation queries.
- **Testing Requirements**: Calculate correct completion percentages and lead times against seed data.
- **Completion Criteria**: Analytics endpoints return structured performance metrics.

---

## Phase 14: Search

- **Purpose**: Fast search across tasks, boards, and members within a workspace.
- **Features**:
  - PostgreSQL full-text search with `tsvector` and `tsquery` (or indexed `ILIKE` fallback).
  - Multi-entity search with filters (assignee, priority, due date).
- **Files**:
  - `apps/backend/src/modules/search/*`
- **Database Changes**: Compound search indexes on `Task(title, description)`.
- **API Changes**:
  - `GET /api/v1/workspaces/:workspaceId/search?q=query`
- **Dependencies**: Database search queries.
- **Testing Requirements**: Search query matches task titles and descriptions across workspace.
- **Completion Criteria**: Fast multi-entity search results returned with relevancy ranking.

---

## Phase 15: Attachments Architecture

- **Purpose**: Secure file attachment system with zero binary storage in PostgreSQL.
- **Features**:
  - Storage provider abstraction (`StorageService`).
  - Pre-signed upload and download URL generation (S3/Cloudflare R2 compatible).
  - Metadata tracking in PostgreSQL.
- **Files**:
  - `apps/backend/src/modules/attachments/*`
  - `apps/backend/src/services/storage.service.ts`
- **Database Changes**: Operates on `Attachment` table.
- **API Changes**:
  - `POST /api/v1/tasks/:taskId/attachments/presign`
  - `DELETE /api/v1/attachments/:attachmentId`
- **Dependencies**: AWS S3 SDK (or R2 client).
- **Testing Requirements**: Mock pre-signed URL generation and metadata persistence.
- **Completion Criteria**: Attachments linked to tasks without storing blobs in the database.

---

## Phase 16: Testing

- **Purpose**: Comprehensive test coverage across all domain modules.
- **Features**:
  - Vitest test runner configuration across monorepo packages.
  - Unit tests for Services and Repositories.
  - Integration tests for REST endpoints and RBAC guards.
  - Concurrency stress tests for task movement.
- **Files**:
  - `apps/backend/tests/*`
  - `packages/*/tests/*`
  - `vitest.config.ts`
- **Database Changes**: Test database environment.
- **API Changes**: None.
- **Dependencies**: `vitest`, `supertest` / native fetch test runner.
- **Testing Requirements**: >80% test coverage on core domain logic.
- **Completion Criteria**: All test suites pass cleanly in CI.

---

## Phase 17: Production Hardening

- **Purpose**: Security, performance, and operational reliability for cloud deployment.
- **Features**:
  - In-memory rate limiting with extensible interface for Redis.
  - HTTP security headers (Helmet equivalent, HSTS, CSP).
  - Graceful shutdown signal handling (`SIGTERM`, `SIGINT`).
  - Comprehensive health checks (`/health` verifying DB connectivity).
- **Files**:
  - `apps/backend/src/middleware/rate-limit.ts`
  - `apps/backend/src/server.ts`
- **Database Changes**: None.
- **API Changes**:
  - `GET /health/ready`
  - `GET /health/live`
- **Dependencies**: None.
- **Testing Requirements**: Verify rate limiter blocks excessive requests; test clean server teardown.
- **Completion Criteria**: API withstands load spikes and gracefully cleans up resources on shutdown.

---

## Phase 18: Frontend Integration

- **Purpose**: Connect the Next.js 16 App Router UI to the stable Bun backend and real-time WebSockets.
- **Features**:
  - Interactive Kanban board with drag-and-drop (@hello-pangea/dnd or dnd-kit).
  - Optimistic UI updates with rollback on error.
  - Live WebSocket updates reflecting colleague actions in real time.
  - OAuth login buttons and session management.
- **Files**:
  - `apps/web/app/*`
  - `apps/web/components/*`
  - `apps/web/hooks/use-websocket.ts`
- **Database Changes**: None.
- **API Changes**: Full client consumption of all REST and WS endpoints.
- **Dependencies**: Next.js, React 19, `@kanban/ui`, `@kanban/types`.
- **Testing Requirements**: End-to-end browser user flows.
- **Completion Criteria**: Fully functional collaborative Kanban platform matching production standards.
