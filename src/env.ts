import dotenv from 'dotenv';
dotenv.config();

export const env = {
  databaseUrl: (() => {
    // Em ambiente de teste, usar SQLite em memória se DATABASE_URL não estiver definida
    if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
      return ':memory:';
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    return process.env.DATABASE_URL;
  })(),
  jwtSecret: (() => {
    // Em ambiente de teste, usar secret padrão se JWT_SECRET não estiver definido
    if (process.env.NODE_ENV === 'test' && !process.env.JWT_SECRET) {
      return 'test-secret-key-default';
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return process.env.JWT_SECRET;
  })(),
  port: Number(process.env.PORT || 8080),
};
