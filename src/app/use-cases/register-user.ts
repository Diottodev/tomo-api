import { randomUUID } from 'node:crypto';
import { db } from '../../infra/db/connection';
import { hashProvider } from '../../infra/hash/bcrypt';

export async function registerUser(email: string, password: string) {
  const password_hash = await hashProvider.hash(password);
  await db('users').insert({
    id: randomUUID(),
    email,
    password_hash,
  });
}
