import { analyticsController } from "./analytics.controller";

export async function handleAnalyticsRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  const parts = pathname.replace("/api/v1/", "").split("/");
  const targetId = parts[1];
  if (!targetId) return null;

  if (parts[0] === "boards" && parts.length === 3 && parts[2] === "analytics") {
    if (req.method === "GET") {
      return analyticsController.getBoardAnalytics(req, targetId, requestId);
    }
  }

  if (parts[0] === "projects" && parts.length === 3 && parts[2] === "analytics") {
    if (req.method === "GET") {
      return analyticsController.getProjectAnalytics(req, targetId, requestId);
    }
  }

  return null;
}
