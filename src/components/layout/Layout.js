import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, onMenuClick, mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(!isMobile);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar 
        open={isMobile ? mobileOpen : open} 
        onClose={handleDrawerToggle} 
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? 240 : 0}px)` },
          ml: { sm: `${open ? 240 : 0}px` },
          mt: '64px', // Wysokość AppBar
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
