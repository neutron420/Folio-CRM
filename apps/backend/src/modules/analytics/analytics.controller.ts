import { requireAuth } from "../../middleware/auth";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  async getBoardAnalytics(req: Request, boardId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const analytics = await analyticsService.getBoardAnalytics(boardId, user.id);

    return Response.json({
      success: true,
      data: analytics,
      meta: { requestId },
    });
  }

  async getProjectAnalytics(req: Request, projectId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const analytics = await analyticsService.getProjectAnalytics(projectId, user.id);

    return Response.json({
      success: true,
      data: analytics,
      meta: { requestId },
    });
  }
}

export const analyticsController = new AnalyticsController();
