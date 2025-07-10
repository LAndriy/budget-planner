import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();

  // Show loading state while data is being loaded
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // This should not happen as ProtectedRoute handles this
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Wystąpił błąd autoryzacji. Proszę zalogować się ponownie.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Witaj, {user.name || 'Użytkowniku'}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          To jest Twój panel główny
        </Typography>
      </Box>

      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom>
          Podsumowanie
        </Typography>
        <Typography paragraph>
          Tutaj będą wyświetlane podstawowe informacje o Twoich finansach.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/transakcje')}
          sx={{ mr: 2 }}
        >
          Przejdź do transakcji
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => navigate('/konta')}
        >
          Moje konta
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;