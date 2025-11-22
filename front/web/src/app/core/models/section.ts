import { Article } from './article';

export interface Section {
  id: string;
  projectId: string;
  title: string;
  order: number;
  articles: Article[];
  loading?: boolean;
  expanded?: boolean;
}
