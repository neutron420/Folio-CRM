import { prisma } from "@kanban/db";

export class ChecklistRepository {
  async findByTaskId(taskId: string) {
    return prisma.checklist.findMany({
      where: { taskId },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(checklistId: string) {
    return prisma.checklist.findUnique({
      where: { id: checklistId },
      include: {
        task: {
          include: {
            board: {
              include: {
                project: {
                  select: { workspaceId: true },
                },
              },
            },
          },
        },
        items: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async createChecklist(taskId: string, title: string) {
    return prisma.checklist.create({
      data: {
        taskId,
        title,
      },
      include: {
        items: true,
      },
    });
  }

  async deleteChecklist(checklistId: string) {
    return prisma.checklist.delete({
      where: { id: checklistId },
    });
  }

  async findItemById(itemId: string) {
    return prisma.checklistItem.findUnique({
      where: { id: itemId },
      include: {
        checklist: {
          include: {
            task: {
              include: {
                board: {
                  include: {
                    project: {
                      select: { workspaceId: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findLastItem(checklistId: string) {
    return prisma.checklistItem.findFirst({
      where: { checklistId },
      orderBy: { position: "desc" },
    });
  }

  async addItem(checklistId: string, content: string, position: number) {
    return prisma.checklistItem.create({
      data: {
        checklistId,
        content,
        position,
      },
    });
  }

  async updateItem(
    itemId: string,
    data: { content?: string; completed?: boolean; position?: number }
  ) {
    return prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });
  }

  async deleteItem(itemId: string) {
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }
}

export const checklistRepository = new ChecklistRepository();
