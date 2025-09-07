import { Router } from 'express';
import {
  addSkill,
  deleteAvatar,
  removeSkill,
  setMemoji,
  updateProfile,
  uploadAvatar,
} from '../controllers/profile.controller';
import { requireAuth } from '@clerk/express';
import { upload } from '../utils/multer';
import { uploadTo } from '../middlewares/uploadTo';

const router = Router();

router.patch('/', requireAuth(), updateProfile);

// avatar routes
router.post(
  '/avatar',
  requireAuth(),
  uploadTo('avatar').single('avatar'),
  uploadAvatar,
);
router.delete('/avatar', requireAuth(), deleteAvatar);

// memoji
router.post('/memoji', requireAuth(), setMemoji);

// skills
router.post('/skills', requireAuth(), addSkill);
router.delete('/skills/:skillId', requireAuth(), removeSkill);

export default router;
