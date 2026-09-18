import { prisma } from "@kanban/db";
import type { AttachmentDTO, CreateAttachmentPresignInput } from "./attachment.types";

export class AttachmentRepository {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
  };

  async create(
    taskId: string,
    userId: string,
    storageKey: string,
    input: CreateAttachmentPresignInput
  ): Promise<AttachmentDTO> {
    const created = await prisma.attachment.create({
      data: {
        taskId,
        uploadedBy: userId,
        filename: input.filename,
        contentType: input.contentType,
        sizeBytes: BigInt(input.sizeBytes),
        storageKey,
      },
      include: {
        uploader: { select: this.userSelect },
      },
    });

    return {
      id: created.id,
      taskId: created.taskId,
      filename: created.filename,
      contentType: created.contentType,
      sizeBytes: Number(created.sizeBytes),
      storageKey: created.storageKey,
      uploadedBy: created.uploader,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async findByTaskId(taskId: string): Promise<AttachmentDTO[]> {
    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploader: { select: this.userSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    return attachments.map((a) => ({
      id: a.id,
      taskId: a.taskId,
      filename: a.filename,
      contentType: a.contentType,
      sizeBytes: Number(a.sizeBytes),
      storageKey: a.storageKey,
      uploadedBy: a.uploader,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  async findById(id: string) {
    const found = await prisma.attachment.findUnique({
      where: { id },
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
        uploader: { select: this.userSelect },
      },
    });

    return found;
  }

  async delete(id: string): Promise<void> {
    await prisma.attachment.delete({
      where: { id },
    });
  }
}

export const attachmentRepository = new AttachmentRepository();
