# Database Architecture & Specification

## 1. Overview

The Zelo Kanban database is powered by **Neon Serverless PostgreSQL** and accessed via **Prisma ORM**. PostgreSQL is the single persistent source of truth for all business state.

---

## 2. Entity Relationship Diagram (ERD)

```
       +------------------+                 +---------------------+
       |   OAuthAccount   |                 |       Session       |
       +------------------+                 +---------------------+
       | id (PK)          |                 | id (PK)             |
       | userId (FK) >----+--------+        | userId (FK) >-------+
       | provider         |        |        | token (UQ)          |
       | providerAccId    |        |        | expiresAt           |
       +------------------+        |        +---------------------+
                                   v
                         +-------------------+
                         |       User        |
                         +-------------------+
                         | id (PK)           |
                         | email (UQ)        |
                         | name              |
                         | avatarUrl         |
                         +---------+---------+
                                   |
              +--------------------+--------------------+
              | 1:N                                     | 1:N
              v                                         v
    +-------------------+                     +-------------------+
    |  WorkspaceMember  |                     |     Workspace     |
    +-------------------+                     +-------------------+
    | id (PK)           |                     | id (PK)           |
    | userId (FK)       |                     | name              |
    | workspaceId (FK) >+--------+            | slug (UQ)         |
    | role (ENUM)       |        |            | ownerId (FK)      |
    +-------------------+        |            +---------+---------+
                                 |                      |
                                 +----------------------+
                                                        | 1:N
                                                        v
                                              +-------------------+
                                              |      Project      |
                                              +-------------------+
                                              | id (PK)           |
                                              | workspaceId (FK)  |
                                              | name              |
                                              | color / icon      |
                                              +---------+---------+
                                                        |
                                                        | 1:N
                                                        v
                                              +-------------------+
                                              |       Board       |
                                              +-------------------+
                                              | id (PK)           |
                                              | projectId (FK)    |
                                              | name              |
                                              +---------+---------+
                                                        |
                                                        | 1:N
                                                        v
                                              +-------------------+
                                              |      Column       |
                                              +-------------------+
                                              | id (PK)           |
                                              | boardId (FK)      |
                                              | name              |
                                              | position (Float)  |
                                              +---------+---------+
                                                        |
                                                        | 1:N
                                                        v
                                              +-------------------+
                                              |       Task        |<-------------+
                                              +-------------------+              |
                                              | id (PK)           |              |
                                              | columnId (FK)     |              |
                                              | boardId (FK)      |              |
                                              | title             |              |
                                              | priority (ENUM)   |              |
                                              | position (Float)  |              |
                                              | dueDate           |              |
                                              +---+---+---+---+---+              |
                                                  |   |   |   |                  |
           +------------------+-------------------+   |   |   +----------+       |
           |                  |                       |   |              |       |
           v                  v                       v   v              v       v
+-------------------+ +----------------+ +------------------+ +--------------------+
|   TaskAssignee    | |    Comment     | |    Checklist     | |   TaskDependency   |
+-------------------+ +----------------+ +------------------+ +--------------------+
| id (PK)           | | id (PK)        | | id (PK)          | | id (PK)            |
| taskId (FK)       | | taskId (FK)    | | taskId (FK)      | | blockerTaskId (FK) |
| userId (FK)       | | userId (FK)    | | title            | | blockedTaskId (FK) |
+-------------------+ | content        | +--------+---------+ | type (BLOCKS/...)  |
                      +----------------+          |           +--------------------+
                                                  | 1:N
                                                  v
                                         +------------------+
                                         |  ChecklistItem   |
                                         +------------------+
                                         | id (PK)          |
                                         | checklistId (FK) |
                                         | content          |
                                         | completed (Bool) |
                                         | position (Float) |
                                         +------------------+
```

---

## 3. Detailed Entity Schema & Specifications

### 3.1 User & Identity Domain

#### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` (CUID/UUID) | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Normalized user email |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `avatarUrl` | `TEXT` | `NULLABLE` | Remote profile picture URL |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Last update timestamp |

