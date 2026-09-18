import { prisma } from "@kanban/db";
import type { Label } from "@kanban/db";

export class LabelRepository {
  async findByWorkspaceId(workspaceId: string): Promise<Label[]> {
    return prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
    });
  }

  async findById(labelId: string) {
    return prisma.label.findUnique({
      where: { id: labelId },
      include: {
        workspace: {
          select: { id: true, ownerId: true },
        },
      },
    });
  }

  async create(workspaceId: string, name: string, color: string): Promise<Label> {
    return prisma.label.create({
      data: {
        workspaceId,
        name,
        color,
      },
    });
  }

  async update(labelId: string, data: { name?: string; color?: string }): Promise<Label> {
    return prisma.label.update({
      where: { id: labelId },
      data,
    });
  }

  async delete(labelId: string): Promise<Label> {
    return prisma.label.delete({
      where: { id: labelId },
    });
  }

  async attachToTask(taskId: string, labelId: string) {
    return prisma.taskLabel.create({
      data: { taskId, labelId },
    });
  }

  async detachFromTask(taskId: string, labelId: string) {
    return prisma.taskLabel.delete({
      where: {
        taskId_labelId: { taskId, labelId },
      },
    });
  }

  async isAttached(taskId: string, labelId: string): Promise<boolean> {
    const existing = await prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: { taskId, labelId },
      },
    });
    return existing !== null;
  }
}

export const labelRepository = new LabelRepository();
