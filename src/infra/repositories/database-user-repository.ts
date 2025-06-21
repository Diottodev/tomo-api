import { UserRepository } from '../../domain/repositories/user-repository';
import { UserEntity } from '../../domain/entities/user';
import { Email } from '../../domain/value-objects/email';
import { db } from '../db/connection';
import type { Knex } from 'knex';

export class DatabaseUserRepository implements UserRepository {
  private dbInstance: Knex;

  constructor(dbInstance?: Knex) {
    this.dbInstance = dbInstance || db;
  }
  async findByEmail(email: Email): Promise<UserEntity | null> {
    const userData = await this.dbInstance('users').where({ email: email.getValue() }).first();
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
    const userData = await this.dbInstance('users').where({ id }).first();
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
    await this.dbInstance('users').insert({
      id: user.getId(),
      email: user.getEmail(),
      password_hash: user.getPasswordHash(),
      created_at: user.getCreatedAt(),
    });
  }

  async exists(email: Email): Promise<boolean> {
    const count = await this.dbInstance('users')
      .where({ email: email.getValue() })
      .count('id as total')
      .first();
    return Number(count?.total) > 0;
  }
}
