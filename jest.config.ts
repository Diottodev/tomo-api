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
      branches: 25,
      functions: 55,
      lines: 50,
      statements: 50,
    },
  },
  testTimeout: process.env.CI ? 30000 : 15000, // Increased timeout for CI environments
  maxWorkers: process.env.CI ? 1 : '50%', // Sequential in CI, parallel locally
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  bail: process.env.CI ? 1 : false, // Stop on first failure in CI
  errorOnDeprecated: true,
  forceExit: true,
  detectOpenHandles: true, // Detect handles that prevent Jest from exiting
};

export default config;
