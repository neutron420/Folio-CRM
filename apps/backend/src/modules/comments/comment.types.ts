export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface CommentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface CommentDTO {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  user: CommentUser;
  createdAt: string;
  updatedAt: string;
}
