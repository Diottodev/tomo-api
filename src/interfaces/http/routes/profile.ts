import type { FastifyInstance } from 'fastify';
import { authMiddleware, getUserFromToken } from '../middlewares/auth';
import { ApiResponse } from '../../../utils/api-response';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', {
    preHandler: authMiddleware,
    handler: async (request, reply) => {
      try {
        const { sub: userId } = getUserFromToken(request);
        const { db } = await import('../../../infra/db/connection');
        
        const user = await db('users').where({ id: userId }).first();
        
        if (!user) {
          return ApiResponse.notFound(reply, 'User');
        }
        
        return ApiResponse.success(reply, {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.created_at,
          },
        });
      } catch (error) {
        console.error('Profile route error:', error);
        return ApiResponse.internalError(reply);
      }
    },
  });
}
