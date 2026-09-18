import { prisma } from "@kanban/db";
import type { SearchBoardResult, SearchMemberResult, SearchTaskResult } from "./search.types";

export class SearchRepository {
  async searchTasks(workspaceId: string, query: string, limit = 20): Promise<SearchTaskResult[]> {
    const tasks = await prisma.task.findMany({
      where: {
        board: {
          project: {
            workspaceId,
          },
        },
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: {
        board: { select: { id: true, name: true } },
        column: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      boardId: t.board.id,
      boardName: t.board.name,
      columnId: t.column.id,
      columnName: t.column.name,
    }));
  }

  async searchBoards(workspaceId: string, query: string, limit = 10): Promise<SearchBoardResult[]> {
    const boards = await prisma.board.findMany({
      where: {
        project: {
          workspaceId,
        },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return boards.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      projectId: b.project.id,
      projectName: b.project.name,
    }));
  }

  async searchMembers(
    workspaceId: string,
    query: string,
    limit = 10
  ): Promise<SearchMemberResult[]> {
    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: limit,
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

    return members.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      avatarUrl: m.user.avatarUrl,
    }));
  }
}

export const searchRepository = new SearchRepository();
