export interface CreateColumnInput {
  name: string;
  position?: number;
}

export interface UpdateColumnInput {
  name?: string;
  position?: number;
}

export interface MoveColumnInput {
  prevPosition?: number;
  nextPosition?: number;
  targetPosition?: number;
}

export interface ColumnSummary {
  id: string;
  boardId: string;
  name: string;
  position: number;
  tasksCount?: number;
  createdAt: string;
  updatedAt: string;
}
