import { UserModel } from '../models/User';

interface FindUsersOptions {
  filters: Record<string, unknown>;
  page: number;
  limit: number;
  sort: string;
}

export const findUsers = async ({
  filters,
  page,
  limit,
  sort,
}: FindUsersOptions) => {
  const query: Record<string, unknown> = {};

  if (filters.username)
    query.username = { $regex: filters.username as string, $options: 'i' };
  if (filters.email)
    query.email = { $regex: filters.email as string, $options: 'i' };
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    UserModel.find(query)
      .select('-password -__v')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    UserModel.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const findUserById = async (id: string) => {
  return UserModel.findById(id).select('-password -__v');
};
