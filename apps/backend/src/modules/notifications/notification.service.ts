import { NotFoundError } from "@kanban/errors";
import { logger } from "@kanban/logger";
import { realtimeBroker } from "../realtime/realtime.broker";
import { notificationRepository } from "./notification.repository";
import type { CreateNotificationDTO, NotificationQueryOptions, NotificationRecord } from "./notification.types";

export class NotificationService {
  async notifyUser(dto: CreateNotificationDTO): Promise<NotificationRecord> {
    const notification = await notificationRepository.create(dto);
    logger.info("Notification created", { userId: dto.userId, type: dto.type });

    try {
      realtimeBroker.sendToUser(dto.userId, "NOTIFICATION_CREATED", {
        notification,
      });
    } catch (err) {
      logger.error("Failed to broadcast notification over WebSocket", { error: String(err) });
    }

    return notification;
  }

  async getUserNotifications(
    userId: string,
    options?: NotificationQueryOptions
  ): Promise<NotificationRecord[]> {
    return notificationRepository.findByUserId(userId, options);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.countUnread(userId);
  }

  async markAsRead(id: string, userId: string): Promise<NotificationRecord> {
    const updated = await notificationRepository.markAsRead(id, userId);
    if (!updated) {
      throw new NotFoundError(`Notification ${id} not found or not owned by user`);
    }
    return updated;
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    return notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
