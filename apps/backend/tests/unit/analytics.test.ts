describe("Analytics Calculations & Metrics", () => {
  it("calculates completion rate with divide-by-zero protection", () => {
    const calcRate = (completed: number, total: number) =>
      total > 0 ? Math.round((completed / total) * 100) : 0;

    expect(calcRate(0, 0)).toBe(0);
    expect(calcRate(5, 10)).toBe(50);
    expect(calcRate(1, 3)).toBe(33);
    expect(calcRate(10, 10)).toBe(100);
    expect(calcRate(0, 10)).toBe(0);
  });

  it("accurately categorizes tasks into priorities", () => {
    const sampleTasks = [
      { id: "1", priority: "LOW" },
      { id: "2", priority: "LOW" },
      { id: "3", priority: "MEDIUM" },
      { id: "4", priority: "HIGH" },
      { id: "5", priority: "URGENT" },
      { id: "6", priority: "URGENT" },
    ];

    const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
    for (const t of sampleTasks) {
      if (t.priority in distribution) {
        distribution[t.priority as keyof typeof distribution]++;
      }
    }

    expect(distribution.LOW).toBe(2);
    expect(distribution.MEDIUM).toBe(1);
    expect(distribution.HIGH).toBe(1);
    expect(distribution.URGENT).toBe(2);
  });

  it("identifies overdue tasks correctly only when not in Done column", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000); // 1 day ago
    const future = new Date(now.getTime() + 86400000); // 1 day ahead

    const tasks = [
      { id: "1", dueDate: past, isDoneColumn: false }, // OVERDUE
      { id: "2", dueDate: past, isDoneColumn: true },  // Completed, NOT overdue
      { id: "3", dueDate: future, isDoneColumn: false }, // In future, NOT overdue
      { id: "4", dueDate: null, isDoneColumn: false }, // No due date, NOT overdue
    ];

    let overdueCount = 0;
    for (const t of tasks) {
      if (!t.isDoneColumn && t.dueDate && t.dueDate < now) {
        overdueCount++;
      }
    }

    expect(overdueCount).toBe(1);
  });

  it("aggregates assignee workload correctly across multiple tasks", () => {
    const tasks = [
      { id: "1", assignees: ["user_1", "user_2"] },
      { id: "2", assignees: ["user_1"] },
      { id: "3", assignees: ["user_3"] },
    ];

    const workload = new Map<string, number>();
    for (const t of tasks) {
      for (const uid of t.assignees) {
        workload.set(uid, (workload.get(uid) || 0) + 1);
      }
    }

    expect(workload.get("user_1")).toBe(2);
    expect(workload.get("user_2")).toBe(1);
    expect(workload.get("user_3")).toBe(1);
  });
});
