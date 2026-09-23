import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TopBar } from './TopBar';
import { usePermission } from '../hooks/usePermission';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const NavItem = ({ to, label, icon, permission }) => {
  const { isAllowed } = usePermission(permission);
  if (permission && !isAllowed) return null;

  return (
    <ListItem disablePadding>
      <ListItemButton component={NavLink} to={to} style={({ isActive }) => ({ backgroundColor: isActive ? 'rgba(13, 148, 136, 0.08)' : 'transparent', borderLeft: isActive ? '3px solid rgb(13, 148, 136)' : '3px solid transparent' })}>
        <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

export const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <NavItem to="/" label="Dashboard" icon={<DashboardIcon />} />
        <NavItem to="/vendors" label="Vendors" icon={<BusinessIcon />} permission="vendors.read" />
        <NavItem to="/fleet" label="Fleet" icon={<DirectionsCarIcon />} permission="fleet.read" />
        <NavItem to="/drivers" label="Drivers" icon={<PersonIcon />} permission="drivers.read" />
        <NavItem to="/documents" label="Documents" icon={<DescriptionIcon />} permission="documents.read" />
        <NavItem to="/delegations" label="Delegations" icon={<GavelIcon />} permission="delegations.manage" />
        <NavItem to="/reports" label="Reports" icon={<AssessmentIcon />} permission="reports.read" />
        <NavItem to="/settings" label="Settings" icon={<SettingsIcon />} />
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <a href="#main-content" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Skip to main content</a>
      <TopBar onMenuClick={handleDrawerToggle} />
      
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" id="main-content" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
