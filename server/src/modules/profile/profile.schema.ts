import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    field: z.string().optional(),
    value: z.any().optional(),

    updates: z.record(z.any(), z.any()).optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const uploadAvatarSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const setMemojiSchema = z.object({
  body: z.object({
    memoji: z.string().min(1, 'Memoji is required'),
  }),
});

export type SetMemojiInput = z.infer<typeof setMemojiSchema>;

export const addSkillSchema = z.object({
  body: z.object({
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'professional', 'expert']),
    normalized: z.string().optional(),
  }),
});

export type AddSkillInput = z.infer<typeof addSkillSchema>;

export const removeSkillSchema = z.object({
  params: z.object({
    skillId: z.string(),
  }),
});

export type RemoveSkillInput = z.infer<typeof removeSkillSchema>;
