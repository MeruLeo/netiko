import { z } from 'zod';

// skill validator
export const skillValidator = z.object({
  name: z.string().min(1),
  normalized: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'professional', 'expert']),
  years: z.number().min(0).optional(),
  lastUsed: z.coerce.date().optional(),
  category: z.string().optional(),
  skillId: z.string().optional(),
});

// language validator
export const languageValidator = z.object({
  title: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'professional', 'native']),
});

// social media validator
export const socialMediaValidator = z.object({
  platform: z.enum([
    'instagram',
    'linkedin',
    'github',
    'twitter',
    'facebook',
    'website',
  ]),
  url: z.string().url(),
  title: z.string().optional(),
});

// contact info validator
export const contactInfoValidator = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  website: z.string().url().optional(),
});

// avatar upload validator
export const avatarValidator = z.object({
  file: z.any(),
});

// memoji validator
export const memojiValidator = z.object({
  memoji: z.enum(['memoji1.png', 'memoji2.png', 'memoji3.png', 'memoji4.png']),
});
