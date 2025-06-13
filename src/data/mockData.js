export const mockCategories = [
  {
    id: 1,
    name: "Jedzenie",
    type: "expense",
    budget: 1500,
    color: "#FF6B6B"
  },
  {
    id: 2,
    name: "Rozrywka",
    type: "expense",
    budget: 500,
    color: "#4ECDC4"
  },
  {
    id: 3,
    name: "Transport",
    type: "expense",
    budget: 300,
    color: "#45B7D1"
  },
  {
    id: 4,
    name: "Wynagrodzenie",
    type: "income",
    color: "#96CEB4"
  },
  {
    id: 5,
    name: "Inne",
    type: "expense",
    budget: 200,
    color: "#FFEEAD"
  }
];

export const mockTransactions = [
  {
    id: 1,
    title: "Wynagrodzenie",
    amount: 5000,
    type: "income",
    category: 4,
    date: "2025-06-01"
  },
  {
    id: 2,
    title: "Zakupy spożywcze",
    amount: 250,
    type: "expense",
    category: 1,
    date: "2025-06-10"
  },
  {
    id: 3,
    title: "Bilety do kina",
    amount: 100,
    type: "expense",
    category: 2,
    date: "2025-06-12"
  },
  {
    id: 4,
    title: "Paliwo",
    amount: 150,
    type: "expense",
    category: 3,
    date: "2025-06-15"
  }
];

export const mockSettings = {
  currency: "PLN",
  defaultCategory: 1,
  dateFormat: "YYYY-MM-DD",
  theme: "light"
};
