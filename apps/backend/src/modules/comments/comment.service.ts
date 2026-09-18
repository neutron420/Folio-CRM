import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@kanban/errors";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember, hasMinimumRole } from "../../middleware/rbac";
import { realtimeBroker } from "../realtime/realtime.broker";
import { taskRepository } from "../tasks/task.repository";
import { commentRepository } from "./comment.repository";
import type { CreateCommentInput, UpdateCommentInput, CommentDTO } from "./comment.types";

export class CommentService {
  async listComments(taskId: string, userId: string): Promise<CommentDTO[]> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    await requireWorkspaceMember(task.board.project.workspaceId, userId, "VIEWER");

    const comments = await commentRepository.findByTaskId(taskId);

    return comments.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      userId: c.userId,
      content: c.content,
      user: {
        id: c.user.id,
        name: c.user.name,
        email: c.user.email,
        avatarUrl: c.user.avatarUrl,
      },
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  }

  async createComment(
    taskId: string,
    userId: string,
    input: CreateCommentInput
  ): Promise<CommentDTO> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const workspaceId = task.board.project.workspaceId;
    await requireWorkspaceMember(workspaceId, userId, "MEMBER");

    const content = input.content?.trim();
    if (!content || content.length === 0) {
      throw new ValidationError("Comment content is required");
    }
    if (content.length > 5000) {
      throw new ValidationError("Comment content cannot exceed 5000 characters");
    }

    const created = await commentRepository.create(taskId, userId, content);

    await taskRepository.logActivity({
      workspaceId,
      projectId: task.board.project.id,
      boardId: task.boardId,
      taskId,
      userId,
      action: "COMMENT_CREATED",
      metadata: { commentId: created.id },
    });

    logger.info("Comment created", { commentId: created.id, taskId, userId });

    const dto: CommentDTO = {
      id: created.id,
      taskId: created.taskId,
      userId: created.userId,
      content: created.content,
      user: {
        id: created.user.id,
        name: created.user.name,
        email: created.user.email,
        avatarUrl: created.user.avatarUrl,
      },
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    realtimeBroker.broadcastToBoard(task.boardId, "COMMENT_CREATED", {
      taskId,
      comment: dto,
    });

    return dto;
  }

  async updateComment(
    commentId: string,
    userId: string,
    input: UpdateCommentInput
  ): Promise<CommentDTO> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError(`Comment ${commentId} not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError("You can only edit your own comments");
    }

    const content = input.content?.trim();
    if (!content || content.length === 0) {
      throw new ValidationError("Comment content cannot be empty");
    }
    if (content.length > 5000) {
      throw new ValidationError("Comment content cannot exceed 5000 characters");
    }

    const updated = await commentRepository.update(commentId, content);

    return {
      id: updated.id,
      taskId: updated.taskId,
      userId: updated.userId,
      content: updated.content,
      user: {
        id: updated.user.id,
        name: updated.user.name,
        email: updated.user.email,
        avatarUrl: updated.user.avatarUrl,
      },
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError(`Comment ${commentId} not found`);
    }

    const isCreator = comment.userId === userId;

    if (!isCreator) {
      const member = await requireWorkspaceMember(
        comment.task.board.project.workspaceId,
        userId,
        "MEMBER"
      );
      const isAdmin = hasMinimumRole(member.role, "ADMIN");
      if (!isAdmin) {
        throw new ForbiddenError("Only comment creator or workspace admins can delete comments");
      }
    }

    await commentRepository.delete(commentId);
    logger.info("Comment deleted", { commentId, userId });
  }
}

export const commentService = new CommentService();
