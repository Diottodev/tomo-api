import { UserEntity } from '../entities/user';
import { Email } from '../value-objects/email';

export interface UserRepository {
  findByEmail(email: Email): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
  exists(email: Email): Promise<boolean>;
}
