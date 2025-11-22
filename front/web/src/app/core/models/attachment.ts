export interface Attachment {
  id: string;
  articleId: string;
  fileName: string;
  storedName: string;
  size: number;
  contentType: string;
  uploading?: boolean;
  progress?: number; // 👈 porcentaje de subida
}
