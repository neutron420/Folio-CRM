import { DefaultStorageService } from "../../src/services/storage.service";

describe("Attachments & Storage Architecture", () => {
  let storage: DefaultStorageService;

  beforeEach(() => {
    storage = new DefaultStorageService();
  });

  it("generates presigned upload URL with valid structure and token", async () => {
    const key = "tasks/task_123/1700000000_spec.pdf";
    const result = await storage.generateUploadUrl(key, "application/pdf", 1800);

    expect(result.storageKey).toBe(key);
    expect(result.expiresInSeconds).toBe(1800);
    expect(result.uploadUrl).toContain(key);
    expect(result.uploadUrl).toContain("upload_token=");
  });

  it("generates presigned download URL containing expiry token", async () => {
    const key = "tasks/task_123/1700000000_spec.pdf";
    const downloadUrl = await storage.generateDownloadUrl(key, 3600);

    expect(downloadUrl).toContain(key);
    expect(downloadUrl).toContain("download_token=");
  });

  it("safely handles BigInt file sizes for JSON serialization", () => {
    const rawAttachment = {
      id: "att_1",
      filename: "architecture.png",
      sizeBytes: BigInt(1048576), // 1MB
    };

    // Serializing raw BigInt fails in native JSON.stringify
    expect(() => JSON.stringify(rawAttachment)).toThrow(TypeError);

    // Sanitized version converts to Number
    const sanitized = {
      ...rawAttachment,
      sizeBytes: Number(rawAttachment.sizeBytes),
    };

    expect(typeof sanitized.sizeBytes).toBe("number");
    expect(() => JSON.stringify(sanitized)).not.toThrow();
    expect(sanitized.sizeBytes).toBe(1048576);
  });
});
