import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember, hasMinimumRole } from "../../middleware/rbac";
import { projectRepository } from "./project.repository";
import type { CreateProjectInput, UpdateProjectInput, ProjectSummary } from "./project.types";

export class ProjectService {
  async listProjects(workspaceId: string, userId: string): Promise<ProjectSummary[]> {
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");
    const projects = await projectRepository.findByWorkspaceId(workspaceId);

    return projects.map((p) => ({
      id: p.id,
      workspaceId: p.workspaceId,
      name: p.name,
      description: p.description,
      color: p.color,
      icon: p.icon,
      createdBy: p.createdBy,
      boardsCount: p._count.boards,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  async getProject(projectId: string, userId: string): Promise<ProjectSummary> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    await requireWorkspaceMember(project.workspaceId, userId, "VIEWER");

    return {
      id: project.id,
      workspaceId: project.workspaceId,
      name: project.name,
      description: project.description,
      color: project.color,
      icon: project.icon,
      createdBy: project.createdBy,
      boardsCount: project._count.boards,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  async createProject(
    workspaceId: string,
    userId: string,
    input: CreateProjectInput
  ): Promise<ProjectSummary> {
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const name = input.name?.trim();
    if (!name || name.length === 0) {
      throw new ValidationError("Project name is required");
    }
    if (name.length > 100) {
      throw new ValidationError("Project name cannot exceed 100 characters");
    }

    const project = await projectRepository.create(workspaceId, userId, {
      name,
      description: input.description?.trim() || undefined,
      color: input.color?.trim() || undefined,
      icon: input.icon?.trim() || undefined,
    });

    logger.info("Project created", { projectId: project.id, workspaceId, userId });

    return {
      id: project.id,
      workspaceId: project.workspaceId,
      name: project.name,
      description: project.description,
      color: project.color,
      icon: project.icon,
      createdBy: project.createdBy,
      boardsCount: 0,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  async updateProject(
    projectId: string,
    userId: string,
    input: UpdateProjectInput
  ): Promise<ProjectSummary> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    const member = await requireWorkspaceMember(project.workspaceId, userId, "MEMBER");

    const isCreator = project.createdBy === userId;
    const isAdmin = hasMinimumRole(member.role, "ADMIN");
    if (!isCreator && !isAdmin) {
      throw new ForbiddenError("Only project creator or workspace admins can modify this project");
    }

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length === 0) {
        throw new ValidationError("Project name cannot be empty");
      }
      if (name.length > 100) {
        throw new ValidationError("Project name cannot exceed 100 characters");
      }
    }

    const updated = await projectRepository.update(projectId, {
      name: input.name?.trim(),
      description: input.description !== undefined ? input.description?.trim() || null : undefined,
      color: input.color !== undefined ? input.color?.trim() || null : undefined,
      icon: input.icon !== undefined ? input.icon?.trim() || null : undefined,
    });

    return {
      id: updated.id,
      workspaceId: updated.workspaceId,
      name: updated.name,
      description: updated.description,
      color: updated.color,
      icon: updated.icon,
      createdBy: updated.createdBy,
      boardsCount: project._count.boards,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }

    const member = await requireWorkspaceMember(project.workspaceId, userId, "MEMBER");

    const isCreator = project.createdBy === userId;
    const isAdmin = hasMinimumRole(member.role, "ADMIN");
    if (!isCreator && !isAdmin) {
      throw new ForbiddenError("Only project creator or workspace admins can delete this project");
    }

    await projectRepository.delete(projectId);
    logger.info("Project deleted", { projectId, workspaceId: project.workspaceId, userId });
  }
}

export const projectService = new ProjectService();
