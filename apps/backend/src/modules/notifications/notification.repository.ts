import { prisma } from "@kanban/db";
import type { Notification } from "@kanban/db";
import type { CreateNotificationDTO, NotificationQueryOptions } from "./notification.types";

export class NotificationRepository {
  async create(data: CreateNotificationDTO): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata ?? {},
      },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string, options?: NotificationQueryOptions): Promise<Notification[]> {
    const limit = Math.min(options?.limit ?? 50, 100);
    return prisma.notification.findMany({
      where: {
        userId,
        ...(options?.unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: options?.offset ?? 0,
      ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
    });
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    const existing = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    return { count: result.count };
  }
}

export const notificationRepository = new NotificationRepository();
