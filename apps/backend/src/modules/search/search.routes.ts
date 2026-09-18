import { searchController } from "./search.controller";

export async function handleSearchRoutes(
  req: Request,
  pathname: string,
  requestId: string
): Promise<Response | null> {
  const parts = pathname.replace("/api/v1/", "").split("/");

  if (parts[0] === "workspaces" && parts.length === 3 && parts[2] === "search") {
    if (req.method === "GET") {
      const workspaceId = parts[1];
      if (!workspaceId) return null;
      return searchController.search(req, workspaceId, requestId);
    }
  }

  return null;
}
