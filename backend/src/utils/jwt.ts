import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { TokenPayload } from '../types';

export const generateToken = (userId: string, email: string): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId,
    email,
  };

  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
