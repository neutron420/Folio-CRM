import { ValidationError } from "@kanban/errors";
import { taskService } from "./task.service";
import type { User } from "@kanban/db";

export class TaskController {
  async createTask(req: Request, user: User, columnId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const task = await taskService.createTask(columnId, user.id, body);
    return Response.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );
  }

  async getTask(_req: Request, user: User, taskId: string): Promise<Response> {
    const task = await taskService.getTask(taskId, user.id);
    return Response.json({
      success: true,
      data: task,
    });
  }

  async updateTask(req: Request, user: User, taskId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const task = await taskService.updateTask(taskId, user.id, body);
    return Response.json({
      success: true,
      data: task,
    });
  }

  async moveTask(req: Request, user: User, taskId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const task = await taskService.moveTask(taskId, user.id, body);
    return Response.json({
      success: true,
      data: task,
    });
  }

  async deleteTask(_req: Request, user: User, taskId: string): Promise<Response> {
    await taskService.deleteTask(taskId, user.id);
    return Response.json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  }
}

export const taskController = new TaskController();
