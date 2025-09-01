import { Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { UserModel } from '../models/User';
import { IUser } from '../types/user';

export const me = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    let local = await UserModel.findOne({ clerkId: userId });

    if (!local) {
      const clerkUser = await clerkClient.users.getUser(userId);

      local = await UserModel.create({
        clerkId: clerkUser.id,
        username: clerkUser.username ?? clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        password: clerkUser.passwordEnabled,
        role: 'user',

        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,

        bio: '',
        headLine: '',
        birthday: null,
        contact: {
          phone: '',
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          address: '',
          website: '',
        },
        languages: [],
        skills: [],
        socialMedia: [],
        militaryService: undefined,

        country: '',
        city: '',
        avatar: clerkUser.imageUrl ?? '',
        memoji: '',
        banner: '',
        logo: '',

        status: 'active',
        openToWork: false,
        isVerified: false,
        marriage: false,

        counts: {
          projects: 0,
          workExps: 0,
          educations: 0,
          achievements: 0,
        },

        pinnedProjectIds: [],

        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return res.json({ ok: true, user: local });
  } catch (err: any) {
    console.error('Error in /me:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

export const webhookClerk = async (req: Request, res: Response) => {
  const evt = req.body;
  if (evt.type === 'user.created') {
    const u = evt.data;
    await UserModel.create({
      clerkId: u.id,
      email: u.emailAddresses?.[0]?.emailAddress,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.id,
    });
  }
  res.sendStatus(200);
};
