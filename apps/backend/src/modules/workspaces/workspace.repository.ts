import { prisma } from "@kanban/db";
import type { WorkspaceRole, Workspace, WorkspaceMember } from "@kanban/db";

export class WorkspaceRepository {
  async findUserWorkspaces(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return memberships.map((m) => ({
      ...m.workspace,
      role: m.role,
      memberCount: m.workspace._count.members,
    }));
  }

  async findById(id: string) {
    return prisma.workspace.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.workspace.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    ownerId: string;
  }): Promise<Workspace> {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          ownerId: data.ownerId,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: data.ownerId,
          role: "OWNER",
        },
      });

      return workspace;
    });
  }

  async update(id: string, data: { name?: string; description?: string | null }) {
    return prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.workspace.delete({
      where: { id },
    });
  }

  async findMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      include: { user: true },
    });
  }

  async listMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async addMember(workspaceId: string, userId: string, role: WorkspaceRole = "MEMBER") {
    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async updateMemberRole(workspaceId: string, userId: string, role: WorkspaceRole) {
    return prisma.workspaceMember.update({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async removeMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });
  }

  async countOwners(workspaceId: string): Promise<number> {
    return prisma.workspaceMember.count({
      where: {
        workspaceId,
        role: "OWNER",
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }
}

export const workspaceRepository = new WorkspaceRepository();
