import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBudget } from '../../context/BudgetContext';
import { formatNumber, formatDate } from '../../utils/format';

const TransactionEdit = ({ transaction, onClose }) => {
  const { categories, updateTransaction } = useBudget();
  const [formData, setFormData] = useState({
    title: transaction.title,
    amount: formatNumber(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: transaction.date
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, amount, type, category, date } = formData;
    
    if (!title || !amount || !category) {
      alert('Wszystkie pola są wymagane!');
      return;
    }

    updateTransaction(transaction.id, {
      title,
      amount: parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.')),
      type,
      category: parseInt(category),
      date
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edytuj transakcję</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Nazwa"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Kwota"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            margin="normal"
            required
            type="number"
            inputProps={{
              step: 0.01,
              min: 0
            }}
            InputProps={{
              endAdornment: ' zł'
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Typ</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Typ"
            >
              <MenuItem value="income">Przychód</MenuItem>
              <MenuItem value="expense">Wydatek</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kategoria</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Kategoria"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Data"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Anuluj
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionEdit;
