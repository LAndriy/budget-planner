import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import { CircularProgress } from '@mui/material';

// Tworzenie motywu
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Komponent chroniący trasy wymagające logowania
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  const location = useLocation();
  
  // Jeśli trwa ładowanie, pokaż loader
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
  if (!user) {
    return <Navigate to="/logowanie" state={{ from: location }} replace />;
  }
  
  return children;
};

// Komponent dla chronionych tras
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>
      {children}
    </Layout>
  </ProtectedRoute>
);

// Główny komponent aplikacji
const AppContent = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Routes>
        {/* Publiczne trasy */}
        <Route path="/logowanie" element={<Login />} />
        <Route path="/rejestracja" element={<Register />} />
        
        {/* Chronione trasy */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/transakcje" element={<Transactions />} />
          <Route path="/konta" element={<Accounts />} />
          <Route path="/kategorie" element={<Categories />} />
          <Route path="/raporty" element={<Reports />} />
        </Route>
        
        {/* Domyślne przekierowanie */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

// Główny komponent aplikacji z providerami
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        preventDuplicate
      >
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;