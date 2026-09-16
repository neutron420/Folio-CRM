export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type OAuthProvider = "GOOGLE" | "GITHUB";

export type DependencyType = "BLOCKS" | "BLOCKED_BY";

export type ActivityAction =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_MOVED"
  | "TASK_DELETED"
  | "TASK_ASSIGNED"
  | "TASK_UNASSIGNED"
  | "TASK_COMPLETED"
  | "COMMENT_CREATED"
  | "COMMENT_UPDATED"
  | "COMMENT_DELETED"
  | "COLUMN_CREATED"
  | "COLUMN_UPDATED"
  | "COLUMN_MOVED"
  | "COLUMN_DELETED"
  | "MEMBER_JOINED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_UPDATED"
  | "BOARD_CREATED"
  | "PROJECT_CREATED"
  | "WORKSPACE_CREATED";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "COMMENT_MENTION"
  | "TASK_DUE_SOON"
  | "WORKSPACE_INVITATION"
  | "TASK_COMPLETED";


export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;


export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  role?: WorkspaceRole;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDTO {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDTO {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnDTO {
  id: string;
  boardId: string;
  name: string;
  position: number;
  tasks?: TaskDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskDTO {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  position: number;
  dueDate: string | null;
  createdBy: string;
  assignees?: UserDTO[];
  labels?: LabelDTO[];
  checklistSummary?: {
    total: number;
    completed: number;
  };
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabelDTO {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentDTO {
  id: string;
  taskId: string;
  userId: string;
  user?: UserDTO;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItemDTO {
  id: string;
  checklistId: string;
  content: string;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistDTO {
  id: string;
  taskId: string;
  title: string;
  items: ChecklistItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDTO {
  id: string;
  workspaceId: string;
  projectId: string | null;
  boardId: string | null;
  taskId: string | null;
  userId: string;
  user?: UserDTO;
  action: ActivityAction;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export type WebSocketClientAction =
  | { action: "subscribe"; channel: string }
  | { action: "unsubscribe"; channel: string }
  | { action: "ping" };

export interface WebSocketServerEvent<T = unknown> {
  event: string;
  channel: string;
  timestamp: string;
  data: T;
}

export interface TaskMovedEventData {
  taskId: string;
  boardId: string;
  fromColumnId: string;
  toColumnId: string;
  position: number;
  movedBy: {
    id: string;
    name: string;
  };
}
