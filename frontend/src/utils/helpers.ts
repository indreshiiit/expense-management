import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy');
};

export const formatDateForInput = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    utilities: '#45B7D1',
    entertainment: '#FFA07A',
    healthcare: '#98D8C8',
    shopping: '#F7DC6F',
    education: '#BB8FCE',
    other: '#95A5A6',
  };

  return colors[category] || colors.other;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    healthcare: '⚕️',
    shopping: '🛍️',
    education: '📚',
    other: '📌',
  };

  return icons[category] || icons.other;
};
