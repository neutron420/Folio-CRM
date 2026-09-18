import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { columnRepository } from "../columns/column.repository";
import { realtimeBroker } from "../realtime/realtime.broker";
import { taskRepository } from "./task.repository";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  TaskDetail,
} from "./task.types";

export class TaskService {
  async createTask(
    columnId: string,
    userId: string,
    input: CreateTaskInput
  ): Promise<TaskDetail> {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError(`Column ${columnId} not found`);
    }

    const workspaceId = column.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const title = input.title?.trim();
    if (!title || title.length === 0) {
      throw new ValidationError("Task title is required");
    }
    if (title.length > 255) {
      throw new ValidationError("Task title cannot exceed 255 characters");
    }

    const last = input.position === undefined ? await taskRepository.findLastInColumn(columnId) : null;
    const position: number = input.position ?? (last ? last.position + 1000.0 : 1000.0);

    const created = await taskRepository.create(
      column.boardId,
      columnId,
      userId,
      position,
      {
        ...input,
        title,
        description: input.description?.trim() || undefined,
      }
    );

    await taskRepository.logActivity({
      workspaceId,
      projectId: column.board.project.id,
      boardId: column.boardId,
      taskId: created.id,
      userId,
      action: "TASK_CREATED",
      metadata: { title, columnId, position },
    });

    logger.info("Task created", { taskId: created.id, columnId, title });

