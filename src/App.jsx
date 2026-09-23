import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box 
        sx={{ 
          p: 6, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 3,
          textAlign: 'center',
          borderTop: '8px solid',
          borderTopColor: 'primary.main',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom color="primary.main">
          MoveInSync Vendor Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the multi-level vendor management system.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
