import type { FastifyInstance } from 'fastify';
import { registerUser } from '../../src/app/use-cases/register-user';
import { authenticateUser } from '../../src/app/use-cases/authenticate-user';
import {
  authSchema,
  loginResponseSchema,
  registerResponseSchema,
  type AuthInput,
} from '../../src/schemas/auth';
import { zodToFastifySchema } from '../../src/utils/validation';
import { ZodError } from 'zod';
import type { Knex } from 'knex';

export function createTestAuthRoutes(dbInstance: Knex) {
  return async function authRoutes(app: FastifyInstance) {
    app.post('/register', {
      schema: {
        body: zodToFastifySchema(authSchema),
        response: {
          201: zodToFastifySchema(registerResponseSchema),
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              errors: { type: 'array', items: { type: 'string' } },
            },
          },
          409: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
      handler: async (request, reply) => {
        try {
          const user = await registerUser(request.body as AuthInput, dbInstance);
          reply.status(201).send({
            message: 'User created successfully',
            user,
          });
        } catch (error: unknown) {
          if (error instanceof ZodError) {
            const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
            reply.status(400).send({
              message: 'Validation error',
              errors,
            });
            return;
          }
          if (error instanceof Error && error.message === 'User already exists') {
            reply.status(409).send({
              message: 'User already exists',
            });
            return;
          }
          reply.status(500).send({
            message: 'Internal server error',
          });
        }
      },
    });
    app.post('/login', {
      schema: {
        body: zodToFastifySchema(authSchema),
        response: {
          200: zodToFastifySchema(loginResponseSchema),
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              errors: { type: 'array', items: { type: 'string' } },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
      handler: async (request, reply) => {
        try {
          const user = await authenticateUser(request.body as AuthInput, dbInstance);
          if (!user) {
            reply.status(401).send({
              message: 'Invalid credentials',
            });
            return;
          }
          const token = app.jwt.sign({ sub: user.id });
          reply.send({
            token,
            user,
          });
        } catch (error: unknown) {
          if (error instanceof ZodError) {
            const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
            reply.status(400).send({
              message: 'Validation error',
              errors,
            });
            return;
          }
          reply.status(500).send({
            message: 'Internal server error',
          });
        }
      },
    });
  };
}
