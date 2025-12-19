import jwt from 'jsonwebtoken';
import { config } from '@config/env.js';
import { TokenPayload } from '@types/index.js';

export const generateToken = (userId: string, email: string): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId,
    email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
