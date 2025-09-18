import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
