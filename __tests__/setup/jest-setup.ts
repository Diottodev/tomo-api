import { config } from 'dotenv';

// Setup test environment - load .env.test first, then fallback to .env
config({ path: '.env.test' });
config({ path: '.env' });

// Ensure required environment variables for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-only';

// Set database configuration for CI environments
if (process.env.CI) {
  process.env.DB_CLIENT = process.env.DB_CLIENT || 'sqlite3';
  process.env.DB_CONNECTION = process.env.DB_CONNECTION || ':memory:';
}
