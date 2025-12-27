import mongoose from 'mongoose';
import { AppError } from '#src/middlewares/error-handler.js';
import { WorkExpModel } from './work-exp.model.js';
import { UserModel } from '../user/user.model.js';

import type { CreateWorkExpInput, UpdateWorkExpInput, GetWorkExpsInput } from './work-exp.schema.js';

const FIELD_MAP: Record<string, string> = {
  jobTitle: 'jobTitle',
  company: 'company',
  location: 'location',
  startDate: 'startDate',
  endDate: 'endDate',
  isCurrent: 'isCurrent',
  description: 'description',
  techs: 'techs',
};

const ARRAY_FIELDS = ['techs'];

const setNested = (obj: Record<string, any>, path: string, value: any) => {
  const keys = path.split('.');
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] ||= {};
      current = current[key];
    }
  });
};

export const workExpService = {
  create: async (clerkId: string, payload: CreateWorkExpInput['body']) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    return WorkExpModel.create({
      ...payload,
      creator: user._id,
    });
  },

  getAll: async (query: GetWorkExpsInput['query']) => {
    const { creator, company, tech, search, page = 1, limit = 10, sort = '-createdAt' } = query;

    const filter: any = {};

    if (creator && mongoose.Types.ObjectId.isValid(creator)) {
      filter.creator = new mongoose.Types.ObjectId(creator);
    }
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (tech) filter.techs = tech;

    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [workExps, total] = await Promise.all([
      WorkExpModel.find(filter).sort(sort).skip(skip).limit(limit),
      WorkExpModel.countDocuments(filter),
    ]);

    return {
      workExps,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  getById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid id', 400);
    }

    const workExp = await WorkExpModel.findById(id);
    if (!workExp) throw new AppError('Work experience not found', 404);

    return workExp;
  },

  update: async (clerkId: string, workExpId: string, payload: UpdateWorkExpInput['body']) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    const { field, value, updates, op } = payload;

    const setObj: any = {};
    const updateQuery: any = {};
    const invalidFields: string[] = [];

    const handleValue = (path: string, val: any) => {
      if (ARRAY_FIELDS.includes(path) && op) {
        if (op === 'push') {
          updateQuery.$addToSet = {
            ...(updateQuery.$addToSet || {}),
            [path]: { $each: Array.isArray(val) ? val : [val] },
          };
          return;
        }
        if (op === 'pull') {
          updateQuery.$pull = {
            ...(updateQuery.$pull || {}),
            [path]: { $in: Array.isArray(val) ? val : [val] },
          };
          return;
        }
      }

      setNested(setObj, path, val);
    };

    if (updates) {
      for (const [k, v] of Object.entries(updates)) {
        const path = FIELD_MAP[k];
        if (!path) {
          invalidFields.push(k);
          continue;
        }
        handleValue(path, v);
      }
    } else if (field) {
      const path = FIELD_MAP[field];
      if (!path) throw new AppError('Invalid field', 400);
      handleValue(path, value);
    }

    if (invalidFields.length) {
      throw new AppError('Invalid fields provided', 400);
    }

    updateQuery.$set = {
      ...(updateQuery.$set || {}),
      ...setObj,
      updatedAt: new Date(),
    };

    const workExp = await WorkExpModel.findOneAndUpdate({ _id: workExpId, creator: user._id }, updateQuery, { new: true });

    if (!workExp) throw new AppError('Work experience not found', 404);

    return workExp;
  },

  delete: async (clerkId: string, workExpId: string) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    const deleted = await WorkExpModel.findOneAndDelete({
      _id: workExpId,
      creator: user._id,
    });

    if (!deleted) throw new AppError('Work experience not found', 404);
  },
};
