import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAppContext } from '../../context/AppContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Profile = () => {
  const { user, updateUser, fetchUserById, logout } = useAppContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    login: '',
    age: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const response = await fetchUserById(user.id);
          if (response.success && response.data) {
            const { name, surname, login, age } = response.data;
            setFormData(prev => ({
              ...prev,
              name: name || '',
              surname: surname || '',
              login: login || '',
              age: age?.toString() || ''
            }));
          }
        }
      } catch (error) {
        console.error('Błąd podczas ładowania danych użytkownika:', error);
        enqueueSnackbar('Nie udało się załadować danych profilu', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id, fetchUserById, enqueueSnackbar]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Imię jest wymagane';
    }
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Nazwisko jest wymagane';
    }
    
    if (!formData.login.trim()) {
      newErrors.login = 'Login jest wymagany';
    }
    
    if (formData.age && isNaN(formData.age)) {
      newErrors.age = 'Wiek musi być liczbą';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Aktualne hasło jest wymagane';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nowe hasło jest wymagane';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Hasło musi mieć co najmniej 6 znaków';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      setLoading(true);
      const userData = {
        id: user.id,
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        login: formData.login.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        roleId: user.roleId || 2 // Default to regular user role if not set
      };
      
      const response = await updateUser(userData);
      
      if (response.success) {
        enqueueSnackbar('Profil został zaktualizowany', { variant: 'success' });
        setEditing(false);
      } else {
        throw new Error(response.error || 'Nie udało się zaktualizować profilu');
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu:', error);
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas aktualizacji profilu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enqueueSnackbar('Hasło zostało zmienione', { variant: 'success' });
      setPasswordDialogOpen(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Błąd podczas zmiany hasła:', error);
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas zmiany hasła', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        surname: user.surname || '',
        login: user.login || '',
        age: user.age?.toString() || ''
      }));
    }
    setEditing(false);
    setErrors({});
  };

  const userInitials = formData.name && formData.surname 
    ? `${formData.name[0]}${formData.surname[0]}`.toUpperCase()
    : 'U';

  if (loading && !editing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
                mb: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }}
            >
              {userInitials}
            </Avatar>
            <Typography component="h1" variant="h5">
              Mój profil
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.roleId === 1 ? 'Administrator' : 'Użytkownik'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Imię"
                name="name"
                autoComplete="given-name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing || loading}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ flex: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="surname"
                label="Nazwisko"
                name="surname"
                autoComplete="family-name"
                value={formData.surname}
                onChange={handleChange}
                disabled={!editing || loading}
                error={!!errors.surname}
                helperText={errors.surname}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Nazwa użytkownika"
              name="login"
              autoComplete="username"
              value={formData.login}
              onChange={handleChange}
              disabled={!editing || loading}
              error={!!errors.login}
              helperText={errors.login}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="age"
              label="Wiek"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              disabled={!editing || loading}
              error={!!errors.age}
              helperText={errors.age}
              inputProps={{ min: 1, max: 120 }}
              sx={{ mt: 2 }}
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
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Anuluj
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => setEditing(true)}
                  fullWidth
                >
                  Edytuj profil
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setPasswordDialogOpen(true)}
                  fullWidth
                >
                  Zmień hasło
                </Button>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Konto utworzono: {new Date(user?.createdAt).toLocaleDateString('pl-PL')}
            </Typography>
            <Button 
              color="error" 
              variant="text"
              onClick={() => {
                if (window.confirm('Czy na pewno chcesz się wylogować?')) {
                  logout();
                  navigate('/login');
                }
              }}
            >
              Wyloguj się
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => !loading && setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handlePasswordSubmit}>
          <DialogTitle>Zmień hasło</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.currentPassword}>
              <InputLabel htmlFor="currentPassword">Aktualne hasło</InputLabel>
              <OutlinedInput
                id="currentPassword"
                name="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
                label="Aktualne hasło"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.currentPassword && (
                <FormHelperText>{errors.currentPassword}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.newPassword}>
              <InputLabel htmlFor="newPassword">Nowe hasło</InputLabel>
              <OutlinedInput
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                label="Nowe hasło"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.newPassword && (
                <FormHelperText>{errors.newPassword}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.confirmPassword}>
              <InputLabel htmlFor="confirmPassword">Potwierdź nowe hasło</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                label="Potwierdź nowe hasło"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirmPassword && (
                <FormHelperText>{errors.confirmPassword}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setPasswordDialogOpen(false)}
              disabled={loading}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Zapisz nowe hasło'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile;
