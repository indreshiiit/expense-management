import { useState, useEffect } from 'react';
import { api } from '@services/api';
import type { Expense, ExpenseFormData } from '@types/index';

export const useExpenses = (startDate?: string, endDate?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getExpenses(startDate, endDate);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [startDate, endDate]);

  const createExpense = async (data: ExpenseFormData) => {
    try {
      const newExpense = await api.createExpense(data);
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      throw err;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseFormData>) => {
    try {
      const updated = await api.updateExpense(id, data);
      setExpenses((prev) => prev.map((exp) => (exp._id === id ? updated : exp)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    expenses,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
};
