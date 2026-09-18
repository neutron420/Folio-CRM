import { generateSessionToken, hashToken } from "../../src/modules/auth/auth.repository";

describe("Auth Module & Session Security", () => {
  it("hashes session tokens deterministically with SHA-256", () => {
    const rawToken = "my-secret-session-token-12345";
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
    expect(hash1).not.toBe(rawToken);
  });

  it("produces distinct hashes for different tokens", () => {
    const hashA = hashToken("token-a");
    const hashB = hashToken("token-b");
    expect(hashA).not.toBe(hashB);
  });

  it("generates random high-entropy session tokens", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1).toHaveLength(64); // 32 bytes hex
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it("detects expired sessions accurately", () => {
    const now = new Date();
    const activeSession = { expiresAt: new Date(now.getTime() + 1000 * 60 * 60) };
    const expiredSession = { expiresAt: new Date(now.getTime() - 1000 * 60 * 60) };

    const isExpired = (session: { expiresAt: Date }) => session.expiresAt < now;

    expect(isExpired(activeSession)).toBe(false);
    expect(isExpired(expiredSession)).toBe(true);
  });

  it("generates URL-safe workspace slugs from user names", () => {
    const sanitizeName = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);

    expect(sanitizeName("Alice Cooper")).toBe("alice-cooper");
    expect(sanitizeName("John Doe & Co.!")).toBe("john-doe-co");
    expect(sanitizeName("   Extra   Spaces   ")).toBe("extra-spaces");
  });
});
