import { config } from 'dotenv';

// Setup test environment
config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

afterAll(async () => {
  // Any global cleanup can go here
});
