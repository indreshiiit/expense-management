export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  expensesByDay: DayExpense[];
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface DayExpense {
  date: string;
  total: number;
}

export interface CategoryStats {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'education'
  | 'other';
