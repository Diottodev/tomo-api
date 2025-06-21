import { UserDomainService } from '../../domain/services/user-domain-service';
import { DatabaseUserRepository } from '../../infra/repositories/database-user-repository';
import { BcryptHashService } from '../../infra/services/bcrypt-hash-service';

export class ServiceFactory {
  private static userDomainService: UserDomainService;
  static getUserDomainService(): UserDomainService {
    if (!this.userDomainService) {
      const userRepository = new DatabaseUserRepository();
      const hashService = new BcryptHashService();
      this.userDomainService = new UserDomainService(userRepository, hashService);
    }
    return this.userDomainService;
  }
}
