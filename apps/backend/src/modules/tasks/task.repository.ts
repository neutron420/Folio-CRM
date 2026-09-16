import { prisma } from "@kanban/db";
import type { CreateTaskInput, UpdateTaskInput } from "./task.types";

export class TaskRepository {
  async findById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: {
          include: {
            project: {
              select: {
                id: true,
                workspaceId: true,
              },
            },
          },
        },
        column: true,
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });
  }

  async findLastInColumn(columnId: string) {
    return prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: "desc" },
    });
  }

  async create(
    boardId: string,
    columnId: string,
    createdBy: string,
    position: number,
    input: CreateTaskInput
  ) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          boardId,
          columnId,
          createdBy,
          title: input.title,
          description: input.description,
          priority: input.priority || "MEDIUM",
          position,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        },
      });

      // Add assignees if provided
      if (input.assigneeIds && input.assigneeIds.length > 0) {
        for (const userId of input.assigneeIds) {
          await tx.taskAssignee.create({
            data: {
              taskId: task.id,
              userId,
            },
          });
        }
      }

      // Add labels if provided
      if (input.labelIds && input.labelIds.length > 0) {
        for (const labelId of input.labelIds) {
          await tx.taskLabel.create({
            data: {
              taskId: task.id,
              labelId,
            },
          });
        }
      }

      return tx.task.findUniqueOrThrow({
        where: { id: task.id },
        include: {
          assignees: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          labels: {
            include: {
              label: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async update(taskId: string, input: UpdateTaskInput) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id: taskId },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate) : null) : undefined,
          columnId: input.columnId,
          position: input.position,
        },
      });

      if (input.assigneeIds !== undefined) {
        await tx.taskAssignee.deleteMany({ where: { taskId } });
        for (const userId of input.assigneeIds) {
          await tx.taskAssignee.create({ data: { taskId, userId } });
        }
      }

      if (input.labelIds !== undefined) {
        await tx.taskLabel.deleteMany({ where: { taskId } });
        for (const labelId of input.labelIds) {
          await tx.taskLabel.create({ data: { taskId, labelId } });
        }
      }

      return tx.task.findUniqueOrThrow({
        where: { id: taskId },
        include: {
          assignees: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          labels: {
            include: {
              label: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async moveTask(taskId: string, targetColumnId: string, newPosition: number) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: targetColumnId,
        position: newPosition,
      },
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(taskId: string) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  async rebalanceColumn(columnId: string): Promise<void> {
    const tasks = await prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
    });

    await prisma.$transaction(
      tasks.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: { position: (index + 1) * 1000.0 },
        })
      )
    );
  }

  async addAssignee(taskId: string, userId: string) {
    return prisma.taskAssignee.create({
      data: { taskId, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async removeAssignee(taskId: string, userId: string) {
    return prisma.taskAssignee.delete({
      where: {
        taskId_userId: { taskId, userId },
      },
    });
  }

  async logActivity(data: {
    workspaceId: string;
    projectId?: string;
    boardId?: string;
    taskId?: string;
    userId: string;
    action: string;
    metadata?: any;
  }) {
    return prisma.activity.create({
      data: {
        workspaceId: data.workspaceId,
        projectId: data.projectId,
        boardId: data.boardId,
        taskId: data.taskId,
        userId: data.userId,
        action: data.action,
        metadata: data.metadata || {},
      },
    });
  }
}

export const taskRepository = new TaskRepository();
