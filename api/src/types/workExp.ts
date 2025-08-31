export interface WorkExp {
  _id: string;
  userId: string;
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
