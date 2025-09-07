import { z } from 'zod';

export const educationValidator = z.object({
  degree: z.string().min(2, 'مدرک باید حداقل ۲ کاراکتر باشد'),
  field: z.string().min(2, 'رشته باید حداقل ۲ کاراکتر باشد'),
  institution: z.string().min(2, 'نام مؤسسه باید حداقل ۲ کاراکتر باشد'),
  startDate: z.coerce
    .date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: 'تاریخ شروع معتبر نیست',
    }),
  endDate: z.coerce.date().nullable().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});
