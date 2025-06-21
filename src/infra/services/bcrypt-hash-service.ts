import { HashService } from '../../domain/services/hash-service';
import { hashProvider } from '../hash/bcrypt';

export class BcryptHashService implements HashService {
  async hash(password: string): Promise<string> {
    return hashProvider.hash(password);
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return hashProvider.compare(password, hashedPassword);
  }
}
