import { Schema, model, Document, Types } from 'mongoose';
import {
  ContactInfo,
  IUser,
  Language,
  Skill,
  SocialMedia,
} from '../types/user';

// Skill Schema
const SkillSchema = new Schema<Skill>(
  {
    name: { type: String, required: true },
    normalized: { type: String },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'professional', 'expert'],
      required: true,
    },
    years: { type: Number },
    lastUsed: { type: Date },
    category: { type: String },
    skillId: { type: String },
  },
  { _id: false },
);

// Language Schema
const LanguageSchema = new Schema<Language>(
  {
    title: { type: String, required: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'professional', 'native'],
      required: true,
    },
  },
  { _id: false },
);

// Social Media Schema
const SocialMediaSchema = new Schema<SocialMedia>(
  {
    platform: {
      type: String,
      enum: [
        'instagram',
        'linkedin',
        'github',
        'twitter',
        'facebook',
        'website',
      ],
      required: true,
    },
    url: { type: String, required: true },
    title: { type: String },
  },
  { _id: false },
);

// Contact Info Schema
const ContactInfoSchema = new Schema<ContactInfo>(
  {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    website: { type: String },
  },
  { _id: false },
);

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    bio: String,
    headLine: String,
    birthday: Date,

    contact: ContactInfoSchema,
    languages: [LanguageSchema],
    skills: [SkillSchema],
    socialMedia: [SocialMediaSchema],
    militaryService: {
      type: String,
      enum: [
        'eligible',
        'exemptPermanent',
        'exemptTemporary',
        'completed',
        'inService',
        'absent',
        'caregiver',
        'reserve',
      ],
    },

    country: String,
    city: String,
    avatar: String,
    memoji: String,
    banner: String,
    logo: String,

    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    openToWork: Boolean,
    isVerified: { type: Boolean, default: false },
    marriage: Boolean,

    counts: {
      projects: Number,
      workExps: Number,
      educations: Number,
      achievements: Number,
    },

    pinnedProjectIds: [{ type: String }],
  },
  { timestamps: true },
);

export const UserModel = model<IUserDocument>('User', UserSchema);
