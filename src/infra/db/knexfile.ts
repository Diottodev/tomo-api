import type { Knex } from 'knex';
import dotenv from 'dotenv';
import { env } from '../../env';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: env.databaseUrl,
    migrations: {
      directory: './migrations',
    },
  },
};

export default config;
