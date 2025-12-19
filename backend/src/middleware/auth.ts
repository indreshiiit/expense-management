import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config/env.js';
import { AuthRequest, TokenPayload } from '@types/index.js';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
