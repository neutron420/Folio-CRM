export interface ColumnTaskCount {
  columnId: string;
  columnName: string;
  position: number;
  taskCount: number;
}

export interface PriorityDistribution {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}

export interface AssigneeWorkload {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  taskCount: number;
}

export interface BoardAnalytics {
  boardId: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number; 
  overdueTasks: number;
  tasksByColumn: ColumnTaskCount[];
  tasksByPriority: PriorityDistribution;
  assigneeWorkload: AssigneeWorkload[];
}

export interface ProjectAnalytics {
  projectId: string;
  totalBoards: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasks: number;
  tasksByPriority: PriorityDistribution;
}
