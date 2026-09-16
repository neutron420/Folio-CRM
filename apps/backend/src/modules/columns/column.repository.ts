import { prisma } from "@kanban/db";
import type { Column } from "@kanban/db";

export class ColumnRepository {
  async findByBoardId(boardId: string) {
    return prisma.column.findMany({
      where: { boardId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { position: "asc" },
    });
  }

  async findById(columnId: string) {
    return prisma.column.findUnique({
      where: { id: columnId },
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
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async findLastInBoard(boardId: string): Promise<Column | null> {
    return prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });
  }

  async create(boardId: string, name: string, position: number): Promise<Column> {
    return prisma.column.create({
      data: {
        boardId,
        name,
        position,
      },
    });
  }

  async update(columnId: string, data: { name?: string; position?: number }): Promise<Column> {
    return prisma.column.update({
      where: { id: columnId },
      data,
    });
  }

  async delete(columnId: string): Promise<Column> {
    return prisma.column.delete({
      where: { id: columnId },
    });
  }

  async rebalance(boardId: string): Promise<void> {
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    await prisma.$transaction(
      columns.map((col, index) =>
        prisma.column.update({
          where: { id: col.id },
          data: { position: (index + 1) * 1000.0 },
        })
      )
    );
  }
}

export const columnRepository = new ColumnRepository();
