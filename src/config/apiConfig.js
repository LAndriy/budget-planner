export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  endpoints: {
    // Użytkownicy
    users: {
      getAll: '/Users/AllUsers',
      getById: (id) => `/Users/${id}`,
      create: '/Users/AddUser',
      update: '/Users/UpdateUser',
      delete: (id) => `/Users/DeleteUser/${id}`
    },
    // Transakcje
    transactions: {
      getAll: (accountId) => `/Transaction/AllTransactions/${accountId}`,
      getByCategory: (accountId, categoryId) => `/Transaction/AllTransactions/${accountId}/${categoryId}`,
      getById: (id) => `/Transaction/GetTransaction/${id}`,
      create: '/Transaction/AddTransaction',
      update: '/Transaction/UpdateTransaction',
      delete: (id) => `/Transaction/DeleteTransaction/${id}`
    },
    // Kategorie
    categories: {
      getAll: '/TransactionCategory/AllCategories',
      getById: (id) => `/TransactionCategory/GetCategory/${id}`,
      create: '/TransactionCategory/AddCategory',
      update: '/TransactionCategory/UpdateCategory',
      delete: (id) => `/TransactionCategory/DeleteCategory/${id}`
    },
    // Raporty
    reports: {
      allCategories: (accountId) => `/Report/AllCategoryReport/${accountId}`,
      byCategory: (accountId, categoryId) => `/Report/${accountId}/${categoryId}`
    },
    // Konta finansowe
    accounts: {
      getById: (id) => `/FinanceAccount/GetFinanceAccount/${id}`,
      create: '/FinanceAccount/AddFinanceAccount',
      update: '/FinanceAccount/UpdateFinanceAccount',
      delete: (id) => `/FinanceAccount/DeleteFinanceAccount/${id}`
    }
  }
};
