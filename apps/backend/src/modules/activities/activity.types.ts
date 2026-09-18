import type { Activity } from "@kanban/db";

export interface RecordActivityDTO {
  workspaceId: string;
  projectId?: string | null;
  boardId?: string | null;
  taskId?: string | null;
  userId: string;
  action: string;
  metadata?: Record<string, any>;
}

export interface ActivityQueryOptions {
  limit?: number;
  cursor?: string;
  offset?: number;
}

export type ActivityWithUser = Activity & {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};
