import { Request, Response } from 'express';
import { WorkExpModel } from '../models/WorkExp';
import { workExpValidator } from '../validators/workExp';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

export const createWorkExp = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const parsed = workExpValidator.safeParse(req.body);
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

    const workExp = await WorkExpModel.create({
      ...data,
      creator: user._id,
    });

    return res.status(201).json({
      ok: true,
      workExp,
    });
  } catch (err: any) {
    console.error('createWorkExp error:', err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Internal server error',
    });
  }
};

export const getWorkExps = async (req: Request, res: Response) => {
  try {
    const {
      creator,
      company,
      tech,
      search,
      page = '1',
      limit = '10',
      sort = '-createdAt',
    } = req.query;

    const query: any = {};
    if (creator) query.creator = creator;
    if (company) query.company = { $regex: company as string, $options: 'i' };
    if (tech) query.techs = tech;

    if (search) {
      query.$or = [
        { jobTitle: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { company: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [workExps, total] = await Promise.all([
      WorkExpModel.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      WorkExpModel.countDocuments(query),
    ]);

    return res.json({
      ok: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      workExps,
    });
  } catch (err) {
    console.error('getWorkExps error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

export const getWorkExpById = async (req: Request, res: Response) => {
  try {
    const workExp = await WorkExpModel.findById(req.params.id);
    if (!workExp)
      return res.status(404).json({ ok: false, error: 'Not found' });

    return res.json({ ok: true, workExp });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

//? the update
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

export const updateWorkExp = async (req: Request, res: Response) => {
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

    const arrayFields = ['techs'];

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

    const updatedWorkExp = await WorkExpModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), creator: user._id },
      updateQuery,
      { new: true },
    );

    if (!updatedWorkExp) {
      return res
        .status(404)
        .json({ ok: false, error: 'Work experience not found' });
    }

    return res.json({ ok: true, workExp: updatedWorkExp });
  } catch (err) {
    console.error('updateWorkExp error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
//? end of the update

export const deleteWorkExp = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const { id } = req.params;
    const workExp = WorkExpModel.findById(id);
    if (!workExp) {
      res.status(404).json({ ok: false, error: 'Work Exp not found' });
    }

    await WorkExpModel.findByIdAndDelete(id);

    return res.json({ ok: true, message: 'Work experience deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
