import { NotFoundError } from "@kanban/errors";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { boardRepository } from "../boards/board.repository";
import { projectRepository } from "../projects/project.repository";
import { analyticsRepository } from "./analytics.repository";
import type { BoardAnalytics, ProjectAnalytics } from "./analytics.types";

export class AnalyticsService {
  async getBoardAnalytics(boardId: string, userId: string): Promise<BoardAnalytics> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError(`Board ${boardId} not found`);
    }

    await requireWorkspaceMember(board.project.workspaceId, userId, "VIEWER");
    return analyticsRepository.getBoardMetrics(boardId);
  }

  async getProjectAnalytics(projectId: string, userId: string): Promise<ProjectAnalytics> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    await requireWorkspaceMember(project.workspaceId, userId, "VIEWER");
    return analyticsRepository.getProjectMetrics(projectId);
  }
}

export const analyticsService = new AnalyticsService();
