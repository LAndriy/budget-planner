import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Transactions = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transakcje
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
        >
          Dodaj transakcję
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          Lista transakcji pojawi się tutaj
        </Typography>
      </Paper>
    </Box>
  );
};

export default Transactions;
