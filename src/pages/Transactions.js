import React, { useState, useMemo, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionEdit from '../components/transactions/TransactionEdit';
import { 
  formatCurrency, 
  formatDate, 
  formatTime,
  formatCategoryName,
  formatAccountName
} from '../utils/format';

// Stylizowane komponenty
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const AmountCell = styled(TableCell)(({ theme, type }) => ({
  fontWeight: 500,
  color: type === 'income' 
    ? theme.palette.success.main 
    : theme.palette.error.main,
}));

const Transactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { 
    transactions = [], 
    categories = [],
    accounts = [],
    deleteTransaction,
    fetchTransactions,
    fetchCategories,
    fetchAccounts,
    loading,
    error,
    selectedAccount
  } = useAppContext();
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const userId = localStorage.getItem('userId');
  
  // Fetch data on component mount and when selectedAccount changes
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCategories(userId),
          fetchAccounts(userId)
        ]);
        
        if (selectedAccount?.id) {
          await fetchTransactions(selectedAccount.id);
        }
      } catch (err) {
        console.error('Błąd podczas ładowania danych:', err);
        setFormError('Nie udało się załadować danych');
      }
    };
    
    loadData();
  }, [userId, selectedAccount, fetchTransactions, fetchCategories, fetchAccounts]);

  // Sort and filter transactions
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(transaction => {
        if (!transaction) return false;
        
        const matchesSearch = transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ?? false;
          
        const transactionAmount = parseFloat(transaction.amount) || 0;
        const isIncome = transactionAmount >= 0;
        const matchesType = filterType === 'all' || 
          (filterType === 'income' ? isIncome : !isIncome);
          
        const matchesCategory = filterCategory === 'all' || 
          transaction.categoryId === filterCategory;
          
        const matchesAccount = filterAccount === 'all' || 
          transaction.accountId === filterAccount;
          
        return matchesSearch && matchesType && matchesCategory && matchesAccount;
      });
  }, [transactions, searchTerm, filterType, filterCategory, filterAccount]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEdit = () => {
    setEditingTransaction(null);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę transakcję? Ta operacja jest nieodwracalna.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const result = await deleteTransaction(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Nie udało się usunąć transakcji');
      }
      
      // Refresh transactions list
      if (selectedAccount?.id) {
        await fetchTransactions(selectedAccount.id);
      }
    } catch (err) {
      console.error('Błąd podczas usuwania transakcji:', err);
      setFormError(err.message || 'Wystąpił błąd podczas usuwania transakcji');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterAccount('all');
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        gap: 2,
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: isMobile ? 1 : 0 }}>
          Transakcje
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TransactionForm 
            triggerButton={{
              variant: 'contained',
              startIcon: <AddIcon />,
              size: isMobile ? 'medium' : 'large'
            }} 
          />
          
          <TextField
            size={isMobile ? 'small' : 'medium'}
            placeholder="Szukaj transakcji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      
      {/* Filtry */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Typ transakcji</InputLabel>
              <Select
                value={filterType}
                label="Typ transakcji"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Wszystkie</MenuItem>
                <MenuItem value="income">Przychody</MenuItem>
                <MenuItem value="expense">Wydatki</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Kategoria</InputLabel>
              <Select
                value={filterCategory}
                label="Kategoria"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">Wszystkie kategorie</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Konto</InputLabel>
              <Select
                value={filterAccount}
                label="Konto"
                onChange={(e) => setFilterAccount(e.target.value)}
              >
                <MenuItem value="all">Wszystkie konta</MenuItem>
                {accounts.map(account => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'right' }}>
            <Button 
              onClick={handleClearFilters}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<FilterListIcon />}
            >
              Wyczyść filtry
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        {/* Statystyki filtrów */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {searchTerm && (
            <Chip 
              label={`Szukana fraza: "${searchTerm}"`} 
              onDelete={() => setSearchTerm('')}
              color="primary"
              variant="outlined"
            />
          )}
          {filterType !== 'all' && (
            <Chip 
              label={`Typ: ${filterType === 'income' ? 'Przychody' : 'Wydatki'}`} 
              onDelete={() => setFilterType('all')}
              color="secondary"
              variant="outlined"
            />
          )}
          {filterCategory !== 'all' && (
            <Chip 
              label={`Kategoria: ${categories.find(c => c.id === filterCategory)?.name || ''}`} 
              onDelete={() => setFilterCategory('all')}
              color="info"
              variant="outlined"
            />
          )}
          {filterAccount !== 'all' && (
            <Chip 
              label={`Konto: ${accounts.find(a => a.id === filterAccount)?.name || ''}`} 
              onDelete={() => setFilterAccount('all')}
              color="success"
              variant="outlined"
            />
          )}
        </Box>
        
        <TableContainer component={Paper} elevation={2}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                {!isMobile && <TableCell>Godzina</TableCell>}
                <TableCell>Opis</TableCell>
                {!isMobile && <TableCell>Kategoria</TableCell>}
                {!isMobile && <TableCell>Konto</TableCell>}
                <TableCell align="right">Kwota</TableCell>
                <TableCell align="center">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => {
                  const isExpense = transaction.amount < 0;
                  const amount = Math.abs(transaction.amount);
                  const category = categories.find(c => c.id === transaction.categoryId);
                  const account = accounts.find(a => a.id === transaction.accountId);
                  
                  return (
                    <StyledTableRow key={transaction.id} hover>
                      <TableCell>{formatDate(transaction.date, 'short')}</TableCell>
                      {!isMobile && <TableCell>{formatTime(transaction.date)}</TableCell>}
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Box>
                          <Typography variant="body2" noWrap>{transaction.description}</Typography>
                          {isMobile && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <Chip 
                                label={formatCategoryName(transaction.categoryId, categories)} 
                                size="small" 
                                sx={{ 
                                  bgcolor: `${category?.color || 'primary.light'}20`,
                                  color: category?.color || 'primary.main',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                              <Chip 
                                label={formatAccountName(transaction.accountId, accounts)} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Chip 
                            label={formatCategoryName(transaction.categoryId, categories)} 
                            size="small" 
                            sx={{ 
                              bgcolor: `${category?.color || 'primary.light'}20`,
                              color: category?.color || 'primary.main',
                            }}
                          />
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          <Chip 
                            label={formatAccountName(transaction.accountId, accounts)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                      )}
                      <AmountCell 
                        align="right" 
                        type={isExpense ? 'expense' : 'income'}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {isExpense ? <ExpenseIcon fontSize="small" /> : <IncomeIcon fontSize="small" />}
                          <Box sx={{ ml: 0.5 }}>
                            {isExpense ? '-' : ''}{formatCurrency(amount)}
                          </Box>
                        </Box>
                      </AmountCell>
                      <TableCell align="center">
                        <Tooltip title="Edytuj">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEdit(transaction)}
                            color="primary"
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(transaction.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <FilterListIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body1" color="textSecondary">
                        Brak transakcji spełniających wybrane kryteria
                      </Typography>
                      <Button 
                        onClick={handleClearFilters}
                        variant="text"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Wyczyść filtry
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {editingTransaction && (
        <TransactionEdit 
          transaction={editingTransaction} 
          onClose={handleCloseEdit} 
        />
      )}
    </Box>
  );
};

export default Transactions;
