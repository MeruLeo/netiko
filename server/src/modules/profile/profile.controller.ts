import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { AppError } from '#src/middlewares/error-handler.js';

import { profileService } from './profile.service.js';
import { UpdateProfileInput, SetMemojiInput, AddSkillInput, RemoveSkillInput } from './profile.schema.js';

export const profileController = {
  updateProfile: async (req: Request<any, any, UpdateProfileInput['body']>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await profileService.updateProfile(auth.userId, req.body);

    res.success(user, 'Profile updated successfully');
  },

  uploadAvatar: async (req: Request, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const avatar = await profileService.uploadAvatar(auth.userId, req.file.filename);

    res.success({ avatar }, 'Avatar uploaded successfully');
  },

  deleteAvatar: async (req: Request, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    await profileService.deleteAvatar(auth.userId);

    res.success(null, 'Avatar removed successfully');
  },

  setMemoji: async (req: Request<any, any, SetMemojiInput['body']>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const memoji = await profileService.setMemoji(auth.userId, req.body.memoji);

    res.success({ memoji }, 'Memoji updated successfully');
  },

  addSkill: async (req: Request<any, any, AddSkillInput['body']>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const skills = await profileService.addSkill(auth.userId, req.body);

    res.success({ skills }, 'Skill added successfully');
  },

  removeSkill: async (req: Request<RemoveSkillInput['params']>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const skills = await profileService.removeSkill(auth.userId, req.params.skillId);

    res.success({ skills }, 'Skill removed successfully');
  },
};
