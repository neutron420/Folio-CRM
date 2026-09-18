export interface CreateAttachmentPresignInput {
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export interface AttachmentDTO {
  id: string;
  taskId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  storageKey: string;
  downloadUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface PresignUploadResponse {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
  attachment: AttachmentDTO;
}
