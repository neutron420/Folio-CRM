import { prisma } from "@kanban/db";
import type { ActivityQueryOptions, ActivityWithUser, RecordActivityDTO } from "./activity.types";

export class ActivityRepository {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
  };

  async create(data: RecordActivityDTO): Promise<ActivityWithUser> {
    return prisma.activity.create({
      data: {
        workspaceId: data.workspaceId,
        projectId: data.projectId,
        boardId: data.boardId,
        taskId: data.taskId,
        userId: data.userId,
        action: data.action,
        metadata: data.metadata ?? {},
      },
      include: {
        user: { select: this.userSelect },
      },
    }) as Promise<ActivityWithUser>;
  }

  async findByWorkspaceId(workspaceId: string, options?: ActivityQueryOptions): Promise<ActivityWithUser[]> {
    const limit = Math.min(options?.limit ?? 50, 100);
    return prisma.activity.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: options?.offset ?? 0,
      ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
      include: {
        user: { select: this.userSelect },
      },
    }) as Promise<ActivityWithUser[]>;
  }

  async findByBoardId(boardId: string, options?: ActivityQueryOptions): Promise<ActivityWithUser[]> {
    const limit = Math.min(options?.limit ?? 50, 100);
    return prisma.activity.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: options?.offset ?? 0,
      ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
      include: {
        user: { select: this.userSelect },
      },
    }) as Promise<ActivityWithUser[]>;
  }

  async findByTaskId(taskId: string, options?: ActivityQueryOptions): Promise<ActivityWithUser[]> {
    const limit = Math.min(options?.limit ?? 50, 100);
    return prisma.activity.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: options?.offset ?? 0,
      ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
      include: {
        user: { select: this.userSelect },
      },
    }) as Promise<ActivityWithUser[]>;
  }
}

export const activityRepository = new ActivityRepository();
