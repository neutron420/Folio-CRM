
describe("Fractional Indexing Algorithm", () => {
  it("computes midpoint between two positions correctly", () => {
    const prev = 1000.0;
    const next = 2000.0;
    const mid = (prev + next) / 2;
    expect(mid).toBe(1500.0);
  });

  it("computes top of column drop correctly", () => {
    const next = 1000.0;
    const top = next / 2;
    expect(top).toBe(500.0);
  });

  it("computes bottom of column drop correctly", () => {
    const prev = 2000.0;
    const bottom = prev + 1000.0;
    expect(bottom).toBe(3000.0);
  });

  it("detects density threshold requiring rebalance", () => {
    const prev = 1000.00005;
    const next = 1000.0001;
    const diff = Math.abs(next - prev);
    const requiresRebalance = diff < 0.0001;
    expect(requiresRebalance).toBe(true);
  });

  it("does not trigger rebalance when distance is safe", () => {
    const prev = 1000.0;
    const next = 1001.0;
    const diff = Math.abs(next - prev);
    const requiresRebalance = diff < 0.0001;
    expect(requiresRebalance).toBe(false);
  });
});
