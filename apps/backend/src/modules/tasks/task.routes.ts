import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { taskController } from "./task.controller";

/**
 * Handles all /api/v1/tasks/* requests.
 */
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

    // /api/v1/tasks/:taskId
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

    // /api/v1/tasks/:taskId/move
    if (segments.length === 2 && segments[1] === "move") {
      if (req.method === "PATCH") {
        return await taskController.moveTask(req, user, taskId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
