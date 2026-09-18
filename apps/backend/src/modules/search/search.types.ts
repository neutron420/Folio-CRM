export interface SearchTaskResult {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  boardId: string;
  boardName: string;
  columnId: string;
  columnName: string;
}

export interface SearchBoardResult {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  projectName: string;
}

export interface SearchMemberResult {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

export interface SearchResults {
  query: string;
  tasks: SearchTaskResult[];
  boards: SearchBoardResult[];
  members: SearchMemberResult[];
  totalMatches: number;
}
