# Realtime WebSocket Architecture

## 1. Overview

Realtime communication in Zelo provides sub-50ms live updates across collaborative Kanban boards. 

> [!IMPORTANT]
> **PostgreSQL is the source of truth; WebSockets are for broadcasting state transitions.** Mutations must always commit to the database through the REST API before an event is broadcast to connected clients.

---

## 2. Connection Lifecycle & Authentication

Native Bun HTTP servers support direct WebSocket upgrades on the same port or dedicated path (`/ws`).

```
Client Browser                            Bun API Gateway                        PostgreSQL (Neon)
      |                                          |                                       |
      |-- 1. HTTP Upgrade Request (/ws) -------->|                                       |
      |      Cookie: zelo_session=...            |                                       |
      |                                          |-- 2. Extract Token & Query Session -->|
      |                                          |<-- 3. Return User & Memberships ------|
      |                                          |                                       |
      |                                          |-- 4. Session Valid?                   |
      |                                          |      YES -> Proceed to upgrade        |
      |                                          |      NO  -> 401 Unauthorized / Close  |
      |<-- 5. 101 Switching Protocols -----------|                                       |
      |      (WebSocket Connection Established)  |                                       |
      |                                          |                                       |
      |-- 6. { action: "subscribe", channel: "board:b1" } ->                             |
      |                                          |-- 7. Validate Board Access -----------|
      |                                          |      Attach socket to Room            |
      |<-- 8. { event: "subscribed", channel: "board:b1" } --                            |
```

### Connection Handshake
- Upgrades originate at `ws://localhost:4000/ws` (or `wss://...` in production).
- Session cookies are validated inside the `upgrade(req)` hook. Unauthenticated upgrade requests are immediately rejected before WebSocket allocation.

---

## 3. Room & Channel Hierarchy

Sockets join named channels representing bounded resource scopes:

| Channel Pattern | Intended Audience | Example Events |
| :--- | :--- | :--- |
| `board:{boardId}` | Users actively viewing a Kanban board | `TASK_MOVED`, `TASK_CREATED`, `COLUMN_REORDERED` |
| `project:{projectId}` | Users viewing project boards and overview | `BOARD_CREATED`, `PROJECT_UPDATED` |
| `workspace:{workspaceId}` | All active members of an organization | `MEMBER_JOINED`, `MEMBER_REMOVED`, `WORKSPACE_UPDATED` |
| `user:{userId}` | Targeted personal channel | `NOTIFICATION_CREATED`, `INVITATION_RECEIVED` |

### Subscription Authorization
Clients cannot arbitrarily subscribe to channels. When a client sends a `subscribe` command:
1. The server inspects `socket.data.userId`.
2. Verifies the user has an active `WorkspaceMember` or `ProjectMember` record granting read access to the requested entity.
3. If authorized, socket joins the room. Otherwise, sends an `UNAUTHORIZED_CHANNEL` error frame.

---

## 4. Realtime Message Protocol

All frames are JSON strings adhering to a standardized schema.

### 4.1 Client-to-Server Actions

#### Subscribe to Channel
```json
{
  "action": "subscribe",
  "channel": "board:brd_sprint14"
}
```

#### Unsubscribe from Channel
```json
{
  "action": "unsubscribe",
  "channel": "board:brd_sprint14"
}
```

#### Ping (Keepalive)
```json
{
  "action": "ping"
}
```

---

### 4.2 Server-to-Client Broadcast Events

#### Task Moved Event
```json
{
  "event": "TASK_MOVED",
  "channel": "board:brd_sprint14",
  "timestamp": "2026-09-16T20:50:00.120Z",
  "data": {
    "taskId": "tsk_01",
    "boardId": "brd_sprint14",
    "fromColumnId": "col_todo",
    "toColumnId": "col_in_progress",
    "position": 1500.0,
    "movedBy": {
      "id": "usr_alex",
      "name": "Alex Chen"
    }
  }
}
```

#### Task Created Event
```json
{
  "event": "TASK_CREATED",
  "channel": "board:brd_sprint14",
  "timestamp": "2026-09-16T20:50:02.400Z",
  "data": {
    "task": {
      "id": "tsk_02",
      "columnId": "col_todo",
      "title": "Setup Neon Postgres pooler",
      "priority": "HIGH",
      "position": 2000.0,
      "assignees": []
    }
  }
}
```

#### New Comment Added
```json
{
  "event": "COMMENT_CREATED",
  "channel": "board:brd_sprint14",
  "timestamp": "2026-09-16T20:50:15.000Z",
  "data": {
    "taskId": "tsk_01",
    "comment": {
      "id": "cmt_99",
      "content": "PR is ready for review.",
      "user": { "id": "usr_alex", "name": "Alex Chen" }
    }
  }
}
```

#### In-App Notification
```json
{
  "event": "NOTIFICATION_CREATED",
  "channel": "user:usr_sarah",
  "timestamp": "2026-09-16T20:50:16.000Z",
  "data": {
    "id": "notif_44",
    "type": "TASK_ASSIGNED",
    "title": "Assigned to Task",
    "message": "Alex Chen assigned you to 'Setup Neon Postgres pooler'"
  }
}
```

---

## 5. Connection Maintenance & Resilience

### 5.1 Heartbeat Protocol (Ping/Pong)
- **Interval**: Server sends a ping frame every **30 seconds**.
- **Timeout**: If no pong response or inbound message is detected within **60 seconds**, the socket is forcibly terminated to prevent zombie connection memory leaks.

### 5.2 Disconnect & Cleanup
- When `socket.close()` fires, the socket is removed from all room maps in memory.
- In-flight operations complete without blocking.

### 5.3 Client Reconnection Strategy
Clients implement **Exponential Backoff with Jitter**:
1. Connection drops -> Wait $T = \min(1000 \times 2^{\text{retryCount}} + \text{jitter}, 30000)$ ms.
2. Upon successful reconnect:
   - Re-send channel subscriptions (`board:brd_sprint14`).
   - Query REST endpoint `GET /api/v1/boards/:id` to reconcile any missed state changes during downtime.
