import { requireWorkspaceMember } from "../../middleware/rbac";
import { searchRepository } from "./search.repository";
import type { SearchResults } from "./search.types";

export class SearchService {
  async searchWorkspace(
    workspaceId: string,
    query: string,
    userId: string,
    type?: string
  ): Promise<SearchResults> {
    await requireWorkspaceMember(workspaceId, userId, "VIEWER");

    const trimmed = query.trim();
    if (!trimmed) {
      return {
        query: "",
        tasks: [],
        boards: [],
        members: [],
        totalMatches: 0,
      };
    }

    const searchAll = !type || type === "all";
    const searchTasks = searchAll || type === "task" || type === "tasks";
    const searchBoards = searchAll || type === "board" || type === "boards";
    const searchMembers = searchAll || type === "member" || type === "members";

    const [tasks, boards, members] = await Promise.all([
      searchTasks ? searchRepository.searchTasks(workspaceId, trimmed) : Promise.resolve([]),
      searchBoards ? searchRepository.searchBoards(workspaceId, trimmed) : Promise.resolve([]),
      searchMembers ? searchRepository.searchMembers(workspaceId, trimmed) : Promise.resolve([]),
    ]);

    const totalMatches = tasks.length + boards.length + members.length;

    return {
      query: trimmed,
      tasks,
      boards,
      members,
      totalMatches,
    };
  }
}

export const searchService = new SearchService();
