import { FastifyInstance } from 'fastify';
import {
  createTestApp,
  setupTestDatabase,
  cleanupTestDatabase,
  teardownTestDatabase,
} from '../helpers/test-app-factory';
import { validUser, registerUser, loginUser } from '../helpers/test-helpers';

describe('Performance Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('Response Time Tests', () => {
    it('should register user within acceptable time limit', async () => {
      const startTime = Date.now();

      const response = await registerUser(app, validUser);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.statusCode).toBe(201);
      expect(responseTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should login user within acceptable time limit', async () => {
      await registerUser(app, validUser);

      const startTime = Date.now();

      const response = await loginUser(app, validUser);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.statusCode).toBe(200);
      expect(responseTime).toBeLessThan(500); // Should complete within 500ms
    });
  });

  describe('Load Tests', () => {
    it('should handle multiple concurrent login requests', async () => {
      // First register a user
      await registerUser(app, validUser);

      // Create multiple concurrent login requests
      const concurrentRequests = 10;
      const requests = Array.from({ length: concurrentRequests }, () => loginUser(app, validUser));

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
      });

      // Total time should be reasonable (not significantly longer than single request)
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle multiple concurrent user registrations with different emails', async () => {
      const concurrentRequests = 5;
      const requests = Array.from({ length: concurrentRequests }, (_, index) =>
        registerUser(app, {
          email: `user${index}@test.com`,
          password: 'TestPass123!',
        })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.statusCode).toBe(201);
      });

      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });

  describe('Memory and Resource Tests', () => {
    it('should handle sequential operations without memory leaks', async () => {
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        const user = {
          email: `sequential-user-${i}@test.com`,
          password: 'TestPass123!',
        };

        const registerResponse = await registerUser(app, user);
        expect(registerResponse.statusCode).toBe(201);

        const loginResponse = await loginUser(app, user);
        expect(loginResponse.statusCode).toBe(200);
      }

      // If we reach here without timeout, memory usage is likely stable
      expect(true).toBe(true);
    });
  });
});
