export type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_KEYS = new Set([
  "password",
  "secret",
  "token",
  "authorization",
  "cookie",
  "session",
  "client_secret",
]);

function redact(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(redact);
  }

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      clean[key] = redact(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

export class Logger {
  private defaultContext: LogContext;

  constructor(defaultContext: LogContext = {}) {
    this.defaultContext = defaultContext;
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.defaultContext, ...context });
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...this.defaultContext,
      ...(context ? (redact(context) as Record<string, unknown>) : {}),
    };

    const serialized = JSON.stringify(entry);
    if (level === "error") {
      console.error(serialized);
    } else if (level === "warn") {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext) {
    this.log("error", message, context);
  }
}

export const logger = new Logger();
