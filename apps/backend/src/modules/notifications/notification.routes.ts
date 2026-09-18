import { notificationController } from "./notification.controller";

export async function handleNotificationRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  
  const parts = pathname.replace("/api/v1/", "").split("/");

  if (parts[0] !== "notifications") return null;

  if (parts.length === 1) {
    if (req.method === "GET") {
      return notificationController.listNotifications(req, requestId);
    }
  }

  if (parts.length === 2 && parts[1] === "unread-count") {
    if (req.method === "GET") {
      return notificationController.getUnreadCount(req, requestId);
    }
  }

  if (parts.length === 2 && parts[1] === "read-all") {
    if (req.method === "POST") {
      return notificationController.markAllAsRead(req, requestId);
    }
  }

  if (parts.length === 3 && parts[2] === "read") {
    const notificationId = parts[1];
    if (!notificationId) return null;
    if (req.method === "PATCH") {
      return notificationController.markAsRead(req, notificationId, requestId);
    }
  }

  return null;
}
