export interface Education {
  _id: string;
  userId: string;
  degree: string;
  field: string;
  institution: string;
  startDate: Date;
  endDate?: Date | null;
  grade?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
