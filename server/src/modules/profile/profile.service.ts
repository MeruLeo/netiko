import { UserModel } from '../user/user.model.js';
import { AppError } from '#src/middlewares/error-handler.js';
import { PROFILE_FIELD_MAP, setNestedValue } from './profile.constants.js';

export const profileService = {
  updateProfile: async (
    clerkId: string,
    payload: {
      field?: string;
      value?: any;
      updates?: Record<string, any>;
    },
  ) => {
    const { field, value, updates } = payload;

    if (!field && !updates) {
      throw new AppError('Provide either field/value or updates object', 400);
    }

    const setObj: any = {};
    const invalidFields: string[] = [];

    if (updates && typeof updates === 'object') {
      for (const [key, val] of Object.entries(updates)) {
        const path = PROFILE_FIELD_MAP[key];
        if (!path) {
          invalidFields.push(key);
          continue;
        }

        let finalValue = val;
        if (path === 'birthday' && typeof finalValue === 'string') {
          finalValue = new Date(finalValue);
        }

        setNestedValue(setObj, path, finalValue);
      }
    } else if (field) {
      const path = PROFILE_FIELD_MAP[field];
      if (!path) {
        throw new AppError('Invalid field', 400);
      }

      let finalValue = value;
      if (path === 'birthday' && typeof finalValue === 'string') {
        finalValue = new Date(finalValue);
      }

      setNestedValue(setObj, path, finalValue);
    }

    if (invalidFields.length) {
      throw new AppError('Invalid fields provided', 400);
    }

    setObj.updatedAt = new Date();

    const user = await UserModel.findOneAndUpdate({ clerkId }, { $set: setObj }, { new: true });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  uploadAvatar: async (clerkId: string, filename: string) => {
    const user = await UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { avatar: `/imgs/avatars/${filename}`, updatedAt: new Date() } },
      { new: true },
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.avatar;
  },

  deleteAvatar: async (clerkId: string) => {
    await UserModel.findOneAndUpdate({ clerkId }, { $unset: { avatar: '' }, $set: { updatedAt: new Date() } });
  },

  setMemoji: async (clerkId: string, memoji: string) => {
    if (!memoji) {
      throw new AppError('Memoji is required', 400);
    }

    const user = await UserModel.findOneAndUpdate({ clerkId }, { $set: { memoji, updatedAt: new Date() } }, { new: true });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.memoji;
  },

  addSkill: async (clerkId: string, skill: any) => {
    const user = await UserModel.findOneAndUpdate({ clerkId }, { $push: { skills: skill } }, { new: true });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.skills;
  },

  removeSkill: async (clerkId: string, skillId: string) => {
    const user = await UserModel.findOneAndUpdate({ clerkId }, { $pull: { skills: { skillId } } }, { new: true });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.skills;
  },
};
