import React from 'react';
import { Typography, Box, Paper, Grid, Tabs, Tab } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Reports = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Raporty
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Przegląd miesięczny" />
          <Tab label="Wydatki według kategorii" />
          <Tab label="Trendy wydatków" />
        </Tabs>
        
        <TabPanel value={value} index={0}>
          <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Wykres miesięczny pojawi się tutaj</Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Wykres kategorii pojawi się tutaj</Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Wykres trendów pojawi się tutaj</Typography>
          </Box>
        </TabPanel>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Największe wydatki
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              Lista największych wydatków pojawi się tutaj
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Podsumowanie kategorii
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              Podsumowanie kategorii pojawi się tutaj
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
