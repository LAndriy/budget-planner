import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const Accounts = () => {
  const { 
    accounts, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    loading, 
    error 
  } = useAppContext();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    currency: 'PLN',
    description: ''
  });
  const [editingAccount, setEditingAccount] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        balance: account.balance,
        currency: account.currency,
        description: account.description || ''
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: '',
        balance: '',
        currency: 'PLN',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        // Aktualizacja istniejącego konta
        const result = await updateAccount(editingAccount.id, formData);
        if (!result.success) {
          console.error('Błąd podczas aktualizacji konta:', result.error);
          return;
        }
      } else {
        // Dodanie nowego konta
        const result = await addAccount(formData);
        if (!result.success) {
          console.error('Błąd podczas dodawania konta:', result.error);
          return;
        }
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Błąd podczas zapisywania konta:', err);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć to konto? Ta operacja jest nieodwracalna.')) {
      try {
        setIsDeleting(true);
        const result = await deleteAccount(id);
        if (!result.success) {
          console.error('Błąd podczas usuwania konta:', result.error);
          alert(`Nie udało się usunąć konta: ${result.error}`);
        }
      } catch (err) {
        console.error('Błąd podczas usuwania konta:', err);
        alert('Wystąpił nieoczekiwany błąd podczas usuwania konta');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading && !accounts) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">Moje konta</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj konto
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa konta</TableCell>
                <TableCell align="right">Saldo</TableCell>
                <TableCell>Waluta</TableCell>
                <TableCell>Opis</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts?.length > 0 ? (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: account.currency || 'PLN'
                      }).format(account.balance || 0)}
                    </TableCell>
                    <TableCell>{account.currency || 'PLN'}</TableCell>
                    <TableCell>{account.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(account)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteAccount(account.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Brak kont. Dodaj swoje pierwsze konto.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog do dodawania/edycji konta */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAccount ? 'Edytuj konto' : 'Dodaj nowe konto'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Nazwa konta"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Saldo początkowe"
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                inputProps={{ step: '0.01', min: '0' }}
              />
              <TextField
                label="Waluta"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
                select
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="PLN">PLN - Złoty polski</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dolar amerykański</option>
                <option value="GBP">GBP - Funt brytyjski</option>
              </TextField>
              <TextField
                label="Opis (opcjonalnie)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingAccount ? 'Zapisz zmiany' : 'Dodaj konto'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default Accounts;
