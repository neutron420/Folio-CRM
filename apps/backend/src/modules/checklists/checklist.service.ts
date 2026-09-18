import {
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { taskRepository } from "../tasks/task.repository";
import { checklistRepository } from "./checklist.repository";
import type {
  CreateChecklistInput,
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
  ChecklistDTO,
  ChecklistItemDTO,
} from "./checklist.types";

export class ChecklistService {
  async listChecklists(taskId: string, userId: string): Promise<ChecklistDTO[]> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    await requireWorkspaceMember(task.board.project.workspaceId, userId, "VIEWER");

    const checklists = await checklistRepository.findByTaskId(taskId);

    return checklists.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      title: c.title,
      items: c.items.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        content: item.content,
        completed: item.completed,
        position: item.position,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  }

  async createChecklist(
    taskId: string,
    userId: string,
    input: CreateChecklistInput
  ): Promise<ChecklistDTO> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const title = input.title?.trim();
    if (!title || title.length === 0) {
      throw new ValidationError("Checklist title is required");
    }
    if (title.length > 100) {
      throw new ValidationError("Checklist title cannot exceed 100 characters");
    }

    const checklist = await checklistRepository.createChecklist(taskId, title);
    logger.info("Checklist created", { checklistId: checklist.id, taskId, userId });

    return {
      id: checklist.id,
      taskId: checklist.taskId,
      title: checklist.title,
      items: [],
      createdAt: checklist.createdAt.toISOString(),
      updatedAt: checklist.updatedAt.toISOString(),
    };
  }

  async deleteChecklist(checklistId: string, userId: string): Promise<void> {
    const checklist = await checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new NotFoundError(`Checklist ${checklistId} not found`);
    }

    const workspaceId = checklist.task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    await checklistRepository.deleteChecklist(checklistId);
    logger.info("Checklist deleted", { checklistId, userId });
  }

  async addItem(
    checklistId: string,
    userId: string,
    input: CreateChecklistItemInput
  ): Promise<ChecklistItemDTO> {
    const checklist = await checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new NotFoundError(`Checklist ${checklistId} not found`);
    }

    const workspaceId = checklist.task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const content = input.content?.trim();
    if (!content || content.length === 0) {
      throw new ValidationError("Checklist item content is required");
    }
    if (content.length > 255) {
      throw new ValidationError("Checklist item content cannot exceed 255 characters");
    }

    const last = input.position === undefined ? await checklistRepository.findLastItem(checklistId) : null;
    const finalPosition: number = input.position ?? (last ? last.position + 1000.0 : 1000.0);

    const item = await checklistRepository.addItem(checklistId, content, finalPosition);
    logger.info("Checklist item added", { itemId: item.id, checklistId, userId });

    return {
      id: item.id,
      checklistId: item.checklistId,
      content: item.content,
      completed: item.completed,
      position: item.position,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async updateItem(
    itemId: string,
    userId: string,
    input: UpdateChecklistItemInput
  ): Promise<ChecklistItemDTO> {
    const item = await checklistRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError(`Checklist item ${itemId} not found`);
    }

    const workspaceId = item.checklist.task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    if (input.content !== undefined) {
      const content = input.content.trim();
      if (!content || content.length === 0) {
        throw new ValidationError("Checklist item content cannot be empty");
      }
      if (content.length > 255) {
        throw new ValidationError("Checklist item content cannot exceed 255 characters");
      }
    }

    const updated = await checklistRepository.updateItem(itemId, {
      content: input.content?.trim(),
      completed: input.completed,
      position: input.position,
    });

    return {
      id: updated.id,
      checklistId: updated.checklistId,
      content: updated.content,
      completed: updated.completed,
      position: updated.position,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteItem(itemId: string, userId: string): Promise<void> {
    const item = await checklistRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError(`Checklist item ${itemId} not found`);
    }

    const workspaceId = item.checklist.task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    await checklistRepository.deleteItem(itemId);
    logger.info("Checklist item deleted", { itemId, userId });
  }
}

export const checklistService = new ChecklistService();
