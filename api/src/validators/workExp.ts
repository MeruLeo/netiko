import { z } from 'zod';

export const workExpValidator = z
  .object({
    jobTitle: z.string().min(2, 'عنوان شغلی باید حداقل ۲ کاراکتر باشد'),
    company: z.string().min(2, 'نام شرکت باید حداقل ۲ کاراکتر باشد'),
    location: z.string().optional(),

    startDate: z.coerce
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: 'تاریخ شروع معتبر نیست',
      }),

    endDate: z.coerce.date().nullable().optional(),

    isCurrent: z.boolean().optional(),
    description: z.string().optional(),
    techs: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد',
      });
    }
  });
