import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ProjectModel } from '../models/Project';
import { projectValidator } from '../validators/project';

export const create = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
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
      userId,
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
