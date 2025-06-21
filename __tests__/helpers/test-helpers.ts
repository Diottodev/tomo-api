import { FastifyInstance } from 'fastify';

export interface TestUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export const validUser: TestUser = {
  email: 'test@example.com',
  password: 'TestPass123!',
};

export const invalidUser: TestUser = {
  email: 'invalid-email',
  password: 'TestPass123!',
};

export const weakPasswordUser: TestUser = {
  email: 'test@example.com',
  password: '123',
};

export const missingRequirementsUser: TestUser = {
  email: 'test@example.com',
  password: 'testpass',
};

export async function registerUser(app: FastifyInstance, user: TestUser) {
  return app.inject({
    method: 'POST',
    url: '/register',
    payload: user,
  });
}

export async function loginUser(app: FastifyInstance, user: TestUser) {
  return app.inject({
    method: 'POST',
    url: '/login',
    payload: user,
  });
}

export async function getProfile(app: FastifyInstance, token: string) {
  return app.inject({
    method: 'GET',
    url: '/profile',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export async function getProfileWithoutToken(app: FastifyInstance) {
  return app.inject({
    method: 'GET',
    url: '/profile',
  });
}

export async function createUserAndGetToken(
  app: FastifyInstance,
  user: TestUser = validUser
): Promise<string> {
  await registerUser(app, user);
  const loginRes = await loginUser(app, user);
  const response = JSON.parse(loginRes.body) as AuthResponse;
  return response.data.token;
}
