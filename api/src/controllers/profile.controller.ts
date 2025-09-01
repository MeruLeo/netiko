import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { UserModel } from '../models/User';

const FIELD_MAP: Record<string, string> = {
  bio: 'bio',
  headline: 'headLine',
  headLine: 'headLine',
  birthday: 'birthday',
  country: 'country',
  city: 'city',
  avatar: 'avatar',
  memoji: 'memoji',
  banner: 'banner',
  logo: 'logo',
  openToWork: 'openToWork',
  open_to_work: 'openToWork',
  marriage: 'marriage',
  // contact fields
  phone: 'contact.phone',
  email: 'contact.email',
  address: 'contact.address',
  website: 'contact.website',
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ ok: false, error: 'Unauthorized' });

    const { field, value, updates } = req.body;

    if (!field && !updates) {
      return res.status(400).json({
        ok: false,
        error: 'Provide either { field, value } or { updates: { ... } }',
      });
    }

    const setObj: any = {};
    const invalidFields: string[] = [];

    if (updates && typeof updates === 'object') {
      for (const [k, v] of Object.entries(updates)) {
        const path = FIELD_MAP[k];
        if (!path) {
          invalidFields.push(k);
          continue;
        }
        let val = v;

        if (path === 'birthday' && typeof val === 'string') val = new Date(val);
        setNested(setObj, path, val);
      }
    } else {
      const path = FIELD_MAP[field as string];
      if (!path)
        return res.status(400).json({
          ok: false,
          error: 'Invalid field',
          allowed: Object.keys(FIELD_MAP),
        });
      let val = value;
      if (path === 'birthday' && typeof val === 'string') val = new Date(val);
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

    setObj.updatedAt = new Date();

    const updatedUser = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      { $set: setObj },
      { new: true },
    );

    if (!updatedUser)
      return res.status(404).json({ ok: false, error: 'User not found' });

    return res.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error('updateProfileField error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
