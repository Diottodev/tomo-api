import type { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../src/interfaces/http/middlewares/auth';
import type { Knex } from 'knex';
import { DatabaseUserRepository } from '../../src/infra/repositories/database-user-repository';

export function createTestProfileRoutes(dbInstance: Knex) {
  return async function profileRoutes(app: FastifyInstance) {
    app.get('/profile', {
      preHandler: [authMiddleware],
      handler: async (request, reply) => {
        const tokenPayload = request.user as { userId: string };
        const userId = tokenPayload?.userId;
        if (!userId) {
          reply.status(401).send({ message: 'Unauthorized' });
          return;
        }
        const userRepository = new DatabaseUserRepository(dbInstance);
        const user = await userRepository.findById(userId);
        if (!user) {
          reply.status(404).send({ message: 'User not found' });
          return;
        }
        reply.send({
          user: user.toPublicData(),
        });
      },
    });
  };
}
