import mongoose from 'mongoose';

export interface IEducation {
  creator: mongoose.Types.ObjectId;
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
