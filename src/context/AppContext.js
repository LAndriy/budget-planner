import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiEndpoints } from '../services/apiService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pobieranie danych przy starcie
  useEffect(() => {
    let isMounted = true;
    
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Jeśli brak tokena lub ID użytkownika, zakończ ładowanie
        if (!token || !userId) {
          if (isMounted) {
            setLoading(false);
            setUser(null);
          }
          return;
        }
        
        if (isMounted) setLoading(true);
        
        // Pobierz dane użytkownika
        const userResponse = await apiEndpoints.users.getById(userId);
        
        if (!isMounted) return;
        
        if (userResponse?.data) {
          setUser(userResponse.data);
          
          // Pobierz konta użytkownika (bez transakcji)
          await fetchAccounts(userId, true);
          
          // Pobierz kategorie
          await fetchCategories();
          
          // Jeśli mamy wybrane konto, pobierz transakcje
          if (selectedAccount?.id) {
            await fetchTransactions(selectedAccount.id);
          }
        } else {
          // Jeśli nie udało się pobrać danych użytkownika, wyloguj
          if (isMounted) {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
        }
      } catch (err) {
        console.error('Błąd podczas pobierania danych:', err);
        // W przypadku błędu, wyczyść dane autoryzacyjne
        if (isMounted) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
          setLoading(false);
        }
      }
      
      return () => {
        isMounted = false;
      };
    };

    fetchInitialData();
  }, []);

  // Pobieranie kont użytkownika
  const fetchAccounts = async (userId, skipTransactions = false) => {
    try {
      if (!userId) {
        console.error('Brak ID użytkownika do pobrania kont');
        return [];
      }
      
      setLoading(true);
      const response = await apiEndpoints.accounts.getByUser(userId);
      
      if (response?.data) {
        // Formatowanie danych kont zgodnie z modelem z backendu
        const formattedAccounts = response.data.map(account => ({
          id: account.AccountID,
          name: account.AccountName,
          currency: account.Currency,
          balance: account.Ammount || 0
        }));
        
        setAccounts(formattedAccounts);
        
        // Automatyczne wybieranie pierwszego konta, jeśli nie ma wybranego
        if (formattedAccounts.length > 0 && !selectedAccount) {
          const firstAccount = formattedAccounts[0];
          setSelectedAccount(firstAccount);
          
          // Pobierz transakcje tylko jeśli nie pomijamy
          if (!skipTransactions) {
            await fetchTransactions(firstAccount.id);
          }
        }
        
        return formattedAccounts;
      }
      
      return [];
    } catch (err) {
      console.error('Błąd podczas pobierania kont:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać listy kont';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie szczegółów konta
  const getAccountDetails = async (accountId) => {
    try {
      if (!user?.id) {
        throw new Error('Użytkownik nie jest zalogowany');
      }
      
      setLoading(true);
      const response = await apiEndpoints.accounts.getById(user.id, accountId);
      
      if (!response.data) {
        throw new Error('Nie znaleziono konta o podanym ID');
      }
      
      // Formatowanie danych konta
      const accountData = response.data;
      const formattedAccount = {
        id: accountId,
        name: accountData.AccountName,
        currency: accountData.Currency,
        balance: accountData.Ammount || 0
      };
      
      return formattedAccount;
    } catch (err) {
      console.error('Błąd podczas pobierania szczegółów konta:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać szczegółów konta';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Dodawanie nowego konta
  const addAccount = async (accountData) => {
    try {
      setLoading(true);
      
      // Przygotowanie danych do wysłania zgodnie z modelem z backendu
      const accountToAdd = {
        UserID: user?.id,
        AccountName: accountData.name,
        Currency: accountData.currency,
        Ammount: accountData.balance || 0
      };
      
      const response = await apiEndpoints.accounts.create(accountToAdd);
      
      // Odśwież listę kont
      if (user?.id) {
        await fetchAccounts(user.id);
      }
      
      return { 
        success: true, 
        data: response.data,
        message: 'Konto zostało pomyślnie dodane'
      };
    } catch (err) {
      console.error('Błąd podczas dodawania konta:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się dodać konta';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  // Aktualizacja konta
  const updateAccount = async (id, accountData) => {
    try {
      setLoading(true);
      
      // Przygotowanie danych do aktualizacji
      const accountToUpdate = {
        AccountID: id,
        AccountName: accountData.name,
        Currency: accountData.currency,
        Ammount: accountData.balance || 0
      };
      
      const response = await apiEndpoints.accounts.update(accountToUpdate);
      
      // Odśwież listę kont
      if (user?.id) {
        await fetchAccounts(user.id);
      }
      
      return { 
        success: true, 
        data: response.data,
        message: 'Konto zostało zaktualizowane'
      };
    } catch (err) {
      console.error('Błąd podczas aktualizacji konta:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się zaktualizować konta';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  // Usuwanie konta
  const deleteAccount = async (accountId) => {
    try {
      setLoading(true);
      
      const response = await apiEndpoints.accounts.delete(accountId);
      
      // Odśwież listę kont
      if (user?.id) {
        await fetchAccounts(user.id);
      }
      
      return { 
        success: true, 
        message: 'Konto zostało pomyślnie usunięte'
      };
    } catch (err) {
      console.error('Błąd podczas usuwania konta:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się usunąć konta';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie transakcji po kategorii
  const fetchTransactionsByCategory = async (accountId, categoryId) => {
    try {
      const response = await apiEndpoints.transactions.getByCategory(accountId, categoryId);
      setTransactions(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas pobierania transakcji z kategorii:', err);
      return [];
    }
  };

  // Pobieranie wszystkich użytkowników (tylko dla admina)
  const fetchAllUsers = async () => {
    try {
      const response = await apiEndpoints.users.getAll();
      // Mapowanie danych z odpowiedzi API na format używany w aplikacji
      const users = Array.isArray(response.data) ? response.data.map(u => ({
        id: u.userID,
        name: u.name,
        surname: u.surname,
        login: u.login,
        age: u.age,
        roleId: u.userRoleID,
        createdAt: u.creationDate
      })) : [];
      
      return { success: true, data: users };
    } catch (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać listy użytkowników';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Pobieranie danych użytkownika po ID
  const fetchUserById = async (userId) => {
    try {
      const response = await apiEndpoints.users.getById(userId);
      if (!response.data) {
        throw new Error('Nie znaleziono użytkownika');
      }
      
      const userData = response.data;
      const formattedUser = {
        id: userId,
        name: userData.name,
        surname: userData.surname,
        login: userData.login,
        age: userData.age,
        roleId: userData.userRoleID,
        createdAt: userData.creationDate
      };
      
      return { success: true, data: formattedUser };
    } catch (err) {
      console.error(`Błąd podczas pobierania użytkownika o ID ${userId}:`, err);
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać danych użytkownika';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Aktualizacja danych użytkownika
  const updateUser = async (userData) => {
    try {
      // Przygotowanie danych do wysłania
      const updateData = {
        userID: userData.id,
        name: userData.name,
        surname: userData.surname,
        login: userData.login,
        age: userData.age,
        userRoleID: userData.roleId,
        // Upewnij się, że data jest w odpowiednim formacie
        creationDate: userData.createdAt ? new Date(userData.createdAt).toISOString() : new Date().toISOString()
      };
      
      const response = await apiEndpoints.users.update(updateData);
      
      // Jeśli aktualizujemy dane zalogowanego użytkownika, aktualizuj stan
      if (user && user.id === userData.id) {
        setUser(prev => ({
          ...prev,
          name: updateData.name,
          surname: updateData.surname,
          login: updateData.login,
          age: updateData.age,
          roleId: updateData.userRoleID
        }));
      }
      
      return { 
        success: true, 
        data: response.data,
        message: response.data?.message || 'Dane użytkownika zostały zaktualizowane'
      };
      
    } catch (err) {
      console.error('Błąd podczas aktualizacji użytkownika:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się zaktualizować danych użytkownika';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };
  
  // Usuwanie użytkownika
  const deleteUser = async (userId) => {
    try {
      const response = await apiEndpoints.users.delete(userId);
      
      // Jeśli usuwamy zalogowanego użytkownika, wyloguj
      if (user && user.id === userId) {
        logout();
      }
      
      return { 
        success: true, 
        data: response.data,
        message: response.data?.message || 'Użytkownik został usunięty'
      };
      
    } catch (err) {
      console.error(`Błąd podczas usuwania użytkownika o ID ${userId}:`, err);
      const errorMessage = err.response?.data?.message || 'Nie udało się usunąć użytkownika';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Pobieranie transakcji dla konta
  const fetchTransactions = async (accountId) => {
    try {
      if (!accountId) return [];
      
      // Sprawdź czy już ładujemy dane
      if (loading) return [];
      
      setLoading(true);
      const response = await apiEndpoints.transactions.getAll(accountId);
      
      // Sprawdź czy odpowiedź jest poprawna przed aktualizacją stanu
      if (response?.data && Array.isArray(response.data)) {
        setTransactions(response.data);
        return response.data;
      }
      return [];
    } catch (err) {
      console.error('Błąd podczas pobierania transakcji:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać transakcji';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie szczegółów transakcji
  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await apiEndpoints.transactions.getById(transactionId);
      if (!response.data) {
        throw new Error('Nie znaleziono transakcji');
      }
      return { 
        success: true, 
        data: response.data 
      };
    } catch (err) {
      console.error('Błąd podczas pobierania szczegółów transakcji:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać szczegółów transakcji';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Dodawanie transakcji
  const addTransaction = async (transactionData) => {
    try {
      // Przygotowanie danych do wysłania
      const transactionToAdd = {
        AccountID: transactionData.accountId,
        Amount: transactionData.amount,
        CategoryID: transactionData.categoryId,
        Comment: transactionData.comment || ''
      };

      const response = await apiEndpoints.transactions.create(transactionToAdd);
      
      // Odśwież listę transakcji i saldo konta
      if (transactionData.accountId) {
        await fetchTransactions(transactionData.accountId);
        await updateAccountBalance(transactionData.accountId);
      }
      
      return { 
        success: true, 
        data: response.data,
        message: 'Transakcja została dodana pomyślnie'
      };
      
    } catch (err) {
      console.error('Błąd podczas dodawania transakcji:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się dodać transakcji';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Aktualizacja transakcji
  const updateTransaction = async (transactionData) => {
    try {
      // Pobierz aktualną transakcję, aby zachować dane, które nie są aktualizowane
      const currentTransaction = transactions.find(t => t.TransactionID === transactionData.transactionId);
      
      if (!currentTransaction) {
        throw new Error('Nie znaleziono transakcji do aktualizacji');
      }

      // Przygotowanie danych do aktualizacji
      const transactionToUpdate = {
        TransactionID: transactionData.transactionId,
        AccountID: transactionData.accountId || currentTransaction.AccountID,
        Amount: transactionData.amount || currentTransaction.Amount,
        CategoryID: transactionData.categoryId || currentTransaction.CategoryID,
        Comment: transactionData.comment !== undefined ? transactionData.comment : currentTransaction.Comment
      };

      const response = await apiEndpoints.transactions.update(transactionToUpdate);
      
      // Odśwież listę transakcji i saldo konta
      if (transactionToUpdate.AccountID) {
        await fetchTransactions(transactionToUpdate.AccountID);
        await updateAccountBalance(transactionToUpdate.AccountID);
      }
      
      return { 
        success: true, 
        data: response.data,
        message: 'Transakcja została zaktualizowana pomyślnie'
      };
      
    } catch (err) {
      console.error('Błąd podczas aktualizacji transakcji:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się zaktualizować transakcji';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Usuwanie transakcji
  const deleteTransaction = async (transactionId) => {
    try {
      // Pobierz transakcję przed usunięciem, aby znać konto
      const transaction = transactions.find(t => t.TransactionID === transactionId);
      if (!transaction) {
        throw new Error('Nie znaleziono transakcji do usunięcia');
      }

      await apiEndpoints.transactions.delete(transactionId);
      
      // Odśwież listę transakcji i saldo konta
      if (transaction.AccountID) {
        await fetchTransactions(transaction.AccountID);
        await updateAccountBalance(transaction.AccountID);
      }
      
      return { 
        success: true, 
        message: 'Transakcja została usunięta pomyślnie'
      };
      
    } catch (err) {
      console.error('Błąd podczas usuwania transakcji:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się usunąć transakcji';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Czyszczenie błędu
  const clearError = () => setError('');

  // Odświeżanie danych
  const refreshData = async () => {
    if (user?.id) {
      await Promise.all([
        fetchAccounts(user.id),
        fetchCategories(user.id),
        fetchReports(user.id)
      ]);
    }
  };

  // Pobieranie raportu dla wszystkich kategorii
  const fetchReports = async (accountId) => {
    try {
      setLoading(true);
      const response = await apiEndpoints.reports.getAllCategories(accountId);
      
      // Formatowanie danych raportu
      const formattedReports = Array.isArray(response.data) 
        ? response.data.map(report => ({
            categoryName: report.CategoryName,
            amount: report.Amount
          }))
        : [];
      
      setReports(formattedReports);
      return {
        success: true,
        data: formattedReports
      };
      
    } catch (err) {
      console.error('Błąd podczas pobierania raportu dla wszystkich kategorii:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać raportu dla wszystkich kategorii';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie raportu dla wybranej kategorii
  const fetchReportByCategory = async (accountId, categoryId) => {
    try {
      setLoading(true);
      const response = await apiEndpoints.reports.getByCategory(accountId, categoryId);
      
      if (!response.data) {
        throw new Error('Nie znaleziono raportu dla wybranej kategorii');
      }
      
      // Formatowanie danych raportu
      const formattedReport = {
        categoryName: response.data.CategoryName,
        amount: response.data.Amount
      };
      
      return {
        success: true,
        data: formattedReport
      };
      
    } catch (err) {
      console.error(`Błąd podczas pobierania raportu dla kategorii o ID ${categoryId}:`, {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || `Nie udało się pobrać raportu dla kategorii o ID ${categoryId}`;
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  // Wybór konta
  const selectAccount = (account) => {
    setSelectedAccount(account);
    if (account?.id) {
      fetchTransactions(account.id);
    }
  };

  // Aktualizacja salda konta
  const updateAccountBalance = async (accountId) => {
    try {
      const response = await apiEndpoints.accounts.getById(user.id, accountId);
      if (response.data) {
        setAccounts(prev => 
          prev.map(acc => 
            acc.id === accountId ? { ...acc, balance: response.data.balance } : acc
          )
        );
      }
    } catch (err) {
      console.error('Błąd podczas aktualizacji salda:', err);
    }
  };

  // Pobieranie wszystkich kategorii
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiEndpoints.categories.getAll();
      
      // Mapowanie danych z odpowiedzi API na format używany w aplikacji
      const formattedCategories = Array.isArray(response.data) 
        ? response.data.map(cat => ({
            id: cat.CategoryID,
            name: cat.CategoryName
          }))
        : [];
      
      setCategories(formattedCategories);
      return formattedCategories;
      
    } catch (err) {
      console.error('Błąd podczas pobierania kategorii:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać kategorii';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie szczegółów kategorii
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const response = await apiEndpoints.categories.getById(categoryId);
      
      if (!response.data) {
        throw new Error('Nie znaleziono kategorii');
      }
      
      return {
        success: true,
        data: {
          id: response.data.CategoryID,
          name: response.data.CategoryName
        }
      };
      
    } catch (err) {
      console.error(`Błąd podczas pobierania szczegółów kategorii o ID ${categoryId}:`, err);
      const errorMessage = err.response?.data?.message || 'Nie udało się pobrać szczegółów kategorii';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Dodawanie nowej kategorii
  const addCategory = async (categoryData) => {
    try {
      // Przygotowanie danych do wysłania
      const categoryToAdd = {
        CategoryName: categoryData.name
      };
      
      const response = await apiEndpoints.categories.create(categoryToAdd);
      
      // Odśwież listę kategorii
      await fetchCategories();
      
      return {
        success: true,
        data: {
          id: response.data?.CategoryID,
          name: response.data?.CategoryName
        },
        message: 'Kategoria została dodana pomyślnie'
      };
      
    } catch (err) {
      console.error('Błąd podczas dodawania kategorii:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się dodać kategorii';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Aktualizacja kategorii
  const updateCategory = async (categoryData) => {
    try {
      // Przygotowanie danych do aktualizacji
      const categoryToUpdate = {
        CategoryID: categoryData.id,
        CategoryName: categoryData.name
      };
      
      const response = await apiEndpoints.categories.update(categoryToUpdate);
      
      // Odśwież listę kategorii
      await fetchCategories();
      
      return {
        success: true,
        data: {
          id: response.data?.CategoryID,
          name: response.data?.CategoryName
        },
        message: 'Kategoria została zaktualizowana pomyślnie'
      };
      
    } catch (err) {
      console.error('Błąd podczas aktualizacji kategorii:', err);
      const errorMessage = err.response?.data?.message || 'Nie udało się zaktualizować kategorii';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };
  
  // Usuwanie kategorii
  const deleteCategory = async (categoryId) => {
    try {
      await apiEndpoints.categories.delete(categoryId);
      
      // Odśwież listę kategorii
      await fetchCategories();
      
      return {
        success: true,
        message: 'Kategoria została usunięta pomyślnie'
      };
      
    } catch (err) {
      console.error(`Błąd podczas usuwania kategorii o ID ${categoryId}:`, err);
      const errorMessage = err.response?.data?.message || 'Nie udało się usunąć kategorii';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Pobieranie szczegółów kategorii
  const getCategoryDetails = async (categoryId) => {
    try {
      const response = await apiEndpoints.categories.getById(categoryId);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas pobierania szczegółów kategorii:', err);
      return null;
    }
  };

  // Pobieranie raportu
  const getReport = async (accountId, categoryId = null) => {
    try {
      const response = categoryId
        ? await apiEndpoints.reports.byCategory(accountId, categoryId)
        : await apiEndpoints.reports.allCategories(accountId);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas pobierania raportu:', err);
      return null;
    }
  };

  // Logowanie
  const login = async (credentials) => {
    try {
      console.log('Próba logowania z danymi:', credentials);
      
      // Wysyłanie żądania logowania
      const response = await apiEndpoints.auth.login(credentials);
      
      if (response.data) {
        const userData = response.data;
        
        // Zapisz dane użytkownika w localStorage
        localStorage.setItem('userId', userData.name); // Używamy name jako identyfikator
        
        // Zaktualizuj stan użytkownika w kontekście
        const formattedUser = {
          id: userData.name, // Używamy name jako ID, ponieważ nie ma bezpośredniego ID w odpowiedzi
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.login || '',
          roleId: userData.userRoleID || 2,
          createdAt: userData.creationDate || new Date().toISOString(),
          login: userData.login || ''
        };
        
        setUser(formattedUser);
        
        // Pobierz dodatkowe dane użytkownika
        await fetchUserData(userData.name);
        
        return { 
          success: true, 
          user: formattedUser,
          message: 'Zalogowano pomyślnie'
        };
      } else {
        throw new Error('Nieprawidłowa odpowiedź z serwera');
      }
      
    } catch (err) {
      console.error('Błąd logowania:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      let errorMessage = 'Błąd logowania';
      
      if (err.response) {
        // Błąd odpowiedzi z serwera
        errorMessage = err.response.data?.message || errorMessage;
        
        if (err.response.status === 401) {
          errorMessage = 'Nieprawidłowy login lub hasło';
        } else if (err.response.status >= 500) {
          errorMessage = 'Błąd serwera. Spróbuj ponownie później.';
        }
      } else if (err.request) {
        // Brak odpowiedzi z serwera
        errorMessage = 'Nie można połączyć się z serwerem. Sprawdź swoje połączenie internetowe.';
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: err.response?.data?.errors
      };
    }
  };
  
  // Pobieranie danych użytkownika po zalogowaniu
  const fetchUserData = async (userId) => {
    try {
      const [accountsResponse, categoriesResponse] = await Promise.all([
        fetchAccounts(userId),
        fetchCategories()
      ]);
      
      // Jeśli użytkownik ma konta, wybierz pierwsze
      if (accountsResponse.length > 0) {
        await selectAccount(accountsResponse[0]);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Błąd podczas pobierania danych użytkownika:', err);
      return { success: false, error: 'Nie udało się załadować danych użytkownika' };
    }
  };

  // Wylogowanie
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setAccounts([]);
    setTransactions([]);
  };

  // Rejestracja
  const register = async (userData) => {
    try {
      console.log('Próba rejestracji z danymi:', userData);
      
      // Format danych zgodny z oczekiwanym przez endpoint /api/Users/AddUser
      const formattedData = {
        Name: userData.firstName || '',
        Surname: userData.lastName || '',
        Login: userData.email, // Używamy emaila jako loginu
        Password: userData.password,
        // Ustawiamy domyślne wartości wymagane przez API
        Age: 18, // Domyślny wiek
        CreationDate: new Date().toISOString(),
        UserRoleID: 2 // Domyślna rola użytkownika (zakładam, że 2 to ID roli użytkownika)
      };
      
      console.log('Wysyłane dane do API:', formattedData);
      
      const response = await apiEndpoints.users.create(formattedData);
      console.log('Odpowiedź z API:', response);
      
      if (response.data) {
        try {
          // Próba automatycznego logowania po udanej rejestracji
          const loginResponse = await login({
            login: userData.email,
            password: userData.password
          });
          
          if (loginResponse.success) {
            return { 
              success: true, 
              data: response.data,
              user: loginResponse.user
            };
          }
        } catch (loginError) {
          console.error('Błąd podczas automatycznego logowania po rejestracji:', loginError);
          // Kontynuuj mimo błędu logowania - użytkownik może się zalogować ręcznie
          return { 
            success: true, 
            data: response.data,
            requiresLogin: true
          };
        }
      }
      
      return { 
        success: true, 
        data: response.data,
        requiresLogin: true
      };
      
    } catch (err) {
      console.error('Szczegółowy błąd rejestracji:', {
        message: err.message,
        response: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        },
        stack: err.stack
      });
      
      let errorMessage = 'Wystąpił błąd podczas rejestracji';
      let validationErrors = null;
      
      if (err.response) {
        // Błąd odpowiedzi z serwera
        errorMessage = err.response.data?.message || errorMessage;
        validationErrors = err.response.data?.errors;
      } else if (err.request) {
        // Brak odpowiedzi z serwera
        errorMessage = 'Nie można połączyć się z serwerem. Sprawdź swoje połączenie internetowe.';
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        validationErrors: validationErrors
      };
    }
  };

  // Udostępniane wartości kontekstu
  const value = {
    user,
    loading,
    error,
    accounts: accounts || [],
    categories: categories || [],
    transactions: transactions || [],
    selectedAccount,
    reports,
    // Authentication
    login,
    register,
    logout,
    // User management
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    // Account management
    addAccount,
    updateAccount,
    deleteAccount,
    // Category management
    addCategory,
    updateCategory,
    deleteCategory,
    // Transaction management
    addTransaction,
    updateTransaction,
    deleteTransaction,
    // Data fetching
    fetchAccounts,
    fetchCategories,
    fetchTransactions,
    fetchTransactionDetails,
    fetchReports,
    // Other
    selectAccount,
    clearError,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext musi być użyty wewnątrz AppProvider');
  }
  return context;
};

export default AppContext;