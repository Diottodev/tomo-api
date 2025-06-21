import { UserRepository } from '../../domain/repositories/user-repository';
import { UserEntity } from '../../domain/entities/user';
import { Email } from '../../domain/value-objects/email';
import { db } from '../db/connection';

export class DatabaseUserRepository implements UserRepository {
  async findByEmail(email: Email): Promise<UserEntity | null> {
    const userData = await db('users').where({ email: email.getValue() }).first();
    if (!userData) {
      return null;
    }
    return UserEntity.fromPersistence({
      id: userData.id,
      email: userData.email,
      passwordHash: userData.password_hash,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const userData = await db('users').where({ id }).first();
    if (!userData) {
      return null;
    }
    return UserEntity.fromPersistence({
      id: userData.id,
      email: userData.email,
      passwordHash: userData.password_hash,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    });
  }

  async save(user: UserEntity): Promise<void> {
    await db('users').insert({
      id: user.getId(),
      email: user.getEmail(),
      password_hash: user.getPasswordHash(),
      created_at: user.getCreatedAt(),
    });
  }

  async exists(email: Email): Promise<boolean> {
    const count = await db('users').where({ email: email.getValue() }).count('id as total').first();
    return Number(count?.total) > 0;
  }
}
