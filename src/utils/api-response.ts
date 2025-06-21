import type { FastifyReply } from 'fastify';

export interface ApiError {
  message: string;
  error: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T = Record<string, unknown>> {
  data?: T;
  message?: string;
}

export class ApiResponse {
  static success<T>(reply: FastifyReply, data: T, message?: string, statusCode = 200) {
    return reply.status(statusCode).send({
      ...(data && { data }),
      ...(message && { message }),
    });
  }

  static error(
    reply: FastifyReply,
    message: string,
    error: string,
    statusCode = 400,
    details?: Record<string, unknown>
  ) {
    return reply.status(statusCode).send({
      message,
      error,
      ...(details && { details }),
    });
  }

  static validationError(reply: FastifyReply, errors: string[], details?: Record<string, unknown>) {
    return reply.status(400).send({
      message: 'Invalid data. Please check the fields below:',
      error: 'VALIDATION_ERROR',
      errors,
      ...(details && { details }),
    });
  }

  static notFound(reply: FastifyReply, resource = 'Resource') {
    return reply.status(404).send({
      message: `${resource} not found`,
      error: 'NOT_FOUND',
    });
  }

  static unauthorized(reply: FastifyReply, message = 'Unauthorized') {
    return reply.status(401).send({
      message,
      error: 'UNAUTHORIZED',
    });
  }

  static conflict(reply: FastifyReply, message: string) {
    return reply.status(409).send({
      message,
      error: 'CONFLICT',
    });
  }

  static internalError(reply: FastifyReply, message = 'Internal server error') {
    return reply.status(500).send({
      message,
      error: 'INTERNAL_ERROR',
    });
  }
}
