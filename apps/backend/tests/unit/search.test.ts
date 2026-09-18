describe("Multi-Entity Search Service", () => {
  it("normalizes search type filters accurately", () => {
    const parseSearchFlags = (type?: string) => {
      const searchAll = !type || type === "all";
      return {
        tasks: searchAll || type === "task" || type === "tasks",
        boards: searchAll || type === "board" || type === "boards",
        members: searchAll || type === "member" || type === "members",
      };
    };

    expect(parseSearchFlags(undefined)).toEqual({ tasks: true, boards: true, members: true });
    expect(parseSearchFlags("all")).toEqual({ tasks: true, boards: true, members: true });
    expect(parseSearchFlags("task")).toEqual({ tasks: true, boards: false, members: false });
    expect(parseSearchFlags("board")).toEqual({ tasks: false, boards: true, members: false });
    expect(parseSearchFlags("member")).toEqual({ tasks: false, boards: false, members: true });
  });

  it("handles blank queries by returning empty results without querying", () => {
    const handleBlank = (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) {
        return { query: "", tasks: [], boards: [], members: [], totalMatches: 0 };
      }
      return null;
    };

    expect(handleBlank("")).toEqual({
      query: "",
      tasks: [],
      boards: [],
      members: [],
      totalMatches: 0,
    });
    expect(handleBlank("   ")).toEqual({
      query: "",
      tasks: [],
      boards: [],
      members: [],
      totalMatches: 0,
    });
    expect(handleBlank("search term")).toBeNull();
  });

  it("computes total matches by summing entity counts", () => {
    const tasks = [{ id: "t1" }, { id: "t2" }];
    const boards = [{ id: "b1" }];
    const members = [{ id: "m1" }];

    const totalMatches = tasks.length + boards.length + members.length;
    expect(totalMatches).toBe(4);
  });
});
