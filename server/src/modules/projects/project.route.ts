import { Router } from 'express';
import { requireAuth } from '@clerk/express';

import { validate } from '#src/middlewares/validate.js';
import { projectController } from './project.controller.js';

import {
  createProjectSchema,
  updateProjectSchema,
  uploadCoverSchema,
  uploadImagesSchema,
  deleteProjectSchema,
  getProjectsSchema,
} from './project.schema.js';

import { uploadProjectImages, uploadProjectCover } from '#src/utils/project-uploader.js';

const router = Router();

router.get('/', validate(getProjectsSchema), projectController.getProjects);

router.post('/', requireAuth(), validate(createProjectSchema), projectController.create);

router.patch('/:id', requireAuth(), validate(updateProjectSchema), projectController.update);

router.delete('/:id', requireAuth(), validate(deleteProjectSchema), projectController.delete);

router.post(
  '/:id/cover',
  requireAuth(),
  validate(uploadCoverSchema),
  uploadProjectCover.single('cover'),
  projectController.uploadCoverImage,
);

router.post(
  '/:id/images',
  requireAuth(),
  validate(uploadImagesSchema),
  uploadProjectImages.array('images', 10),
  projectController.uploadImages,
);

export default router;
