import { requireAuth } from "../../middleware/auth";
import { searchService } from "./search.service";

export class SearchController {
  async search(req: Request, workspaceId: string, requestId: string): Promise<Response> {
    const { user } = await requireAuth(req);
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const type = url.searchParams.get("type") || undefined;

    const results = await searchService.searchWorkspace(workspaceId, query, user.id, type);

    return Response.json({
      success: true,
      data: results,
      meta: {
        totalMatches: results.totalMatches,
        requestId,
      },
    });
  }
}

export const searchController = new SearchController();
