import { ValidationError } from "@kanban/errors";
import { checklistService } from "./checklist.service";
import type { User } from "@kanban/db";

export class ChecklistController {
  async listChecklists(_req: Request, user: User, taskId: string): Promise<Response> {
    const checklists = await checklistService.listChecklists(taskId, user.id);
    return Response.json({
      success: true,
      data: checklists,
    });
  }

  async createChecklist(req: Request, user: User, taskId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const checklist = await checklistService.createChecklist(taskId, user.id, body);
    return Response.json(
      {
        success: true,
        data: checklist,
      },
      { status: 201 }
    );
  }

  async deleteChecklist(_req: Request, user: User, checklistId: string): Promise<Response> {
    await checklistService.deleteChecklist(checklistId, user.id);
    return Response.json({
      success: true,
      data: { message: "Checklist deleted successfully" },
    });
  }

  async addItem(req: Request, user: User, checklistId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const item = await checklistService.addItem(checklistId, user.id, body);
    return Response.json(
      {
        success: true,
        data: item,
      },
      { status: 201 }
    );
  }

  async updateItem(req: Request, user: User, itemId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const item = await checklistService.updateItem(itemId, user.id, body);
    return Response.json({
      success: true,
      data: item,
    });
  }

  async deleteItem(_req: Request, user: User, itemId: string): Promise<Response> {
    await checklistService.deleteItem(itemId, user.id);
    return Response.json({
      success: true,
      data: { message: "Checklist item deleted successfully" },
    });
  }
}

export const checklistController = new ChecklistController();
