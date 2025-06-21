import type { FastifyError, FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ApiResponse } from './api-response';

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    console.error('Error caught by error handler:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      validation: error.validation,
      url: request.url,
      method: request.method,
    });
    if (error.statusCode === 400 && error.validation) {
      const formattedErrors = error.validation.map((validationError) => {
        const field = validationError.instancePath || validationError.schemaPath || 'unknown';
        const message = validationError.message || 'Invalid value';
        return `${field}: ${message}`;
      });
      return ApiResponse.validationError(reply, formattedErrors, {
        originalError: error.message,
      });
    }
    if (error.statusCode === 404) {
      return ApiResponse.notFound(reply, 'Endpoint');
    }
    if (error.statusCode === 401) {
      return ApiResponse.unauthorized(reply, error.message || 'Unauthorized');
    }
    if (error.statusCode === 409) {
      return ApiResponse.conflict(reply, error.message || 'Conflict');
    }
    if (error.statusCode && error.statusCode < 500) {
      return ApiResponse.error(
        reply,
        error.message || 'Client error',
        error.code || 'CLIENT_ERROR',
        error.statusCode
      );
    }
    return ApiResponse.internalError(reply, 'Internal server error');
  });
}
