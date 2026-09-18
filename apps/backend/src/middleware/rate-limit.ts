interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets = new Map<string, RateLimitBucket>();
  private readonly defaultCapacity: number;
  private readonly authCapacity: number;
  private readonly windowMs: number;

  constructor(defaultCapacity = 120, authCapacity = 20, windowMs = 60000) {
    this.defaultCapacity = defaultCapacity;
    this.authCapacity = authCapacity;
    this.windowMs = windowMs;

    const timer = setInterval(() => this.cleanup(), 300000);
    if (typeof timer.unref === "function") {
      timer.unref();
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > this.windowMs * 2) {
        this.buckets.delete(key);
      }
    }
  }

  check(
    ipOrUser: string,
    isAuthPath: boolean
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetSeconds: number;
  } {
    const now = Date.now();
    const capacity = isAuthPath ? this.authCapacity : this.defaultCapacity;
    const refillRate = capacity / this.windowMs; 

    let bucket = this.buckets.get(ipOrUser);

    if (!bucket) {
      bucket = { tokens: capacity, lastRefill: now };
      this.buckets.set(ipOrUser, bucket);
    } else {
      const elapsed = now - bucket.lastRefill;
      bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate);
      bucket.lastRefill = now;
    }

    const resetSeconds = Math.ceil(this.windowMs / 1000);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        limit: capacity,
        remaining: Math.floor(bucket.tokens),
        resetSeconds,
      };
    }

    return {
      allowed: false,
      limit: capacity,
      remaining: 0,
      resetSeconds,
    };
  }
}

export const rateLimiter = new RateLimiter();

export function applyRateLimit(req: Request, requestId: string): Response | null {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/health") || url.pathname === "/ws") {
    return null;
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1";

  const isAuth = url.pathname.startsWith("/api/v1/auth");
  const result = rateLimiter.check(clientIp, isAuth);

  if (!result.allowed) {
    return Response.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please slow down and try again later.",
          requestId,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.resetSeconds),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.resetSeconds),
        },
      }
    );
  }

  return null;
}
