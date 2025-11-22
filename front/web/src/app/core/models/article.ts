import { Attachment } from "./attachment";

export interface Article {
  id: string;
  sectionId: string;
  title: string;
  content: string;
  order: number;
  attachments: Attachment[];
  loading?: boolean;
}
