import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { formatNumber, formatDate } from '../../utils/format';

const TrendLineChart = () => {
  const { transactions = [] } = useAppContext();
  
  // Grupujemy transakcje po miesiącach
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
    
    const existing = acc.find(a => a.month === month);
    if (existing) {
      existing.income += transaction.type === 'income' ? transaction.amount : 0;
      existing.expenses += transaction.type === 'expense' ? transaction.amount : 0;
    } else {
      acc.push({
        month,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expenses: transaction.type === 'expense' ? transaction.amount : 0
      });
    }
    return acc;
  }, []);

  // Sortujemy dane po czasie
  const sortedData = [...monthlyData].sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [
            formatNumber(value),
            name === 'income' ? 'Przychody' : 'Wydatki'
          ]}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#2e7d32"
          strokeWidth={2}
          name="Przychody"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#dc004e"
          strokeWidth={2}
          name="Wydatki"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendLineChart;
