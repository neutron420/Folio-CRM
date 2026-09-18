import type { Notification } from "@kanban/db";

export interface CreateNotificationDTO {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface NotificationQueryOptions {
  unreadOnly?: boolean;
  limit?: number;
  cursor?: string;
  offset?: number;
}

export type NotificationRecord = Notification;
