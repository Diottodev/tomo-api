import type { FastifyInstance } from 'fastify';
import { registerUser } from '../../../app/use-cases/register-user';
import { authenticateUser } from '../../../app/use-cases/authenticate-user';
import { authSchema } from '../../../schemas/auth';
import { ZodError } from 'zod';
import { ApiResponse } from '../../../utils/api-response';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    handler: async (request, reply) => {
      try {
        const userData = authSchema.parse(request.body);
        const user = await registerUser(userData);
        
        return ApiResponse.success(reply, { user }, 'User created successfully', 201);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((e) => {
            const field = e.path.join('.');
            const message = e.message;
            return `${field}: ${message}`;
          });

          return ApiResponse.validationError(reply, formattedErrors, {
            passwordRequirements: [
              'Minimum 8 characters',
              'At least one uppercase letter (A-Z)',
              'At least one lowercase letter (a-z)',
              'At least one number (0-9)',
              'At least one special character (!@#$%^&*)',
            ],
          });
        }
        if (error instanceof Error && error.message === 'User already exists') {
          return ApiResponse.conflict(reply, 'User already exists');
        }
        
        console.error('Register route error:', error);
        return ApiResponse.internalError(reply);
      }
    },
  });
  app.post('/login', {
    handler: async (request, reply) => {
      try {
        const userData = authSchema.parse(request.body);
        const user = await authenticateUser(userData);
        
        if (!user) {
          return ApiResponse.unauthorized(
            reply,
            'Invalid credentials. Please check your email and password.'
          );
        }
        
        const token = app.jwt.sign({ sub: user.id });
        return ApiResponse.success(reply, { token, user });
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((e) => {
            const field = e.path.join('.');
            const message = e.message;
            return `${field}: ${message}`;
          });

          return ApiResponse.validationError(reply, formattedErrors);
        }
        
        console.error('Login route error:', error);
        return ApiResponse.internalError(reply);
      }
    },
  });
}
