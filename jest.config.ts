import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/interfaces/http/server.ts', // Exclude server entry point
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 15000, // Increased for CI environments
  maxWorkers: process.env.CI ? 1 : '50%', // Sequential in CI, parallel locally
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  bail: process.env.CI ? 1 : false, // Stop on first failure in CI
  errorOnDeprecated: true,
};

export default config;
