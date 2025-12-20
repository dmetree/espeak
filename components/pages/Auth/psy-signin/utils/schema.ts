import { z } from 'zod';

export const schema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Username must contain only letters and numbers' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one capital letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one symbol' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
})
export type ValidationSchemaType = z.infer<typeof schema>