#### Table: `oauth_accounts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Record ID |
| `userId` | `TEXT` | `NOT NULL`, `FK(users.id ON DELETE CASCADE)` | Owner user ID |
| `provider` | `VARCHAR(32)` | `NOT NULL` | `'GOOGLE'` or `'GITHUB'` |
| `providerAccountId`| `VARCHAR(255)` | `NOT NULL` | Provider subject/id |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Linked timestamp |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Last token refresh |

- **Unique Constraint**: `UNIQUE(provider, providerAccountId)`
- **Index**: `CREATE INDEX idx_oauth_user ON oauth_accounts(userId)`

#### Table: `sessions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Session ID |
| `token` | `VARCHAR(128)`| `UNIQUE`, `NOT NULL` | Cryptographically random token |
| `userId` | `TEXT` | `NOT NULL`, `FK(users.id ON DELETE CASCADE)` | Authenticated user |
| `expiresAt` | `TIMESTAMPTZ` | `NOT NULL` | Expiration timestamp |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Session inception |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Touch timestamp |

- **Indexes**:
  - `CREATE INDEX idx_sessions_token ON sessions(token)`
  - `CREATE INDEX idx_sessions_user_expires ON sessions(userId, expiresAt)`

---

### 3.2 Workspace & Multi-Tenancy Domain

#### Table: `workspaces`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Workspace ID |
| `name` | `VARCHAR(100)`| `NOT NULL` | Workspace name |
| `slug` | `VARCHAR(100)`| `UNIQUE`, `NOT NULL` | URL-friendly unique identifier |
| `description` | `TEXT` | `NULLABLE` | Workspace description |
| `ownerId` | `TEXT` | `NOT NULL`, `FK(users.id RESTRICT)` | Workspace owner |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Created at |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Updated at |

#### Table: `workspace_members`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Membership ID |
| `workspaceId`| `TEXT` | `NOT NULL`, `FK(workspaces.id ON DELETE CASCADE)` | Workspace ID |
| `userId` | `TEXT` | `NOT NULL`, `FK(users.id ON DELETE CASCADE)` | User ID |
| `role` | `VARCHAR(20)` | `NOT NULL DEFAULT 'MEMBER'` | `'OWNER'`, `'ADMIN'`, `'MEMBER'`, `'VIEWER'` |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Membership creation date |

- **Unique Constraint**: `UNIQUE(workspaceId, userId)`
- **Index**: `CREATE INDEX idx_wm_user ON workspace_members(userId)`

---

### 3.3 Project & Board Domain

#### Table: `projects`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Project ID |
| `workspaceId`| `TEXT` | `NOT NULL`, `FK(workspaces.id ON DELETE CASCADE)` | Parent workspace |
| `name` | `VARCHAR(120)`| `NOT NULL` | Project name |
| `description`| `TEXT` | `NULLABLE` | Project overview |
| `icon` | `VARCHAR(32)` | `NULLABLE` | Emoji or Lucide icon key |
| `color` | `VARCHAR(16)` | `NULLABLE` | Hex/Tailwind accent color |
| `createdBy` | `TEXT` | `NOT NULL`, `FK(users.id RESTRICT)` | Project creator |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Modification timestamp |

- **Index**: `CREATE INDEX idx_projects_workspace ON projects(workspaceId)`

#### Table: `boards`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Board ID |
| `projectId` | `TEXT` | `NOT NULL`, `FK(projects.id ON DELETE CASCADE)` | Parent project |
| `name` | `VARCHAR(120)`| `NOT NULL` | Board name |
| `description`| `TEXT` | `NULLABLE` | Board description |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Modification timestamp |

- **Index**: `CREATE INDEX idx_boards_project ON boards(projectId)`

---

### 3.4 Column & Task Domain (Kanban Core)

#### Table: `columns`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Column ID |
| `boardId` | `TEXT` | `NOT NULL`, `FK(boards.id ON DELETE CASCADE)` | Parent board |
| `name` | `VARCHAR(64)` | `NOT NULL` | e.g., "Todo", "In Progress" |
| `position` | `DOUBLE PRECISION` | `NOT NULL` | Fractional ordering index |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Timestamp |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Timestamp |

