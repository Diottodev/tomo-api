import type { FastifyInstance } from 'fastify';
import { registerUser } from '../../../app/use-cases/register-user';
import { authenticateUser } from '../../../app/use-cases/authenticate-user';
import { authSchema, loginResponseSchema, registerResponseSchema } from '../../../schemas/auth';
import { zodToFastifySchema } from '../../../utils/validation';
import { ZodError } from 'zod';

export async function authRoutes(app: FastifyInstance) {
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
        const userData = authSchema.parse(request.body);
        const user = await registerUser(userData);
        return reply.status(201).send({
          message: 'User created successfully',
          user,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
          });
        }
        if (error instanceof Error && error.message === 'User already exists') {
          return reply.status(409).send({ message: 'User already exists' });
        }
        throw error;
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
        const userData = authSchema.parse(request.body);
        const user = await authenticateUser(userData);
        if (!user) {
          return reply.status(401).send({ message: 'Invalid credentials' });
        }
        const token = app.jwt.sign({ sub: user.id });
        return reply.send({ token, user });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
          });
        }
        throw error;
      }
    },
  });
}
