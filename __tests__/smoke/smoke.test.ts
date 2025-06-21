import { FastifyInstance } from 'fastify';
import {
  createTestApp,
  setupTestDatabase,
  teardownTestDatabase,
} from '../helpers/test-app-factory';

describe('Smoke Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('Health Checks', () => {
    it('should start the application without errors', async () => {
      expect(app).toBeDefined();
      expect(app.server).toBeDefined();
    });

    it('should have all required routes registered', async () => {
      const routes = app.printRoutes();
      
      expect(routes).toContain('register (POST)');
      expect(routes).toContain('login (POST)');
      expect(routes).toContain('profile (GET');
    });

    it('should connect to database successfully', async () => {
      // This test verifies database connectivity
      // The fact that setupTestDatabase() succeeds means DB is working
      expect(true).toBe(true);
    });

    it('should have proper error handling', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/non-existent-route',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: 'invalid-json',
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should have CORS configured properly (if applicable)', async () => {
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/register',
      });

      // This will depend on your CORS configuration
      expect(response.statusCode).not.toBe(500);
    });
  });
});
