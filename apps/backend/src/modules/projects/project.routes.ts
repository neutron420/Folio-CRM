import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { projectController } from "./project.controller";
import { boardController } from "../boards";
import { analyticsController } from "../analytics";

export async function handleProjectRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/projects")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/projects/", "").split("/");
    const projectId = segments[0];

    if (!projectId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "GET") {
        return await projectController.getProject(req, user, projectId);
      }
      if (req.method === "PATCH") {
        return await projectController.updateProject(req, user, projectId);
      }
      if (req.method === "DELETE") {
        return await projectController.deleteProject(req, user, projectId);
      }
    }

    if (segments.length === 2 && segments[1] === "boards") {
      if (req.method === "GET") {
        return await boardController.listBoards(req, user, projectId);
      }
      if (req.method === "POST") {
        return await boardController.createBoard(req, user, projectId);
      }
    }

    if (segments.length === 2 && segments[1] === "analytics") {
      if (req.method === "GET") {
        return await analyticsController.getProjectAnalytics(req, projectId, requestId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
