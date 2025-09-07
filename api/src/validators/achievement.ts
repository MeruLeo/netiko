import { z } from 'zod';

export const achievementValidator = z.object({
  title: z.string().min(3, 'عنوان دستاورد باید حداقل ۳ کاراکتر باشد'),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  url: z.string().url('لینک معتبر نیست').optional(),
});