- **Index**: `CREATE INDEX idx_columns_board_pos ON columns(boardId, position ASC)`

#### Table: `tasks`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Task ID |
| `boardId` | `TEXT` | `NOT NULL`, `FK(boards.id ON DELETE CASCADE)` | Parent board |
| `columnId` | `TEXT` | `NOT NULL`, `FK(columns.id ON DELETE CASCADE)` | Current column |
| `title` | `VARCHAR(255)`| `NOT NULL` | Task title |
| `description`| `TEXT` | `NULLABLE` | Task markdown body |
| `priority` | `VARCHAR(16)` | `NOT NULL DEFAULT 'MEDIUM'` | `'LOW'`, `'MEDIUM'`, `'HIGH'`, `'URGENT'` |
| `position` | `DOUBLE PRECISION` | `NOT NULL` | Fractional position in column |
| `dueDate` | `TIMESTAMPTZ` | `NULLABLE` | Optional deadline |
| `createdBy` | `TEXT` | `NOT NULL`, `FK(users.id RESTRICT)` | Creator |
| `createdAt` | `TIMESTAMPTZ` | `DEFAULT now()` | Created at |
| `updatedAt` | `TIMESTAMPTZ` | `UPDATED AT` | Updated at |

- **Indexes**:
  - `CREATE INDEX idx_tasks_column_pos ON tasks(columnId, position ASC)`
  - `CREATE INDEX idx_tasks_board ON tasks(boardId)`
  - `CREATE INDEX idx_tasks_priority ON tasks(priority)`
  - `CREATE INDEX idx_tasks_due_date ON tasks(dueDate)`

---

### 3.5 Card Additions: Labels, Checklists, Comments, Attachments

#### Table: `labels` & `task_labels`
```sql
CREATE TABLE labels (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE task_labels (
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  label_id TEXT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);
```

#### Table: `checklists` & `checklist_items`
```sql
CREATE TABLE checklists (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE checklist_items (
  id TEXT PRIMARY KEY,
  checklist_id TEXT NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  content VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  position DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `comments`
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_comments_task ON comments(task_id, created_at DESC);
```

#### Table: `attachments`
```sql
CREATE TABLE attachments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(128) NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 3.6 Audit & Notifications

#### Table: `activities`
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  board_id TEXT REFERENCES boards(id) ON DELETE SET NULL,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action VARCHAR(64) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_activities_board ON activities(board_id, created_at DESC);
CREATE INDEX idx_activities_task ON activities(task_id, created_at DESC);
```

#### Table: `notifications`
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
```

---

## 4. Kanban Ordering Strategy (Floating-Point Fractional Indexing)

To achieve $O(1)$ task movement without updating every card in a column:

1. **Initial Spacing**: When cards are appended, they receive position $P_n = P_{n-1} + 1000.0$.
2. **Insertion Between Cards**: When card $C$ is dropped between card $A$ ($pos_A = 1000.0$) and card $B$ ($pos_B = 2000.0$):
   $$pos_C = \frac{pos_A + pos_B}{2} = \frac{1000.0 + 2000.0}{2} = 1500.0$$
3. **Boundary Drops**:
   - Dropping before first card $A$: $pos_C = pos_A / 2$
   - Dropping after last card $Z$: $pos_C = pos_Z + 1000.0$
4. **Automatic Rebalancing**:
   If $|pos_B - pos_A| < 0.0001$, a background or transactional rebalance resets positions in the column back to $1000.0, 2000.0, 3000.0 \dots$ to prevent floating-point precision loss.

---

## 5. Neon Configuration & Connection Pooling

Neon provides serverless PostgreSQL with two connection strings:
1. `DATABASE_URL`: Pooled connection string using Neon Connection Pooler (PgBouncer) for high-frequency short-lived queries.
2. `DIRECT_URL`: Direct connection to compute endpoint required by Prisma for migrations (`prisma migrate dev`).

```env
# Neon pooled connection
DATABASE_URL="postgres://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Neon direct connection (for migrations and DDL)
DIRECT_URL="postgres://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
```
