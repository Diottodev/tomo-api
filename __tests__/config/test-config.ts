import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

export const testConfig = {
  database: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test-secret-key',
  },
  fastify: {
    logger: false, // Disable logging in tests for cleaner output
  },
} as const;
