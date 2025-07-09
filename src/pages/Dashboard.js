import React, { useEffect, useState } from 'react';
import { 
  Container,
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { ResponsivePie } from '@nivo/pie';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const Dashboard = () => {
  const { 
    accounts, 
    transactions, 
    categories, 
    getReport,
    selectedAccount,
    loading 
  } = useAppContext();
  
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      if (selectedAccount) {
        try {
          setIsLoading(true);
          const data = await getReport(selectedAccount.id);
          setReportData(data);
        } catch (err) {
          console.error('Błąd podczas pobierania raportu:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedAccount, getReport]);

  // Obliczanie podsumowania
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
  
  const monthlySummary = transactions?.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (transaction.amount > 0) {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += Math.abs(transaction.amount);
    }
    
    return acc;
  }, {});
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthData = monthlySummary?.[currentMonth] || { income: 0, expenses: 0 };
  
  // Przygotowanie danych do wykresu
  const pieData = categories
    ?.filter(cat => cat.type === 'expense')
    .map(category => {
      const categoryTransactions = transactions?.filter(
        t => t.categoryId === category.id && t.amount < 0
      ) || [];
      
      const total = Math.abs(categoryTransactions.reduce((sum, t) => sum + t.amount, 0));
      
      return {
        id: category.name,
        label: category.name,
        value: total,
        color: category.color
      };
    })
    .filter(item => item.value > 0) || [];

  if (loading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Stylizowane komponenty
  const StatCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  }));

  const ChartContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px',
  }));

  if (loading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel główny
      </Typography>
      
      {/* Karty podsumowujące */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Karta salda */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="subtitle2">
                  Saldo ogółem
                </Typography>
              </Box>
              <Typography variant="h5">
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format(totalBalance)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {accounts?.length || 0} {accounts?.length === 1 ? 'konto' : 'kont'}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        {/* Karta przychodów */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="subtitle2">
                  Bilans miesięczny
                </Typography>
              </Box>
              <Typography 
                variant="h5" 
                color={currentMonthData.income - currentMonthData.expenses >= 0 ? 'success.main' : 'error'}
              >
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format(currentMonthData.income - currentMonthData.expenses)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        {/* Karta przychodów */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <IncomeIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="subtitle2">
                  Przychody (miesiąc)
                </Typography>
              </Box>
              <Typography variant="h5" color="success.main">
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format(currentMonthData.income || 0)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {transactions?.filter(t => t.amount > 0).length || 0} transakcji
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        {/* Karta wydatków */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ExpenseIcon color="error" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="subtitle2">
                  Wydatki (miesiąc)
                </Typography>
              </Box>
              <Typography variant="h5" color="error">
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                }).format(currentMonthData.expenses || 0)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {transactions?.filter(t => t.amount < 0).length || 0} transakcji
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        {/* Wykres kategorii */}
        <Grid item xs={12} md={6}>
          <ChartContainer elevation={3}>
            <Typography variant="h6" gutterBottom>
              Wydatki według kategorii
            </Typography>
            {pieData.length > 0 ? (
              <Box sx={{ flex: 1, minHeight: '300px' }}>
                <ResponsivePie
                  data={pieData}
                  margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="white"
                  colors={{ datum: 'data.color' }}
                  tooltip={({ datum: { id, value, color } }) => (
                    <Box 
                      sx={{ 
                        background: 'white', 
                        padding: '8px', 
                        border: `1px solid ${color}`, 
                        borderRadius: '4px' 
                      }}
                    >
                      <strong>{id}</strong><br />
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      }).format(value)}
                    </Box>
                  )}
                />
              </Box>
            ) : (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100%"
                minHeight="300px"
                color="text.secondary"
              >
                <Typography>Brak danych do wyświetlenia</Typography>
              </Box>
            )}
          </ChartContainer>
        </Grid>
        
        {/* Ostatnie transakcje */}
        <Grid item xs={12} md={6}>
          <ChartContainer elevation={3}>
            <Typography variant="h6" gutterBottom>
              Ostatnie transakcje
            </Typography>
            {transactions?.length > 0 ? (
              <Box>
                {transactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((transaction) => {
                    const category = categories?.find(c => c.id === transaction.categoryId);
                    const isExpense = transaction.amount < 0;
                    
                    return (
                      <Box 
                        key={transaction.id} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 1.5,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2">
                            {transaction.description || 'Brak opisu'}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={0.5}>
                            {category && (
                              <Box 
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: category.color || 'primary.main',
                                  mr: 1,
                                }}
                              />
                            )}
                            <Typography variant="caption" color="textSecondary">
                              {category?.name || 'Brak kategorii'}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography 
                          variant="subtitle1" 
                          color={isExpense ? 'error' : 'success.main'}
                        >
                          {isExpense ? '-' : ''}
                          {new Intl.NumberFormat('pl-PL', {
                            style: 'currency',
                            currency: 'PLN'
                          }).format(Math.abs(transaction.amount))}
                        </Typography>
                      </Box>
                    );
                  })}
                <Box mt={2} textAlign="right">
                  <Button 
                    variant="text" 
                    color="primary" 
                    size="small"
                    href="/transakcje"
                  >
                    Zobacz wszystkie transakcje →
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100%"
                minHeight="300px"
                color="text.secondary"
              >
                <Typography>Brak transakcji</Typography>
              </Box>
            )}
          </ChartContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
