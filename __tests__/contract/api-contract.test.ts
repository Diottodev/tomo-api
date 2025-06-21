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
  createUserAndGetToken,
  getProfile,
} from '../helpers/test-helpers';

describe('API Contract Tests', () => {
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

  describe('Response Structure Validation', () => {
    it('should return correct structure for successful registration', async () => {
      const response = await registerUser(app, validUser);
      
      expect(response.statusCode).toBe(201);
      
      const body = JSON.parse(response.body);
      
      // Validate response structure
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('id');
      expect(body.user).toHaveProperty('email');
      expect(body.user).toHaveProperty('createdAt');
      
      // Validate data types
      expect(typeof body.message).toBe('string');
      expect(typeof body.user.id).toBe('string');
      expect(typeof body.user.email).toBe('string');
      expect(body.user.id).toMatch(/^[0-9a-f-]+$/); // UUID pattern
      
      // Ensure sensitive data is not exposed
      expect(body.user).not.toHaveProperty('password');
      expect(body.user).not.toHaveProperty('passwordHash');
    });

    it('should return correct structure for successful login', async () => {
      await registerUser(app, validUser);
      const response = await loginUser(app, validUser);
      
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      
      // Validate response structure
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('id');
      expect(body.user).toHaveProperty('email');
      
      // Validate data types
      expect(typeof body.token).toBe('string');
      expect(typeof body.user.id).toBe('string');
      expect(typeof body.user.email).toBe('string');
      
      // Validate token format (JWT should have 3 parts separated by dots)
      expect(body.token.split('.')).toHaveLength(3);
      
      // Ensure sensitive data is not exposed
      expect(body.user).not.toHaveProperty('password');
      expect(body.user).not.toHaveProperty('passwordHash');
    });

    it('should return correct structure for profile endpoint', async () => {
      const token = await createUserAndGetToken(app);
      const response = await getProfile(app, token);
      
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      
      // Validate response structure
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('id');
      expect(body.user).toHaveProperty('email');
      
      // Validate data types
      expect(typeof body.user.id).toBe('string');
      expect(typeof body.user.email).toBe('string');
      
      // Ensure sensitive data is not exposed
      expect(body.user).not.toHaveProperty('password');
      expect(body.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('Error Response Structure Validation', () => {
    it('should return correct error structure for validation errors', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          email: 'invalid-email',
          password: '123',
        },
      });
      
      expect(response.statusCode).toBe(400);
      
      const body = JSON.parse(response.body);
      
      // Validate error structure
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
      expect(body.message.length).toBeGreaterThan(0);
    });

    it('should return correct error structure for unauthorized access', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/profile',
      });
      
      expect(response.statusCode).toBe(401);
      
      const body = JSON.parse(response.body);
      
      // Validate error structure
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
    });

    it('should return correct error structure for conflict errors', async () => {
      await registerUser(app, validUser);
      const response = await registerUser(app, validUser);
      
      expect(response.statusCode).toBe(409);
      
      const body = JSON.parse(response.body);
      
      // Validate error structure
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
      expect(body.message).toBe('User already exists');
    });
  });

  describe('HTTP Headers Validation', () => {
    it('should return correct content-type for JSON responses', async () => {
      const response = await registerUser(app, validUser);
      
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should handle authorization header correctly', async () => {
      const token = await createUserAndGetToken(app);
      const response = await getProfile(app, token);
      
      expect(response.statusCode).toBe(200);
    });

    it('should reject malformed authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/profile',
        headers: {
          authorization: 'InvalidFormat token',
        },
      });
      
      expect(response.statusCode).toBe(401);
    });
  });
});
