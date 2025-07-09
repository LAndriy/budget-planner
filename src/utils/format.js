// Formatuje liczbę jako walutę
const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (amount) => {
  return currencyFormatter.format(amount);
};

export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatDate = (dateString, format = 'long') => {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('pl-PL');
  }
  
  if (format === 'month') {
    return date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  }
  
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCategoryName = (category, categories = []) => {
  if (!category) return 'Brak kategorii';
  const foundCategory = categories.find(c => c.id === category);
  return foundCategory?.name || 'Brak kategorii';
};

export const formatAccountName = (accountId, accounts = []) => {
  if (!accountId) return 'Brak konta';
  const account = accounts.find(a => a.id === accountId);
  return account?.name || 'Brak konta';
};
