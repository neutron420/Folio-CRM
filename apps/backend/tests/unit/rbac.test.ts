import { hasMinimumRole } from "../../src/middleware/rbac";

describe("RBAC Role Hierarchy", () => {
  it("OWNER satisfies all lower roles", () => {
    expect(hasMinimumRole("OWNER", "OWNER")).toBe(true);
    expect(hasMinimumRole("OWNER", "ADMIN")).toBe(true);
    expect(hasMinimumRole("OWNER", "MEMBER")).toBe(true);
    expect(hasMinimumRole("OWNER", "VIEWER")).toBe(true);
  });

  it("ADMIN satisfies ADMIN, MEMBER, VIEWER but not OWNER", () => {
    expect(hasMinimumRole("ADMIN", "OWNER")).toBe(false);
    expect(hasMinimumRole("ADMIN", "ADMIN")).toBe(true);
    expect(hasMinimumRole("ADMIN", "MEMBER")).toBe(true);
    expect(hasMinimumRole("ADMIN", "VIEWER")).toBe(true);
  });

  it("MEMBER satisfies MEMBER and VIEWER only", () => {
    expect(hasMinimumRole("MEMBER", "OWNER")).toBe(false);
    expect(hasMinimumRole("MEMBER", "ADMIN")).toBe(false);
    expect(hasMinimumRole("MEMBER", "MEMBER")).toBe(true);
    expect(hasMinimumRole("MEMBER", "VIEWER")).toBe(true);
  });

  it("VIEWER satisfies only VIEWER", () => {
    expect(hasMinimumRole("VIEWER", "OWNER")).toBe(false);
    expect(hasMinimumRole("VIEWER", "ADMIN")).toBe(false);
    expect(hasMinimumRole("VIEWER", "MEMBER")).toBe(false);
    expect(hasMinimumRole("VIEWER", "VIEWER")).toBe(true);
  });
});
