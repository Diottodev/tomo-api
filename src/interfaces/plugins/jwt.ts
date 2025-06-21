import fp from 'fastify-plugin';
import * as jwtPlugin from '@fastify/jwt';
import { env } from '../../env';

export default fp(async (fastify) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fastify.register(jwtPlugin as any, {
    secret: env.jwtSecret,
  });
});
