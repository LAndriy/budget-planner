import React from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import TrendLineChart from '../components/charts/TrendLineChart';
import { useAppContext } from '../context/AppContext';
import { formatNumber } from '../utils/format';

const Reports = () => {
  const { transactions = [] } = useAppContext();
  const [activeTab, setActiveTab] = React.useState(0);

  // Podsumowanie wydatków
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Podsumowanie przychodów
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Bilans
  const balance = totalIncome - totalExpenses;

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Raporty
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChangeTab}>
            <Tab label="Wykresy" />
            <Tab label="Podsumowanie" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Rozkład wydatków po kategoriach
                </Typography>
                <CategoryPieChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Trendy przychodów i wydatków
                </Typography>
                <TrendLineChart />
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Przychody
                </Typography>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {formatNumber(totalIncome)} zł
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Wydatki
                </Typography>
                <Typography variant="h4" color="error.main" gutterBottom>
                  {formatNumber(totalExpenses)} zł
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Bilans
                </Typography>
                <Typography variant="h4" color={balance >= 0 ? 'success.main' : 'error.main'} gutterBottom>
                  {formatNumber(balance)} zł
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Reports;
