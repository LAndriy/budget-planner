import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBudget } from '../context/BudgetContext';
import { formatNumber } from '../utils/format';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const Dashboard = () => {
  const { transactions, categories, getBalance, getMonthlyStats } = useBudget();
  const { income, expenses, balance } = getMonthlyStats();
  const totalBalance = getBalance();

  // Sortowanie transakcji po dacie (najnowsze na górze)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Podsumowanie
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Saldo */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Saldo
            </Typography>
            <Typography variant="h4" color={totalBalance >= 0 ? 'primary' : 'error'}>
              {formatNumber(totalBalance)} zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Przychody */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Przychody (miesiąc)
            </Typography>
            <Typography variant="h4" style={{ color: '#2e7d32' }}>
              +{formatNumber(income)} zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Wydatki */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Wydatki (miesiąc)
            </Typography>
            <Typography variant="h4" color="error">
              -{formatNumber(expenses)} zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Ostatnie transakcje */}
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Ostatnie transakcje
            </Typography>
            {sortedTransactions.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Brak transakcji
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {sortedTransactions.slice(0, 5).map((transaction) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      {transaction.title} - {categories.find(c => c.id === transaction.category)?.name}
                    </Typography>
                    <Typography
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatNumber(transaction.amount)} zł
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Item>
        </Grid>
        
        {/* Wykres kategorii */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Wydatki według kategorii
            </Typography>
            <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Wykres pojawi się tutaj
              </Typography>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
