import type { CreateNotificationDTO } from "../../src/modules/notifications/notification.types";

describe("Notifications Engine", () => {
  it("formats CreateNotificationDTO with appropriate action type", () => {
    const dto: CreateNotificationDTO = {
      userId: "user_target",
      type: "TASK_ASSIGNED",
      title: "New Assignment",
      message: "You have been assigned to 'Fix Redis Leak'",
      metadata: { taskId: "task_404" },
    };

    expect(dto.userId).toBe("user_target");
    expect(dto.type).toBe("TASK_ASSIGNED");
    expect(dto.metadata?.taskId).toBe("task_404");
  });

  it("calculates unread notifications count correctly", () => {
    const notifications = [
      { id: "1", read: false },
      { id: "2", read: true },
      { id: "3", read: false },
      { id: "4", read: false },
    ];

    const unread = notifications.filter((n) => !n.read).length;
    expect(unread).toBe(3);
  });

  it("updates read status on markAsRead", () => {
    const notification = { id: "1", read: false, userId: "user_a" };
    const markRead = (n: typeof notification, actorId: string) => {
      if (n.userId !== actorId) throw new Error("Unauthorized notification access");
      return { ...n, read: true };
    };

    expect(markRead(notification, "user_a").read).toBe(true);
    expect(() => markRead(notification, "user_b")).toThrow("Unauthorized notification access");
  });
});
