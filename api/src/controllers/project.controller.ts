import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ProjectModel } from '../models/Project';
import { projectValidator } from '../validators/project';
import { UserModel } from '../models/User';

export const create = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

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
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ ok: false, error: 'Unauthorized' });

    const { projectId } = req.params;
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

    // پیدا کردن یوزر واقعی (چون userId از Clerk هست)
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId, creator: user._id },
      updateQuery,
      { new: true },
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
