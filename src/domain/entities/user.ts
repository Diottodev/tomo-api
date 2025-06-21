import { randomUUID } from 'crypto';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export class UserEntity {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly passwordHash: string,
    private readonly createdAt: Date,
    private readonly updatedAt?: Date
  ) {}

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  toPublicData() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(email: string, passwordHash: string, id?: string): UserEntity {
    return new UserEntity(id || randomUUID(), email, passwordHash, new Date());
  }

  static fromPersistence(data: User): UserEntity {
    return new UserEntity(data.id, data.email, data.passwordHash, data.createdAt, data.updatedAt);
  }
}
