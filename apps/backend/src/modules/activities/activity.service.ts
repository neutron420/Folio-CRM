import { NotFoundError } from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { boardRepository } from "../boards/board.repository";
import { taskRepository } from "../tasks/task.repository";
import { activityRepository } from "./activity.repository";
import type { ActivityQueryOptions, ActivityWithUser, RecordActivityDTO } from "./activity.types";

export class ActivityService {
  async recordActivity(data: RecordActivityDTO): Promise<ActivityWithUser | null> {
    try {
      return await activityRepository.create(data);
    } catch (err) {
      logger.error("Failed to record activity log", { error: String(err), action: data.action });
      return null;
    }
  }

  async getWorkspaceActivities(
    workspaceId: string,
    userId: string,
    options?: ActivityQueryOptions
  ): Promise<ActivityWithUser[]> {
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");
    return activityRepository.findByWorkspaceId(workspaceId, options);
  }

  async getBoardActivities(
    boardId: string,
    userId: string,
    options?: ActivityQueryOptions
  ): Promise<ActivityWithUser[]> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    await requireWorkspaceMember(board.project.workspaceId, userId, "VIEWER");
    return activityRepository.findByBoardId(boardId, options);
  }

  async getTaskActivities(
    taskId: string,
    userId: string,
    options?: ActivityQueryOptions
  ): Promise<ActivityWithUser[]> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    await requireWorkspaceMember(task.board.project.workspaceId, userId, "VIEWER");
    return activityRepository.findByTaskId(taskId, options);
  }
}

export const activityService = new ActivityService();
