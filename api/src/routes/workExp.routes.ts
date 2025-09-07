import { Router } from 'express';
import {
  createWorkExp,
  getWorkExps,
  getWorkExpById,
  updateWorkExp,
  deleteWorkExp,
} from '../controllers/workExp.controller';
import { requireAuth } from '@clerk/express';
import { checkOwnership } from '../middlewares/checkOwnership';
import { WorkExpModel } from '../models/WorkExp';

const router = Router();

router.get('/', getWorkExps);

router.get('/:id', getWorkExpById);

router.post('/', requireAuth(), createWorkExp);

router.patch('/:id', requireAuth(), updateWorkExp);

router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: WorkExpModel, ownerField: 'creator' }),
  deleteWorkExp,
);

export default router;
