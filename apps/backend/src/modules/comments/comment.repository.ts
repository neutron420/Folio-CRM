import { prisma } from "@kanban/db";

export class CommentRepository {
  async findByTaskId(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
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
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(commentId: string) {
    return prisma.comment.findUnique({
      where: { id: commentId },
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

  async create(taskId: string, userId: string, content: string) {
    return prisma.comment.create({
      data: {
        taskId,
        userId,
        content,
      },
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

  async update(commentId: string, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
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

  async delete(commentId: string) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}

export const commentRepository = new CommentRepository();
