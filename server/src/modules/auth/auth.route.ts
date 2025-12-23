import express, { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '#src/middlewares/validate.js';

import { meSchema, clerkWebhookSchema } from './auth.schema.js';

const router = Router();

router.get('/me', validate(meSchema), authController.me);

router.post('/webhook/clerk', express.raw({ type: 'application/json' }), validate(clerkWebhookSchema), authController.webhookClerk);

export default router;
