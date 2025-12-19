import { useState } from 'react';
import { Navbar } from '@components/Navbar';
import { ExpenseList } from '@components/ExpenseList';
import { ExpenseForm } from '@components/ExpenseForm';
import { MonthlySummaryView } from '@components/MonthlySummaryView';
import { useExpenses } from '@hooks/useExpenses';
import { useMonthlySummary } from '@hooks/useMonthlySummary';
import { formatCurrency } from '@utils/helpers';
import type { ExpenseFormData } from '@types/index';

export const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { expenses, isLoading, createExpense, updateExpense, deleteExpense } = useExpenses();
  const { summary } = useMonthlySummary(year, month);

  const handleCreateExpense = async (data: ExpenseFormData) => {
    await createExpense(data);
    setShowAddModal(false);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = summary?.totalExpenses || 0;
  const expenseCount = expenses.length;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Expense Dashboard</h1>
          <p>Track and manage your expenses efficiently</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month</div>
            <div className="stat-value">{formatCurrency(monthlyExpenses)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Count</div>
            <div className="stat-value">{expenseCount}</div>
          </div>
        </div>

        <MonthlySummaryView
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />

        <div className="card">
          <div className="card-header">
            <h2>All Expenses</h2>
            <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
              Add Expense
            </button>
          </div>

          {isLoading ? (
            <div className="loading">Loading expenses...</div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
            />
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Expense</h2>
              </div>
              <ExpenseForm onSubmit={handleCreateExpense} onCancel={() => setShowAddModal(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
