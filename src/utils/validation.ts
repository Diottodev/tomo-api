import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export function zodToFastifySchema(zodSchema: z.ZodType) {
  return zodToJsonSchema(zodSchema, { target: 'jsonSchema7' });
}

export function validateWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
