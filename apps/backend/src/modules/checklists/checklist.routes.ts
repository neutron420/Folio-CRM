import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { checklistController } from "./checklist.controller";

export async function handleChecklistRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  if (!pathname.startsWith("/api/v1/checklists")) {
    return null;
  }

  try {
    const { user } = await requireAuth(req);

    if (pathname.startsWith("/api/v1/checklists/items/")) {
      const itemId = pathname.replace("/api/v1/checklists/items/", "").split("/")[0];
      if (!itemId) return null;

      if (req.method === "PATCH") {
        return await checklistController.updateItem(req, user, itemId);
      }
      if (req.method === "DELETE") {
        return await checklistController.deleteItem(req, user, itemId);
      }
      return null;
    }

    const segments = pathname.replace("/api/v1/checklists/", "").split("/");
    const checklistId = segments[0];

    if (!checklistId) return null;

    if (segments.length === 1) {
      if (req.method === "DELETE") {
        return await checklistController.deleteChecklist(req, user, checklistId);
      }
    }

    if (segments.length === 2 && segments[1] === "items") {
      if (req.method === "POST") {
        return await checklistController.addItem(req, user, checklistId);
      }
    }

    return null;
  } catch (err) {
    return handleError(err, requestId);
  }
}
