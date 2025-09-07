import { Request, Response } from 'express';
import { EducationModel } from '../models/Eduction';
import { educationValidator } from '../validators/eduction';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

//? create education
export const createEducation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const parsed = educationValidator.safeParse(req.body);
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

    const education = await EducationModel.create({
      ...data,
      creator: user._id,
    });

    return res.status(201).json({
      ok: true,
      education,
    });
  } catch (err: any) {
    console.error('createEducation error:', err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Internal server error',
    });
  }
};

//? get list of educations
export const getEducations = async (req: Request, res: Response) => {
  try {
    const {
      creator,
      degree,
      institution,
      field,
      search,
      page = '1',
      limit = '10',
      sort = '-createdAt',
    } = req.query;

    const query: any = {};
    if (creator) query.creator = creator;
    if (degree) query.degree = { $regex: degree as string, $options: 'i' };
    if (institution)
      query.institution = { $regex: institution as string, $options: 'i' };
    if (field) query.field = { $regex: field as string, $options: 'i' };

    if (search) {
      query.$or = [
        { degree: { $regex: search as string, $options: 'i' } },
        { field: { $regex: search as string, $options: 'i' } },
        { institution: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [educations, total] = await Promise.all([
      EducationModel.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      EducationModel.countDocuments(query),
    ]);

    return res.json({
      ok: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      educations,
    });
  } catch (err) {
    console.error('getEducations error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

//? get education by id
export const getEducationById = async (req: Request, res: Response) => {
  try {
    const education = await EducationModel.findById(req.params.id);
    if (!education)
      return res.status(404).json({ ok: false, error: 'Not found' });

    return res.json({ ok: true, education });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

//? update education
const FIELD_MAP: Record<string, string> = {
  degree: 'degree',
  field: 'field',
  institution: 'institution',
  startDate: 'startDate',
  endDate: 'endDate',
  grade: 'grade',
  description: 'description',
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

export const updateEducation = async (req: Request, res: Response) => {
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
        if (
          (path === 'startDate' || path === 'endDate') &&
          typeof val === 'string'
        ) {
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
      if (
        (path === 'startDate' || path === 'endDate') &&
        typeof val === 'string'
      ) {
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

    const updatedEducation = await EducationModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), creator: user._id },
      updateQuery,
      { new: true },
    );

    if (!updatedEducation) {
      return res.status(404).json({ ok: false, error: 'Education not found' });
    }

    return res.json({ ok: true, education: updatedEducation });
  } catch (err) {
    console.error('updateEducation error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

//? delete education
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth().userId;
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ ok: false, error: 'User not found' });

    const { id } = req.params;
    const education = await EducationModel.findOne({
      _id: id,
      creator: user._id,
    });
    if (!education) {
      return res.status(404).json({ ok: false, error: 'Education not found' });
    }

    await EducationModel.findByIdAndDelete(id);

    return res.json({ ok: true, message: 'Education deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
