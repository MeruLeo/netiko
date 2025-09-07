import { Schema, model, Document, Types } from 'mongoose';
import { IAchievement } from '../types/achievement';

export interface IAchievementDocument
  extends Omit<IAchievement, '_id'>,
    Document {
  _id: Types.ObjectId;
}

const achievementSchema = new Schema<IAchievementDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    url: { type: String },
  },
  { timestamps: true },
);

export const AchievementModel = model<IAchievementDocument>(
  'Achievement',
  achievementSchema,
);
