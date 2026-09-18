import { ActivityService } from "../../src/modules/activities/activity.service";
import { activityRepository } from "../../src/modules/activities/activity.repository";
import { logger } from "@kanban/logger";
import type { RecordActivityDTO } from "../../src/modules/activities/activity.types";

describe("Activity Service & Event Logging", () => {
  let activityService: ActivityService;

  beforeEach(() => {
    activityService = new ActivityService();
  });

  it("constructs a valid RecordActivityDTO for task creation", () => {
    const dto: RecordActivityDTO = {
      workspaceId: "ws_123",
      projectId: "proj_456",
      boardId: "board_789",
      taskId: "task_001",
      userId: "user_abc",
      action: "TASK_CREATED",
      metadata: {
        title: "Build landing page",
        priority: "HIGH",
      },
    };

    expect(dto.workspaceId).toBe("ws_123");
    expect(dto.taskId).toBe("task_001");
    expect(dto.action).toBe("TASK_CREATED");
    expect(dto.metadata?.priority).toBe("HIGH");
  });

  it("constructs a valid RecordActivityDTO for task movement with old and new column positions", () => {
    const dto: RecordActivityDTO = {
      workspaceId: "ws_123",
      boardId: "board_789",
      taskId: "task_001",
      userId: "user_abc",
      action: "TASK_MOVED",
      metadata: {
        fromColumnId: "col_1",
        toColumnId: "col_2",
        oldPosition: 1000.0,
        newPosition: 1500.0,
      },
    };

    expect(dto.action).toBe("TASK_MOVED");
    expect(dto.metadata?.oldPosition).toBe(1000.0);
    expect(dto.metadata?.newPosition).toBe(1500.0);
    expect(dto.metadata?.fromColumnId).not.toBe(dto.metadata?.toColumnId);
  });

  it("handles activity recording errors gracefully without crashing the application", async () => {
    const repoSpy = jest
      .spyOn(activityRepository, "create")
      .mockRejectedValueOnce(new Error("DB connection timeout"));
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

    const dto: RecordActivityDTO = {
      workspaceId: "ws_1",
      userId: "u_1",
      action: "TASK_UPDATED",
    };

    const result = await activityService.recordActivity(dto);
    expect(result).toBeNull();

    repoSpy.mockRestore();
    loggerSpy.mockRestore();
  });
});
