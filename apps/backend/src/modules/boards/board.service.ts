import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember, hasMinimumRole } from "../../middleware/rbac";
import { projectRepository } from "../projects/project.repository";
import { boardRepository } from "./board.repository";
import type {
  CreateBoardInput,
  UpdateBoardInput,
  BoardSummary,
  BoardDetail,
} from "./board.types";

export class BoardService {
  async listBoards(projectId: string, userId: string): Promise<BoardSummary[]> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    await requireWorkspaceMember(project.workspaceId, userId, "VIEWER");

    const boards = await boardRepository.findByProjectId(projectId);

    return boards.map((b) => ({
      id: b.id,
      projectId: b.projectId,
      name: b.name,
      description: b.description,
      columnsCount: b._count.columns,
      tasksCount: b._count.tasks,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  }

  async getBoard(boardId: string, userId: string): Promise<BoardDetail> {
    const board = await boardRepository.findByIdWithDetails(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    await requireWorkspaceMember(board.project.workspaceId, userId, "VIEWER");

    return {
      id: board.id,
      projectId: board.projectId,
      name: board.name,
      description: board.description,
      columns: board.columns.map((col) => ({
        id: col.id,
        boardId: col.boardId,
        name: col.name,
        position: col.position,
        tasks: col.tasks.map((t) => ({
          id: t.id,
          boardId: t.boardId,
          columnId: t.columnId,
          title: t.title,
          description: t.description,
          priority: t.priority,
          position: t.position,
          dueDate: t.dueDate ? t.dueDate.toISOString() : null,
          completedAt: null,
          assignees: t.assignees.map((a) => ({
            id: a.id,
            userId: a.user.id,
            name: a.user.name,
            email: a.user.email,
            avatarUrl: a.user.avatarUrl,
          })),
          labels: t.labels.map((l) => ({
            id: l.label.id,
            name: l.label.name,
            color: l.label.color,
          })),
        })),
      })),
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
    };
  }

  async createBoard(
    projectId: string,
    userId: string,
    input: CreateBoardInput
  ): Promise<BoardDetail> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    await requireWorkspaceMember(project.workspaceId, userId, "MEMBER");

    const name = input.name?.trim();
    if (!name || name.length === 0) {
      throw new ValidationError("Board name is required");
    }
    if (name.length > 100) {
      throw new ValidationError("Board name cannot exceed 100 characters");
    }

    const created = await boardRepository.createWithDefaultColumns(projectId, {
      name,
      description: input.description?.trim() || undefined,
    });

    logger.info("Board created with default columns", {
      boardId: created.id,
      projectId,
      userId,
    });

    return {
      id: created.id,
      projectId: created.projectId,
      name: created.name,
      description: created.description,
      columns: created.columns.map((col) => ({
        id: col.id,
        boardId: col.boardId,
        name: col.name,
        position: col.position,
        tasks: [],
      })),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async updateBoard(
    boardId: string,
    userId: string,
    input: UpdateBoardInput
  ): Promise<BoardSummary> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    await requireWorkspaceMember(board.project.workspaceId, userId, "MEMBER");

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length === 0) {
        throw new ValidationError("Board name cannot be empty");
      }
      if (name.length > 100) {
        throw new ValidationError("Board name cannot exceed 100 characters");
      }
    }

    const updated = await boardRepository.update(boardId, {
      name: input.name?.trim(),
      description: input.description !== undefined ? input.description?.trim() || null : undefined,
    });

    return {
      id: updated.id,
      projectId: updated.projectId,
      name: updated.name,
      description: updated.description,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteBoard(boardId: string, userId: string): Promise<void> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    const member = await requireWorkspaceMember(board.project.workspaceId, userId, "MEMBER");

    const isProjectCreator = board.project.createdBy === userId;
    const isAdmin = hasMinimumRole(member.role, "ADMIN");
    if (!isProjectCreator && !isAdmin) {
      throw new ForbiddenError("Only project creator or workspace admins can delete this board");
    }

    await boardRepository.delete(boardId);
    logger.info("Board deleted", { boardId, projectId: board.projectId, userId });
  }
}

export const boardService = new BoardService();
