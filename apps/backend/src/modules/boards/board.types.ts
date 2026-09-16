export interface CreateBoardInput {
  name: string;
  description?: string;
}

export interface UpdateBoardInput {
  name?: string;
  description?: string | null;
}

export interface BoardSummary {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  columnsCount?: number;
  tasksCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumnDetail {
  id: string;
  boardId: string;
  name: string;
  position: number;
  tasks: Array<{
    id: string;
    boardId: string;
    columnId: string;
    title: string;
    description: string | null;
    priority: string;
    position: number;
    dueDate: string | null;
    completedAt: string | null;
    assignees: Array<{
      id: string;
      userId: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    }>;
    labels: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  }>;
}

export interface BoardDetail {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  columns: BoardColumnDetail[];
  createdAt: string;
  updatedAt: string;
}
