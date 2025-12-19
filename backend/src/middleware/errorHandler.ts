import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

interface ErrorResponse {
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const response: ErrorResponse = {
    message: err.message || 'Internal server error',
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
