import { useState, useEffect } from 'react';
import { api } from '@services/api';
import type { MonthlySummary } from '../types';

export const useMonthlySummary = (year: number, month: number) => {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
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
    };

    fetchSummary();
  }, [year, month]);

  return { summary, isLoading, error };
};
