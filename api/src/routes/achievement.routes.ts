import { Router } from 'express';
import {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller';
import { requireAuth } from '@clerk/express';
import { checkOwnership } from '../middlewares/checkOwnership';
import { AchievementModel } from '../models/Achievement';

const router = Router();

router.post('/', requireAuth(), createAchievement);
router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.patch('/:id', requireAuth(), updateAchievement);
router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: AchievementModel, ownerField: 'creator' }),
  deleteAchievement,
);

export default router;
