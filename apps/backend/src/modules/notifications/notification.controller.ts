import { requireAuth } from "../../middleware/auth";
import { notificationService } from "./notification.service";

export class NotificationController {
  async listNotifications(req: Request, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const limit = url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit")!, 10)
      : undefined;
    const cursor = url.searchParams.get("cursor") || undefined;
    const offset = url.searchParams.get("offset")
      ? parseInt(url.searchParams.get("offset")!, 10)
      : undefined;

    const notifications = await notificationService.getUserNotifications(user.id, {
      unreadOnly,
      limit,
      cursor,
      offset,
    });

    return Response.json({
      success: true,
      data: notifications,
      meta: {
        count: notifications.length,
        requestId,
      },
    });
  }

  async getUnreadCount(req: Request, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const count = await notificationService.getUnreadCount(user.id);

    return Response.json({
      success: true,
      data: { count },
      meta: { requestId },
    });
  }

  async markAsRead(req: Request, notificationId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const updated = await notificationService.markAsRead(notificationId, user.id);

    return Response.json({
      success: true,
      data: updated,
      meta: { requestId },
    });
  }

  async markAllAsRead(req: Request, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const result = await notificationService.markAllAsRead(user.id);

    return Response.json({
      success: true,
      data: {
        message: "All notifications marked as read",
        updatedCount: result.count,
      },
      meta: { requestId },
    });
  }
}

export const notificationController = new NotificationController();
