import mongoose from 'mongoose';

export interface IAchievement {
  creator: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date?: Date;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}
