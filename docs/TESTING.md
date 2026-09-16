# Testing Strategy & Test Suites

## 1. Overview & Test Philosophy

Quality and correctness in Zelo are validated through automated tests run via **Vitest**. Testing follows the **Testing Pyramid**:

```
             / \
            / E2E \              (Critical user journeys via Playwright)
           /-------\
          /  Integ. \            (REST APIs, WebSocket events, DB Transactions)
         /-----------\
        /  Unit Tests \          (Domain Services, Fractional Indexing, Validation)
       +---------------+
```

---

## 2. Test Suites & Architecture

### 2.1 Unit Testing
- **Scope**: Pure business logic, utilities, and validation schemas.
- **Key Modules**:
  - `fractional-index.test.ts`: Validates midpoint calculations, edge drops, precision limits, and rebalance triggers.
  - `validation.test.ts`: Checks Zod schema boundaries on task creation, priority enums, and workspace slugs.
  - `authorization.test.ts`: Checks role hierarchy evaluations (`VIEWER` cannot perform `MEMBER` actions).

### 2.2 Integration Testing
- **Scope**: Controller-to-Database workflows using test PostgreSQL databases or mocked Prisma clients.
- **Key Suites**:
  - `auth.integration.test.ts`: Tests session minting, cookie handling, session expiration, and logout.
  - `task-movement.integration.test.ts`: Tests atomic cross-column task movement and activity log creation.
  - `rbac.integration.test.ts`: Ensures non-members cannot read or mutate tenant resources.

### 2.3 Realtime WebSocket Testing
- **Scope**: WebSocket upgrade, session validation, channel subscriptions, and event fanout.
- **Key Suites**:
  - Tests that a socket subscribed to `board:b1` receives `TASK_MOVED` when `PATCH /tasks/:id/move` executes.
  - Tests that a socket lacking workspace permissions receives an `UNAUTHORIZED_CHANNEL` rejection.

---

## 3. Critical Test Cases Specification

### 3.1 Authentication & Sessions
- `should reject expired session token with 401 Unauthorized`
- `should successfully revoke session on logout`
- `should prevent session hijacking with invalid SHA-256 hash`

### 3.2 Authorization & Tenant Isolation
- `should deny access to private workspace for authenticated non-member (403 Forbidden)`
- `should prevent VIEWER role from moving or editing tasks`
- `should allow ADMIN to invite members but prevent them from deleting workspace`

### 3.3 Kanban Movement & Fractional Indexing
- `should correctly position card between two existing tasks (e.g. 1000 and 2000 -> 1500)`
- `should position card at top of column with positive float (pos / 2)`
- `should position card at bottom of column (last_pos + 1000)`
- `should trigger automatic rebalance when card spacing drops below epsilon (0.0001)`

### 3.4 Concurrency & Race Conditions
- `should handle two concurrent moves to the same target column without position corruption`
- `should maintain ACID isolation during simultaneous task move and comment creation`

---

## 4. Test Execution Commands

```bash
# Run all tests across the monorepo
bun run test

# Run tests in apps/backend with coverage
bun --filter backend test -- --coverage

# Run tests in watch mode during development
bun --filter backend test:watch
```
