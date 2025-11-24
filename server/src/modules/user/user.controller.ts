import { Request, Response } from 'express';

import { userService } from './user.service.js';
import { FindUsersInput } from './user.schema.js';
import { IUser, Language, Skill } from './user.types.js';

export const userController = {
  findUsers: async (req: Request<unknown, FindUsersInput['query']>, res: Response) => {
    const { query } = req;

    const users = await userService.findUsers({
      filters: {
        username: query.username as IUser['username'],
        email: query.email as IUser['email'],
        role: query.role as IUser['role'],
        status: query.status as IUser['status'],

        country: query.country as IUser['country'],
        city: query.city as IUser['city'],
        openToWork: query.openToWork === 'true',
        isVerified: query.isVerified === 'true',

        military: query.military as IUser['militaryService'],

        skillName: query.skillName as Skill['name'],
        skillLevel: query.skillLevel as Skill['level'],

        languageTitle: query.languageTitle as Language['title'],
        languageLevel: query.languageLevel as Language['level'],
      },

      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sort: (query.sort as string) || '-createdAt',
    });

    res.success(users, 'Users list finded successfully');
  },
};
