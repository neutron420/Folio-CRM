import { requireAuth } from "../../middleware/auth";
import { handleError } from "../../middleware/error-handler";
import { workspaceController } from "./workspace.controller";
import { projectController } from "../projects";
import { labelController } from "../labels";
import { activityController } from "../activities";
import { searchController } from "../search";

export async function handleWorkspaceRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  
  if (!pathname.startsWith("/api/v1/workspaces")) {
    return null;
  }

  try {
    
    const { user } = await requireAuth(req);

    if (pathname === "/api/v1/workspaces" && req.method === "GET") {
      return await workspaceController.listWorkspaces(req, user);
    }

    if (pathname === "/api/v1/workspaces" && req.method === "POST") {
      return await workspaceController.createWorkspace(req, user);
    }

    const segments = pathname.replace("/api/v1/workspaces/", "").split("/");
    const workspaceId = segments[0];

    if (!workspaceId) {
      return null;
    }

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

    if (segments.length === 2 && segments[1] === "members") {
      if (req.method === "GET") {
        return await workspaceController.listMembers(req, user, workspaceId);
      }
      if (req.method === "POST") {
        return await workspaceController.addMember(req, user, workspaceId);
      }
    }

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

    if (segments.length === 2 && segments[1] === "projects") {
      if (req.method === "GET") {
        return await projectController.listProjects(req, user, workspaceId);
      }
      if (req.method === "POST") {
        return await projectController.createProject(req, user, workspaceId);
      }
    }

    if (segments.length === 2 && segments[1] === "labels") {
      if (req.method === "GET") {
        return await labelController.listLabels(req, user, workspaceId);
      }
      if (req.method === "POST") {
        return await labelController.createLabel(req, user, workspaceId);
      }
    }

    if (segments.length === 2 && segments[1] === "activities") {
      if (req.method === "GET") {
        return await activityController.getWorkspaceActivities(req, workspaceId, requestId);
      }
    }

    if (segments.length === 2 && segments[1] === "search") {
      if (req.method === "GET") {
        return await searchController.search(req, workspaceId, requestId);
      }
    }

    return null; 
  } catch (err) {
    return handleError(err, requestId);
  }
}
