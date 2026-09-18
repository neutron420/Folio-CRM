import { RateLimiter } from "../../src/middleware/rate-limit";

describe("Token-Bucket Rate Limiter", () => {
  it("allows requests within capacity", () => {
    const limiter = new RateLimiter(5, 2, 60000);
    const ip = "192.168.1.1";

    const res1 = limiter.check(ip, false);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = limiter.check(ip, false);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it("blocks requests when capacity is exhausted", () => {
    const limiter = new RateLimiter(3, 1, 60000);
    const ip = "192.168.1.2";

    limiter.check(ip, false); // 2 left
    limiter.check(ip, false); // 1 left
    limiter.check(ip, false); // 0 left

    const resBlocked = limiter.check(ip, false);
    expect(resBlocked.allowed).toBe(false);
    expect(resBlocked.remaining).toBe(0);
  });

  it("applies stricter limit for auth paths", () => {
    const limiter = new RateLimiter(10, 2, 60000);
    const ip = "192.168.1.3";

    const res1 = limiter.check(ip, true);
    expect(res1.allowed).toBe(true);
    expect(res1.limit).toBe(2);

    const res2 = limiter.check(ip, true);
    expect(res2.allowed).toBe(true);

    const resBlocked = limiter.check(ip, true);
    expect(resBlocked.allowed).toBe(false);
  });
});
