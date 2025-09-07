import { Router } from 'express';
import {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
} from '../controllers/eduction.controller';
import { requireAuth } from '@clerk/express';
import { checkOwnership } from '../middlewares/checkOwnership';
import { EducationModel } from '../models/Eduction';

const router = Router();

router.post('/', requireAuth(), createEducation);

router.get('/', getEducations);

router.get('/:id', getEducationById);

router.patch('/:id', requireAuth(), updateEducation);

router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: EducationModel, ownerField: 'creator' }),
  deleteEducation,
);

export default router;
