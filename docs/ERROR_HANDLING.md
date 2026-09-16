# Centralized Error Handling

## 1. Global Error Architecture

All errors across the Zelo REST API and WebSocket interfaces conform to a unified JSON error envelope:

```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID 'tsk_99' does not exist in this board.",
    "details": [],
    "requestId": "req_01h8abc123"
  }
}
```

---

## 2. Shared Error Hierarchy (`packages/errors`)

Domain code throws semantic error classes rather than raw exceptions or ad-hoc HTTP codes.

```typescript
// packages/errors/src/index.ts

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  readonly isOperational: boolean = true;
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = "RESOURCE_NOT_FOUND";
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly code = "FORBIDDEN";
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly code = "CONFLICT";
}

export class RateLimitError extends AppError {
  readonly statusCode = 429;
  readonly code = "RATE_LIMIT_EXCEEDED";
}
```

---

## 3. Centralized Error Middleware (`apps/backend`)

The global error handler catches all unhandled exceptions:

```typescript
export function errorHandler(
  err: Error,
  req: Request,
  requestId: string
): Response {
  // Operational domain errors
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

  // Zod schema validation errors
  if (err instanceof ZodError) {
    return Response.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The submitted request body failed validation constraints.",
          details: err.flatten().fieldErrors,
          requestId,
        },
      },
      { status: 400 }
    );
  }

  // Unknown internal server exceptions
  logger.error({ err, requestId }, "Unhandled internal exception");

  return Response.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected internal server error occurred.",
        requestId,
      },
    },
    { status: 500 }
  );
}
```

---

## 4. Standard Error Codes Catalog

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Missing, expired, or corrupted session token |
| `FORBIDDEN` | 403 | Insufficient RBAC role for the targeted resource |
| `WORKSPACE_NOT_FOUND` | 404 | Workspace does not exist or user has no access |
| `PROJECT_NOT_FOUND` | 404 | Project ID does not exist |
| `BOARD_NOT_FOUND` | 404 | Board ID does not exist |
| `TASK_NOT_FOUND` | 404 | Task ID does not exist |
| `COLUMN_NOT_FOUND` | 404 | Column ID does not exist |
| `SLUG_ALREADY_EXISTS` | 409 | Workspace slug collision |
| `CIRCULAR_DEPENDENCY` | 400 | Adding task dependency would create a cycle |
| `VALIDATION_ERROR` | 400 | Invalid JSON payload or missing required fields |
| `RATE_LIMIT_EXCEEDED` | 429 | IP or User exceeded request quota |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected database or runtime fault |
