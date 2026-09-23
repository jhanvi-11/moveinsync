import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RoleSwitcher } from '../components/rbac/RoleSwitcher';
import { useApp } from '../state/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function LoginPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Box sx={{ p: 6, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Mock Login</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select a vendor role to log in as.
        </Typography>
        <RoleSwitcher />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 3 }} 
          disabled={!state?.currentVendorId}
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
