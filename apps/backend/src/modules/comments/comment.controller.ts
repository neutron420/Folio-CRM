import { ValidationError } from "@kanban/errors";
import { commentService } from "./comment.service";
import type { User } from "@kanban/db";

export class CommentController {
  async listComments(_req: Request, user: User, taskId: string): Promise<Response> {
    const comments = await commentService.listComments(taskId, user.id);
    return Response.json({
      success: true,
      data: comments,
    });
  }

  async createComment(req: Request, user: User, taskId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const comment = await commentService.createComment(taskId, user.id, body);
    return Response.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  }

  async updateComment(req: Request, user: User, commentId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const comment = await commentService.updateComment(commentId, user.id, body);
    return Response.json({
      success: true,
      data: comment,
    });
  }

  async deleteComment(_req: Request, user: User, commentId: string): Promise<Response> {
    await commentService.deleteComment(commentId, user.id);
    return Response.json({
      success: true,
      data: { message: "Comment deleted successfully" },
    });
  }
}

export const commentController = new CommentController();
