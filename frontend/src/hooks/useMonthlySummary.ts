import { useState, useEffect, useCallback } from 'react';
import { api } from '@services/api';
import type { MonthlySummary } from '../types';

export const useMonthlySummary = (year: number, month: number) => {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getMonthlySummary(year, month);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, isLoading, error, refetch: fetchSummary };
};
