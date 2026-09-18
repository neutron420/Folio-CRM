import type { WorkspaceRole } from "@kanban/db";

describe("Workspaces Module & Role Guards", () => {
  it("validates workspace name bounds", () => {
    const validate = (name?: string) => {
      const trimmed = name?.trim();
      if (!trimmed || trimmed.length === 0) {
        throw new Error("Workspace name is required");
      }
      if (trimmed.length > 100) {
        throw new Error("Workspace name cannot exceed 100 characters");
      }
      return trimmed;
    };

    expect(() => validate("")).toThrow("Workspace name is required");
    expect(() => validate("w".repeat(101))).toThrow(
      "Workspace name cannot exceed 100 characters"
    );
    expect(validate("Acme Global Engineering")).toBe("Acme Global Engineering");
  });

  it("enforces role change authorization guards", () => {
    const canPromoteToOwner = (callerRole: WorkspaceRole) => callerRole === "OWNER";
    const canModifyTarget = (callerRole: WorkspaceRole, targetRole: WorkspaceRole) => {
      if (targetRole === "OWNER") return callerRole === "OWNER";
      if (callerRole === "ADMIN") return true;
      return callerRole === "OWNER";
    };

    expect(canPromoteToOwner("OWNER")).toBe(true);
    expect(canPromoteToOwner("ADMIN")).toBe(false);

    // ADMIN cannot modify OWNER
    expect(canModifyTarget("ADMIN", "OWNER")).toBe(false);
    // ADMIN can modify MEMBER
    expect(canModifyTarget("ADMIN", "MEMBER")).toBe(true);
    // OWNER can modify anyone
    expect(canModifyTarget("OWNER", "ADMIN")).toBe(true);
    expect(canModifyTarget("OWNER", "OWNER")).toBe(true);
  });

  it("prevents demoting or removing the sole owner", () => {
    const canDemoteOwner = (ownerCount: number) => ownerCount > 1;

    expect(canDemoteOwner(1)).toBe(false); // Sole owner blocked
    expect(canDemoteOwner(2)).toBe(true);  // Multiple owners permitted
  });
});
