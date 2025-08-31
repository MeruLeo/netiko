import { Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { UserModel } from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      username,
    });
    const localUser = await UserModel.create({
      clerkId: clerkUser.id,
      email,
      firstName,
      lastName,
      username,
      password,
    });
    res.status(201).json({ ok: true, user: localUser });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId)
    return res.status(401).json({ ok: false, error: 'Unauthorized' });

  let local = await UserModel.findOne({ clerkId: userId });
  if (!local) {
    const clerkUser = await clerkClient.users.getUser(userId);
    local = await UserModel.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    });
  }
  res.json({ ok: true, user: local });
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
      username: u.id, // یا هر مقدار placeholder
    });
  }
  res.sendStatus(200);
};
