import { Router } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { me, webhookClerk } from '../controllers/auth.controller';

const router = Router();

router.get('/me', clerkMiddleware(), requireAuth(), me);
router.post('/webhook/clerk', webhookClerk);

export default router;
