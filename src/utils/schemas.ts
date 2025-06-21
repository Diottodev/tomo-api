import type { FastifySchema } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

export const errorResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    error: { type: 'string' },
    errors: {
      type: 'array',
      items: { type: 'string' },
    },
    details: { type: 'object' },
  },
  required: ['message', 'error'],
} as const;

export const successResponseSchema = {
  type: 'object',
  properties: {
    data: { type: 'object' },
    message: { type: 'string' },
  },
} as const;

export const authSchemas = {
  register: {
    body: zodToJsonSchema(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    ),
    response: {
      201: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
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
        },
      },
      400: errorResponseSchema,
      409: errorResponseSchema,
    },
  } satisfies FastifySchema,
  login: {
    body: zodToJsonSchema(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    ),
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
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
        },
      },
      400: errorResponseSchema,
      401: errorResponseSchema,
    },
  } satisfies FastifySchema,
};

export const profileSchemas = {
  getProfile: {
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
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
        },
      },
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  } satisfies FastifySchema,
};
