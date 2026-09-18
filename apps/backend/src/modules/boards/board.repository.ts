import { prisma } from "@kanban/db";
import type { CreateBoardInput, UpdateBoardInput } from "./board.types";

export class BoardRepository {
  async findByProjectId(projectId: string) {
    return prisma.board.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            columns: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(boardId: string) {
    return prisma.board.findUnique({
      where: { id: boardId },
      include: {
        project: {
          select: {
            id: true,
            workspaceId: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findByIdWithDetails(boardId: string) {
    return prisma.board.findUnique({
      where: { id: boardId },
      include: {
        project: {
          select: {
            id: true,
            workspaceId: true,
          },
        },
        columns: {
          orderBy: { position: "asc" },
          include: {
            tasks: {
              orderBy: { position: "asc" },
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
            },
          },
        },
      },
    });
  }

  async createWithDefaultColumns(projectId: string, input: CreateBoardInput) {
    return prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          projectId,
          name: input.name,
          description: input.description,
        },
      });

      const defaultColumns = [
        { name: "To Do", position: 1000.0 },
        { name: "In Progress", position: 2000.0 },
        { name: "In Review", position: 3000.0 },
        { name: "Done", position: 4000.0 },
      ];

      for (const col of defaultColumns) {
        await tx.column.create({
          data: {
            boardId: board.id,
            name: col.name,
            position: col.position,
          },
        });
      }

      return tx.board.findUniqueOrThrow({
        where: { id: board.id },
        include: {
          columns: {
            orderBy: { position: "asc" },
          },
        },
      });
    });
  }

  async update(boardId: string, input: UpdateBoardInput) {
    return prisma.board.update({
      where: { id: boardId },
      data: {
        name: input.name,
        description: input.description,
      },
    });
  }

  async delete(boardId: string) {
    return prisma.board.delete({
      where: { id: boardId },
    });
  }
}

export const boardRepository = new BoardRepository();
