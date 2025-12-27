import { Types } from 'mongoose';

export interface IWorkExp {
  creator: Types.ObjectId;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string;
  techs?: string[];
  createdAt: Date;
  updatedAt: Date;
}
