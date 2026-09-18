import { getEnv } from "@kanban/config";
import { prisma } from "@kanban/db";
import { logger } from "@kanban/logger";
import { createApp } from "./app";
import { authService, getSessionTokenFromRequest } from "./modules/auth";
import { realtimeHandler } from "./modules/realtime/realtime.handler";
import type { WebSocketClientData } from "./modules/realtime/realtime.types";

const env = getEnv();
const app = createApp();

const server = Bun.serve<WebSocketClientData>({
  port: env.PORT,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const token = getSessionTokenFromRequest(req) || url.searchParams.get("token");
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized. Missing session token" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const sessionData = await authService.validateSession(token);
      if (!sessionData) {
        return new Response(
          JSON.stringify({ error: "Unauthorized. Invalid or expired session" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const upgraded = server.upgrade(req, {
        data: {
          userId: sessionData.user.id,
          user: {
            id: sessionData.user.id,
            email: sessionData.user.email,
            name: sessionData.user.name,
            avatarUrl: sessionData.user.avatarUrl,
          },
          subscriptions: new Set<string>(),
        },
      });

      if (upgraded) {
        return undefined;
      }

      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return app.fetch(req);
  },
  websocket: {
    open(ws) {
      realtimeHandler.onOpen(ws);
    },
    message(ws, message) {
      realtimeHandler.onMessage(ws, message);
    },
    close(ws, code, reason) {
      realtimeHandler.onClose(ws, code, reason);
    },
  },
});

logger.info(`Zelo API running on http://localhost:${server.port}`);
logger.info(`Health check at http://localhost:${server.port}/health`);
logger.info(`WebSocket endpoint at ws://localhost:${server.port}/ws`);

function shutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.stop();
  prisma.$disconnect().then(() => {
    logger.info("Database disconnected. Exiting.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
