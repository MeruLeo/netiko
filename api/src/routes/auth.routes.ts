import { Router } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { registerUser, me, webhookClerk } from '../controllers/auth.controller';
import { validateData } from '../middlewares/validationFields';
import { userRegisterValidator } from '../validators/auth/register';

const router = Router();

router.post('/register', validateData(userRegisterValidator), registerUser);
router.get('/me', clerkMiddleware(), requireAuth(), me);
router.post('/webhook/clerk', webhookClerk);

export default router;
