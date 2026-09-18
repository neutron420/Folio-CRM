import { getEnv } from "@kanban/config";
import { prisma } from "@kanban/db";
import { logger } from "@kanban/logger";
import { handleCors, setCorsHeaders } from "./middleware/cors";
import { handleError } from "./middleware/error-handler";
import { applyRateLimit } from "./middleware/rate-limit";
import { applySecurityHeaders } from "./middleware/security-headers";
import { getOrGenerateRequestId } from "./middleware/request-id";
import { handleAuthRoutes } from "./modules/auth";
import { handleWorkspaceRoutes } from "./modules/workspaces";
import { handleProjectRoutes } from "./modules/projects";
import { handleBoardRoutes } from "./modules/boards";
import { handleColumnRoutes } from "./modules/columns";
import { handleTaskRoutes } from "./modules/tasks";
import { handleLabelRoutes } from "./modules/labels";
import { handleCommentRoutes } from "./modules/comments";
import { handleChecklistRoutes } from "./modules/checklists";
import { handleNotificationRoutes } from "./modules/notifications";
import { handleActivityRoutes } from "./modules/activities";
import { handleAnalyticsRoutes } from "./modules/analytics";
import { handleSearchRoutes } from "./modules/search";
import { handleAttachmentRoutes } from "./modules/attachments";

export function createApp() {
  const env = getEnv();

  return {
    async fetch(req: Request): Promise<Response> {
      const startTime = Date.now();
      const requestId = getOrGenerateRequestId(req);
      const url = new URL(req.url);
      const pathname = url.pathname;

      const corsRes = handleCors(req, env.CORS_ORIGIN);
      if (corsRes) return applySecurityHeaders(corsRes);

      const rateLimitRes = applyRateLimit(req, requestId);
      if (rateLimitRes) {
        return applySecurityHeaders(setCorsHeaders(rateLimitRes, env.CORS_ORIGIN));
      }

      try {
        let response: Response | null = null;

        if (pathname === "/" && req.method === "GET") {
          response = Response.json({
            status: "ok",
            service: "zelo-api",
            version: "1.0.0",
            message: "Welcome to Zelo Kanban API",
            endpoints: {
              health: "/health",
              healthLive: "/health/live",
              healthReady: "/health/ready",
              auth: "/api/v1/auth",
              workspaces: "/api/v1/workspaces",
              projects: "/api/v1/projects",
              boards: "/api/v1/boards",
              columns: "/api/v1/columns",
              tasks: "/api/v1/tasks",
              labels: "/api/v1/labels",
              comments: "/api/v1/comments",
              checklists: "/api/v1/checklists",
              notifications: "/api/v1/notifications",
              activities: "/api/v1/workspaces/:workspaceId/activities",
              analytics: "/api/v1/boards/:boardId/analytics",
              search: "/api/v1/workspaces/:workspaceId/search",
              attachments: "/api/v1/tasks/:taskId/attachments",
              websocket: "/ws",
            },
            requestId,
          });
        }

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

        if (pathname === "/health/live" && req.method === "GET") {
          response = Response.json({
            status: "ok",
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            requestId,
          });
        }

        if (pathname === "/health/ready" && req.method === "GET") {
          try {
            await prisma.$queryRaw`SELECT 1`;
            response = Response.json({
              status: "ready",
              database: "connected",
              timestamp: new Date().toISOString(),
              requestId,
            });
          } catch (err) {
            response = Response.json(
              {
                status: "not_ready",
                database: "disconnected",
                error: String(err),
                requestId,
              },
              { status: 503 }
            );
          }
        }

        if (!response && pathname.startsWith("/api/v1/auth")) {
          response = await handleAuthRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/workspaces")) {
          response = await handleWorkspaceRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/projects")) {
          response = await handleProjectRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/boards")) {
          response = await handleBoardRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/columns")) {
          response = await handleColumnRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/tasks")) {
          response = await handleTaskRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/labels")) {
          response = await handleLabelRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/comments")) {
          response = await handleCommentRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/checklists")) {
          response = await handleChecklistRoutes(req, pathname, requestId);
        }

        if (!response && pathname.startsWith("/api/v1/notifications")) {
          response = await handleNotificationRoutes(req, pathname, requestId);
        }

        if (!response && pathname.includes("/activities")) {
          response = await handleActivityRoutes(req, pathname, requestId);
        }

        if (!response && pathname.includes("/analytics")) {
          response = await handleAnalyticsRoutes(req, pathname, requestId);
        }

        if (!response && pathname.includes("/search")) {
          response = await handleSearchRoutes(req, pathname, requestId);
        }

        if (!response && (pathname.includes("/attachments") || pathname.startsWith("/api/v1/attachments"))) {
          response = await handleAttachmentRoutes(req, pathname, requestId);
        }

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

        response.headers.set("x-request-id", requestId);

        const duration = Date.now() - startTime;
        logger.info(`${req.method} ${pathname}`, {
          requestId,
          method: req.method,
          path: pathname,
          status: response.status,
          duration: `${duration}ms`,
        });

        return applySecurityHeaders(setCorsHeaders(response, env.CORS_ORIGIN));
      } catch (err) {
        const errorRes = handleError(err, requestId);
        errorRes.headers.set("x-request-id", requestId);
        return applySecurityHeaders(setCorsHeaders(errorRes, env.CORS_ORIGIN));
      }
    },
  };
}
