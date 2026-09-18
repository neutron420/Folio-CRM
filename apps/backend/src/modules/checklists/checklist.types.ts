export interface CreateChecklistInput {
  title: string;
}

export interface CreateChecklistItemInput {
  content: string;
  position?: number;
}

export interface UpdateChecklistItemInput {
  content?: string;
  completed?: boolean;
  position?: number;
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
