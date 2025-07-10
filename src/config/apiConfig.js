export const API_CONFIG = {
  baseUrl: 'https://budgetplanerapi07092025.azurewebsites.net',
  endpoints: {
    // Authentication
    auth: {
      login: '/api/Login',
    },
    // Użytkownicy (używane również do rejestracji)
    users: {
      getAll: '/api/Users/AllUsers',
      getById: (id) => `/api/Users/${id}`,
      create: '/api/Users/AddUser',
      update: '/api/Users/UpdateUser',
      delete: (id) => `/api/Users/DeleteUser/${id}`
    },
    // Transakcje
    transactions: {
      getAll: (accountId) => `/api/Transaction/AllTransactions/${accountId}`,
      getByCategory: (accountId, categoryId) => `/api/Transaction/AllTransactions/${accountId}/${categoryId}`,
      getById: (id) => `/api/Transaction/${id}`,
      create: '/api/Transaction/AddTransaction',
      update: '/api/Transaction/UpdateTransaction',
      delete: (id) => `/api/Transaction/DeleteTransaction/${id}`
    },
    // Kategorie
    categories: {
      getAll: '/api/TransactionCategory/AllCategories',
      getById: (id) => `/api/TransactionCategory/GetCategory/${id}`,
      create: '/api/TransactionCategory/AddCategory',
      update: '/api/TransactionCategory/UpdateCategory',
      delete: (id) => `/api/TransactionCategory/DeleteCategory/${id}`
    },
    // Raporty
    reports: {
      getAllCategories: (accountId) => `/api/Report/AllCategoryReport/${accountId}`,
      getByCategory: (accountId, categoryId) => `/api/Report/${accountId}/${categoryId}`
    },
    // Konta finansowe
    accounts: {
      getByUser: (userId) => `/api/FinanceAccount/GetAllFinanceAccounts/${userId}`,
      getById: (userId, accountId) => `/api/FinanceAccount/${userId}/${accountId}`,
      create: '/api/FinanceAccount/AddFinanceAccount',
      update: '/api/FinanceAccount/UpdateFinanceAccount',
      delete: (id) => `/api/FinanceAccount/DeleteFinanceAccount/${id}`
    }
  }
};
