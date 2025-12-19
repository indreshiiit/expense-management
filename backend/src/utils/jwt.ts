import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { TokenPayload } from '../types';

export const generateToken = (userId: string, email: string): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId,
    email,
  };
  
  const options: SignOptions = {
    expiresIn: config.jwtExpire,
  };
  
  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