    const result: TaskDetail = {
      id: created.id,
      boardId: created.boardId,
      columnId: created.columnId,
      sprintId: created.sprintId,
      title: created.title,
      description: created.description,
      priority: created.priority,
      position: created.position,
      dueDate: created.dueDate ? created.dueDate.toISOString() : null,
      createdBy: created.createdBy,
      assignees: created.assignees.map((a) => ({
        id: a.id,
        userId: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.avatarUrl,
      })),
      labels: created.labels.map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color,
      })),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    realtimeBroker.broadcastToBoard(created.boardId, "TASK_CREATED", { task: result });
    return result;
  }

  async getTask(taskId: string, userId: string): Promise<TaskDetail> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    await requireWorkspaceMember(task.board.project.workspaceId, userId, "VIEWER");

    return {
      id: task.id,
      boardId: task.boardId,
      columnId: task.columnId,
      sprintId: task.sprintId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      position: task.position,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdBy: task.createdBy,
      assignees: task.assignees.map((a) => ({
        id: a.id,
        userId: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.avatarUrl,
      })),
      labels: task.labels.map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color,
      })),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  async updateTask(
    taskId: string,
    userId: string,
    input: UpdateTaskInput
  ): Promise<TaskDetail> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title || title.length === 0) {
        throw new ValidationError("Task title cannot be empty");
      }
      if (title.length > 255) {
        throw new ValidationError("Task title cannot exceed 255 characters");
      }
    }

    const updated = await taskRepository.update(taskId, {
      ...input,
      title: input.title?.trim(),
      description: input.description !== undefined ? input.description?.trim() || null : undefined,
    });

    await taskRepository.logActivity({
      workspaceId,
      projectId: task.board.project.id,
      boardId: task.boardId,
      taskId: updated.id,
      userId,
      action: "TASK_UPDATED",
      metadata: { fields: Object.keys(input) },
    });

    const result: TaskDetail = {
      id: updated.id,
      boardId: updated.boardId,
      columnId: updated.columnId,
      sprintId: updated.sprintId,
      title: updated.title,
      description: updated.description,
      priority: updated.priority,
      position: updated.position,
      dueDate: updated.dueDate ? updated.dueDate.toISOString() : null,
      createdBy: updated.createdBy,
      assignees: updated.assignees.map((a) => ({
        id: a.id,
        userId: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.avatarUrl,
      })),
      labels: updated.labels.map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color,
      })),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    realtimeBroker.broadcastToBoard(task.boardId, "TASK_UPDATED", { task: result });
    return result;
  }

  async moveTask(
    taskId: string,
    userId: string,
    input: MoveTaskInput
  ): Promise<TaskDetail> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const targetColumnId = input.targetColumnId || task.columnId;

    if (targetColumnId !== task.columnId) {
      const targetColumn = await columnRepository.findById(targetColumnId);
      if (!targetColumn) {
        throw new NotFoundError(`Target column ${targetColumnId} not found`);
      }
      if (targetColumn.boardId !== task.boardId) {
        throw new BadRequestError("Cannot move task to a column on a different board");
      }
    }

    let newPosition: number;

    if (input.targetPosition !== undefined) {
      newPosition = input.targetPosition;
    } else if (input.prevTaskId && input.nextTaskId) {
      const prev = await taskRepository.findById(input.prevTaskId);
      const next = await taskRepository.findById(input.nextTaskId);
      if (!prev || !next) {
        throw new NotFoundError("Adjacent tasks for relative positioning not found");
      }
      const diff = Math.abs(next.position - prev.position);
      if (diff < 0.0001) {
        
        await taskRepository.rebalanceColumn(targetColumnId);
        const reloadedPrev = await taskRepository.findById(input.prevTaskId);
        const reloadedNext = await taskRepository.findById(input.nextTaskId);
        newPosition =
          ((reloadedPrev?.position || 1000.0) + (reloadedNext?.position || 2000.0)) / 2;
      } else {
        newPosition = (prev.position + next.position) / 2;
      }
    } else if (input.prevTaskId) {
      const prev = await taskRepository.findById(input.prevTaskId);
      newPosition = prev ? prev.position + 1000.0 : 1000.0;
    } else if (input.nextTaskId) {
      const next = await taskRepository.findById(input.nextTaskId);
      newPosition = next ? next.position / 2 : 1000.0;
    } else {
      
      const lastInTarget = await taskRepository.findLastInColumn(targetColumnId);
      newPosition = lastInTarget ? lastInTarget.position + 1000.0 : 1000.0;
    }

    const moved = await taskRepository.moveTask(taskId, targetColumnId, newPosition);

    await taskRepository.logActivity({
      workspaceId,
      projectId: task.board.project.id,
      boardId: task.boardId,
      taskId: moved.id,
      userId,
      action: "TASK_MOVED",
      metadata: {
        fromColumnId: task.columnId,
        toColumnId: targetColumnId,
        position: newPosition,
      },
    });

    logger.info("Task moved", {
      taskId,
      fromColumn: task.columnId,
      toColumn: targetColumnId,
      newPosition,
    });

    const result: TaskDetail = {
      id: moved.id,
      boardId: moved.boardId,
      columnId: moved.columnId,
      sprintId: moved.sprintId,
      title: moved.title,
      description: moved.description,
      priority: moved.priority,
      position: moved.position,
      dueDate: moved.dueDate ? moved.dueDate.toISOString() : null,
      createdBy: moved.createdBy,
      assignees: moved.assignees.map((a) => ({
        id: a.id,
        userId: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.avatarUrl,
      })),
      labels: moved.labels.map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color,
      })),
      createdAt: moved.createdAt.toISOString(),
      updatedAt: moved.updatedAt.toISOString(),
    };

    realtimeBroker.broadcastToBoard(task.boardId, "TASK_MOVED", {
      taskId: moved.id,
      boardId: task.boardId,
      fromColumnId: task.columnId,
      toColumnId: targetColumnId,
      position: newPosition,
      movedBy: { id: userId },
    });

    return result;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    await taskRepository.logActivity({
      workspaceId,
      projectId: task.board.project.id,
      boardId: task.boardId,
      userId,
      action: "TASK_DELETED",
      metadata: { taskId, title: task.title },
    });

    await taskRepository.delete(taskId);

    realtimeBroker.broadcastToBoard(task.boardId, "TASK_DELETED", {
      taskId,
      boardId: task.boardId,
    });

    logger.info("Task deleted", { taskId, userId });
  }
}

export const taskService = new TaskService();
