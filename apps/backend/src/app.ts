import { getEnv } from "@kanban/config";
import { prisma } from "@kanban/db";
import { logger } from "@kanban/logger";
import { handleCors, setCorsHeaders } from "./middleware/cors";
import { handleError } from "./middleware/error-handler";
import { getOrGenerateRequestId } from "./middleware/request-id";

export function createApp() {
  const env = getEnv();

  return {
    async fetch(req: Request): Promise<Response> {
      const requestId = getOrGenerateRequestId(req);
      const url = new URL(req.url);
      const pathname = url.pathname;

      // 1. Handle CORS preflight
      const corsRes = handleCors(req, env.CORS_ORIGIN);
      if (corsRes) return corsRes;

      try {
        // 2. Health check endpoint (verifies DB connection to Neon)
        if (pathname === "/health" && req.method === "GET") {
          let dbStatus = "connected";
          try {
            await prisma.$queryRaw`SELECT 1`;
          } catch {
            dbStatus = "disconnected";
          }

          const response = Response.json({
            status: dbStatus === "connected" ? "ok" : "degraded",
            timestamp: new Date().toISOString(),
            service: "zelo-api",
            database: dbStatus,
            requestId,
          });

          response.headers.set("x-request-id", requestId);
          return setCorsHeaders(response, env.CORS_ORIGIN);
        }

        // Default 404
        const notFound = Response.json(
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
        notFound.headers.set("x-request-id", requestId);
        return setCorsHeaders(notFound, env.CORS_ORIGIN);
      } catch (err) {
        const errorRes = handleError(err, requestId);
        errorRes.headers.set("x-request-id", requestId);
        return setCorsHeaders(errorRes, env.CORS_ORIGIN);
      }
    },
  };
}
