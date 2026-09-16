import { ValidationError } from "@kanban/errors";
import { projectService } from "./project.service";
import type { User } from "@kanban/db";

export class ProjectController {
  async listProjects(_req: Request, user: User, workspaceId: string): Promise<Response> {
    const projects = await projectService.listProjects(workspaceId, user.id);
    return Response.json({
      success: true,
      data: projects,
    });
  }

  async createProject(req: Request, user: User, workspaceId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const project = await projectService.createProject(workspaceId, user.id, body);
    return Response.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  }

  async getProject(_req: Request, user: User, projectId: string): Promise<Response> {
    const project = await projectService.getProject(projectId, user.id);
    return Response.json({
      success: true,
      data: project,
    });
  }

  async updateProject(req: Request, user: User, projectId: string): Promise<Response> {
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }

    const project = await projectService.updateProject(projectId, user.id, body);
    return Response.json({
      success: true,
      data: project,
    });
  }

  async deleteProject(_req: Request, user: User, projectId: string): Promise<Response> {
    await projectService.deleteProject(projectId, user.id);
    return Response.json({
      success: true,
      data: { message: "Project deleted successfully" },
    });
  }
}

export const projectController = new ProjectController();
