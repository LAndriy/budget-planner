import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Konfiguracja axios
export const apiService = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor do dodawania tokena do żądań
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor do obsługi błędów
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Przekierowanie do logowania przy braku autoryzacji
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  // Autoryzacja
  auth: {
    login: async (credentials) => {
      // Format danych zgodny z oczekiwanym przez backend
      const loginData = {
        Login: credentials.login,
        Password: credentials.password
      };
      return apiService.post(API_CONFIG.endpoints.auth.login, loginData);
    }
  },
  // Użytkownicy
  users: {
    getAll: async () => {
      return apiService.get(API_CONFIG.endpoints.users.getAll);
    },
    getById: async (id) => {
      return apiService.get(API_CONFIG.endpoints.users.getById(id));
    },
    create: async (userData) => {
      return apiService.post(API_CONFIG.endpoints.users.create, userData);
    },
    update: async (userData) => {
      return apiService.put(API_CONFIG.endpoints.users.update, userData);
    },
    delete: async (id) => {
      return apiService.delete(API_CONFIG.endpoints.users.delete(id));
    }
  },

  // Transakcje
  transactions: {
    getAll: async (accountId) => {
      return apiService.get(API_CONFIG.endpoints.transactions.getAll(accountId));
    },
    getByCategory: async (accountId, categoryId) => {
      return apiService.get(API_CONFIG.endpoints.transactions.getByCategory(accountId, categoryId));
    },
    getById: async (id) => {
      return apiService.get(API_CONFIG.endpoints.transactions.getById(id));
    },
    create: async (transaction) => {
      return apiService.post(API_CONFIG.endpoints.transactions.create, transaction);
    },
    update: async (transaction) => {
      return apiService.put(API_CONFIG.endpoints.transactions.update, transaction);
    },
    delete: async (id) => {
      return apiService.delete(API_CONFIG.endpoints.transactions.delete(id));
    }
  },

  // Kategorie
  categories: {
    getAll: async () => {
      return apiService.get(API_CONFIG.endpoints.categories.getAll);
    },
    getById: async (id) => {
      return apiService.get(API_CONFIG.endpoints.categories.getById(id));
    },
    create: async (category) => {
      return apiService.post(API_CONFIG.endpoints.categories.create, category);
    },
    update: async (category) => {
      return apiService.put(API_CONFIG.endpoints.categories.update, category);
    },
    delete: async (id) => {
      return apiService.delete(API_CONFIG.endpoints.categories.delete(id));
    }
  },

  // Raporty
  reports: {
    getAllCategories: async (accountId) => {
      return apiService.get(API_CONFIG.endpoints.reports.allCategories(accountId));
    },
    getByCategory: async (accountId, categoryId) => {
      return apiService.get(API_CONFIG.endpoints.reports.byCategory(accountId, categoryId));
    }
  },

  // Konta finansowe
  accounts: {
    getById: async (id) => {
      return apiService.get(API_CONFIG.endpoints.accounts.getById(id));
    },
    create: async (account) => {
      return apiService.post(API_CONFIG.endpoints.accounts.create, account);
    },
    update: async (account) => {
      return apiService.put(API_CONFIG.endpoints.accounts.update, account);
    },
    delete: async (id) => {
      return apiService.delete(API_CONFIG.endpoints.accounts.delete(id));
    }
  }
};
