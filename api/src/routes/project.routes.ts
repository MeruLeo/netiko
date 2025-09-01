import { Router } from 'express';
import { create } from '../controllers/project.controller';

const router = Router();

router.post('/', create);

export default router;
