import { ValidationError } from "@kanban/errors";
import { boardService } from "./board.service";
import type { User } from "@kanban/db";

export class BoardController {
  async listBoards(_req: Request, user: User, projectId: string): Promise<Response> {
    const boards = await boardService.listBoards(projectId, user.id);
    return Response.json({
      success: true,
      data: boards,
    });
  }

  async createBoard(req: Request, user: User, projectId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const board = await boardService.createBoard(projectId, user.id, body);
    return Response.json(
      {
        success: true,
        data: board,
      },
      { status: 201 }
    );
  }

  async getBoard(_req: Request, user: User, boardId: string): Promise<Response> {
    const board = await boardService.getBoard(boardId, user.id);
    return Response.json({
      success: true,
      data: board,
    });
  }

  async updateBoard(req: Request, user: User, boardId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const board = await boardService.updateBoard(boardId, user.id, body);
    return Response.json({
      success: true,
      data: board,
    });
  }

  async deleteBoard(_req: Request, user: User, boardId: string): Promise<Response> {
    await boardService.deleteBoard(boardId, user.id);
    return Response.json({
      success: true,
      data: { message: "Board deleted successfully" },
    });
  }
}

export const boardController = new BoardController();
