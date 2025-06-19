import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { BudgetProvider } from './context/BudgetContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';

// Tworzenie motywu
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <BudgetProvider>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/logowanie" element={<Login />} />
                <Route path="/rejestracja" element={<Register />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/transakcje" element={<Transactions />} />
                <Route path="/raporty" element={<Reports />} />
                <Route path="/ustawienia" element={<Settings />} />
              </Routes>
            </Layout>
          </Box>
        </BudgetProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;