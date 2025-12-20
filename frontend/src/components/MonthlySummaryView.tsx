import { useMonthlySummary } from '@hooks/useMonthlySummary';
import { formatCurrency, getCategoryColor } from '@utils/helpers';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlySummaryViewProps {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MonthlySummaryView = ({
  year,
  month,
  onYearChange,
  onMonthChange,
}: MonthlySummaryViewProps) => {
  const { summary, isLoading } = useMonthlySummary(year, month);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (isLoading) {
    return <div className="loading">Loading summary...</div>;
  }

  if (!summary) {
    return null;
  }

  const categoryData = summary.categoryBreakdown.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    value: cat.total,
    color: getCategoryColor(cat.category),
  }));

  const dailyData = summary.expensesByDay.map((day) => ({
    date: new Date(day.date).getDate(),
    amount: day.total,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h2>Monthly Summary</h2>
        <div className="month-year-selector">
          <select value={month} onChange={(e) => onMonthChange(parseInt(e.target.value))}>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => onYearChange(parseInt(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div className="stat-label">
          {summary.month} {summary.year} Total
        </div>
        <div className="stat-value">{formatCurrency(summary.totalExpenses)}</div>
      </div>

      {categoryData.length > 0 && (
        <div className="chart-container">
          <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="chart-container">
          <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>Daily Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {summary.categoryBreakdown.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>Category Breakdown</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {summary.categoryBreakdown.map((cat) => (
              <div
                key={cat.category}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#f7fafc',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: 600,
                      color: getCategoryColor(cat.category),
                    }}
                  >
                    {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                  </span>
                  <span style={{ marginLeft: '8px', color: '#718096', fontSize: '14px' }}>
                    ({cat.count} {cat.count === 1 ? 'expense' : 'expenses'})
                  </span>
                </div>
                <div style={{ fontWeight: 700 }}>{formatCurrency(cat.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
