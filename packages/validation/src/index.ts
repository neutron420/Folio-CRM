import { z } from "zod";

// ==========================================
// Workspace Schemas
// ==========================================

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const addWorkspaceMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export const updateWorkspaceMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

// ==========================================
// Project & Board Schemas
// ==========================================

export const createProjectSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(32).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createBoardSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
});

export const updateBoardSchema = createBoardSchema.partial();

// ==========================================
// Column & Task Schemas
// ==========================================

export const createColumnSchema = z.object({
  name: z.string().min(1).max(64),
  position: z.number().positive().optional(),
});

export const updateColumnSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  position: z.number().positive().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().positive().optional(),
  assigneeIds: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeIds: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
});

export const moveTaskSchema = z.object({
  targetColumnId: z.string().min(1),
  targetPosition: z.number().positive(),
});

// ==========================================
// Comments, Labels & Checklists Schemas
// ==========================================

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const createLabelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const createChecklistSchema = z.object({
  title: z.string().min(1).max(120),
});

export const createChecklistItemSchema = z.object({
  content: z.string().min(1).max(255),
  position: z.number().positive().optional(),
});

export const updateChecklistItemSchema = z.object({
  content: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
  position: z.number().positive().optional(),
});
