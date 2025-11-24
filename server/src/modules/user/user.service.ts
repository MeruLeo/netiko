import { AppError } from '#src/middlewares/error-handler.js';
import { UserModel } from './user.model.js';
import { IUser, UserFilters } from './user.types.js';

interface FindUsersOptions {
  filters: UserFilters;
  page: number;
  limit: number;
  sort: string;
}

interface FindUsersResult {
  items: IUser[];
  total: number;
  page: number;
  pages: number;
}

export const userService = {
  findUsers: async ({ filters, page, limit, sort }: FindUsersOptions): Promise<FindUsersResult> => {
    if (page < 1 || limit < 1) {
      throw new AppError('Invalid pagination values', 400);
    }

    const query: Record<string, unknown> = {};

    // simple fields
    if (filters.username) query.username = { $regex: filters.username, $options: 'i' };
    if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    if (filters.country) query.country = filters.country;
    if (filters.city) query.city = filters.city;
    if (filters.openToWork !== undefined) query.openToWork = filters.openToWork;
    if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
    if (filters.military) query.militaryService = filters.military;

    // skills filtering
    if (filters.skillName) {
      query['skills.name'] = { $regex: filters.skillName, $options: 'i' };
    }
    if (filters.skillLevel) {
      query['skills.level'] = filters.skillLevel;
    }

    // languages filtering
    if (filters.languageTitle) {
      query['languages.title'] = { $regex: filters.languageTitle, $options: 'i' };
    }
    if (filters.languageLevel) {
      query['languages.level'] = filters.languageLevel;
    }

    // pagination
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      UserModel.find(query).select('-password -__v').sort(sort).skip(skip).limit(limit).lean<IUser[]>(),

      UserModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },
};
