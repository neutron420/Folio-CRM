import { ForbiddenError, NotFoundError } from "@kanban/errors";
import { prisma } from "@kanban/db";
import type { WorkspaceRole, WorkspaceMember } from "@kanban/db";

export const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export function hasMinimumRole(userRole: WorkspaceRole, minimumRole: WorkspaceRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minimumRole] ?? 0);
}

export async function requireWorkspaceMember(
  workspaceId: string,
  userId: string,
  minimumRole: WorkspaceRole = "VIEWER"
): Promise<WorkspaceMember> {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });

  if (!member) {
    // Check if workspace even exists
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundError(`Workspace with ID ${workspaceId} not found`);
    }

    throw new ForbiddenError("You are not a member of this workspace");
  }

  if (!hasMinimumRole(member.role, minimumRole)) {
    throw new ForbiddenError(
      `Permission denied. Requires role ${minimumRole} or higher, but you have ${member.role}`
    );
  }

  return member;
}
