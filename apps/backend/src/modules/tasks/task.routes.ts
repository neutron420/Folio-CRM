import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { taskController } from "./task.controller";
import { commentController } from "../comments";
import { labelController } from "../labels";
import { checklistController } from "../checklists";
import { activityController } from "../activities";
import { attachmentController } from "../attachments";

export async function handleTaskRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/tasks")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/tasks/", "").split("/");
    const taskId = segments[0];

    if (!taskId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "GET") {
        return await taskController.getTask(req, user, taskId);
      }
      if (req.method === "PATCH") {
        return await taskController.updateTask(req, user, taskId);
      }
      if (req.method === "DELETE") {
        return await taskController.deleteTask(req, user, taskId);
      }
    }

    if (segments.length === 2 && segments[1] === "move") {
      if (req.method === "PATCH") {
        return await taskController.moveTask(req, user, taskId);
      }
    }

    if (segments.length === 2 && segments[1] === "comments") {
      if (req.method === "GET") {
        return await commentController.listComments(req, user, taskId);
      }
      if (req.method === "POST") {
        return await commentController.createComment(req, user, taskId);
      }
    }

    if (segments.length === 3 && segments[1] === "labels") {
      const labelId = segments[2];
      if (labelId) {
        if (req.method === "POST") {
          return await labelController.attachLabel(req, user, taskId, labelId);
        }
        if (req.method === "DELETE") {
          return await labelController.detachLabel(req, user, taskId, labelId);
        }
      }
    }

    if (segments.length === 2 && segments[1] === "checklists") {
      if (req.method === "GET") {
        return await checklistController.listChecklists(req, user, taskId);
      }
      if (req.method === "POST") {
        return await checklistController.createChecklist(req, user, taskId);
      }
    }

    if (segments.length === 2 && segments[1] === "activities") {
      if (req.method === "GET") {
        return await activityController.getTaskActivities(req, taskId, requestId);
      }
    }

    if (segments.length === 2 && segments[1] === "attachments") {
      if (req.method === "GET") {
        return await attachmentController.listAttachments(req, taskId, requestId);
      }
    }

    if (segments.length === 3 && segments[1] === "attachments" && segments[2] === "presign") {
      if (req.method === "POST") {
        return await attachmentController.createPresignedUpload(req, taskId, requestId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
