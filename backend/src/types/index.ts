import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalExpenses: number;
  categoryBreakdown: {
    category: string;
    total: number;
    count: number;
  }[];
  expensesByDay: {
    date: string;
    total: number;
  }[];
}

export interface CategoryStats {
  category: string;
  total: number;
  count: number;
  percentage: number;
}
