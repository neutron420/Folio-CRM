import {
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { boardRepository } from "../boards/board.repository";
import { columnRepository } from "./column.repository";
import type {
  CreateColumnInput,
  UpdateColumnInput,
  MoveColumnInput,
  ColumnSummary,
} from "./column.types";

export class ColumnService {
  async createColumn(
    boardId: string,
    userId: string,
    input: CreateColumnInput
  ): Promise<ColumnSummary> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    await requireWorkspaceMember(board.project.workspaceId, userId, "MEMBER");

    const name = input.name?.trim();
    if (!name || name.length === 0) {
      throw new ValidationError("Column name is required");
    }
    if (name.length > 100) {
      throw new ValidationError("Column name cannot exceed 100 characters");
    }

    const last = input.position === undefined ? await columnRepository.findLastInBoard(boardId) : null;
    const finalPosition: number = input.position ?? (last ? last.position + 1000.0 : 1000.0);

    const column = await columnRepository.create(boardId, name, finalPosition);
    logger.info("Column created", { columnId: column.id, boardId, name, position: finalPosition });

    return {
      id: column.id,
      boardId: column.boardId,
      name: column.name,
      position: column.position,
      tasksCount: 0,
      createdAt: column.createdAt.toISOString(),
      updatedAt: column.updatedAt.toISOString(),
    };
  }

  async updateColumn(
    columnId: string,
    userId: string,
    input: UpdateColumnInput
  ): Promise<ColumnSummary> {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError(`Column ${columnId} not found`);
    }

    await requireWorkspaceMember(column.board.project.workspaceId, userId, "MEMBER");

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length === 0) {
        throw new ValidationError("Column name cannot be empty");
      }
      if (name.length > 100) {
        throw new ValidationError("Column name cannot exceed 100 characters");
      }
    }

    const updated = await columnRepository.update(columnId, {
      name: input.name?.trim(),
      position: input.position,
    });

    return {
      id: updated.id,
      boardId: updated.boardId,
      name: updated.name,
      position: updated.position,
      tasksCount: column._count.tasks,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async moveColumn(
    columnId: string,
    userId: string,
    input: MoveColumnInput
  ): Promise<ColumnSummary> {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError(`Column ${columnId} not found`);
    }

    await requireWorkspaceMember(column.board.project.workspaceId, userId, "MEMBER");

    let newPosition: number;

    if (input.targetPosition !== undefined) {
      newPosition = input.targetPosition;
    } else if (input.prevPosition !== undefined && input.nextPosition !== undefined) {
      const diff = Math.abs(input.nextPosition - input.prevPosition);
      if (diff < 0.0001) {
        
        await columnRepository.rebalance(column.boardId);
        const reloaded = await columnRepository.findById(columnId);
        return {
          id: column.id,
          boardId: column.boardId,
          name: column.name,
          position: reloaded ? reloaded.position : 1000.0,
          tasksCount: column._count.tasks,
          createdAt: column.createdAt.toISOString(),
          updatedAt: column.updatedAt.toISOString(),
        };
      }
      newPosition = (input.prevPosition + input.nextPosition) / 2;
    } else if (input.prevPosition !== undefined) {
      newPosition = input.prevPosition + 1000.0;
    } else if (input.nextPosition !== undefined) {
      newPosition = input.nextPosition / 2;
    } else {
      newPosition = column.position;
    }

    const updated = await columnRepository.update(columnId, { position: newPosition });
    logger.info("Column moved", { columnId, boardId: column.boardId, newPosition });

    return {
      id: updated.id,
      boardId: updated.boardId,
      name: updated.name,
      position: updated.position,
      tasksCount: column._count.tasks,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteColumn(columnId: string, userId: string): Promise<void> {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError(`Column ${columnId} not found`);
    }

    await requireWorkspaceMember(column.board.project.workspaceId, userId, "MEMBER");

    await columnRepository.delete(columnId);
    logger.info("Column deleted", { columnId, boardId: column.boardId, userId });
  }
}

export const columnService = new ColumnService();
