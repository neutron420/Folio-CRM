import { attachmentController } from "./attachment.controller";

export async function handleAttachmentRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  const parts = pathname.replace(/^\/api\/v1\

  if (
    parts[0] === "tasks" &&
    parts.length === 4 &&
    parts[2] === "attachments" &&
    parts[3] === "presign"
  ) {
    if (req.method === "POST") {
      const taskId = parts[1];
      if (!taskId) return null;
      return attachmentController.createPresignedUpload(req, taskId, requestId);
    }
  }

  if (parts[0] === "tasks" && parts.length === 3 && parts[2] === "attachments") {
    if (req.method === "GET") {
      const taskId = parts[1];
      if (!taskId) return null;
      return attachmentController.listAttachments(req, taskId, requestId);
    }
  }

  if (parts[0] === "attachments" && parts.length === 2) {
    if (req.method === "DELETE") {
      const attachmentId = parts[1];
      if (!attachmentId) return null;
      return attachmentController.deleteAttachment(req, attachmentId, requestId);
    }
  }

  return null;
}
