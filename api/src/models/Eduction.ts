import { Schema, model, Document, Types } from 'mongoose';
import { IEducation } from '../types/eduction';

export interface IEducationDocument extends Omit<IEducation, '_id'>, Document {
  _id: Types.ObjectId;
}

const educationSchema = new Schema<IEducationDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    grade: String,
    description: String,
  },
  { timestamps: true },
);

export const EducationModel = model<IEducationDocument>(
  'Education',
  educationSchema,
);
