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
      expect(body.user).toMatchObject({
        email: validUser.email,
      });
      expect(body.user.id).toBeDefined();
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
      expect(body.message).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      await registerUser(app, validUser);
      const response = await loginUser(app, validUser);

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.token).toBeDefined();
      expect(body.user).toMatchObject({
        email: validUser.email,
      });
    });

    it('should fail with invalid credentials', async () => {
      const response = await loginUser(app, {
        email: validUser.email,
        password: 'wrongpassword',
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toContain('password');
    });
  });

  describe('GET /profile', () => {
    it('should access protected route with valid token', async () => {
      const token = await createUserAndGetToken(app);
      const response = await getProfile(app, token);

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.user).toMatchObject({
        email: validUser.email,
      });
    });

    it('should fail to access protected route without token', async () => {
      const response = await getProfileWithoutToken(app);

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });
});
