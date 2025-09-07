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

// GET /work-exps?creator=:id&company=...&page=...
router.get('/', getWorkExps);

// GET /work-exps/:id
router.get('/:id', getWorkExpById);

// POST /work-exps
router.post('/', requireAuth(), createWorkExp);

// PUT /work-exps/:id
router.put('/:id', requireAuth(), updateWorkExp);

// DELETE /work-exps/:id
router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: WorkExpModel, ownerField: 'creator' }),
  deleteWorkExp,
);

export default router;
