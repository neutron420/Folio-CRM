import { activityController } from "./activity.controller";

export async function handleActivityRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  const parts = pathname.replace(/^\/api\/v1\
  const targetId = parts[1];
  if (!targetId) return null;

  if (parts[0] === "workspaces" && parts.length === 3 && parts[2] === "activities") {
    if (req.method === "GET") {
      return activityController.getWorkspaceActivities(req, targetId, requestId);
    }
  }

  if (parts[0] === "boards" && parts.length === 3 && parts[2] === "activities") {
    if (req.method === "GET") {
      return activityController.getBoardActivities(req, targetId, requestId);
    }
  }

  if (parts[0] === "tasks" && parts.length === 3 && parts[2] === "activities") {
    if (req.method === "GET") {
      return activityController.getTaskActivities(req, targetId, requestId);
    }
  }

  return null;
}
