import { getEnv } from "@kanban/config";
import { prisma } from "@kanban/db";
import { logger } from "@kanban/logger";
import { createApp } from "./app";

const env = getEnv();
const app = createApp();

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

logger.info(`Zelo API running on http://localhost:${server.port}`);
logger.info(`Health check at http://localhost:${server.port}/health`);

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
