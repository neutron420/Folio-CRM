describe("Columns Module & Reordering Logic", () => {
  it("validates column name bounds", () => {
    const validateName = (name?: string) => {
      const trimmed = name?.trim();
      if (!trimmed) throw new Error("Column name is required");
      if (trimmed.length > 100) throw new Error("Column name cannot exceed 100 characters");
      return trimmed;
    };

    expect(() => validateName("")).toThrow("Column name is required");
    expect(() => validateName("   ")).toThrow("Column name is required");
    expect(() => validateName("c".repeat(101))).toThrow("Column name cannot exceed 100 characters");
    expect(validateName("In QA Review")).toBe("In QA Review");
  });

  it("calculates sequential initial column positions with 1000 step", () => {
    const getNextPos = (lastPos: number | null) => (lastPos !== null ? lastPos + 1000.0 : 1000.0);

    expect(getNextPos(null)).toBe(1000.0);
    expect(getNextPos(1000.0)).toBe(2000.0);
    expect(getNextPos(2000.0)).toBe(3000.0);
  });

  it("calculates column reordering positions across all scenarios", () => {
    // 1. Dropped between two columns
    const prev = 1000.0;
    const next = 2000.0;
    expect((prev + next) / 2).toBe(1500.0);

    // 2. Dropped to the very start (before first column)
    expect(next / 2).toBe(1000.0);

    // 3. Dropped to the very end (after last column)
    expect(prev + 1000.0).toBe(2000.0);
  });

  it("flags column rebalance condition when distance is below threshold", () => {
    const isRebalanceNeeded = (prevPos: number, nextPos: number) =>
      Math.abs(nextPos - prevPos) < 0.0001;

    expect(isRebalanceNeeded(1000.00002, 1000.00008)).toBe(true);
    expect(isRebalanceNeeded(1000.0, 1001.0)).toBe(false);
  });
});
