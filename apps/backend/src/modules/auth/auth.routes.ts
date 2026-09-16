import { authController } from "./auth.controller";
import { handleError } from "../../middleware/error-handler";

/**
 * Routes all /api/v1/auth/* requests to the auth controller.
 * Returns a Response or null if the path doesn't match.
 */
export async function handleAuthRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  try {
    // GET /api/v1/auth/google
    if (pathname === "/api/v1/auth/google" && req.method === "GET") {
      return await authController.initiateGoogle(req);
    }

    // GET /api/v1/auth/google/callback
    if (pathname === "/api/v1/auth/google/callback" && req.method === "GET") {
      return await authController.googleCallback(req);
    }

    // GET /api/v1/auth/github
    if (pathname === "/api/v1/auth/github" && req.method === "GET") {
      return await authController.initiateGitHub(req);
    }

    // GET /api/v1/auth/github/callback
    if (pathname === "/api/v1/auth/github/callback" && req.method === "GET") {
      return await authController.githubCallback(req);
    }

    // GET /api/v1/auth/me
    if (pathname === "/api/v1/auth/me" && req.method === "GET") {
      return await authController.me(req);
    }

    // POST /api/v1/auth/logout
    if (pathname === "/api/v1/auth/logout" && req.method === "POST") {
      return await authController.logout(req);
    }

    return null; // Not an auth route
  } catch (err) {
    return handleError(err, requestId);
  }
}
