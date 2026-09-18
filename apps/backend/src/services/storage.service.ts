export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
}

export interface StorageService {
  generateUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds?: number
  ): Promise<PresignedUploadResult>;
  generateDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

export class DefaultStorageService implements StorageService {
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || "zelo-attachments";
    this.endpoint = process.env.STORAGE_ENDPOINT || "https://storage.zelo.dev";
  }

  async generateUploadUrl(
    key: string,
    _contentType: string,
    expiresInSeconds = 3600
  ): Promise<PresignedUploadResult> {
    const token = Buffer.from(`${key}:${Date.now() + expiresInSeconds * 1000}`).toString(
      "base64url"
    );
    const uploadUrl = `${this.endpoint}/${this.bucket}/${key}?upload_token=${token}`;

    return {
      uploadUrl,
      storageKey: key,
      expiresInSeconds,
    };
  }

  async generateDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const token = Buffer.from(`${key}:${Date.now() + expiresInSeconds * 1000}`).toString(
      "base64url"
    );
    return `${this.endpoint}/${this.bucket}/${key}?download_token=${token}`;
  }

  async deleteObject(_key: string): Promise<void> {
    
  }
}

export const storageService = new DefaultStorageService();
