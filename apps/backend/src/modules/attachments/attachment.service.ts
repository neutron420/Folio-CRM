import { NotFoundError, ValidationError } from "@kanban/errors";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { storageService } from "../../services/storage.service";
import { taskRepository } from "../tasks/task.repository";
import { attachmentRepository } from "./attachment.repository";
import type {
  AttachmentDTO,
  CreateAttachmentPresignInput,
  PresignUploadResponse,
} from "./attachment.types";

const MAX_FILE_SIZE = 50 * 1024 * 1024; 

export class AttachmentService {
  async createPresignedUpload(
    taskId: string,
    userId: string,
    input: CreateAttachmentPresignInput
  ): Promise<PresignUploadResponse> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    if (!input.filename || input.filename.trim().length === 0) {
      throw new ValidationError("Filename is required");
    }

    if (!input.contentType || input.contentType.trim().length === 0) {
      throw new ValidationError("Content-Type is required");
    }

    if (!input.sizeBytes || input.sizeBytes <= 0) {
      throw new ValidationError("Size in bytes must be greater than 0");
    }

    if (input.sizeBytes > MAX_FILE_SIZE) {
      throw new ValidationError(`File exceeds maximum size limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const sanitizedName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `tasks/${taskId}/${Date.now()}_${sanitizedName}`;

    const presigned = await storageService.generateUploadUrl(storageKey, input.contentType);
    const attachment = await attachmentRepository.create(taskId, userId, storageKey, input);

    return {
      uploadUrl: presigned.uploadUrl,
      storageKey: presigned.storageKey,
      expiresInSeconds: presigned.expiresInSeconds,
      attachment,
    };
  }

  async listTaskAttachments(taskId: string, userId: string): Promise<AttachmentDTO[]> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");

    const attachments = await attachmentRepository.findByTaskId(taskId);

    return Promise.all(
      attachments.map(async (a) => ({
        ...a,
        downloadUrl: await storageService.generateDownloadUrl(a.storageKey),
      }))
    );
  }

  async deleteAttachment(attachmentId: string, userId: string): Promise<void> {
    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment) {
      throw new NotFoundError(`Attachment ${attachmentId} not found`);
    }

    const workspaceId = attachment.task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    await storageService.deleteObject(attachment.storageKey);
    await attachmentRepository.delete(attachmentId);
  }
}

export const attachmentService = new AttachmentService();
