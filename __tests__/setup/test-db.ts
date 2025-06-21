import Knex from 'knex';
import path from 'path';

export const testDb = Knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '../migrations'),
  },
});
