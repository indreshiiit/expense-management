import { Expense } from '../models/Expense';
import { MonthlySummary, CategoryStats } from '../types';

interface CreateExpenseData {
  userId: string;
  amount: number;
  category: string;
  description: string;
  date?: Date;
}

interface UpdateExpenseData {
  amount?: number;
  category?: string;
  description?: string;
  date?: Date;
}

export const createExpense = async (data: CreateExpenseData) => {
  const expense = await Expense.create({
    ...data,
    date: data.date || new Date(),
  });

  return expense;
};

export const getExpensesByUser = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query: any = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  return expenses;
};

export const getExpenseById = async (expenseId: string, userId: string) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  return expense;
};

export const updateExpense = async (
  expenseId: string,
  userId: string,
  data: UpdateExpenseData
) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    data,
    { new: true, runValidators: true }
  );

  return expense;
};

export const deleteExpense = async (expenseId: string, userId: string) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
  return expense;
};

export const getMonthlySummary = async (
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummary> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const expenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryMap = new Map<string, { total: number; count: number }>();

  expenses.forEach((exp) => {
    const existing = categoryMap.get(exp.category) || { total: 0, count: 0 };
    categoryMap.set(exp.category, {
      total: existing.total + exp.amount,
      count: existing.count + 1,
    });
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, stats]) => ({
      category,
      total: stats.total,
      count: stats.count,
    })
  );

  const dayMap = new Map<string, number>();

  expenses.forEach((exp) => {
    const dateStr = exp.date.toISOString().split('T')[0];
    dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + exp.amount);
  });

  const expensesByDay = Array.from(dayMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    month: startDate.toLocaleString('default', { month: 'long' }),
    year,
    totalExpenses,
    categoryBreakdown,
    expensesByDay,
  };
};

export const getCategoryStats = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<CategoryStats[]> => {
  const query: any = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const expenses = await Expense.find(query);

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryMap = new Map<string, { total: number; count: number }>();

  expenses.forEach((exp) => {
    const existing = categoryMap.get(exp.category) || { total: 0, count: 0 };
    categoryMap.set(exp.category, {
      total: existing.total + exp.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    total: stats.total,
    count: stats.count,
    percentage: totalAmount > 0 ? (stats.total / totalAmount) * 100 : 0,
  }));
};
