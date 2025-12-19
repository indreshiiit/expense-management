import { useState } from 'react';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '@utils/helpers';
import { ExpenseForm } from './ExpenseForm';
import type { Expense, ExpenseFormData } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: (id: string, data: Partial<ExpenseFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ExpenseList = ({ expenses, onUpdate, onDelete }: ExpenseListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = async (data: ExpenseFormData) => {
    if (editingId) {
      await onUpdate(editingId, data);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await onDelete(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <h3>No expenses yet</h3>
        <p>Start tracking your expenses by adding your first one!</p>
      </div>
    );
  }

  const editingExpense = expenses.find((exp) => exp._id === editingId);

  return (
    <>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense._id} className="expense-item">
            <div className="expense-info">
              <div
                className="expense-category"
                style={{
                  backgroundColor: getCategoryColor(expense.category) + '20',
                  color: getCategoryColor(expense.category),
                }}
              >
                <span>{getCategoryIcon(expense.category)}</span>
                <span>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</span>
              </div>
              <div className="expense-description">{expense.description}</div>
              <div className="expense-date">{formatDate(expense.date)}</div>
            </div>
            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
            <div className="expense-actions">
              <button
                className="btn btn-secondary btn-small"
                onClick={() => setEditingId(expense._id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(expense._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId && editingExpense && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Expense</h2>
            </div>
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};
