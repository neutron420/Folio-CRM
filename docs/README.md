# Kanban Platform Documentation

Welcome to the technical architecture and engineering documentation for **Zelo Kanban**, a production-grade, collaborative project-management platform built with TypeScript, Bun, Next.js, and PostgreSQL.

---

##  Documentation Index

| Document | Purpose & Scope |
| :--- | :--- |
| [ARCHITECTURE.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/ARCHITECTURE.md) | High-level system architecture, monorepo layout, modular monolith design, data flow, and microservice extraction path. |
| [IMPLEMENTATION_PLAN.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/IMPLEMENTATION_PLAN.md) | Complete 18-phase implementation roadmap detailing features, database changes, APIs, and completion criteria. |
| [DATABASE.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DATABASE.md) | Database architecture, complete entity models, ER diagram, indexing strategy, fractional ranking, and migrations. |
| [AUTHENTICATION.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/AUTHENTICATION.md) | Google & GitHub OAuth 2.0 flows, cryptographically secure session handling, cookie policies, and account linking. |
| [API.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/API.md) | Complete REST API specification for `/api/v1/*` endpoints, request/response formats, validation, and error contracts. |
| [WEBSOCKET.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/WEBSOCKET.md) | Realtime WebSocket architecture, room hierarchy, event dispatching, heartbeat protocol, and connection lifecycles. |
| [SERVICES.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/SERVICES.md) | Domain boundary specifications, module responsibilities, public interfaces, and microservice decoupling blueprints. |
| [SECURITY.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/SECURITY.md) | Threat modeling, OAuth & session security, RBAC matrices, CORS, rate limiting, and data protection practices. |
| [TESTING.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/TESTING.md) | Vitest testing strategy, unit, integration, and E2E testing patterns, concurrent task movement tests, and mocking. |
| [DEPLOYMENT.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DEPLOYMENT.md) | Production infrastructure, Neon serverless PostgreSQL, Bun containers, Next.js hosting, health checks, and CI/CD. |
| [ERROR_HANDLING.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/ERROR_HANDLING.md) | Standardized error taxonomy, error envelope structure, status mappings, and centralized error middleware. |
| [CONFIGURATION.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/CONFIGURATION.md) | Type-safe environment variable schema, configuration loading, secrets management, and development defaults. |
| [DEVELOPMENT.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DEVELOPMENT.md) | Local development setup guide, Bun scripts, Prisma workflows, database migrations, and debugging tips. |

---

## Core Engineering Principles

1. **Database as Single Source of Truth**: WebSockets broadcast state updates, but never hold or mutate persistent authority. Every mutation originates from an authorized, validated PostgreSQL transaction.
2. **Clean Domain Boundaries**: Business logic is strictly prohibited from HTTP route handlers or WebSocket connection managers. Logic lives in isolated Domain Services and Repositories.
3. **Passwordless Identity**: No email/password registrations, credential databases, or password reset tokens. Identity is federated via Google OAuth and GitHub OAuth, backed by secure, opaque session cookies.
4. **Fractional Kanban Positioning**: Tasks and columns utilize floating-point fractional ranking (`pos = (prev + next) / 2`), eliminating $O(N)$ reindexing on single-card drags.
5. **Multi-Tenant Hierarchical RBAC**: Strict resource chain validation: `User -> Workspace -> Project -> Board -> Column -> Task`. Authenticated status does not implicitly grant tenant access.
