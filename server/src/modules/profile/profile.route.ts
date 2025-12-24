import { validate } from '#src/middlewares/validate.js';
import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { profileController } from './profile.controller.js';
import { addSkillSchema, removeSkillSchema, setMemojiSchema, updateProfileSchema, uploadAvatarSchema } from './profile.schema.js';
import uploadAvatarImage from '#src/utils/avatar-uploader.js';

const router = Router();

router.patch('/', requireAuth(), validate(updateProfileSchema), profileController.updateProfile);

router.post('/avatar', requireAuth(), validate(uploadAvatarSchema), uploadAvatarImage.single('avatar'), profileController.uploadAvatar);
router.delete('/avatar', requireAuth(), profileController.deleteAvatar);

router.post('/memoji', requireAuth(), validate(setMemojiSchema), profileController.setMemoji);

router.post('/skills', requireAuth(), validate(addSkillSchema), profileController.addSkill);
router.delete('/skills/:skillId', requireAuth(), validate(removeSkillSchema), profileController.removeSkill);

export default router;
