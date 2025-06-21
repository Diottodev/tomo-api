import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { authSchema, type AuthInput } from '../../schemas/auth';
import { ServiceFactory } from '../factories/service-factory';
import type { Knex } from 'knex';

export async function authenticateUser(data: AuthInput, dbInstance?: Knex) {
  // Validar dados de entrada com Zod
  const { email, password } = authSchema.parse(data);

  // Criar value objects de domínio
  const emailVO = new Email(email);
  const passwordVO = new Password(password);

  // Obter serviço de domínio
  const userDomainService = ServiceFactory.getUserDomainService(dbInstance);

  // Executar regra de domínio
  const user = await userDomainService.authenticateUser(emailVO, passwordVO);

  if (!user) {
    return null;
  }

  // Retornar dados públicos
  return user.toPublicData();
}
