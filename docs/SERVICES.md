# Domain Services Specification

## 1. Modular Monolith Architecture

The backend application (`apps/backend`) isolates core domain concerns into cohesive modules. Modules do not directly query another module's database tables or execute ad-hoc joins. Instead, all cross-domain operations invoke typed **Public Service Interfaces**.

---

## 2. Domain Modules

### 2.1 Auth & Identity Module (`modules/auth`)
- **Purpose**: Authenticate users via third-party OAuth providers and manage active session lifecycles.
- **Responsibilities**:
  - Exchange OAuth codes for provider tokens.
  - Link multiple OAuth providers to a single user identity.
  - Generate, validate, and revoke cryptographically secure opaque sessions.
- **Entities**: `User`, `OAuthAccount`, `Session`.
- **Public Interface**:
  - `validateSession(token: string): Promise<{ user: User; session: Session } | null>`
  - `createSession(userId: string): Promise<{ sessionToken: string; expiresAt: Date }>`
  - `revokeSession(token: string): Promise<void>`
  - `handleOAuthCallback(provider: 'GOOGLE' | 'GITHUB', code: string): Promise<{ sessionToken: string; user: User }>`
- **Dependencies**: Prisma DB client, Config module.
- **Extraction Path**: Easily extracted into a standalone **Auth & Identity Microservice** communicating via JWT/Paseto or central Redis session cache.

---

### 2.2 Workspace & RBAC Module (`modules/workspaces`)
- **Purpose**: Manage multi-tenant organization boundaries, memberships, and role hierarchies.
- **Responsibilities**:
  - Workspace creation, slug collision resolution, and metadata updates.
  - Member invitations, role modifications (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
  - Authorization guards checking tenant isolation.
- **Entities**: `Workspace`, `WorkspaceMember`, `Invitation`.
- **Public Interface**:
  - `getWorkspaceById(workspaceId: string): Promise<Workspace | null>`
  - `verifyMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | null>`
  - `assertHasRole(workspaceId: string, userId: string, minimumRole: Role): Promise<boolean>`
- **Dependencies**: Auth Module, Prisma DB client.
- **Extraction Path**: Can form a centralized **Tenant Management Service**.

---

### 2.3 Project & Board Module (`modules/projects`, `modules/boards`)
- **Purpose**: Group work items into logical project buckets and customizable Kanban boards.
- **Responsibilities**:
  - Create and configure projects with custom colors and icons.
  - Manage multiple boards per project.
  - Query full board state including columns, tasks, and assignees.
- **Entities**: `Project`, `ProjectMember`, `Board`.
- **Public Interface**:
  - `getBoardById(boardId: string): Promise<BoardWithHierarchy | null>`
  - `verifyBoardAccess(boardId: string, userId: string): Promise<boolean>`
- **Dependencies**: Workspace Module, Prisma DB client.

---

### 2.4 Column & Task Module (`modules/columns`, `modules/tasks`)
- **Purpose**: Core business engine driving the Kanban board lifecycle and atomic task movement.
- **Responsibilities**:
  - Column CRUD and column fractional reordering.
  - Task CRUD, priorities, due dates, and assignee assignments.
  - Atomic task movement across columns with fractional position calculations.
  - Automatic column rebalancing when precision limits are reached.
- **Entities**: `Column`, `Task`, `TaskAssignee`.
- **Public Interface**:
  - `createTask(dto: CreateTaskDTO, userId: string): Promise<Task>`
  - `moveTask(taskId: string, targetColumnId: string, targetPosition: number, userId: string): Promise<TaskMoveResult>`
  - `rebalanceColumn(columnId: string): Promise<void>`
- **Dependencies**: Activity Module, Realtime Service, Board Module.
- **Extraction Path**: Candidate for a high-scale **Kanban Execution Service**.

---

### 2.5 Comments, Labels & Checklists Module
- **Purpose**: Collaborative enhancements attached to individual task cards.
- **Responsibilities**:
  - Task discussions and markdown comment formatting.
  - Workspace label palette creation and many-to-many task tagging.
  - Subtask checklists with boolean completion flags.
- **Entities**: `Comment`, `Label`, `TaskLabel`, `Checklist`, `ChecklistItem`.
- **Public Interface**:
  - `addComment(taskId: string, userId: string, content: string): Promise<Comment>`
  - `attachLabel(taskId: string, labelId: string): Promise<void>`
  - `toggleChecklistItem(itemId: string, completed: boolean): Promise<ChecklistItem>`
- **Dependencies**: Task Module, Realtime Service, Notification Module.

---

### 2.6 Activity & Audit Module (`modules/activities`)
- **Purpose**: Provide an immutable audit trail of state changes across all workspaces.
- **Responsibilities**:
  - Record structured action events with JSON metadata payloads.
  - Query chronological activity feeds for boards and tasks.
- **Entities**: `Activity`.
- **Public Interface**:
  - `recordActivity(event: ActivityEventPayload): Promise<Activity>`
  - `getActivityStream(entityType: 'board' | 'task', entityId: string, limit: number): Promise<Activity[]>`
- **Dependencies**: Prisma DB client.
- **Extraction Path**: Can be transitioned to an asynchronous **Audit Log Service** consuming events from a message queue.

---

### 2.7 Notification Module (`modules/notifications`)
- **Purpose**: Manage in-app alert notifications triggered by team collaboration.
- **Responsibilities**:
  - Create alerts on task assignment, comments, and deadline alerts.
  - Query unread notifications for a user.
  - Mark notifications as read or dismissed.
- **Entities**: `Notification`.
- **Public Interface**:
  - `notifyUser(userId: string, type: NotificationType, payload: NotificationData): Promise<void>`
  - `getUnreadCount(userId: string): Promise<number>`
- **Dependencies**: Realtime Service (broadcasts alerts immediately to user room).

---

### 2.8 Realtime Module (`modules/realtime`)
- **Purpose**: Manage client WebSocket connections, channel subscriptions, and event fanout.
- **Responsibilities**:
  - Authenticate WebSocket upgrade handshakes via session cookies.
  - Maintain in-memory mapping of channel names to active WebSocket connections.
  - Fan out serialized JSON events to targeted rooms (`board:*`, `workspace:*`, `user:*`).
- **Entities**: None (In-memory connection state; Redis adapter ready).
- **Public Interface**:
  - `broadcastToBoard(boardId: string, event: string, payload: unknown): void`
  - `broadcastToWorkspace(workspaceId: string, event: string, payload: unknown): void`
  - `sendToUser(userId: string, event: string, payload: unknown): void`
- **Dependencies**: None.

---

### 2.9 Analytics & Search Module (`modules/analytics`, `modules/search`)
- **Purpose**: Operational metrics, velocity calculations, and workspace-wide search.
- **Responsibilities**:
  - Compute lead time, cycle time, overdue cards, and priority breakdowns.
  - Perform indexed full-text search across tasks, boards, and members.
- **Entities**: Read-only queries against `Task`, `Column`, `Activity`, `Board`.
- **Public Interface**:
  - `getBoardMetrics(boardId: string): Promise<BoardMetrics>`
  - `searchWorkspace(workspaceId: string, query: string): Promise<SearchResults>`
- **Dependencies**: Prisma DB client.
