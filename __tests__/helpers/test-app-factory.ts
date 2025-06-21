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
  await testDb.migrate.latest();
}

export async function cleanupTestDatabase(): Promise<void> {
  await testDb('users').del();
}

export async function teardownTestDatabase(): Promise<void> {
  await testDb.destroy();
}
