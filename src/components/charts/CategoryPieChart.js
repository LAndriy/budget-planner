import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { formatNumber } from '../../utils/format';

const CategoryPieChart = () => {
  const { transactions, categories } = useBudget();

  // Filtrujemy tylko wydatki i grupujemy je po kategoriach
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find(c => c.id === transaction.category);
      if (category) {
        const existing = acc.find(a => a.name === category.name);
        if (existing) {
          existing.value += transaction.amount;
        } else {
          acc.push({
            name: category.name,
            value: transaction.amount,
            color: category.color
          });
        }
      }
      return acc;
    }, []);

  // Sortujemy kategorie od największej do najmniejszej
  const sortedData = [...expensesByCategory].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={90}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${formatNumber(value)} zł`}
        >
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="transparent" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
