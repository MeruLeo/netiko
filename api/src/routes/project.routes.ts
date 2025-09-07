import { Router } from 'express';
import {
  create,
  deleteProject,
  getProjects,
  updateProject,
  uploadCoverImage,
  uploadImages,
} from '../controllers/project.controller';
import { upload } from '../utils/multer';
import { checkOwnership } from '../middlewares/checkOwnership';
import { ProjectModel } from '../models/Project';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/', getProjects);

router.post('/', create);
router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: ProjectModel, ownerField: 'creator' }),
  deleteProject,
);
router.put(
  '/:id',
  requireAuth(),
  checkOwnership({ model: ProjectModel, ownerField: 'creator' }),
  updateProject,
);
router.put(
  '/:id/cover',
  upload.single('coverImage'),
  requireAuth(),
  checkOwnership({ model: ProjectModel, ownerField: 'creator' }),
  uploadCoverImage,
);
router.put(
  '/:projectId/images',
  upload.array('images', 10),
  requireAuth(),
  checkOwnership({ model: ProjectModel, ownerField: 'creator' }),
  uploadImages,
);
export default router;
