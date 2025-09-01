import { Router } from 'express';
import { updateProfile } from '../controllers/profile.controller';

const router = Router();

router.put('/', updateProfile);

export default router;
