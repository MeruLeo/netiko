import { Schema, model, Document, Types } from 'mongoose';
import { IWorkExp } from '../types/workExp';

interface IWorkExpDocument extends Omit<IWorkExp, '_id'>, Document {
  _id: Types.ObjectId;
}

const workExpSchema = new Schema<IWorkExpDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    techs: [{ type: String }],
  },
  { timestamps: true },
);

export const WorkExpModel = model<IWorkExpDocument>('WorkExp', workExpSchema);
