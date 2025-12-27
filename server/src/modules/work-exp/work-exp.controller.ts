import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { AppError } from '#src/middlewares/error-handler.js';
import { workExpService } from './work-exp.service.js';
import { CreateWorkExpInput, DeleteWorkExpInput, GetWorkExpByIdInput, GetWorkExpsInput, UpdateWorkExpInput } from './work-exp.schema.js';

export const workExpController = {
  create: async (req: Request<any, any, CreateWorkExpInput['body']>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    const workExp = await workExpService.create(auth.userId, req.body);

    res.success(workExp, 'Work experience created', 201);
  },

  getAll: async (req: Request, res: Response) => {
    const { query } = req.validated as GetWorkExpsInput;

    const result = await workExpService.getAll(query);
    res.success(result, 'Work experiences fetched');
  },

  getById: async (req: Request<GetWorkExpByIdInput['params']>, res: Response) => {
    const workExp = await workExpService.getById(req.params.id);
    res.success(workExp, 'Work experience fetched');
  },

  update: async (req: Request<UpdateWorkExpInput['params'], any, UpdateWorkExpInput['body']>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    const workExp = await workExpService.update(auth.userId, req.params.id, req.body);

    res.success(workExp, 'Work experience updated');
  },

  delete: async (req: Request<DeleteWorkExpInput['params']>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    await workExpService.delete(auth.userId, req.params.id);

    res.success(null, 'Work experience deleted');
  },
};
