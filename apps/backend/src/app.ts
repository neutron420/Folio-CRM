import { getEnv } from "@kanban/config";
import { prisma } from "@kanban/db";
import { logger } from "@kanban/logger";
import { handleCors, setCorsHeaders } from "./middleware/cors";
import { handleError } from "./middleware/error-handler";
import { getOrGenerateRequestId } from "./middleware/request-id";
import { handleAuthRoutes } from "./modules/auth";
import { handleWorkspaceRoutes } from "./modules/workspaces";
import { handleProjectRoutes } from "./modules/projects";
import { handleBoardRoutes } from "./modules/boards";
import { handleColumnRoutes } from "./modules/columns";
import { handleTaskRoutes } from "./modules/tasks";

export function createApp() {
  const env = getEnv();

  return {
    async fetch(req: Request): Promise<Response> {
      const startTime = Date.now();
      const requestId = getOrGenerateRequestId(req);
      const url = new URL(req.url);
      const pathname = url.pathname;

      // 1. Handle CORS preflight
      const corsRes = handleCors(req, env.CORS_ORIGIN);
      if (corsRes) return corsRes;

      try {
        let response: Response | null = null;

        // 2. Root welcome endpoint
        if (pathname === "/" && req.method === "GET") {
          response = Response.json({
            status: "ok",
            service: "zelo-api",
            version: "1.0.0",
            message: "Welcome to Zelo Kanban API",
            endpoints: {
              health: "/health",
              auth: "/api/v1/auth",
              workspaces: "/api/v1/workspaces",
              projects: "/api/v1/projects",
              boards: "/api/v1/boards",
              columns: "/api/v1/columns",
              tasks: "/api/v1/tasks",
            },
            requestId,
          });
        }

        // 3. Health check
        if (pathname === "/health" && req.method === "GET") {
          let dbStatus = "connected";
          try {
            await prisma.$queryRaw`SELECT 1`;
          } catch {
            dbStatus = "disconnected";
          }

          response = Response.json({
            status: dbStatus === "connected" ? "ok" : "degraded",
            timestamp: new Date().toISOString(),
            service: "zelo-api",
            database: dbStatus,
            requestId,
          });
        }

        // 3. Auth routes (/api/v1/auth/*)
        if (!response && pathname.startsWith("/api/v1/auth")) {
          response = await handleAuthRoutes(req, pathname, requestId);
        }

        // 4. Workspace routes (/api/v1/workspaces/*)
        if (!response && pathname.startsWith("/api/v1/workspaces")) {
          response = await handleWorkspaceRoutes(req, pathname, requestId);
        }

        // 5. Project routes (/api/v1/projects/*)
        if (!response && pathname.startsWith("/api/v1/projects")) {
          response = await handleProjectRoutes(req, pathname, requestId);
        }

        // 6. Board routes (/api/v1/boards/*)
        if (!response && pathname.startsWith("/api/v1/boards")) {
          response = await handleBoardRoutes(req, pathname, requestId);
        }

        // 7. Column routes (/api/v1/columns/*)
        if (!response && pathname.startsWith("/api/v1/columns")) {
          response = await handleColumnRoutes(req, pathname, requestId);
        }

        // 8. Task routes (/api/v1/tasks/*)
        if (!response && pathname.startsWith("/api/v1/tasks")) {
          response = await handleTaskRoutes(req, pathname, requestId);
        }

        // 4. 404 fallback
        if (!response) {
          response = Response.json(
            {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: `Route ${req.method} ${pathname} not found`,
                requestId,
              },
            },
            { status: 404 }
          );
        }

        // Add standard headers
        response.headers.set("x-request-id", requestId);

        // Log request
        const duration = Date.now() - startTime;
        logger.info(`${req.method} ${pathname}`, {
          requestId,
          method: req.method,
          path: pathname,
          status: response.status,
          duration: `${duration}ms`,
        });

        return setCorsHeaders(response, env.CORS_ORIGIN);
      } catch (err) {
        const errorRes = handleError(err, requestId);
        errorRes.headers.set("x-request-id", requestId);
        return setCorsHeaders(errorRes, env.CORS_ORIGIN);
      }
    },
  };
}
