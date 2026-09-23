import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { RoleSwitcher } from '../components/rbac/RoleSwitcher';
import Box from '@mui/material/Box';

export const TopBar = ({ onMenuClick }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'primary.main' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src="/logo.svg" alt="" style={{ height: 32, marginRight: 16 }} />
          <Typography variant="h6" noWrap component="div">
            MoveInSync Vendor Hub
          </Typography>
        </Box>
        <RoleSwitcher />
      </Toolbar>
    </AppBar>
  );
};
