import Fastify from 'fastify';
import { authRoutes } from '../src/interfaces/http/routes/auth';
import { profileRoutes } from '../src/interfaces/http/routes/profile';
import jwtPlugin from '../src/interfaces/plugins/jwt';
import { db } from '../src/infra/db/connection';

const app = Fastify();
app.register(jwtPlugin);
app.register(authRoutes);
app.register(profileRoutes);

beforeAll(async () => {
  await db.migrate.latest();
});

afterEach(async () => {
  await db('users').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Auth Routes', () => {
  test('registers a user successfully', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('User created successfully');
    expect(body.user).toMatchObject({
      email: 'test@example.com',
    });
    expect(body.user.id).toBeDefined();
  });

  test('fails to register user with invalid email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'invalid-email',
        password: 'TestPass123!',
      },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Validation error');
    expect(body.errors).toContain('email: Invalid email');
  });

  test('fails to register user with short password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: '123',
      },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Validation error');
    expect(body.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('Senha deve ter pelo menos 8 caracteres')])
    );
  });

  test('fails to register user with password missing requirements', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'testpass',
      },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Validation error');
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('maiúscula'),
        expect.stringContaining('número'),
        expect.stringContaining('especial'),
      ])
    );
  });

  test('fails to register duplicate user', async () => {
    await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    expect(res.statusCode).toBe(409);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('User already exists');
  });

  test('logs in user successfully', async () => {
    await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    const res = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(body.user).toMatchObject({
      email: 'test@example.com',
    });
  });

  test('fails to login with invalid credentials', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });
    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Invalid credentials');
  });

  test('accesses protected route with valid token', async () => {
    await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    const loginRes = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    });
    const { token } = JSON.parse(loginRes.body);
    const res = await app.inject({
      method: 'GET',
      url: '/profile',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.user).toMatchObject({
      email: 'test@example.com',
    });
  });

  test('fails to access protected route without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/profile',
    });
    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Unauthorized');
  });
});
