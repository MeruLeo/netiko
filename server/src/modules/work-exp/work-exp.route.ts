import { Router } from 'express';
import { requireAuth } from '@clerk/express';

import { validate } from '#src/middlewares/validate.js';
import { workExpController } from './work-exp.controller.js';

import {
  createWorkExpSchema,
  updateWorkExpSchema,
  getWorkExpsSchema,
  getWorkExpByIdSchema,
  deleteWorkExpSchema,
} from './work-exp.schema.js';

const router = Router();

router.get('/', validate(getWorkExpsSchema), workExpController.getAll);

router.get('/:id', validate(getWorkExpByIdSchema), workExpController.getById);

router.post('/', requireAuth(), validate(createWorkExpSchema), workExpController.create);

router.patch('/:id', requireAuth(), validate(updateWorkExpSchema), workExpController.update);

router.delete('/:id', requireAuth(), validate(deleteWorkExpSchema), workExpController.delete);

export default router;
