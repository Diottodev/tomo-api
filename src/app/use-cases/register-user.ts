import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { authSchema, type AuthInput } from '../../schemas/auth';
import { ServiceFactory } from '../factories/service-factory';
import type { Knex } from 'knex';

export async function registerUser(data: AuthInput, dbInstance?: Knex) {
  const { email, password } = authSchema.parse(data);
  const emailVO = new Email(email);
  const passwordVO = new Password(password);
  const userDomainService = ServiceFactory.getUserDomainService(dbInstance);
  const user = await userDomainService.registerUser(emailVO, passwordVO);
  return user.toPublicData();
}
