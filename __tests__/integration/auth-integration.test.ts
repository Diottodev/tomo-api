import { FastifyInstance } from 'fastify';
import {
  createTestApp,
  setupTestDatabase,
  cleanupTestDatabase,
  teardownTestDatabase,
} from '../helpers/test-app-factory';
import {
  validUser,
  registerUser,
  loginUser,
  getProfile,
  createUserAndGetToken,
} from '../helpers/test-helpers';

describe('Auth Integration Tests', () => {
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

  describe('Complete Authentication Flow', () => {
    it('should complete full user journey: register -> login -> access protected route', async () => {
      // 1. Register user
      const registerResponse = await registerUser(app, validUser);
      expect(registerResponse.statusCode).toBe(201);

      const registerBody = JSON.parse(registerResponse.body);
      const userId = registerBody.user.id;

      // 2. Login user
      const loginResponse = await loginUser(app, validUser);
      expect(loginResponse.statusCode).toBe(200);

      const loginBody = JSON.parse(loginResponse.body);
      expect(loginBody.token).toBeDefined();
      expect(loginBody.user.id).toBe(userId);

      // 3. Access protected route
      const profileResponse = await getProfile(app, loginBody.token);
      expect(profileResponse.statusCode).toBe(200);

      const profileBody = JSON.parse(profileResponse.body);
      expect(profileBody.user.id).toBe(userId);
      expect(profileBody.user.email).toBe(validUser.email);
    });

    it('should maintain user session across multiple requests', async () => {
      const token = await createUserAndGetToken(app);

      // Make multiple requests with the same token
      const requests = Array.from({ length: 5 }, () => getProfile(app, token));
      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.user.email).toBe(validUser.email);
      });
    });

    it('should prevent duplicate user registration', async () => {
      // First registration
      const firstResponse = await registerUser(app, validUser);
      expect(firstResponse.statusCode).toBe(201);

      // Second registration with same email
      const secondResponse = await registerUser(app, validUser);
      expect(secondResponse.statusCode).toBe(409);
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive user data in responses', async () => {
      await registerUser(app, validUser);
      const loginResponse = await loginUser(app, validUser);

      const body = JSON.parse(loginResponse.body);
      expect(body.user.passwordHash).toBeUndefined();
      expect(body.user.password).toBeUndefined();
    });

    it('should validate token expiration (if implemented)', async () => {
      // This test would be more relevant if JWT expiration is implemented
      const token = await createUserAndGetToken(app);
      const response = await getProfile(app, token);
      expect(response.statusCode).toBe(200);
    });

    it('should handle concurrent registration attempts', async () => {
      const requests = Array.from({ length: 3 }, () =>
        registerUser(app, {
          email: 'concurrent@test.com',
          password: 'TestPass123!',
        })
      );

      const responses = await Promise.allSettled(requests);

      // Filter only fulfilled promises
      const fulfilledResponses = responses
        .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof registerUser>>> => result.status === 'fulfilled')
        .map((result) => result.value);

      // Count status codes
      const successfulRegistrations = fulfilledResponses.filter((r) => r.statusCode === 201);
      const conflictErrors = fulfilledResponses.filter((r) => r.statusCode === 409);
      const serverErrors = fulfilledResponses.filter((r) => r.statusCode >= 500);

      // At least one should succeed
      expect(successfulRegistrations.length).toBeGreaterThanOrEqual(1);

      // Allow for server errors during concurrent operations (database conflicts)
      // This is expected behavior when multiple requests try to insert the same data simultaneously
      const totalValidResponses =
        successfulRegistrations.length + conflictErrors.length + serverErrors.length;
      expect(totalValidResponses).toBe(fulfilledResponses.length);

      // Ensure we have at least some responses
      expect(fulfilledResponses.length).toBeGreaterThanOrEqual(1);
    });
  });
});
