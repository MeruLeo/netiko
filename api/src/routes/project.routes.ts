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
import { uploadTo } from '../middlewares/uploadTo';

const router = Router();

router.get('/', getProjects);

router.post('/', create);
router.delete(
  '/:id',
  requireAuth(),
  checkOwnership({ model: ProjectModel, ownerField: 'creator' }),
  deleteProject,
);
router.patch('/:id', requireAuth(), updateProject);
router.put(
  '/:id/cover',
  uploadTo('projects').single('coverImage'),
  requireAuth(),
  uploadCoverImage,
);
router.put(
  '/:projectId/images',
  uploadTo('projects').array('images', 10),
  requireAuth(),
  uploadImages,
);
export default router;
