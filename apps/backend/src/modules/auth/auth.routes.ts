import { authController } from "./auth.controller";
import { handleError } from "../../middleware/error-handler";

export async function handleAuthRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  try {
    
    if (pathname === "/api/v1/auth/google" && req.method === "GET") {
      return await authController.initiateGoogle(req);
    }

    if (pathname === "/api/v1/auth/google/callback" && req.method === "GET") {
      return await authController.googleCallback(req);
    }

    if (pathname === "/api/v1/auth/github" && req.method === "GET") {
      return await authController.initiateGitHub(req);
    }

    if (pathname === "/api/v1/auth/github/callback" && req.method === "GET") {
      return await authController.githubCallback(req);
    }

    if (pathname === "/api/v1/auth/me" && req.method === "GET") {
      return await authController.me(req);
    }

    if (pathname === "/api/v1/auth/logout" && req.method === "POST") {
      return await authController.logout(req);
    }

    return null; 
  } catch (err) {
    return handleError(err, requestId);
  }
}
