import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Email must be valid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)'),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    createdAt: z.date().optional(),
  }),
});

export const registerResponseSchema = z.object({
  message: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      createdAt: z.date().optional(),
    })
    .optional(),
});

export type AuthInput = z.infer<typeof authSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
