import type { TaskPriority } from "@kanban/db";

describe("Tasks Module & Kanban Operations", () => {
  it("validates task title length and formatting", () => {
    const validateTitle = (title?: string) => {
      const trimmed = title?.trim();
      if (!trimmed || trimmed.length === 0) {
        throw new Error("Task title is required");
      }
      if (trimmed.length > 255) {
        throw new Error("Task title cannot exceed 255 characters");
      }
      return trimmed;
    };

    expect(() => validateTitle("")).toThrow("Task title is required");
    expect(() => validateTitle("t".repeat(256))).toThrow(
      "Task title cannot exceed 255 characters"
    );
    expect(validateTitle("Deploy Neon DB indexes")).toBe("Deploy Neon DB indexes");
  });

  it("validates and defaults task priorities", () => {
    const validPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const parsePriority = (p?: string): TaskPriority => {
      if (p && (validPriorities as string[]).includes(p)) {
        return p as TaskPriority;
      }
      return "MEDIUM";
    };

    expect(parsePriority("URGENT")).toBe("URGENT");
    expect(parsePriority("LOW")).toBe("LOW");
    expect(parsePriority("INVALID")).toBe("MEDIUM");
    expect(parsePriority(undefined)).toBe("MEDIUM");
  });

  it("parses valid ISO due date strings", () => {
    const parseDueDate = (dateStr?: string | null) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid due date format");
      }
      return d;
    };

    expect(parseDueDate(null)).toBeNull();
    expect(parseDueDate("2026-12-31T23:59:59.000Z")).toBeInstanceOf(Date);
    expect(() => parseDueDate("invalid-date")).toThrow("Invalid due date format");
  });
});
