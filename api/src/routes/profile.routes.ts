import { Router } from 'express';
import { updateProfile } from '../controllers/profile.controller';
import { requireAuth } from '@clerk/express';

const router = Router();

router.put('/', requireAuth(), updateProfile);

export default router;
