import z from 'zod';

export const userRegisterValidator = z.object({
  email: z.email(),
  firstName: z.string().min(3, 'please enter 3 char'),
  lastName: z.string().min(3, 'please enter 3 char'),
  username: z.string().min(4, 'please enter 4 char'),
  password: z.string().min(8, 'please enter 8 char'),
});
