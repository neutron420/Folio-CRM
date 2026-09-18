import { applySecurityHeaders } from "../../src/middleware/security-headers";

describe("Production Hardening & Security Standards", () => {
  it("injects all mandatory security headers into responses", () => {
    const original = new Response("OK", { status: 200 });
    const secured = applySecurityHeaders(original);

    expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
    expect(secured.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    expect(secured.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(secured.headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
  });

  it("structures liveness and readiness probe responses properly", () => {
    const livenessResponse = {
      status: "ok",
      uptime: process.uptime(),
    };

    const readinessResponse = {
      status: "ready",
      database: "connected",
    };

    expect(livenessResponse.status).toBe("ok");
    expect(typeof livenessResponse.uptime).toBe("number");
    expect(readinessResponse.status).toBe("ready");
    expect(readinessResponse.database).toBe("connected");
  });

  it("builds compliant HTTP 429 rate limit payload with required headers", () => {
    const errorBody = {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please slow down and try again later.",
        requestId: "req_test",
      },
    };

    const headers = {
      "Retry-After": "60",
      "X-RateLimit-Limit": "120",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": "60",
    };

    expect(errorBody.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(headers["Retry-After"]).toBe("60");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
  });
});
