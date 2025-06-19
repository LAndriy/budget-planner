import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  Receipt as TransactionsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onClose, isMobile }) => {
  console.log('Sidebar render - mobileOpen:', mobileOpen, 'isMobile:', isMobile);
  const theme = useTheme();

  // Domyślne dane użytkownika
  const user = {
    displayName: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
  };

  const userInitials = user.displayName 
    ? user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  const menuItems = [
    { text: 'Pulpit', icon: <DashboardIcon />, path: '/' },
    { text: 'Transakcje', icon: <TransactionsIcon />, path: '/transakcje' },
    { text: 'Raporty', icon: <ReportsIcon />, path: '/raporty' },
    { text: 'Ustawienia', icon: <SettingsIcon />, path: '/ustawienia' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 2,
            bgcolor: 'secondary.main',
            fontSize: '1.5rem'
          }}
        >
          {userInitials}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          {user.displayName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            onClick={isMobile ? onClose : null}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/profil"
          onClick={isMobile ? onClose : null}
        >
          <ListItemIcon><ProfileIcon /></ListItemIcon>
          <ListItemText primary="Profil" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/logowanie"
          onClick={isMobile ? onClose : null}
        >
          <ListItemIcon><WalletIcon /></ListItemIcon>
          <ListItemText primary="Wyloguj się" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
      }}
      aria-label="menu boczne"
    >
      {/* Wersja mobilna */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Lepsza wydajność na urządzeniach mobilnych
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: drawerWidth,
            height: 'calc(100% - 64px)',
            top: '64px',
            left: '0',
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Wersja desktopowa */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: theme.shadows[3],
            position: 'fixed',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
