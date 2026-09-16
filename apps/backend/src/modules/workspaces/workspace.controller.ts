import { ValidationError } from "@kanban/errors";
import { workspaceService } from "./workspace.service";
import type { User } from "@kanban/db";

export class WorkspaceController {
  async listWorkspaces(_req: Request, user: User): Promise<Response> {
    const workspaces = await workspaceService.listUserWorkspaces(user.id);
    return Response.json({
      success: true,
      data: workspaces,
    });
  }

  async createWorkspace(req: Request, user: User): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const workspace = await workspaceService.createWorkspace(user.id, body);
    return Response.json(
      {
        success: true,
        data: workspace,
      },
      { status: 201 }
    );
  }

  async getWorkspace(_req: Request, user: User, workspaceId: string): Promise<Response> {
    const workspace = await workspaceService.getWorkspace(workspaceId, user.id);
    return Response.json({
      success: true,
      data: workspace,
    });
  }

  async updateWorkspace(req: Request, user: User, workspaceId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const workspace = await workspaceService.updateWorkspace(workspaceId, user.id, body);
    return Response.json({
      success: true,
      data: workspace,
    });
  }

  async deleteWorkspace(_req: Request, user: User, workspaceId: string): Promise<Response> {
    await workspaceService.deleteWorkspace(workspaceId, user.id);
    return Response.json({
      success: true,
      data: { message: "Workspace deleted successfully" },
    });
  }

  async listMembers(_req: Request, user: User, workspaceId: string): Promise<Response> {
    const members = await workspaceService.listMembers(workspaceId, user.id);
    return Response.json({
      success: true,
      data: members,
    });
  }

  async addMember(req: Request, user: User, workspaceId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const member = await workspaceService.addMember(workspaceId, user.id, body);
    return Response.json(
      {
        success: true,
        data: member,
      },
      { status: 201 }
    );
  }

  async updateMemberRole(
    req: Request,
    user: User,
    workspaceId: string,
    targetUserId: string
  ): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const member = await workspaceService.updateMemberRole(
      workspaceId,
      user.id,
      targetUserId,
      body
    );
    return Response.json({
      success: true,
      data: member,
    });
  }

  async removeMember(
    _req: Request,
    user: User,
    workspaceId: string,
    targetUserId: string
  ): Promise<Response> {
    await workspaceService.removeMember(workspaceId, user.id, targetUserId);
    return Response.json({
      success: true,
      data: { message: "Member removed successfully" },
    });
  }
}

export const workspaceController = new WorkspaceController();
