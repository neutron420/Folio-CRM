import { ValidationError } from "@kanban/errors";
import { columnService } from "./column.service";
import type { User } from "@kanban/db";

export class ColumnController {
  async createColumn(req: Request, user: User, boardId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const column = await columnService.createColumn(boardId, user.id, body);
    return Response.json(
      {
        success: true,
        data: column,
      },
      { status: 201 }
    );
  }

  async updateColumn(req: Request, user: User, columnId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const column = await columnService.updateColumn(columnId, user.id, body);
    return Response.json({
      success: true,
      data: column,
    });
  }

  async moveColumn(req: Request, user: User, columnId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const column = await columnService.moveColumn(columnId, user.id, body);
    return Response.json({
      success: true,
      data: column,
    });
  }

  async deleteColumn(_req: Request, user: User, columnId: string): Promise<Response> {
    await columnService.deleteColumn(columnId, user.id);
    return Response.json({
      success: true,
      data: { message: "Column deleted successfully" },
    });
  }
}

export const columnController = new ColumnController();
