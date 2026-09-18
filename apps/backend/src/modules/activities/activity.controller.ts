import { requireAuth } from "../../middleware/auth";
import { activityService } from "./activity.service";

export class ActivityController {
  private parseOptions(req: Request) {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit")!, 10)
      : undefined;
    const cursor = url.searchParams.get("cursor") || undefined;
    const offset = url.searchParams.get("offset")
      ? parseInt(url.searchParams.get("offset")!, 10)
      : undefined;

    return { limit, cursor, offset };
  }

  async getWorkspaceActivities(req: Request, workspaceId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const options = this.parseOptions(req);
    const activities = await activityService.getWorkspaceActivities(workspaceId, user.id, options);

    return Response.json({
      success: true,
      data: activities,
      meta: {
        count: activities.length,
        requestId,
      },
    });
  }

  async getBoardActivities(req: Request, boardId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const options = this.parseOptions(req);
    const activities = await activityService.getBoardActivities(boardId, user.id, options);

    return Response.json({
      success: true,
      data: activities,
      meta: {
        count: activities.length,
        requestId,
      },
    });
  }

  async getTaskActivities(req: Request, taskId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const options = this.parseOptions(req);
    const activities = await activityService.getTaskActivities(taskId, user.id, options);

    return Response.json({
      success: true,
      data: activities,
      meta: {
        count: activities.length,
        requestId,
      },
    });
  }
}

export const activityController = new ActivityController();
