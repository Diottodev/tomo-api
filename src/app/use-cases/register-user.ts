import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { authSchema, type AuthInput } from '../../schemas/auth';
import { ServiceFactory } from '../factories/service-factory';

export async function registerUser(data: AuthInput) {
  const { email, password } = authSchema.parse(data);
  const emailVO = new Email(email);
  const passwordVO = new Password(password);
  const userDomainService = ServiceFactory.getUserDomainService();
  const user = await userDomainService.registerUser(emailVO, passwordVO);
  return user.toPublicData();
}
