import { FastifyInstance } from 'fastify';
import {
  createTestApp,
  setupTestDatabase,
  cleanupTestDatabase,
  teardownTestDatabase,
} from './helpers/test-app-factory';
import {
  validUser,
  invalidUser,
  weakPasswordUser,
  missingRequirementsUser,
  registerUser,
  loginUser,
  getProfile,
  getProfileWithoutToken,
  createUserAndGetToken,
} from './helpers/test-helpers';

describe('Auth Routes', () => {
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

  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const response = await registerUser(app, validUser);

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('User created successfully');
      expect(body.user).toBeDefined();
      expect(body.user).toMatchObject({
        email: validUser.email,
      });
      expect(body.user.id).toBeDefined();
      expect(body.user.passwordHash).toBeUndefined(); // Ensure password is not exposed
    });

    it('should fail with invalid email format', async () => {
      const response = await registerUser(app, invalidUser);

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('email');
    });

    it('should fail with weak password', async () => {
      const response = await registerUser(app, weakPasswordUser);

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('password');
    });

    it('should fail with password missing requirements', async () => {
      const response = await registerUser(app, missingRequirementsUser);

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('password');
    });

    it('should fail when user already exists', async () => {
      await registerUser(app, validUser);
      const response = await registerUser(app, validUser);

      expect(response.statusCode).toBe(409);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('CONFLICT');
      expect(body.message).toBe('User already exists');
    });

    it('should fail with missing email field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: { password: 'TestPass123!' },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('email');
    });

    it('should fail with missing password field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('password');
    });

    it('should fail with empty body', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {},
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toBeDefined();
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      await registerUser(app, validUser);
      const response = await loginUser(app, validUser);

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.data.token).toBeDefined();
      expect(body.data.user).toMatchObject({
        email: validUser.email,
      });
      expect(body.data.user.id).toBeDefined();
      expect(body.data.user.passwordHash).toBeUndefined(); // Ensure password is not exposed
    });

    it('should fail with invalid credentials', async () => {
      await registerUser(app, validUser);
      const response = await loginUser(app, {
        email: validUser.email,
        password: 'wrongpassword',
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('UNAUTHORIZED');
      expect(body.message).toBe('Invalid credentials. Please check your email and password.');
    });

    it('should fail with non-existent user', async () => {
      const response = await loginUser(app, {
        email: 'nonexistent@example.com',
        password: 'TestPass123!',
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('UNAUTHORIZED');
      expect(body.message).toBe('Invalid credentials. Please check your email and password.');
    });

    it('should fail with missing email field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/login',
        payload: { password: 'TestPass123!' },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('email');
    });

    it('should fail with missing password field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/login',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('password');
    });

    it('should fail with invalid email format in login', async () => {
      const response = await loginUser(app, {
        email: 'invalid-email',
        password: 'TestPass123!',
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('email');
    });
  });

  describe('GET /profile', () => {
    it('should access protected route with valid token', async () => {
      const token = await createUserAndGetToken(app);
      const response = await getProfile(app, token);

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.data.user).toMatchObject({
        email: validUser.email,
      });
      expect(body.data.user.id).toBeDefined();
      expect(body.data.user.passwordHash).toBeUndefined(); // Ensure password is not exposed
    });

    it('should fail to access protected route without token', async () => {
      const response = await getProfileWithoutToken(app);

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('UNAUTHORIZED');
      expect(body.message).toBe('Unauthorized');
    });

    it('should fail with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/profile',
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('UNAUTHORIZED');
    });

    it('should fail with malformed authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/profile',
        headers: {
          authorization: 'InvalidFormat token',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error).toBe('UNAUTHORIZED');
    });
  });
});