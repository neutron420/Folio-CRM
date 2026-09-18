import { ValidationError } from "@kanban/errors";
import { labelService } from "./label.service";
import type { User } from "@kanban/db";

export class LabelController {
  async listLabels(_req: Request, user: User, workspaceId: string): Promise<Response> {
    const labels = await labelService.listLabels(workspaceId, user.id);
    return Response.json({
      success: true,
      data: labels,
    });
  }

  async createLabel(req: Request, user: User, workspaceId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const label = await labelService.createLabel(workspaceId, user.id, body);
    return Response.json(
      {
        success: true,
        data: label,
      },
      { status: 201 }
    );
  }

  async updateLabel(req: Request, user: User, labelId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const label = await labelService.updateLabel(labelId, user.id, body);
    return Response.json({
      success: true,
      data: label,
    });
  }

  async deleteLabel(_req: Request, user: User, labelId: string): Promise<Response> {
    await labelService.deleteLabel(labelId, user.id);
    return Response.json({
      success: true,
      data: { message: "Label deleted successfully" },
    });
  }

  async attachLabel(_req: Request, user: User, taskId: string, labelId: string): Promise<Response> {
    await labelService.attachLabelToTask(taskId, labelId, user.id);
    return Response.json({
      success: true,
      data: { message: "Label attached to task" },
    });
  }

  async detachLabel(_req: Request, user: User, taskId: string, labelId: string): Promise<Response> {
    await labelService.detachLabelFromTask(taskId, labelId, user.id);
    return Response.json({
      success: true,
      data: { message: "Label detached from task" },
    });
  }
}

export const labelController = new LabelController();
