import React, { useState } from 'react';
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
  IconButton,
  Chip,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { 
    categories = [], 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    loading, 
    fetchCategories 
  } = useAppContext();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    type: 'expense', // 'expense' or 'income'
    icon: 'category'
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = localStorage.getItem('userId');

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || '#1976d2',
        type: category.type || 'expense'
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
        type: 'expense'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      if (!formData.name) {
        throw new Error('Nazwa kategorii jest wymagana');
      }
      
      const categoryData = {
        ...formData,
        userId: userId
      };
      
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, categoryData);
        if (!result.success) {
          throw new Error(result.error || 'Nie udało się zaktualizować kategorii');
        }
      } else {
        const result = await addCategory(categoryData);
        if (!result.success) {
          throw new Error(result.error || 'Nie udało się dodać kategorii');
        }
      }
      
      // Refresh categories list
      await fetchCategories(userId);
      
      setOpenDialog(false);
      setFormData({ name: '', description: '', color: '#1976d2', type: 'expense', icon: 'category' });
      setEditingCategory(null);
    } catch (err) {
      console.error('Błąd podczas zapisywania kategorii:', err);
      setFormError(err.message || 'Wystąpił błąd podczas zapisywania kategorii');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę kategorię? Ta operacja jest nieodwracalna.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const result = await deleteCategory(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Nie udało się usunąć kategorii');
      }
      
      // Refresh categories list
      await fetchCategories(userId);
    } catch (err) {
      console.error('Błąd podczas usuwania kategorii:', err);
      setFormError(err.message || 'Wystąpił błąd podczas usuwania kategorii');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtruj kategorie według typu
  const expenseCategories = categories?.filter(cat => cat.type === 'expense') || [];
  const incomeCategories = categories?.filter(cat => cat.type === 'income') || [];

  if (loading && !categories) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const renderCategoryTable = (categoryList, type) => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {type === 'expense' ? 'Kategorie wydatków' : 'Kategorie przychodów'}
      </Typography>
      {categoryList.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>Opis</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryList.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Chip 
                        icon={<CategoryIcon />} 
                        label={category.name}
                        size="small"
                        sx={{ 
                          backgroundColor: category.color || 'primary.main',
                          color: 'white',
                          mr: 1
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(category)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(category.id)} 
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Brak kategorii {type === 'expense' ? 'wydatków' : 'przychodów'}. Dodaj nową kategorię.
          </Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">Kategorie</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj kategorię
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderCategoryTable(expenseCategories, 'expense')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderCategoryTable(incomeCategories, 'income')}
        </Grid>
      </Grid>

      {/* Dialog do dodawania/edycji kategorii */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCategory ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Nazwa kategorii"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Typ kategorii"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                select
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="expense">Wydatek</option>
                <option value="income">Przychód</option>
              </TextField>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Kolor kategorii:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2', '#0097a7'].map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: formData.color === color ? '3px solid #333' : 'none',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                  <TextField
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    sx={{ width: 48, height: 48, ml: 1 }}
                  />
                </Box>
              </Box>
              
              <TextField
                label="Opis (opcjonalnie)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCategory ? 'Zapisz zmiany' : 'Dodaj kategorię'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Categories;
