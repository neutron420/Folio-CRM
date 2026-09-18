import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { columnController } from "./column.controller";
import { taskController } from "../tasks";

export async function handleColumnRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/columns")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/columns/", "").split("/");
    const columnId = segments[0];

    if (!columnId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "PATCH") {
        return await columnController.updateColumn(req, user, columnId);
      }
      if (req.method === "DELETE") {
        return await columnController.deleteColumn(req, user, columnId);
      }
    }

    if (segments.length === 2 && segments[1] === "move") {
      if (req.method === "PATCH") {
        return await columnController.moveColumn(req, user, columnId);
      }
    }

    if (segments.length === 2 && segments[1] === "tasks") {
      if (req.method === "POST") {
        return await taskController.createTask(req, user, columnId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
