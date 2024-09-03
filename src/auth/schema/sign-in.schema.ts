import { z } from 'zod';

export const signInSchema = z
  .object({
    username: z.string(),
    email: z.string(),
  })
  .required();

export type SignInDTO = z.infer<typeof signInSchema>;
