import Fastify from 'fastify';
import { authRoutes } from '../src/interfaces/http/routes/auth';
import jwtPlugin from '../src/interfaces/plugins/jwt';
import { db } from '../src/infra/db/connection';

const app = Fastify();
app.register(jwtPlugin);
app.register(authRoutes);

beforeAll(async () => {
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test('registers a user', async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      email: 'test@example.com',
      password: '123456',
    },
  });
  expect(res.statusCode).toBe(201);
});
