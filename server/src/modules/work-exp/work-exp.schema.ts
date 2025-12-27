import { z } from 'zod';

export const getWorkExpsSchema = z.object({
  query: z.object({
    creator: z.string().optional(),
    company: z.string().optional(),
    tech: z.string().optional(),
    search: z.string().optional(),

    page: z.string().regex(/^\d+$/).transform(Number).default(1).optional(),

    limit: z.string().regex(/^\d+$/).transform(Number).default(10).optional(),

    sort: z.string().default('-createdAt'),
  }),
});
export type GetWorkExpsInput = z.infer<typeof getWorkExpsSchema>;

export const getWorkExpByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type GetWorkExpByIdInput = z.infer<typeof getWorkExpByIdSchema>;

export const createWorkExpSchema = z.object({
  body: z.object({
    jobTitle: z.string().min(2),
    company: z.string().min(2),

    location: z.string().optional(),

    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),

    isCurrent: z.boolean().optional(),

    description: z.string().optional(),

    techs: z.array(z.string()).optional(),
  }),
});
export type CreateWorkExpInput = z.infer<typeof createWorkExpSchema>;

export const updateWorkExpSchema = z.object({
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
export type UpdateWorkExpInput = z.infer<typeof updateWorkExpSchema>;

export const deleteWorkExpSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type DeleteWorkExpInput = z.infer<typeof deleteWorkExpSchema>;
