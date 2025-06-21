import { UserDomainService } from '../../domain/services/user-domain-service';
import { DatabaseUserRepository } from '../../infra/repositories/database-user-repository';
import { BcryptHashService } from '../../infra/services/bcrypt-hash-service';
import type { Knex } from 'knex';

export class ServiceFactory {
  private static userDomainService: UserDomainService;

  static getUserDomainService(dbInstance?: Knex): UserDomainService {
    if (!this.userDomainService || dbInstance) {
      const userRepository = new DatabaseUserRepository(dbInstance);
      const hashService = new BcryptHashService();
      const service = new UserDomainService(userRepository, hashService);
      if (!dbInstance) {
        this.userDomainService = service;
      }
      return service;
    }
    return this.userDomainService;
  }
}
