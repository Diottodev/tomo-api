import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse } from '../../../utils/api-response';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return ApiResponse.unauthorized(reply);
  }
}

export function getUserFromToken(request: FastifyRequest): { sub: string } {
  return request.user as { sub: string };
}
