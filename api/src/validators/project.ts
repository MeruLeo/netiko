import { z } from 'zod';

export const projectValidator = z.object({
  name: z.string().min(3, 'نام پروژه باید حداقل ۳ کاراکتر باشد'),
  slug: z
    .string()
    .min(3, 'اسلاگ باید حداقل ۳ کاراکتر باشد')
    .regex(
      /^[a-z0-9-]+$/,
      'اسلاگ فقط باید شامل حروف کوچک، اعداد و خط تیره باشد',
    ),
  description: z.string().optional(),
  techs: z.array(z.string()).optional(),
  link: z.url('لینک معتبر نیست').optional(),
  repo: z.url('آدرس ریپو معتبر نیست').optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  images: z.array(z.string()).optional(),
  coverImage: z.string('تصویر کاور معتبر نیست').optional(),
  status: z.enum(['active', 'archived']).default('active'),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
});
