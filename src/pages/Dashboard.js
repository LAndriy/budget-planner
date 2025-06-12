import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
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
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Podsumowanie
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Saldo */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Saldo
            </Typography>
            <Typography variant="h4" color="primary">
              5 249,50 zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Przychody */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Przychody (miesiąc)
            </Typography>
            <Typography variant="h4" style={{ color: '#2e7d32' }}>
              +3 200,00 zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Wydatki */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Wydatki (miesiąc)
            </Typography>
            <Typography variant="h4" color="error">
              -1 950,50 zł
            </Typography>
          </Item>
        </Grid>
        
        {/* Ostatnie transakcje */}
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Ostatnie transakcje
            </Typography>
            <Box sx={{ textAlign: 'left', mt: 2 }}>
              <Typography>Brak ostatnich transakcji</Typography>
            </Box>
          </Item>
        </Grid>
        
        {/* Wykres kategorii */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Wydatki według kategorii
            </Typography>
            <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Wykres pojawi się tutaj</Typography>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
