import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Alert
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { register } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Walidacja haseł
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }
    
    if (!termsAccepted) {
      setError('Musisz zaakceptować regulamin');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await register({
        username: formData.email, // Using email as username
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      if (result.success) {
        navigate('/');
      } else {
        // Handle validation errors if present
        if (result.validationErrors) {
          const errorMessages = Object.values(result.validationErrors).flat();
          setError(errorMessages.join('\n'));
        } else {
          setError(result.error || 'Wystąpił błąd podczas rejestracji');
        }
      }
    } catch (err) {
      setError('Wystąpił błąd podczas łączenia z serwerem');
      console.error('Błąd rejestracji:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Załóż konto
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="Imię"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Nazwisko"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adres email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Hasło"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              helperText="Minimum 6 znaków"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Powtórz hasło"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  value="terms" 
                  color="primary"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label={
                <span>
                  Akceptuję <Link to="/regulamin" style={{ textDecoration: 'none' }}>regulamin</Link> serwisu
                </span>
              }
              sx={{ mt: 2, display: 'block' }}
            />
            
            {loading && <LinearProgress sx={{ my: 2 }} />}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !termsAccepted}
              sx={{ mt: 3, mb: 2 }}
            >
              Zarejestruj się
            </Button>
            
            <Box textAlign="center">
              <Link to="/logowanie" style={{ textDecoration: 'none' }}>
                <Button variant="text">
                  Masz już konto? Zaloguj się
                </Button>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;