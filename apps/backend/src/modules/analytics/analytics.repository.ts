import { prisma } from "@kanban/db";
import type { BoardAnalytics, ProjectAnalytics } from "./analytics.types";

export class AnalyticsRepository {
  async getBoardMetrics(boardId: string): Promise<BoardAnalytics> {
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
      include: {
        tasks: {
          include: {
            assignees: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const now = new Date();
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    const tasksByPriority = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    const assigneeMap = new Map<
      string,
      { userId: string; name: string; email: string; avatarUrl: string | null; taskCount: number }
    >();

    const doneColumn =
      columns.find((c) => c.name.trim().toLowerCase() === "done") ||
      (columns.length > 0 ? columns[columns.length - 1] : null);

    const tasksByColumn = columns.map((col) => {
      const isDone = doneColumn?.id === col.id;
      const count = col.tasks.length;
      totalTasks += count;

      if (isDone) {
        completedTasks += count;
      }

      for (const task of col.tasks) {
        
        if (task.priority in tasksByPriority) {
          tasksByPriority[task.priority as keyof typeof tasksByPriority]++;
        }

        if (!isDone && task.dueDate && task.dueDate < now) {
          overdueTasks++;
        }

        for (const a of task.assignees) {
          const existing = assigneeMap.get(a.user.id);
          if (existing) {
            existing.taskCount++;
          } else {
            assigneeMap.set(a.user.id, {
              userId: a.user.id,
              name: a.user.name,
              email: a.user.email,
              avatarUrl: a.user.avatarUrl,
              taskCount: 1,
            });
          }
        }
      }

      return {
        columnId: col.id,
        columnName: col.name,
        position: col.position,
        taskCount: count,
      };
    });

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      boardId,
      totalTasks,
      completedTasks,
      completionRate,
      overdueTasks,
      tasksByColumn,
      tasksByPriority,
      assigneeWorkload: Array.from(assigneeMap.values()),
    };
  }

  async getProjectMetrics(projectId: string): Promise<ProjectAnalytics> {
    const boards = await prisma.board.findMany({
      where: { projectId },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    const now = new Date();
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    const tasksByPriority = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    for (const board of boards) {
      const doneCol =
        board.columns.find((c) => c.name.trim().toLowerCase() === "done") ||
        (board.columns.length > 0 ? board.columns[board.columns.length - 1] : null);

      for (const col of board.columns) {
        const isDone = doneCol?.id === col.id;
        const count = col.tasks.length;
        totalTasks += count;
        if (isDone) completedTasks += count;

        for (const task of col.tasks) {
          if (task.priority in tasksByPriority) {
            tasksByPriority[task.priority as keyof typeof tasksByPriority]++;
          }
          if (!isDone && task.dueDate && task.dueDate < now) {
            overdueTasks++;
          }
        }
      }
    }

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      projectId,
      totalBoards: boards.length,
      totalTasks,
      completedTasks,
      completionRate,
      overdueTasks,
      tasksByPriority,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
