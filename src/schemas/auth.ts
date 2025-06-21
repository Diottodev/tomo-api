import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Email deve ser válido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
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
