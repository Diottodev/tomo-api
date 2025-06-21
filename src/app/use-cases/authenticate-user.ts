import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { authSchema, type AuthInput } from '../../schemas/auth';
import { ServiceFactory } from '../factories/service-factory';
import type { Knex } from 'knex';

export async function authenticateUser(data: AuthInput, dbInstance?: Knex) {
  const { email, password } = authSchema.parse(data);

  const emailVO = new Email(email);
  const passwordVO = new Password(password);

  const userDomainService = ServiceFactory.getUserDomainService(dbInstance);

  const user = await userDomainService.authenticateUser(emailVO, passwordVO);

  if (!user) {
    return null;
  }

  return user.toPublicData();
}
