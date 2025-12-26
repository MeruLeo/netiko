import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { AppError } from '#src/middlewares/error-handler.js';

import { projectService } from './project.service.js';
import { GetProjectsInput, CreateProjectInput, UpdateProjectInput, UploadCoverInput } from './project.schema.js';

export const projectController = {
  getProjects: async (req: Request<any, any, GetProjectsInput['query']>, res: Response) => {
    const result = await projectService.getProjects(req.query);
    res.success(result, 'Projects fetched successfully');
  },

  create: async (req: Request<any, any, CreateProjectInput['body']>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    const project = await projectService.create(auth.userId, req.body);

    res.success(project, 'Project created successfully', 201);
  },

  update: async (req: Request<UpdateProjectInput['params'], any, UpdateProjectInput['body']>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    const project = await projectService.update(auth.userId, req.params.id, req.body);

    res.success(project, 'Project updated successfully');
  },

  delete: async (req: Request<{ id: string }>, res: Response) => {
    const auth = getAuth(req);
    if (!auth.userId) throw new AppError('Unauthorized', 401);

    await projectService.delete(auth.userId, req.params.id);

    res.success(null, 'Project deleted successfully');
  },

  uploadCoverImage: async (req: Request<UploadCoverInput['params']>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const project = await projectService.uploadCoverImage(auth.userId, req.params.id, req.file.fieldname);

    res.success({ project }, 'Project cover image uploaded successfully');
  },

  uploadImages: async (req: Request<{ id: string }>, res: Response) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      throw new AppError('No files uploaded', 400);
    }

    const project = await projectService.uploadImages(auth.userId, req.params.id, req.files as Express.Multer.File[]);

    res.success(project, 'Project images uploaded successfully');
  },
};
