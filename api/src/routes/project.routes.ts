import { Router } from 'express';
import {
  create,
  updateProject,
  uploadCoverImage,
  uploadImages,
} from '../controllers/project.controller';
import { upload } from '../utils/multer';

const router = Router();

router.post('/', create);
router.put('/:projectId', updateProject);
router.put('/:projectId/cover', upload.single('coverImage'), uploadCoverImage);
router.put('/:projectId/images', upload.array('images', 10), uploadImages);
export default router;
