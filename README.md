# Zelo — Production-Quality Collaborative Kanban Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3+-F472B6?logo=bun&logoColor=white)](https://bun.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0+-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0+-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)

Zelo is an enterprise-ready, real-time collaborative Kanban project management platform engineered with clean architecture, strict domain boundaries, and high-concurrency real-time capabilities.

---

## 🎯 Architecture & Engineering Philosophy

- **Backend & Database First**: Persisted PostgreSQL state is the single source of truth. Realtime WebSockets stream transitions; they do not hold authority.
- **Strictly Passwordless Identity**: Users authenticate exclusively through **Google OAuth 2.0** and **GitHub OAuth 2.0**, backed by cryptographically secure, opaque 256-bit database sessions with HttpOnly/Secure/SameSite cookies. No password hashes, no reset tokens, no traditional JWTs.
- **Floating-Point Fractional Kanban Ordering**: Card reordering operates via fractional midpoint positioning (`(posA + posB) / 2`), eliminating $O(N)$ row-rewrite penalties on single drag-and-drop operations.
- **Multi-Tenant Hierarchical RBAC**: Fail-closed access validation across the resource cascade (`User -> Workspace -> Project -> Board -> Column -> Task`).
- **Modular Monolith**: Designed for instant developer productivity while maintaining zero-cost extraction boundaries for future microservice extraction.

---

## 📚 Complete Engineering Documentation

Comprehensive specifications, protocols, and guides are maintained in the [`docs/`](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs) directory:

| Document | Description |
| :--- | :--- |
| 📖 [**Docs Index**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/README.md) | Complete documentation index and high-level platform summary |
| 🏛️ [**Architecture**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/ARCHITECTURE.md) | System overview, module boundaries, request lifecycles, and microservice decoupling |
| 🗺️ [**Implementation Plan**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/IMPLEMENTATION_PLAN.md) | 19-phase master development roadmap from backend foundation to UI integration |
| 🗄️ [**Database Architecture**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DATABASE.md) | Entity relationship diagram, schemas, fractional indexing, and Neon pooling |
| 🔐 [**Authentication & Sessions**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/AUTHENTICATION.md) | Google & GitHub OAuth 2.0 flows, PKCE, state tokens, and session management |
| 🔌 [**REST API (v1)**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/API.md) | REST API contracts, endpoints, request/response formats, and error codes |
| ⚡ [**WebSocket Realtime**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/WEBSOCKET.md) | Native Bun WebSocket protocol, room hierarchy, event dispatching, and heartbeat |
| 🧩 [**Domain Services**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/SERVICES.md) | Public service interfaces, domain responsibilities, and extraction readiness |
| 🛡️ [**Security & Hardening**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/SECURITY.md) | Threat modeling, CSRF, XSS defense, CORS, and rate limiting |
| 🧪 [**Testing Strategy**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/TESTING.md) | Vitest test suites, concurrent move tests, and integration testing |
| 🚀 [**Deployment & Infrastructure**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DEPLOYMENT.md) | Production cloud deployment, reverse proxies, and health check probes |
| ⚠️ [**Error Handling**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/ERROR_HANDLING.md) | Centralized error hierarchy, status code catalog, and error envelopes |
| ⚙️ [**Configuration**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/CONFIGURATION.md) | Zod-validated environment schema, secret management, and defaults |
| 💻 [**Local Development**](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/DEVELOPMENT.md) | Step-by-step developer onboarding, Bun commands, and migrations |

---

## 🗂️ Monorepo Structure

```
root/
├── apps/
│   ├── web/                     # Next.js 16 (React 19) App Router frontend
│   └── backend/                 # Bun HTTP REST API & WebSocket server
│
├── packages/
│   ├── db/                      # Prisma schema, migrations & client (@kanban/db)
│   ├── types/                   # Shared TypeScript models & contracts (@kanban/types)
│   ├── validation/              # Zod validation schemas (@kanban/validation)
│   ├── config/                  # Validated environment configuration (@kanban/config)
│   ├── logger/                  # Structured JSON logger (@kanban/logger)
│   ├── errors/                  # Standardized error hierarchy (@kanban/errors)
│   ├── eslint-config/           # Shared ESLint configuration
│   ├── typescript-config/       # Standardized TypeScript presets
│   └── ui/                      # Shared React component library
│
├── docs/                        # Architecture & engineering documentation
├── package.json                 # Monorepo workspaces definition
├── turbo.json                   # Turborepo task pipeline
└── bun.lock                     # Bun lockfile
```

---

## 🚀 Quickstart

### 1. Prerequisites
- [Bun](https://bun.sh/) (v1.2+)
- [Node.js](https://nodejs.org/) (v20+ or v24+)
- Neon PostgreSQL Account ([neon.tech](https://neon.tech))

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URLs and OAuth credentials (see [CONFIGURATION.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/CONFIGURATION.md)).

### 4. Database Setup
```bash
# Push schema and create migrations in Neon
bun run --filter @kanban/db db:migrate

# Seed database with sample teams, projects, and Kanban cards
bun run --filter @kanban/db db:seed
```

### 5. Launch Development Servers
```bash
bun run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API & WebSockets**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

---

## 🧪 Testing

```bash
# Run tests across all workspaces
bun run test

# Run tests with coverage
bun --filter backend test -- --coverage
```

---

## 🗺️ Implementation Phases

Follow the complete roadmap defined in [IMPLEMENTATION_PLAN.md](file:///c:/Users/R.K%20Singh/Desktop/kanban/docs/IMPLEMENTATION_PLAN.md):
- **Phase 0**: Repository Inspection ✅
- **Phase 1**: Backend Foundation
- **Phase 2**: Database Architecture
- **Phase 3**: Prisma + Neon Integration
- **Phase 4**: OAuth Authentication (Google & GitHub)
- **Phase 5**: Workspace + RBAC
- **Phase 6**: Projects + Boards
- **Phase 7**: Columns + Tasks
- **Phase 8**: Kanban Ordering & Atomic Movement
- **Phase 9**: Comments + Labels + Checklists
- **Phase 10**: Activity & Audit Logging
- **Phase 11**: In-App Notifications
- **Phase 12**: Realtime WebSocket System
- **Phase 13**: Analytics Engine
- **Phase 14**: Workspace Search
- **Phase 15**: Attachments Architecture
- **Phase 16**: Test Automation Suite
- **Phase 17**: Production Hardening
- **Phase 18**: Next.js Frontend Integration
