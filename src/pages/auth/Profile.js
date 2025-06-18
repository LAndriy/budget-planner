import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';

const Profile = () => {
  const [formData, setFormData] = useState({
    displayName: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
  });
  const [loading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Zaktualizowano profil:', formData);
    setEditing(false);
    // Tutaj będzie logika aktualizacji profilu
  };

  const userInitials = formData.displayName 
    ? formData.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                fontSize: '2.5rem',
                mb: 2 
              }}
            >
              {userInitials}
            </Avatar>
            <Typography component="h1" variant="h5">
              Mój profil
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="displayName"
              label="Imię i nazwisko"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adres email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 3 }}
            />
            
            {editing ? (
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Zapisz zmiany'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  sx={{ flex: 1 }}
                >
                  Anuluj
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={() => setEditing(true)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Edytuj profil
              </Button>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <Link to="/" style={{ textDecoration: 'none' }}>
                Powrót do strony głównej
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
