import dotenv from 'dotenv';
dotenv.config();

export const env = {
  databaseUrl: (() => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    return process.env.DATABASE_URL;
  })(),
  jwtSecret: (() => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return process.env.JWT_SECRET;
  })(),
  port: Number(process.env.PORT || 8080),
};
