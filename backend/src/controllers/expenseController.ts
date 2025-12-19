import { Response } from 'express';
import { AuthRequest } from '@types/index.js';
import {
  createExpense,
  getExpensesByUser,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getCategoryStats,
} from '@services/expenseService.js';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user!.userId;

    const expense = await createExpense({
      userId,
      amount,
      category,
      description,
      date: date ? new Date(date) : undefined,
    });

    res.status(201).json(expense);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create expense';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const expenses = await getExpensesByUser(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.status(200).json(expenses);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch expenses';
    res.status(400).json({ message });
  }
};

export const getOne = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const expense = await getExpenseById(id, userId);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json(expense);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch expense';
    res.status(400).json({ message });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    const expense = await updateExpense(id, userId, {
      amount,
      category,
      description,
      date: date ? new Date(date) : undefined,
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json(expense);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update expense';
    res.status(400).json({ message });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const expense = await deleteExpense(id, userId);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete expense';
    res.status(400).json({ message });
  }
};

export const summary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { year, month } = req.query;

    const currentDate = new Date();
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;

    const data = await getMonthlySummary(userId, targetYear, targetMonth);

    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch summary';
    res.status(400).json({ message });
  }
};

export const stats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const data = await getCategoryStats(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    res.status(400).json({ message });
  }
};
