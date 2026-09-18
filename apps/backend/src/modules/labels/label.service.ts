import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { taskRepository } from "../tasks/task.repository";
import { labelRepository } from "./label.repository";
import type { CreateLabelInput, UpdateLabelInput, LabelDTO } from "./label.types";

export class LabelService {
  async listLabels(workspaceId: string, userId: string): Promise<LabelDTO[]> {
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");
    const labels = await labelRepository.findByWorkspaceId(workspaceId);

    return labels.map((l) => ({
      id: l.id,
      workspaceId: l.workspaceId,
      name: l.name,
      color: l.color,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));
  }

  async createLabel(
    workspaceId: string,
    userId: string,
    input: CreateLabelInput
  ): Promise<LabelDTO> {
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const name = input.name?.trim();
    if (!name || name.length === 0) {
      throw new ValidationError("Label name is required");
    }
    if (name.length > 50) {
      throw new ValidationError("Label name cannot exceed 50 characters");
    }

    const color = input.color?.trim();
    if (!color || color.length === 0) {
      throw new ValidationError("Label color is required");
    }

    try {
      const label = await labelRepository.create(workspaceId, name, color);
      logger.info("Label created", { labelId: label.id, workspaceId, name, color });

      return {
        id: label.id,
        workspaceId: label.workspaceId,
        name: label.name,
        color: label.color,
        createdAt: label.createdAt.toISOString(),
        updatedAt: label.updatedAt.toISOString(),
      };
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ConflictError(`Label "${name}" already exists in this workspace`);
      }
      throw err;
    }
  }

  async updateLabel(
    labelId: string,
    userId: string,
    input: UpdateLabelInput
  ): Promise<LabelDTO> {
    const label = await labelRepository.findById(labelId);
    if (!label) {
      throw new NotFoundError(`Label ${labelId} not found`);
    }

    await requireWorkspaceMember(label.workspaceId, userId, "MEMBER");

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length === 0) {
        throw new ValidationError("Label name cannot be empty");
      }
      if (name.length > 50) {
        throw new ValidationError("Label name cannot exceed 50 characters");
      }
    }

    const updated = await labelRepository.update(labelId, {
      name: input.name?.trim(),
      color: input.color?.trim(),
    });

    return {
      id: updated.id,
      workspaceId: updated.workspaceId,
      name: updated.name,
      color: updated.color,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteLabel(labelId: string, userId: string): Promise<void> {
    const label = await labelRepository.findById(labelId);
    if (!label) {
      throw new NotFoundError(`Label ${labelId} not found`);
    }

    await requireWorkspaceMember(label.workspaceId, userId, "MEMBER");

    await labelRepository.delete(labelId);
    logger.info("Label deleted", { labelId, workspaceId: label.workspaceId, userId });
  }

  async attachLabelToTask(taskId: string, labelId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const label = await labelRepository.findById(labelId);
    if (!label) {
      throw new NotFoundError(`Label ${labelId} not found`);
    }

    if (label.workspaceId !== workspaceId) {
      throw new BadRequestError("Label does not belong to the same workspace as the task");
    }

    const alreadyAttached = await labelRepository.isAttached(taskId, labelId);
    if (alreadyAttached) {
      return; 
    }

    await labelRepository.attachToTask(taskId, labelId);
    logger.info("Label attached to task", { taskId, labelId, userId });
  }

  async detachLabelFromTask(taskId: string, labelId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const alreadyAttached = await labelRepository.isAttached(taskId, labelId);
    if (!alreadyAttached) {
      return; 
    }

    await labelRepository.detachFromTask(taskId, labelId);
    logger.info("Label detached from task", { taskId, labelId, userId });
  }
}

export const labelService = new LabelService();
