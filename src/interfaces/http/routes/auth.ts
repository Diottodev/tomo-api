import type { FastifyInstance } from 'fastify';
import { registerUser } from '../../../app/use-cases/register-user';
import { authenticateUser } from '../../../app/use-cases/authenticate-user';
import { authSchema } from '../../../schemas/auth';
import { ZodError } from 'zod';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
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
          const formattedErrors = error.errors.map((e) => {
            const field = e.path.join('.');
            const message = e.message;
            return `${field}: ${message}`;
          });
          return reply.status(400).send({
            message: 'Invalid data. Please check the fields below:',
            errors: formattedErrors,
            details: {
              passwordRequirements: [
                'Minimum 8 characters',
                'At least one uppercase letter (A-Z)',
                'At least one lowercase letter (a-z)',
                'At least one number (0-9)',
                'At least one special character (!@#$%^&*)',
              ],
            },
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
    handler: async (request, reply) => {
      try {
        const userData = authSchema.parse(request.body);
        const user = await authenticateUser(userData);
        if (!user) {
          return reply.status(401).send({
            message: 'Invalid credentials. Please check your email and password.',
          });
        }
        const token = app.jwt.sign({ sub: user.id });
        return reply.send({ token, user });
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((e) => {
            const field = e.path.join('.');
            const message = e.message;
            return `${field}: ${message}`;
          });
          return reply.status(400).send({
            message: 'Invalid data. Please check the fields below:',
            errors: formattedErrors,
          });
        }
        throw error;
      }
    },
  });
}
