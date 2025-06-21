import Knex from 'knex';
import path from 'path';

export const testDb = Knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '../migrations'),
  },
  pool: {
    min: 1,
    max: 1,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
});
