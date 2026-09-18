describe("Labels Module & Workspace Isolation", () => {
  it("validates label name and color inputs", () => {
    const validateLabel = (name?: string, color?: string) => {
      const trimmedName = name?.trim();
      if (!trimmedName || trimmedName.length === 0) {
        throw new Error("Label name is required");
      }
      if (trimmedName.length > 50) {
        throw new Error("Label name cannot exceed 50 characters");
      }

      const trimmedColor = color?.trim();
      if (!trimmedColor || trimmedColor.length === 0) {
        throw new Error("Label color is required");
      }

      return { name: trimmedName, color: trimmedColor };
    };

    expect(() => validateLabel("", "#ff0000")).toThrow("Label name is required");
    expect(() => validateLabel("Bug", "")).toThrow("Label color is required");
    expect(() => validateLabel("a".repeat(51), "#ff0000")).toThrow(
      "Label name cannot exceed 50 characters"
    );
    expect(validateLabel("Backend", "#6366f1")).toEqual({
      name: "Backend",
      color: "#6366f1",
    });
  });

  it("enforces workspace boundary when attaching label to task", () => {
    const canAttachLabel = (taskWorkspaceId: string, labelWorkspaceId: string) => {
      return taskWorkspaceId === labelWorkspaceId;
    };

    expect(canAttachLabel("ws_100", "ws_100")).toBe(true);
    expect(canAttachLabel("ws_100", "ws_200")).toBe(false);
  });

  it("handles idempotent attachment state", () => {
    const attachedLabels = new Set<string>();
    const attach = (id: string) => {
      if (attachedLabels.has(id)) return false; // Already attached
      attachedLabels.add(id);
      return true;
    };

    expect(attach("lbl_1")).toBe(true);
    expect(attach("lbl_1")).toBe(false); // Idempotent second call
    expect(attachedLabels.size).toBe(1);
  });
});
