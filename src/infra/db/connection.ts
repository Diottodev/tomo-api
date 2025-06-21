import knex from 'knex';
import { env } from '../../env';

export const db = knex({
  client: 'pg',
  connection: env.databaseUrl,
  migrations: {
    directory: __dirname + '/migrations',
  },
});
