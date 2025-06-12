import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Wysokość nagłówka
          width: { sm: `calc(100% - 240px)` },
          marginLeft: { sm: '240px' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
