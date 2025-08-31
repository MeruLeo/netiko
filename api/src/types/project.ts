export interface Project {
  _id: string;
  userId: string;
  name: string;
  slug?: string;
  description?: string;
  techs?: string[];
  link?: string;
  repo?: string;
  startDate?: Date;
  endDate?: Date | null;
  images?: string[];
  coverImage?: string;
  collaborators?: string[];
  status?: 'active' | 'archived';
  tags?: string[];
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
