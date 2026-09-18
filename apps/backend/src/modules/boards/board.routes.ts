import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { boardController } from "./board.controller";
import { columnController } from "../columns";
import { activityController } from "../activities";
import { analyticsController } from "../analytics";

export async function handleBoardRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/boards")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/boards/", "").split("/");
    const boardId = segments[0];

    if (!boardId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "GET") {
        return await boardController.getBoard(req, user, boardId);
      }
      if (req.method === "PATCH") {
        return await boardController.updateBoard(req, user, boardId);
      }
      if (req.method === "DELETE") {
        return await boardController.deleteBoard(req, user, boardId);
      }
    }

    if (segments.length === 2 && segments[1] === "columns") {
      if (req.method === "POST") {
        return await columnController.createColumn(req, user, boardId);
      }
    }

    if (segments.length === 2 && segments[1] === "activities") {
      if (req.method === "GET") {
        return await activityController.getBoardActivities(req, boardId, requestId);
      }
    }

    if (segments.length === 2 && segments[1] === "analytics") {
      if (req.method === "GET") {
        return await analyticsController.getBoardAnalytics(req, boardId, requestId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
