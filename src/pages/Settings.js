import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  const [currency, setCurrency] = React.useState('PLN');

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Ustawienia
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preferencje
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="currency-select-label">Domyślna waluta</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={currency}
                label="Domyślna waluta"
                onChange={handleCurrencyChange}
              >
                <MenuItem value="PLN">Złoty polski (PLN)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="USD">Dolar amerykański (USD)</MenuItem>
                <MenuItem value="GBP">Funt brytyjski (GBP)</MenuItem>
              </Select>
              <FormHelperText>Wybierz domyślną walutę dla transakcji</FormHelperText>
            </FormControl>
            
            <TextField
              fullWidth
              label="Domyślna kategoria wydatków"
              variant="outlined"
              sx={{ mb: 3 }}
              helperText="Kategoria domyślnie wybierana przy nowych wydatkach"
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Zapisz zmiany
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Eksport danych
            </Typography>
            <Button variant="outlined" sx={{ mr: 2 }}>
              Eksportuj dane do CSV
            </Button>
            <Button variant="outlined">
              Eksportuj dane do JSON
            </Button>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Import danych
              </Typography>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Importuj dane z pliku
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informacje o aplikacji
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Wersja:</strong> 1.0.0
          </Typography>
          <Typography variant="body1">
            <strong>Ostatnia aktualizacja:</strong> {new Date().toLocaleDateString()}
          </Typography>
        </Box>
        
        <Button variant="text" color="primary">
          Sprawdź aktualizacje
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings;
