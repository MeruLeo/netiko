import { z } from 'zod';

export const meSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const clerkWebhookSchema = z.object({
  body: z.object({
    type: z.string(),
    data: z.object({}).passthrough(),
  }),
});
