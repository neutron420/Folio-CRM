import type { TaskPriority } from "@kanban/db";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  position?: number;
  assigneeIds?: string[];
  labelIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  columnId?: string;
  position?: number;
  assigneeIds?: string[];
  labelIds?: string[];
}

export interface MoveTaskInput {
  targetColumnId?: string;
  targetPosition?: number;
  prevTaskId?: string;
  nextTaskId?: string;
}

export interface TaskAssigneeInfo {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface TaskLabelInfo {
  id: string;
  name: string;
  color: string;
}

export interface TaskDetail {
  id: string;
  boardId: string;
  columnId: string;
  sprintId: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  position: number;
  dueDate: string | null;
  createdBy: string;
  assignees: TaskAssigneeInfo[];
  labels: TaskLabelInfo[];
  createdAt: string;
  updatedAt: string;
}
