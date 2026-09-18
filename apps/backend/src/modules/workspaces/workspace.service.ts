import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { randomBytes } from "crypto";
import { requireWorkspaceMember, hasMinimumRole } from "../../middleware/rbac";
import { workspaceRepository } from "./workspace.repository";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  AddMemberInput,
  UpdateMemberInput,
  WorkspaceSummary,
  WorkspaceMemberInfo,
} from "./workspace.types";
import type { WorkspaceRole } from "@kanban/db";

export class WorkspaceService {
  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const suffix = randomBytes(3).toString("hex");
    return base ? `${base}-${suffix}` : `workspace-${suffix}`;
  }

  async listUserWorkspaces(userId: string): Promise<WorkspaceSummary[]> {
    const workspaces = await workspaceRepository.findUserWorkspaces(userId);
    return workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      ownerId: ws.ownerId,
      role: ws.role,
      memberCount: ws.memberCount,
      createdAt: ws.createdAt.toISOString(),
      updatedAt: ws.updatedAt.toISOString(),
    }));
  }

  async getWorkspace(workspaceId: string, userId: string): Promise<WorkspaceSummary> {
    const member = await requireWorkspaceMember(workspaceId, userId, "VIEWER");
    const ws = await workspaceRepository.findById(workspaceId);

    if (!ws) {
      throw new NotFoundError(`Workspace ${workspaceId} not found`);
    }

    return {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      ownerId: ws.ownerId,
      role: member.role,
      memberCount: ws._count.members,
      createdAt: ws.createdAt.toISOString(),
      updatedAt: ws.updatedAt.toISOString(),
    };
  }

  async createWorkspace(userId: string, input: CreateWorkspaceInput): Promise<WorkspaceSummary> {
    const name = input.name?.trim();
    if (!name || name.length === 0) {
      throw new ValidationError("Workspace name is required");
    }
    if (name.length > 100) {
      throw new ValidationError("Workspace name cannot exceed 100 characters");
    }

    const slug = this.generateSlug(name);

    const workspace = await workspaceRepository.create({
      name,
      slug,
      description: input.description?.trim() || undefined,
      ownerId: userId,
    });

    logger.info("Workspace created", { workspaceId: workspace.id, userId, slug });

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      ownerId: workspace.ownerId,
      role: "OWNER",
      memberCount: 1,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
    };
  }

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    input: UpdateWorkspaceInput
  ): Promise<WorkspaceSummary> {
    const member = await requireWorkspaceMember(workspaceId, userId, "ADMIN");

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name || name.length === 0) {
        throw new ValidationError("Workspace name cannot be empty");
      }
      if (name.length > 100) {
        throw new ValidationError("Workspace name cannot exceed 100 characters");
      }
    }

    const updated = await workspaceRepository.update(workspaceId, {
      name: input.name?.trim(),
      description: input.description !== undefined ? input.description?.trim() || null : undefined,
    });

    const full = await workspaceRepository.findById(workspaceId);

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      ownerId: updated.ownerId,
      role: member.role,
      memberCount: full?._count.members || 1,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    await requireWorkspaceMember(workspaceId, userId, "OWNER");
    await workspaceRepository.delete(workspaceId);
    logger.info("Workspace deleted", { workspaceId, deletedBy: userId });
  }

  async listMembers(workspaceId: string, userId: string): Promise<WorkspaceMemberInfo[]> {
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");
    const members = await workspaceRepository.listMembers(workspaceId);

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.name,
        avatarUrl: m.user.avatarUrl,
      },
      joinedAt: m.createdAt.toISOString(),
    }));
  }

  async addMember(
    workspaceId: string,
    userId: string,
    input: AddMemberInput
  ): Promise<WorkspaceMemberInfo> {
    const callerMember = await requireWorkspaceMember(workspaceId, userId, "ADMIN");

    const email = input.email?.trim().toLowerCase();
    if (!email) {
      throw new ValidationError("Email is required to add a member");
    }

    const role: WorkspaceRole = input.role || "MEMBER";

    if (role === "OWNER" && callerMember.role !== "OWNER") {
      throw new ForbiddenError("Only an OWNER can add another member as OWNER");
    }

    const targetUser = await workspaceRepository.findUserByEmail(email);
    if (!targetUser) {
      throw new NotFoundError(`User with email "${email}" does not have a Zelo account`);
    }

    const existingMember = await workspaceRepository.findMember(workspaceId, targetUser.id);
    if (existingMember) {
      throw new ConflictError("User is already a member of this workspace");
    }

    const newMember = await workspaceRepository.addMember(workspaceId, targetUser.id, role);

    logger.info("Member added to workspace", {
      workspaceId,
      userId: targetUser.id,
      role,
      addedBy: userId,
    });

    return {
      id: newMember.id,
      userId: newMember.userId,
      role: newMember.role,
      user: {
        id: newMember.user.id,
        email: newMember.user.email,
        name: newMember.user.name,
        avatarUrl: newMember.user.avatarUrl,
      },
      joinedAt: newMember.createdAt.toISOString(),
    };
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    targetUserId: string,
    input: UpdateMemberInput
  ): Promise<WorkspaceMemberInfo> {
    const callerMember = await requireWorkspaceMember(workspaceId, userId, "ADMIN");

    const targetMember = await workspaceRepository.findMember(workspaceId, targetUserId);
    if (!targetMember) {
      throw new NotFoundError("Member not found in this workspace");
    }

    const newRole = input.role;
    if (!["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(newRole)) {
      throw new ValidationError("Invalid workspace role specified");
    }

    if (newRole === "OWNER" && callerMember.role !== "OWNER") {
      throw new ForbiddenError("Only an OWNER can promote a member to OWNER");
    }

    if (targetMember.role === "OWNER" && callerMember.role !== "OWNER") {
      throw new ForbiddenError("Only an OWNER can modify another OWNER's role");
    }

    if (targetMember.role === "OWNER" && newRole !== "OWNER") {
      const ownerCount = await workspaceRepository.countOwners(workspaceId);
      if (ownerCount <= 1) {
        throw new BadRequestError(
          "Cannot demote the sole owner. Promote another member to OWNER first."
        );
      }
    }

    const updated = await workspaceRepository.updateMemberRole(
      workspaceId,
      targetUserId,
      newRole
    );

    logger.info("Member role updated", {
      workspaceId,
      targetUserId,
      newRole,
      updatedBy: userId,
    });

    return {
      id: updated.id,
      userId: updated.userId,
      role: updated.role,
      user: {
        id: updated.user.id,
        email: updated.user.email,
        name: updated.user.name,
        avatarUrl: updated.user.avatarUrl,
      },
      joinedAt: updated.createdAt.toISOString(),
    };
  }

  async removeMember(
    workspaceId: string,
    userId: string,
    targetUserId: string
  ): Promise<void> {
    const isSelfLeaving = userId === targetUserId;

    if (isSelfLeaving) {
      const member = await requireWorkspaceMember(workspaceId, userId, "VIEWER");
      if (member.role === "OWNER") {
        const ownerCount = await workspaceRepository.countOwners(workspaceId);
        if (ownerCount <= 1) {
          throw new BadRequestError(
            "Cannot leave workspace as the sole owner. Transfer ownership or delete workspace."
          );
        }
      }
      await workspaceRepository.removeMember(workspaceId, userId);
      logger.info("Member left workspace", { workspaceId, userId });
      return;
    }

    const callerMember = await requireWorkspaceMember(workspaceId, userId, "ADMIN");
    const targetMember = await workspaceRepository.findMember(workspaceId, targetUserId);

    if (!targetMember) {
      throw new NotFoundError("Member not found in this workspace");
    }

    if (targetMember.role === "OWNER") {
      if (callerMember.role !== "OWNER") {
        throw new ForbiddenError("Only an OWNER can remove another OWNER");
      }
      const ownerCount = await workspaceRepository.countOwners(workspaceId);
      if (ownerCount <= 1) {
        throw new BadRequestError("Cannot remove the sole owner of the workspace");
      }
    }

    if (targetMember.role === "ADMIN" && callerMember.role !== "OWNER") {
      throw new ForbiddenError("Only an OWNER can remove an ADMIN");
    }

    await workspaceRepository.removeMember(workspaceId, targetUserId);
    logger.info("Member removed from workspace", {
      workspaceId,
      targetUserId,
      removedBy: userId,
    });
  }
}

export const workspaceService = new WorkspaceService();
