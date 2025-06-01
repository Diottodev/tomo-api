import { db } from '../../infra/db/connection';
import { hashProvider } from '../../infra/hash/bcrypt';

export async function authenticateUser(email: string, password: string) {
  const user = await db('users').where({ email }).first();
  if (!user) return null;
  const match = await hashProvider.compare(password, user.password_hash);
  if (!match) return null;
  return user;
}
