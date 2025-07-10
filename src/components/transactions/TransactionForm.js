import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
  FormHelperText,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pl } from 'date-fns/locale';
import { useAppContext } from '../../context/AppContext';
import { formatNumber, formatCurrency } from '../../utils/format';

const TransactionForm = ({ triggerButton = {} }) => {
  const { categories = [], accounts = [], addTransaction } = useAppContext();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    accountId: accounts[0]?.id || '',
    date: new Date(),
    notes: ''
  });

  // Filtruj kategorie w zależności od typu transakcji
  const filteredCategories = categories.filter(cat => 
    formData.type === 'income' ? cat.type === 'income' : cat.type === 'expense'
  );

  // Resetuj kategorię przy zmianie typu transakcji
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      categoryId: filteredCategories[0]?.id || ''
    }));
  }, [formData.type, categories]);

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      categoryId: '',
      accountId: accounts[0]?.id || '',
      date: new Date(),
      notes: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Opis jest wymagany';
    if (!formData.amount) newErrors.amount = 'Kwota jest wymagana';
    if (!formData.categoryId) newErrors.categoryId = 'Kategoria jest wymagana';
    if (!formData.accountId) newErrors.accountId = 'Konto jest wymagane';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Wyczyść błąd po poprawieniu pola
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount.replace(/[^\d.,-]/g, '').replace(',', '.')),
        type: formData.type,
        categoryId: formData.categoryId,
        accountId: formData.accountId,
        date: formData.date.toISOString(),
        notes: formData.notes
      };
      
      await addTransaction(transactionData);
      handleClose();
    } catch (error) {
      console.error('Błąd podczas dodawania transakcji:', error);
      alert('Wystąpił błąd podczas dodawania transakcji. Spróbuj ponownie.');
    }
  };

  return (
    <>
      <Button 
        variant={triggerButton.variant || "contained"} 
        color="primary" 
        startIcon={triggerButton.startIcon || <AddIcon />}
        onClick={handleOpen}
        size={triggerButton.size || "medium"}
        fullWidth={triggerButton.fullWidth}
        sx={triggerButton.sx}
      >
        {triggerButton.label || 'Dodaj transakcję'}
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 1.5,
          position: 'relative'
        }}>
          <Box display="flex" alignItems="center">
            {formData.type === 'income' ? (
              <IncomeIcon sx={{ mr: 1 }} />
            ) : (
              <ExpenseIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="h6" component="div">
              {formData.type === 'income' ? 'Nowy przychód' : 'Nowy wydatek'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small" 
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'primary.contrastText'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Typ transakcji */}
              <Grid item xs={12}>
                <Box display="flex" mb={2}>
                  <Button
                    fullWidth
                    variant={formData.type === 'expense' ? 'contained' : 'outlined'}
                    color={formData.type === 'expense' ? 'error' : 'inherit'}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    startIcon={<ExpenseIcon />}
                    sx={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: formData.type === 'expense' ? 'bold' : 'normal'
                    }}
                  >
                    Wydatek
                  </Button>
                  <Button
                    fullWidth
                    variant={formData.type === 'income' ? 'contained' : 'outlined'}
                    color={formData.type === 'income' ? 'success' : 'inherit'}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    startIcon={<IncomeIcon />}
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: formData.type === 'income' ? 'bold' : 'normal'
                    }}
                  >
                    Przychód
                  </Button>
                </Box>
              </Grid>
              
              {/* Kwota */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kwota"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography color="text.secondary">PLN</Typography>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    step: '0.01',
                    min: '0.01',
                    pattern: '^\d*[.,]?\d*$'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      '& input': {
                        textAlign: 'right'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Data */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
                  <DatePicker
                    label="Data transakcji"
                    value={formData.date}
                    onChange={(newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        date: newValue
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required 
                      />
                    )}
                    inputFormat="dd.MM.yyyy"
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Opis */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Opis"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  placeholder="np. Zakupy spożywcze, Wynagrodzenie"
                />
              </Grid>
              
              {/* Kategoria */}
              <Grid item xs={12}>
                <FormControl 
                  fullWidth 
                  required 
                  error={!!errors.categoryId}
                >
                  <InputLabel>Kategoria</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    label="Kategoria"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Wybierz kategorię
                    </MenuItem>
                    {filteredCategories.map(category => (
                      <MenuItem 
                        key={category.id} 
                        value={category.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%',
                            bgcolor: category.color || 'primary.main'
                          }} 
                        />
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Konto */}
              <Grid item xs={12}>
                <FormControl 
                  fullWidth 
                  required 
                  error={!!errors.accountId}
                >
                  <InputLabel>Konto</InputLabel>
                  <Select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    label="Konto"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Wybierz konto
                    </MenuItem>
                    {accounts.map(account => (
                      <MenuItem 
                        key={account.id} 
                        value={account.id}
                      >
                        {account.name} ({formatCurrency(account.balance)})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.accountId && (
                    <FormHelperText>{errors.accountId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Notatki */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notatki (opcjonalnie)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Dodaj dodatkowe informacje..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleClose} 
              color="inherit"
              size={triggerButton.size || "medium"}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color={formData.type === 'income' ? 'success' : 'primary'}
              size={triggerButton.size || "medium"}
              startIcon={<AddIcon />}
              sx={{
                minWidth: 180,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              {formData.type === 'income' ? 'Dodaj przychód' : 'Dodaj wydatek'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TransactionForm;
