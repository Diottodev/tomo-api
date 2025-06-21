import type { FastifyInstance } from 'fastify';
import { authMiddleware, getUserFromToken } from '../middlewares/auth';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', {
    preHandler: authMiddleware,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
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
      const { sub: userId } = getUserFromToken(request);
      const { db } = await import('../../../infra/db/connection');
      const user = await db('users').where({ id: userId }).first();
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }
      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
        },
      });
    },
  });
}
