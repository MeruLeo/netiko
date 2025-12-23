import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';

import { authService } from './auth.service.js';
import { AppError } from '#src/middlewares/error-handler.js';
import { ClerkWebhookInput } from './clerk/clerk.schema.js';

export const authController = {
  me: async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await authService.getOrCreateMe(userId);

    res.success(user, 'Current user fetched successfully');
  },

  webhookClerk: async (req: Request<unknown, unknown, ClerkWebhookInput['body']>, res: Response) => {
    const event = req.body;

    if (!event?.type || !event?.data) {
      throw new AppError('Invalid Clerk webhook payload', 400);
    }

    await authService.handleClerkWebhook(event);

    res.sendStatus(200);
  },
};
