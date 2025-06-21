import Fastify, { FastifyInstance } from 'fastify';
import jwtPlugin from '../../src/interfaces/plugins/jwt';
import { createTestAuthRoutes } from '../setup/test-auth-routes';
import { createTestProfileRoutes } from '../setup/test-profile-routes';
import { testDb } from '../setup/test-db';

export async function createTestApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Disable logging in tests
  });

  await app.register(jwtPlugin);
  await app.register(createTestAuthRoutes(testDb));
  await app.register(createTestProfileRoutes(testDb));

  return app;
}

export async function setupTestDatabase(): Promise<void> {
  try {
    // Debug logging for CI
    if (process.env.CI) {
      console.log('Setting up test database:', {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        dbClient: testDb.client.config.client,
        dbConnection: testDb.client.config.connection,
      });
    }

    // Ensure migrations are run
    await testDb.migrate.latest();

    // Verify the users table exists
    const hasUsersTable = await testDb.schema.hasTable('users');
    if (!hasUsersTable) {
      throw new Error('Users table not created after migration');
    }

    if (process.env.CI) {
      console.log('Test database setup completed successfully');
    }
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

export async function cleanupTestDatabase(): Promise<void> {
  try {
    // Only clean if table exists
    const hasUsersTable = await testDb.schema.hasTable('users');
    if (hasUsersTable) {
      await testDb('users').del();
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    // Don't throw here to avoid cascading failures
  }
}

export async function teardownTestDatabase(): Promise<void> {
  try {
    await testDb.destroy();
  } catch (error) {
    console.error('Error tearing down test database:', error);
  }
}
