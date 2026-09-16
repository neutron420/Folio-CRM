import { getEnv } from "@kanban/config";
import { logger } from "@kanban/logger";
import { UnauthorizedError } from "@kanban/errors";
import { randomBytes } from "crypto";
import { authService } from "./auth.service";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days in seconds

// In-memory state store for CSRF (works for single-server; swap to Redis later if needed)
const pendingStates = new Map<string, { createdAt: number }>();

// Clean up expired states every 5 minutes
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, val] of pendingStates) {
    if (val.createdAt < fiveMinutesAgo) pendingStates.delete(key);
  }
}, 5 * 60 * 1000);

function buildSessionCookie(token: string): string {
  const env = getEnv();
  const isProduction = env.NODE_ENV === "production";
  const parts = [
    `${env.SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if (isProduction) parts.push("Secure");
  return parts.join("; ");
}

function clearSessionCookie(): string {
  const env = getEnv();
  return `${env.SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key) cookies[key.trim()] = rest.join("=").trim();
  }
  return cookies;
}

export function getSessionTokenFromRequest(req: Request): string | null {
  const env = getEnv();
  const cookies = parseCookies(req.headers.get("cookie"));
  return cookies[env.SESSION_COOKIE_NAME] || null;
}

export class AuthController {
  // ==========================================
  // GET /api/v1/auth/google — Redirect to Google
  // ==========================================
  async initiateGoogle(_req: Request): Promise<Response> {
    const state = authService.generateState();
    pendingStates.set(state, { createdAt: Date.now() });

    const authUrl = authService.getGoogleAuthUrl(state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl },
    });
  }

  // ==========================================
  // GET /api/v1/auth/google/callback
  // ==========================================
  async googleCallback(req: Request): Promise<Response> {
    const env = getEnv();
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      throw new UnauthorizedError("Missing code or state parameter");
    }

    // Validate CSRF state
    if (!pendingStates.has(state)) {
      throw new UnauthorizedError("Invalid or expired OAuth state");
    }
    pendingStates.delete(state);

    // Exchange code for user profile
    const profile = await authService.exchangeGoogleCode(code);

    // Resolve user (find/create/link) and create session
    const { sessionToken, user } = await authService.resolveOAuthUser(profile);

    logger.info("Google OAuth login successful", { userId: user.id, email: user.email });

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${env.FRONTEND_URL}/dashboard`,
        "Set-Cookie": buildSessionCookie(sessionToken),
      },
    });
  }

  // ==========================================
  // GET /api/v1/auth/github — Redirect to GitHub
  // ==========================================
  async initiateGitHub(_req: Request): Promise<Response> {
    const state = authService.generateState();
    pendingStates.set(state, { createdAt: Date.now() });

    const authUrl = authService.getGitHubAuthUrl(state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl },
    });
  }

  // ==========================================
  // GET /api/v1/auth/github/callback
  // ==========================================
  async githubCallback(req: Request): Promise<Response> {
    const env = getEnv();
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      throw new UnauthorizedError("Missing code or state parameter");
    }

    if (!pendingStates.has(state)) {
      throw new UnauthorizedError("Invalid or expired OAuth state");
    }
    pendingStates.delete(state);

    const profile = await authService.exchangeGitHubCode(code);
    const { sessionToken, user } = await authService.resolveOAuthUser(profile);

    logger.info("GitHub OAuth login successful", { userId: user.id, email: user.email });

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${env.FRONTEND_URL}/dashboard`,
        "Set-Cookie": buildSessionCookie(sessionToken),
      },
    });
  }

  // ==========================================
  // GET /api/v1/auth/me — Get current user
  // ==========================================
  async me(req: Request): Promise<Response> {
    const token = getSessionTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedError("Not authenticated");
    }

    const result = await authService.validateSession(token);
    if (!result) {
      throw new UnauthorizedError("Session expired or invalid");
    }

    return Response.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          avatarUrl: result.user.avatarUrl,
          createdAt: result.user.createdAt.toISOString(),
        },
      },
    });
  }

  // ==========================================
  // POST /api/v1/auth/logout
  // ==========================================
  async logout(req: Request): Promise<Response> {
    const token = getSessionTokenFromRequest(req);
    if (token) {
      await authService.logout(token);
    }

    return new Response(
      JSON.stringify({ success: true, data: { message: "Successfully logged out" } }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": clearSessionCookie(),
        },
      }
    );
  }
}

export const authController = new AuthController();
