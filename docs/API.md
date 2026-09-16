# REST API Specification (v1)

## 1. Global Standards & Conventions

All endpoints adhere to these conventions:
- **Base Prefix**: `/api/v1/`
- **Content Type**: `application/json; charset=utf-8`
- **Authentication**: Authenticated session cookie (`zelo_session`) or `Authorization: Bearer <session_token>`
- **Response Format**: Standardized API Envelope:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { ... }
  }
  ```
- **Error Format**:
  ```json
  {
    "success": false,
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Human-readable description",
      "details": [ ... ]
    }
  }
  ```

---

## 2. Authentication API (`/api/v1/auth`)

### 2.1 Initiating OAuth Flow
- **`GET /api/v1/auth/google`**
  - **Auth**: None
  - **Response**: `302 Redirect` to Google OAuth consent screen.
- **`GET /api/v1/auth/github`**
  - **Auth**: None
  - **Response**: `302 Redirect` to GitHub OAuth authorize screen.

### 2.2 OAuth Callbacks
- **`GET /api/v1/auth/google/callback`**
- **`GET /api/v1/auth/github/callback`**
  - **Query Params**: `code` (string), `state` (string)
  - **Response**: `302 Redirect` to `${FRONTEND_URL}/dashboard` with `Set-Cookie: zelo_session=...; HttpOnly; Secure; SameSite=Lax`.

### 2.3 Current Authenticated User Profile
- **`GET /api/v1/auth/me`**
  - **Auth**: Required
  - **Example Response**:
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "usr_clx9102ab",
          "name": "Alex Chen",
          "email": "alex.chen@example.com",
          "avatarUrl": "https://avatars.githubusercontent.com/u/12345"
        }
      }
    }
    ```

### 2.4 User Logout
- **`POST /api/v1/auth/logout`**
  - **Auth**: Required
  - **Response**: `200 OK` with cleared cookie header.
    ```json
    {
      "success": true,
      "data": { "message": "Successfully logged out" }
    }
    ```

---

## 3. Workspaces & Members API (`/api/v1/workspaces`)

### 3.1 List User's Workspaces
- **`GET /api/v1/workspaces`**
  - **Auth**: Required
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "ws_alpha01",
          "name": "Engineering Core",
          "slug": "engineering-core",
          "role": "OWNER",
          "memberCount": 8
        }
      ]
    }
    ```

### 3.2 Create Workspace
- **`POST /api/v1/workspaces`**
  - **Auth**: Required
  - **Request Body**:
    ```json
    {
      "name": "Product Design",
      "description": "Cross-functional design systems"
    }
    ```
  - **Response (`201 Created`)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "ws_design02",
        "name": "Product Design",
        "slug": "product-design",
        "role": "OWNER"
      }
    }
    ```

### 3.3 Workspace Members Management
- **`GET /api/v1/workspaces/:workspaceId/members`**
  - **Auth**: Workspace Member
- **`POST /api/v1/workspaces/:workspaceId/members`**
  - **Auth**: Workspace `OWNER` or `ADMIN`
  - **Request Body**:
    ```json
    {
      "email": "sarah.dev@example.com",
      "role": "MEMBER"
    }
    ```
- **`DELETE /api/v1/workspaces/:workspaceId/members/:memberId`**
  - **Auth**: Workspace `OWNER` or `ADMIN`

---

## 4. Projects & Boards API

### 4.1 Create Project
- **`POST /api/v1/workspaces/:workspaceId/projects`**
  - **Auth**: Workspace Member (`ADMIN` / `OWNER` / `MEMBER`)
  - **Request Body**:
    ```json
    {
      "name": "Q3 Kanban Overhaul",
      "description": "Backend rewrite and Next.js frontend",
      "color": "#6366F1",
      "icon": "kanban-square"
    }
    ```

### 4.2 List Workspace Projects
- **`GET /api/v1/workspaces/:workspaceId/projects`**
  - **Auth**: Workspace Member

### 4.3 Create Board in Project
- **`POST /api/v1/projects/:projectId/boards`**
  - **Request Body**:
    ```json
    {
      "name": "Sprint 14 Board",
      "description": "Two-week active sprint tasks"
    }
    ```

