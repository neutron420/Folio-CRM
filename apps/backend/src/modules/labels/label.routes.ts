import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { labelController } from "./label.controller";

export async function handleLabelRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/labels")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    const segments = pathname.replace("/api/v1/labels/", "").split("/");
    const labelId = segments[0];

    if (!labelId) {
      return null;
    }

    if (segments.length === 1) {
      if (req.method === "PATCH") {
        return await labelController.updateLabel(req, user, labelId);
      }
      if (req.method === "DELETE") {
        return await labelController.deleteLabel(req, user, labelId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
