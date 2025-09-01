import { Schema, model, Document, Types } from 'mongoose';
import { IProject } from '../types/project';

export interface IProjectDocument extends Omit<IProject, '_id'>, Document {
  _id: Types.ObjectId;
}

const projectSchema = new Schema<IProjectDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    techs: [String],
    link: String,
    repo: String,
    startDate: Date,
    endDate: Date,
    images: [String],
    coverImage: String,
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    tags: [String],
    isPinned: Boolean,
  },
  { timestamps: true },
);

projectSchema.index({ user: 1, slug: 1 }, { unique: true });

export const ProjectModel = model<IProjectDocument>('Project', projectSchema);
