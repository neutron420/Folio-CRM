import type { WorkspaceRole, Workspace, WorkspaceMember, User } from "@kanban/db";

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string | null;
}

export interface AddMemberInput {
  email: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberInput {
  role: WorkspaceRole;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  role: WorkspaceRole;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberInfo {
  id: string;
  userId: string;
  role: WorkspaceRole;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  joinedAt: string;
}
