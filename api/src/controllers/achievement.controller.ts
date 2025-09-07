import { Request, Response } from 'express';
import { AchievementModel } from '../models/Achievement';
import { achievementValidator } from '../validators/achievement';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

export const createAchievement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const user = await UserModel.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const parsed = achievementValidator.safeParse(req.body);
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

    const achievement = await AchievementModel.create({
      ...data,
      creator: user._id,
    });

    return res.status(201).json({ ok: true, achievement });
  } catch (err: any) {
    console.error('createAchievement error:', err);
    return res
      .status(500)
      .json({ ok: false, error: err.message || 'Internal server error' });
  }
};

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const {
      creator,
      search,
      page = '1',
      limit = '10',
      sort = '-createdAt',
    } = req.query;

    const query: any = {};
    if (creator) query.creator = creator;
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [achievements, total] = await Promise.all([
      AchievementModel.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      AchievementModel.countDocuments(query),
    ]);

    return res.json({
      ok: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      achievements,
    });
  } catch (err) {
    console.error('getAchievements error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const achievement = await AchievementModel.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    return res.json({ ok: true, achievement });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

const FIELD_MAP: Record<string, string> = {
  title: 'title',
  description: 'description',
  date: 'date',
  url: 'url',
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

export const updateAchievement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const { id } = req.params;
    const { field, value, updates } = req.body;

    if (!field && !updates) {
      return res.status(400).json({
        ok: false,
        error: 'Provide either { field, value } or { updates: { ... } }',
      });
    }

    const setObj: any = {};
    const invalidFields: string[] = [];
    let updateQuery: any = {};

    if (updates && typeof updates === 'object') {
      for (const [k, v] of Object.entries(updates)) {
        const path = FIELD_MAP[k];
        if (!path) {
          invalidFields.push(k);
          continue;
        }

        let val = v;
        if (path === 'date' && typeof val === 'string') {
          val = new Date(val);
        }

        setNested(setObj, path, val);
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
      if (path === 'date' && typeof val === 'string') {
        val = new Date(val);
      }

      setNested(setObj, path, val);
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

    const updatedAchievement = await AchievementModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), creator: user._id },
      updateQuery,
      { new: true },
    );

    if (!updatedAchievement) {
      return res
        .status(404)
        .json({ ok: false, error: 'Achievement not found' });
    }

    return res.json({ ok: true, achievement: updatedAchievement });
  } catch (err) {
    console.error('updateAchievement error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const { id } = req.params;
    const achievement = await AchievementModel.findById(id);
    if (!achievement) {
      return res
        .status(404)
        .json({ ok: false, error: 'Achievement not found' });
    }

    await AchievementModel.findByIdAndDelete(id);
    return res.json({ ok: true, message: 'Achievement deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
