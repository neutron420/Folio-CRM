import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { commentController } from "./comment.controller";

export async function handleCommentRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/comments")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/comments/", "").split("/");
    const commentId = segments[0];

    if (!commentId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "PATCH") {
        return await commentController.updateComment(req, user, commentId);
      }
      if (req.method === "DELETE") {
        return await commentController.deleteComment(req, user, commentId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
