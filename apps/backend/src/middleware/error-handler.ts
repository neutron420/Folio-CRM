import { AppError } from "@kanban/errors";
import { logger } from "@kanban/logger";
import { ZodError } from "zod";

export function handleError(err: unknown, requestId: string): Response {
  if (err instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details ?? [],
          requestId,
        },
      },
      { status: err.statusCode }
    );
  }

  if (err instanceof ZodError) {
    return Response.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: err.flatten().fieldErrors,
          requestId,
        },
      },
      { status: 400 }
    );
  }

  logger.error("Unhandled internal server exception", {
    requestId,
    error: err instanceof Error ? err.stack || err.message : String(err),
  });

  return Response.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal server error occurred",
        requestId,
      },
    },
    { status: 500 }
  );
}
