import type { FastifyInstance } from 'fastify';
import { registerUser } from '../../../app/use-cases/register-user';
import { authenticateUser } from '../../../app/use-cases/authenticate-user';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        201: {
          type: 'null',
          description: 'User created successfully',
        },
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };
      await registerUser(email, password);
      return reply.status(201).send({ message: 'User created successfully' });
    },
  });

  app.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
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
      const { email, password } = request.body as { email: string; password: string };
      const user = await authenticateUser(email, password);
      if (!user) return reply.status(401).send({ message: 'Invalid credentials' });
      const token = app.jwt.sign({ sub: user.id });
      return reply.send({ token });
    },
  });
}
