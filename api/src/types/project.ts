import { Types } from 'mongoose';

export interface IProject {
  creator: Types.ObjectId;
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
  status?: 'active' | 'archived';
  tags?: string[];
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
