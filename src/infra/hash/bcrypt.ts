import bcrypt from 'bcryptjs';

export const hashProvider = {
  hash: (password: string) => bcrypt.hash(password, 8),
  compare: (password: string, hash: string) => bcrypt.compare(password, hash),
};
