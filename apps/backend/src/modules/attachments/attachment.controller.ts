import { requireAuth } from "../../middleware/auth";
import { attachmentService } from "./attachment.service";
import type { CreateAttachmentPresignInput } from "./attachment.types";

export class AttachmentController {
  async createPresignedUpload(req: Request, taskId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const body = (await req.json()) as CreateAttachmentPresignInput;
    const result = await attachmentService.createPresignedUpload(taskId, user.id, body);

    return Response.json(
      {
        success: true,
        data: result,
        meta: { requestId },
      },
      { status: 201 }
    );
  }

  async listAttachments(req: Request, taskId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const attachments = await attachmentService.listTaskAttachments(taskId, user.id);

    return Response.json({
      success: true,
      data: attachments,
      meta: {
        count: attachments.length,
        requestId,
      },
    });
  }

  async deleteAttachment(
    req: Request,
    attachmentId: string,
    requestId: string
  ): Promise<Response> {
    const { user } = await requireAuth(req);
    await attachmentService.deleteAttachment(attachmentId, user.id);

    return Response.json({
      success: true,
      data: { message: `Attachment ${attachmentId} deleted successfully` },
      meta: { requestId },
    });
  }
}

export const attachmentController = new AttachmentController();
