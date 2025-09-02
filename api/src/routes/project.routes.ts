import { Router } from 'express';
import { create, updateProject } from '../controllers/project.controller';

const router = Router();

router.post('/', create);
router.put('/:projectId', updateProject);

export default router;
