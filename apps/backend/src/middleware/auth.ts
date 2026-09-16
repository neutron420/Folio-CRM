import { UnauthorizedError } from "@kanban/errors";
import type { User, Session } from "@kanban/db";
import { authService, getSessionTokenFromRequest } from "../modules/auth";

export interface AuthenticatedRequest {
  user: User;
  session: Session;
}

export async function requireAuth(req: Request): Promise<AuthenticatedRequest> {
  const token = getSessionTokenFromRequest(req);

  if (!token) {
    throw new UnauthorizedError("Authentication required. Please log in.");
  }

  const result = await authService.validateSession(token);

  if (!result) {
    throw new UnauthorizedError("Session expired or invalid. Please log in again.");
  }

  return { user: result.user, session: result.session };
}
