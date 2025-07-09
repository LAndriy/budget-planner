import React, { createContext, useState, useContext } from 'react';
import { apiEndpoints } from '../services/apiService';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  // Stan
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie danych przy starcie
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, categoriesRes, settingsRes] = await Promise.all([
          apiEndpoints.transactions.getAll(),
          apiEndpoints.categories.getAll(),
          apiEndpoints.settings.get()
        ]);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Funkcje
  const addTransaction = async (transaction) => {
    try {
      const response = await apiEndpoints.transactions.create(transaction);
      setTransactions([...transactions, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiEndpoints.transactions.delete(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const response = await apiEndpoints.transactions.update(id, updatedTransaction);
      setTransactions(
        transactions.map((t) => 
          t.id === id ? response.data : t
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await apiEndpoints.settings.update(newSettings);
      setSettings(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obliczenia
  const getBalance = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return totalIncome - totalExpenses;
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const value = {
    transactions,
    categories,
    settings,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    updateSettings,
    getBalance,
    getMonthlyStats
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
