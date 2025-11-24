import { Router } from 'express';
import { userController } from './user.controller.js';
import { validate } from '#src/middlewares/validate.js';
import { findUsersSchema } from './user.schema.js';

const router = Router();

router.get('/', validate(findUsersSchema), userController.findUsers);

export default router;
