import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiEndpoints } from '../services/apiService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie danych przy starcie
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Pobieranie danych użytkownika (zakładam, że mamy zapisane ID użytkownika w localStorage)
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userResponse = await apiEndpoints.users.getById(userId);
          setUser(userResponse.data);
          
          // Pobieranie kont użytkownika
          const accountsResponse = await apiEndpoints.accounts.getByUser(userId);
          setAccounts(accountsResponse.data);
          
          if (accountsResponse.data.length > 0) {
            setSelectedAccount(accountsResponse.data[0]);
            // Pobieranie transakcji dla wybranego konta
            await fetchTransactions(accountsResponse.data[0].id);
          }
          
          // Pobieranie kategorii
          const categoriesResponse = await apiEndpoints.categories.getAll();
          setCategories(categoriesResponse.data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Błąd podczas pobierania danych:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Pobieranie transakcji dla danego konta
  const fetchTransactions = async (accountId) => {
    try {
      const response = await apiEndpoints.transactions.getAll(accountId);
      setTransactions(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas pobierania transakcji:', err);
    }
  };

  // Obsługa logowania
  const login = async (credentials) => {
    try {
      const response = await apiEndpoints.auth.login(credentials);
      const { token, user } = response.data;
      
      // Zapisanie tokena i danych użytkownika
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      
      setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd logowania');
      return { success: false, error: err.response?.data?.message || 'Błąd logowania' };
    }
  };

  // Obsługa wylogowania
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setSelectedAccount(null);
  };

  // Dodawanie nowej transakcji
  const addTransaction = async (transaction) => {
    try {
      if (!selectedAccount) throw new Error('Nie wybrano konta');
      
      const newTransaction = {
        ...transaction,
        accountId: selectedAccount.id,
        date: new Date().toISOString()
      };
      
      const response = await apiEndpoints.transactions.create(newTransaction);
      setTransactions([...transactions, response.data]);
      
      // Aktualizacja salda konta
      await updateAccountBalance(selectedAccount.id);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Aktualizacja salda konta
  const updateAccountBalance = async (accountId) => {
    try {
      const response = await apiEndpoints.accounts.getById(accountId);
      const updatedAccount = response.data;
      
      setAccounts(accounts.map(acc => 
        acc.id === accountId ? updatedAccount : acc
      ));
      
      if (selectedAccount?.id === accountId) {
        setSelectedAccount(updatedAccount);
      }
    } catch (err) {
      console.error('Błąd podczas aktualizacji salda konta:', err);
    }
  };

  // Dodawanie nowego konta
  const addAccount = async (accountData) => {
    try {
      if (!user) throw new Error('Użytkownik nie jest zalogowany');
      
      const newAccount = {
        ...accountData,
        userId: user.id
      };
      
      const response = await apiEndpoints.accounts.create(newAccount);
      const createdAccount = response.data;
      
      setAccounts([...accounts, createdAccount]);
      
      // Jeśli to pierwsze konto, ustaw je jako wybrane
      if (accounts.length === 0) {
        setSelectedAccount(createdAccount);
      }
      
      return { success: true, account: createdAccount };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Dodawanie nowej kategorii
  const addCategory = async (categoryData) => {
    try {
      const response = await apiEndpoints.categories.create(categoryData);
      const newCategory = response.data;
      
      setCategories([...categories, newCategory]);
      return { success: true, category: newCategory };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Pobieranie raportu
  const getReport = async (accountId, categoryId = null) => {
    try {
      if (categoryId) {
        const response = await apiEndpoints.reports.getByCategory(accountId, categoryId);
        return response.data;
      } else {
        const response = await apiEndpoints.reports.getAllCategories(accountId);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas pobierania raportu:', err);
      return null;
    }
  };

  // Aktualizacja konta
  const updateAccount = async (id, accountData) => {
    try {
      const response = await apiEndpoints.accounts.update(id, accountData);
      const updatedAccount = response.data;
      
      setAccounts(accounts.map(acc => 
        acc.id === id ? updatedAccount : acc
      ));
      
      if (selectedAccount?.id === id) {
        setSelectedAccount(updatedAccount);
      }
      
      return { success: true, account: updatedAccount };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Usuwanie konta
  const deleteAccount = async (id) => {
    try {
      await apiEndpoints.accounts.delete(id);
      
      setAccounts(accounts.filter(acc => acc.id !== id));
      
      // Jeśli usunięto aktualnie wybrane konto, wybierz inne (jeśli istnieje)
      if (selectedAccount?.id === id) {
        const otherAccounts = accounts.filter(acc => acc.id !== id);
        setSelectedAccount(otherAccounts.length > 0 ? otherAccounts[0] : null);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        accounts,
        transactions,
        categories,
        selectedAccount,
        loading,
        error,
        setSelectedAccount,
        login,
        logout,
        addTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addCategory,
        getReport,
        fetchTransactions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext musi być użyty wewnątrz AppProvider');
  }
  return context;
};

export default AppContext;
