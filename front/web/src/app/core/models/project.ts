import { Section } from './section';

export interface Project {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}