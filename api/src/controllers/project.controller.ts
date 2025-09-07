import { Request, Response } from 'express';
import { ProjectModel } from '../models/Project';
import { projectValidator } from '../validators/project';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

//? getting proejcts
export const getProjects = async (req: Request, res: Response) => {
  try {
    const {
      creator, // فیلتر بر اساس سازنده
      status, // وضعیت پروژه (مثلا: ongoing, completed)
      isPinned, // true / false
      slug, // اسلاگ دقیق
      tag, // بر اساس یک تگ خاص
      tech, // بر اساس تکنولوژی خاص
      search, // جستجو در name یا description
      sort = '-createdAt', // مرتب‌سازی، پیش‌فرض جدیدترین‌ها
      page = '1',
      limit = '10',
    } = req.query;

    const filter: any = {};

    if (creator && mongoose.Types.ObjectId.isValid(creator as string)) {
      filter.creator = new mongoose.Types.ObjectId(creator as string);
    }
    if (status) {
      filter.status = status;
    }
    if (typeof isPinned !== 'undefined') {
      filter.isPinned = isPinned === 'true';
    }
    if (slug) {
      filter.slug = slug;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (tech) {
      filter.techs = tech;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const projects = await ProjectModel.find(filter)
      .populate('creator', 'username firstName lastName memoji avatar')
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    const total = await ProjectModel.countDocuments(filter);

    return res.json({
      ok: true,
      total,
      page: pageNum,
      limit: limitNum,
      projects,
    });
  } catch (err) {
    console.error('getProjects error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error',
    });
  }
};
//? end of getting proejcts

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const parsed = projectValidator.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;

    const exists = await ProjectModel.findOne({
      userId,
      slug: data.slug,
    });
    if (exists) {
      return res.status(400).json({
        ok: false,
        error: 'این اسلاگ قبلاً برای شما ثبت شده است.',
      });
    }

    const project = await ProjectModel.create({
      ...data,
      creator: user._id,
    });

    return res.status(201).json({
      ok: true,
      project,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Internal server error',
    });
  }
};

//? for the update
const FIELD_MAP: Record<string, string> = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  techs: 'techs',
  link: 'link',
  repo: 'repo',
  startDate: 'startDate',
  endDate: 'endDate',
  status: 'status',
  tags: 'tags',
  isPinned: 'isPinned',
};

function setNested(obj: any, path: string, value: any) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      cur[p] = value;
    } else {
      if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {};
      cur = cur[p];
    }
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const { id } = req.params;
    const { field, value, updates, op } = req.body;

    if (!field && !updates) {
      return res.status(400).json({
        ok: false,
        error: 'Provide either { field, value } or { updates: { ... } }',
      });
    }

    const setObj: any = {};
    const invalidFields: string[] = [];
    let updateQuery: any = {};

    const arrayFields = ['techs', 'tags'];

    if (updates && typeof updates === 'object') {
      for (const [k, v] of Object.entries(updates)) {
        const path = FIELD_MAP[k];
        if (!path) {
          invalidFields.push(k);
          continue;
        }
        let val = v;

        if (
          (path === 'startDate' || path === 'endDate') &&
          typeof val === 'string'
        ) {
          val = new Date(val);
        }

        if (arrayFields.includes(path)) {
          if (op === 'push') {
            updateQuery.$addToSet = {
              ...(updateQuery.$addToSet || {}),
              [path]: { $each: Array.isArray(val) ? val : [val] },
            };
          } else if (op === 'pull') {
            updateQuery.$pull = {
              ...(updateQuery.$pull || {}),
              [path]: { $in: Array.isArray(val) ? val : [val] },
            };
          } else {
            setNested(setObj, path, val);
          }
        } else {
          setNested(setObj, path, val);
        }
      }
    } else {
      const path = FIELD_MAP[field as string];
      if (!path) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid field',
          allowed: Object.keys(FIELD_MAP),
        });
      }

      let val = value;
      if (
        (path === 'startDate' || path === 'endDate') &&
        typeof val === 'string'
      ) {
        val = new Date(val);
      }

      if (arrayFields.includes(path)) {
        if (op === 'push') {
          updateQuery.$addToSet = {
            ...(updateQuery.$addToSet || {}),
            [path]: { $each: Array.isArray(val) ? val : [val] },
          };
        } else if (op === 'pull') {
          updateQuery.$pull = {
            ...(updateQuery.$pull || {}),
            [path]: { $in: Array.isArray(val) ? val : [val] },
          };
        } else {
          setNested(setObj, path, val);
        }
      } else {
        setNested(setObj, path, val);
      }
    }

    if (invalidFields.length) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid fields',
        invalid: invalidFields,
        allowed: Object.keys(FIELD_MAP),
      });
    }

    if (Object.keys(setObj).length) {
      updateQuery.$set = { ...(updateQuery.$set || {}), ...setObj };
    }

    updateQuery.$set = {
      ...(updateQuery.$set || {}),
      updatedAt: new Date(),
    };

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(id),
      updateQuery,
      {
        new: true,
      },
    );

    if (!updatedProject) {
      return res.status(404).json({ ok: false, error: 'Project not found' });
    }

    return res.json({ ok: true, project: updatedProject });
  } catch (err) {
    console.error('updateProject error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
//? end of the update

//? uploads
export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const { id } = req.params;
    if (!req.file)
      return res.status(400).json({ ok: false, error: 'No file uploaded' });

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const updatedProject = await ProjectModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        $set: {
          coverImage: `/imgs/projects/${req.file.filename}`,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedProject)
      return res.status(404).json({ ok: false, error: 'Project not found' });

    return res.json({ ok: true, project: updatedProject });
  } catch (err) {
    console.error('uploadCoverImage error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const { id } = req.params;
    if (!req.files || !(req.files as Express.Multer.File[]).length)
      return res.status(400).json({ ok: false, error: 'No files uploaded' });

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const filePaths = (req.files as Express.Multer.File[]).map(
      (f) => `/imgs/projects/${f.filename}`,
    );

    const updatedProject = await ProjectModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        $addToSet: { images: { $each: filePaths } },
        $set: { updatedAt: new Date() },
      },
      { new: true },
    );

    if (!updatedProject)
      return res.status(404).json({ ok: false, error: 'Project not found' });

    return res.json({ ok: true, project: updatedProject });
  } catch (err) {
    console.error('uploadImages error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
//? end of uploads

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const { id } = req.params;
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await ProjectModel.findByIdAndDelete(id);

    return res.json({ ok: true, message: 'Project deleted successfuly' });
  } catch (err) {
    console.error('deleting project error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