### 4.4 Get Full Board State (Columns + Cards + Assignees + Labels)
- **`GET /api/v1/boards/:boardId`**
  - **Auth**: Workspace Member
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "brd_99",
        "name": "Sprint 14 Board",
        "columns": [
          {
            "id": "col_todo",
            "name": "To Do",
            "position": 1000.0,
            "tasks": [
              {
                "id": "tsk_01",
                "title": "Build WebSocket Gateway",
                "priority": "HIGH",
                "position": 1000.0,
                "assignees": [{ "id": "usr_1", "name": "Alex" }],
                "labels": [{ "id": "lbl_1", "name": "Backend", "color": "#10B981" }]
              }
            ]
          }
        ]
      }
    }
    ```

---

## 5. Columns & Tasks API

### 5.1 Create Column
- **`POST /api/v1/boards/:boardId/columns`**
  - **Request Body**:
    ```json
    {
      "name": "In Review",
      "position": 3000.0
    }
    ```

### 5.2 Create Task
- **`POST /api/v1/columns/:columnId/tasks`**
  - **Request Body**:
    ```json
    {
      "title": "Integrate Neon Connection Pool",
      "description": "Use PgBouncer pooler connection string in apps/backend",
      "priority": "HIGH",
      "dueDate": "2026-10-01T12:00:00Z",
      "assigneeIds": ["usr_clx9102ab"],
      "labelIds": ["lbl_backend01"]
    }
    ```
  - **Response (`201 Created`)**: Returns created task with initialized fractional `position`.

### 5.3 Move / Reorder Task (Atomic Kanban Drag & Drop)
- **`PATCH /api/v1/tasks/:taskId/move`**
  - **Auth**: Workspace Member
  - **Request Body**:
    ```json
    {
      "targetColumnId": "col_in_progress",
      "targetPosition": 1500.0
    }
    ```
  - **Execution Behavior**:
    1. Runs within atomic database transaction.
    2. Updates `columnId` and `position` on Task.
    3. Writes `TASK_MOVED` entry into `activities` table.
    4. Triggers internal event broker to broadcast `TASK_MOVED` to WebSocket room `board:{boardId}`.
  - **Response (`200 OK`)**:
    ```json
    {
      "success": true,
      "data": {
        "taskId": "tsk_01",
        "boardId": "brd_99",
        "columnId": "col_in_progress",
        "position": 1500.0,
        "updatedAt": "2026-09-16T20:45:00.000Z"
      }
    }
    ```

---

## 6. Comments, Labels & Checklists

### 6.1 Add Comment
- **`POST /api/v1/tasks/:taskId/comments`**
  - **Request Body**:
    ```json
    { "content": "Database migration applied cleanly on staging cluster." }
    ```

### 6.2 Add Checklist Item
- **`POST /api/v1/checklists/:checklistId/items`**
  - **Request Body**:
    ```json
    { "content": "Configure SSL mode to require", "position": 1000.0 }
    ```

---

## 7. Search & Analytics

### 7.1 Multi-Entity Search
- **`GET /api/v1/workspaces/:workspaceId/search?q=neon`**
  - **Response**: Returns matching tasks, boards, and members with highlighting snippets.

### 7.2 Board Analytics
- **`GET /api/v1/boards/:boardId/analytics`**
  - **Response**: Task count by column, priority distribution, overdue card count, velocity metrics.

---

## 8. Error Response Specifications

| HTTP Code | Error Code | Scenario |
| :--- | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Request body failed Zod schema checks |
| `401` | `UNAUTHORIZED` | Session missing, expired, or invalid |
| `403` | `FORBIDDEN` | Insufficient RBAC role in workspace/board |
| `404` | `RESOURCE_NOT_FOUND`| Entity ID not found in database |
| `409` | `CONFLICT` | Unique constraint collision (e.g. slug already taken) |
| `429` | `RATE_LIMIT_EXCEEDED`| Request quota exceeded |
| `500` | `INTERNAL_SERVER_ERROR`| Unhandled server or database exception |
