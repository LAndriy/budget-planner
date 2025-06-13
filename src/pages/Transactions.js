import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useBudget } from '../context/BudgetContext';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionEdit from '../components/transactions/TransactionEdit';
import { formatNumber, formatDate } from '../utils/format';

const Transactions = () => {
  const { transactions, categories, deleteTransaction } = useBudget();
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Sortowanie transakcji po dacie (najnowsze na górze)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transakcje
        </Typography>
        <Box>
          <TransactionForm />
          <Tooltip title="Filtruj">
            <IconButton color="primary" sx={{ ml: 2 }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Kategoria</TableCell>
                <TableCell align="right">Kwota</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Brak transakcji
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === transaction.category)?.name}
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatNumber(transaction.amount)} zł
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edytuj">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleEdit(transaction)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Usuń">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
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
