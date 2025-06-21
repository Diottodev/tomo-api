import { UserEntity } from '../entities/user';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { UserRepository } from '../repositories/user-repository';
import { HashService } from './hash-service';

export class UserDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) {}

  async registerUser(email: Email, password: Password): Promise<UserEntity> {
    const userExists = await this.userRepository.exists(email);
    if (userExists) {
      throw new Error('User already exists');
    }
    const passwordHash = await this.hashService.hash(password.getValue());
    const user = UserEntity.create(email.getValue(), passwordHash);
    await this.userRepository.save(user);
    return user;
  }

  async authenticateUser(email: Email, password: Password): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.hashService.compare(
      password.getValue(),
      user.getPasswordHash()
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
