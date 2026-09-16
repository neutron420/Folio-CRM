import { prisma } from "@kanban/db";
import type { Project } from "@kanban/db";
import type { CreateProjectInput, UpdateProjectInput } from "./project.types";

export class ProjectRepository {
  async findByWorkspaceId(workspaceId: string) {
    return prisma.project.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { boards: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            ownerId: true,
          },
        },
        _count: {
          select: { boards: true },
        },
      },
    });
  }

  async create(workspaceId: string, createdBy: string, input: CreateProjectInput): Promise<Project> {
    return prisma.project.create({
      data: {
        workspaceId,
        createdBy,
        name: input.name,
        description: input.description,
        color: input.color,
        icon: input.icon,
        members: {
          create: {
            userId: createdBy,
          },
        },
      },
    });
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        icon: input.icon,
      },
    });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }
}

export const projectRepository = new ProjectRepository();
