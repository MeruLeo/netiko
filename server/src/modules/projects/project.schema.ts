import { z } from 'zod';

export const getProjectsSchema = z.object({
  query: z.object({
    creator: z.string().optional(),
    status: z.enum(['active', 'archived']).optional(),

    isPinned: z
      .string()
      .transform((v) => v === 'true')
      .optional(),

    slug: z.string().optional(),
    tag: z.string().optional(),
    tech: z.string().optional(),
    search: z.string().optional(),

    page: z.string().regex(/^\d+$/).transform(Number).default(1).optional(),

    limit: z.string().regex(/^\d+$/).transform(Number).default(10).optional(),

    sort: z.string().default('-createdAt'),
  }),
});
export type GetProjectsInput = z.infer<typeof getProjectsSchema>;

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    slug: z
      .string()
      .min(3)
      .regex(/^[a-z0-9-]+$/),

    description: z.string().optional(),
    techs: z.array(z.string()).optional(),

    link: z.string().url().optional(),
    repo: z.string().url().optional(),

    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    status: z.enum(['active', 'archived']).default('active'),
    tags: z.array(z.string()).optional(),
    isPinned: z.boolean().optional(),
  }),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      field: z.string().optional(),
      value: z.any().optional(),

      updates: z.record(z.any(), z.any()).optional(),
      op: z.enum(['push', 'pull']).optional(),
    })
    .refine((data) => data.field || data.updates, {
      message: 'Either field/value or updates must be provided',
    }),
});
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const uploadCoverSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type UploadCoverInput = z.infer<typeof uploadCoverSchema>;

export const uploadImagesSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type UploadImagesInput = z.infer<typeof uploadImagesSchema>;

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
