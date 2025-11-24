import { z } from 'zod';

// pagination
const paginationSchema = {
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional().default(1),

  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional().default(10),
};

// main filters schema
export const findUsersSchema = z.object({
  query: z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(),
    status: z.enum(['active', 'suspended', 'banned']).optional(),

    country: z.string().optional(),
    city: z.string().optional(),

    openToWork: z
      .string()
      .transform((v) => v === 'true')
      .optional(),

    isVerified: z
      .string()
      .transform((v) => v === 'true')
      .optional(),

    military: z
      .enum(['eligible', 'exemptPermanent', 'exemptTemporary', 'completed', 'inService', 'absent', 'caregiver', 'reserve'])
      .optional(),

    // skills
    skillName: z.string().optional(),
    skillLevel: z.enum(['beginner', 'intermediate', 'professional', 'expert']).optional(),

    // languages
    languageTitle: z.string().optional(),
    languageLevel: z.enum(['beginner', 'intermediate', 'professional', 'native']).optional(),

    // pagination
    page: paginationSchema.page,
    limit: paginationSchema.limit,

    // sorting
    sort: z.string().default('-createdAt'),
  }),
});

export type FindUsersInput = z.infer<typeof findUsersSchema>;
