import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { workspaceController } from "./workspace.controller";
import { projectController } from "../projects";


export async function handleWorkspaceRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  // Check if pathname belongs to workspaces
  if (!pathname.startsWith("/api/v1/workspaces")) {
    return null;
  }

  try {
    // All workspace endpoints require an authenticated user
    const { user } = await requireAuth(req);

    // 1. GET /api/v1/workspaces - List workspaces
    if (pathname === "/api/v1/workspaces" && req.method === "GET") {
      return await workspaceController.listWorkspaces(req, user);
    }

    // 2. POST /api/v1/workspaces - Create workspace
    if (pathname === "/api/v1/workspaces" && req.method === "POST") {
      return await workspaceController.createWorkspace(req, user);
    }

    // Match /api/v1/workspaces/:workspaceId/...
    const segments = pathname.replace("/api/v1/workspaces/", "").split("/");
    const workspaceId = segments[0];

    if (!workspaceId) {
      return null;
    }

    // 3. /api/v1/workspaces/:workspaceId
    if (segments.length === 1) {
      if (req.method === "GET") {
        return await workspaceController.getWorkspace(req, user, workspaceId);
      }
      if (req.method === "PATCH") {
        return await workspaceController.updateWorkspace(req, user, workspaceId);
      }
      if (req.method === "DELETE") {
        return await workspaceController.deleteWorkspace(req, user, workspaceId);
      }
    }

    // 4. /api/v1/workspaces/:workspaceId/members
    if (segments.length === 2 && segments[1] === "members") {
      if (req.method === "GET") {
        return await workspaceController.listMembers(req, user, workspaceId);
      }
      if (req.method === "POST") {
        return await workspaceController.addMember(req, user, workspaceId);
      }
    }

    // 5. /api/v1/workspaces/:workspaceId/members/:targetUserId
    if (segments.length === 3 && segments[1] === "members") {
      const targetUserId = segments[2];
      if (!targetUserId) return null;
      if (req.method === "PATCH") {
        return await workspaceController.updateMemberRole(req, user, workspaceId, targetUserId);
      }
      if (req.method === "DELETE") {
        return await workspaceController.removeMember(req, user, workspaceId, targetUserId);
      }
    }

    // 6. /api/v1/workspaces/:workspaceId/projects
    if (segments.length === 2 && segments[1] === "projects") {
      if (req.method === "GET") {
        return await projectController.listProjects(req, user, workspaceId);
      }
      if (req.method === "POST") {
        return await projectController.createProject(req, user, workspaceId);
      }
    }

    return null; // Route within /api/v1/workspaces did not match method/path
  } catch (err) {
    return handleError(err, requestId);
  }
}
