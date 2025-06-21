import knex from 'knex';
import { config } from 'dotenv';

// Load environment variables for test environment
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
}

import { env } from '../../env';

// Determine database client based on DATABASE_URL
const getDatabaseConfig = () => {
  const databaseUrl = env.databaseUrl;
  
  // For test environment or SQLite URLs
  if (
    process.env.NODE_ENV === 'test' ||
    databaseUrl === ':memory:' ||
    databaseUrl.startsWith('sqlite')
  ) {
    return {
      client: 'sqlite3',
      connection: databaseUrl === ':memory:' ? ':memory:' : databaseUrl,
      useNullAsDefault: true,
      migrations: {
        directory: __dirname + '/migrations',
      },
    };
  }
  
  // For production/development PostgreSQL
  return {
    client: 'pg',
    connection: databaseUrl,
    migrations: {
      directory: __dirname + '/migrations',
    },
  };
};

export const db = knex(getDatabaseConfig());
