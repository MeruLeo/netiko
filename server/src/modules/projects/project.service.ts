import mongoose from 'mongoose';
import { AppError } from '#src/middlewares/error-handler.js';
import { ProjectModel } from './project.model.js';
import { UserModel } from '../user/user.model.js';
import { PROJECT_FIELD_MAP, ARRAY_FIELDS } from './project.constants.js';

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

export const projectService = {
  getProjects: async (query: any) => {
    const { creator, status, isPinned, slug, tag, tech, search, sort, page, limit } = query;

    const filter: any = {};

    if (creator && mongoose.Types.ObjectId.isValid(creator)) {
      filter.creator = new mongoose.Types.ObjectId(creator);
    }
    if (status) filter.status = status;
    if (typeof isPinned !== 'undefined') filter.isPinned = isPinned;
    if (slug) filter.slug = slug;
    if (tag) filter.tags = tag;
    if (tech) filter.techs = tech;
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;

    const projects = await ProjectModel.find(filter)
      .populate('creator', 'username firstName lastName memoji avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProjectModel.countDocuments(filter);

    return { projects, total };
  },

  create: async (clerkId: string, data: any) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    const exists = await ProjectModel.findOne({
      creator: user._id,
      slug: data.slug,
    });
    if (exists) {
      throw new AppError('Slug already exists for this user', 400);
    }

    return ProjectModel.create({
      ...data,
      creator: user._id,
    });
  },

  update: async (clerkId: string, projectId: string, payload: any) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    const { field, value, updates, op } = payload;

    if (!field && !updates) {
      throw new AppError('Invalid update payload', 400);
    }

    const setObj: any = {};
    const updateQuery: any = {};
    const invalidFields: string[] = [];

    const handleValue = (path: string, val: any) => {
      if (ARRAY_FIELDS.includes(path as any) && op) {
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
        const path = PROJECT_FIELD_MAP[k];
        if (!path) {
          invalidFields.push(k);
          continue;
        }
        handleValue(path, v);
      }
    } else if (field) {
      const path = PROJECT_FIELD_MAP[field];
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

    const project = await ProjectModel.findOneAndUpdate({ _id: projectId, creator: user._id }, updateQuery, { new: true });

    if (!project) throw new AppError('Project not found', 404);

    return project;
  },

  delete: async (clerkId: string, projectId: string) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) throw new AppError('User not found', 404);

    const project = await ProjectModel.findOneAndDelete({
      _id: projectId,
      creator: user._id,
    });

    if (!project) throw new AppError('Project not found', 404);
  },

  uploadCoverImage: async (clerkId: string, projectId: string, filename: string) => {
    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(projectId),
      {
        $set: {
          coverImage: `/imgs/projects/${filename}`,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedProject) {
      throw new AppError('Project not found', 404);
    }

    return updatedProject.coverImage;
  },

  uploadImages: async (clerkId: string, projectId: string, files: Express.Multer.File[]) => {
    if (!files || !files.length) {
      throw new AppError('No files uploaded', 400);
    }

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError('Invalid project id', 400);
    }

    const filePaths = files.map((file) => `/imgs/projects/${file.filename}`);

    const updatedProject = await ProjectModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(projectId),
        creator: user._id,
      },
      {
        $addToSet: {
          images: { $each: filePaths },
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedProject) {
      throw new AppError('Project not found', 404);
    }

    return updatedProject;
  },
};
