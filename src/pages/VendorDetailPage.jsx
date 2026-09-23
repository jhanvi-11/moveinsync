import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { useApp } from '../state/AppContext';
import { ParentDisabledBanner } from '../components/vendor/ParentDisabledBanner';
import { updateVendor } from '../services/vendors.service';
import { usePermission } from '../hooks/usePermission';
import { isWriteAllowed } from '../utils/cascade';
import FleetPage from './FleetPage';
import DriversPage from './DriversPage';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function VendorDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState(0);

  const vendor = state.vendors.find(v => v.id === id);
  const { isAllowed: canManage } = usePermission('vendors.manage', id);
  const writeAllowed = isWriteAllowed(id, state.currentVendorId, state.vendors, false);

  if (!vendor) return <Typography>Vendor not found</Typography>;

  const handleToggleStatus = () => {
    try {
      const newStatus = vendor.status === 'active' ? 'disabled' : 'active';
      const updated = updateVendor(id, { status: newStatus }, state);
      dispatch({ type: 'UPDATE_VENDOR', payload: updated });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Box>
      <ParentDisabledBanner vendorId={id} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">{vendor.name}</Typography>
          <Typography color="text.secondary">Code: {vendor.code} | Level: {vendor.level}</Typography>
        </Box>
        {canManage && writeAllowed && (
          <Button 
            variant={vendor.status === 'active' ? 'outlined' : 'contained'} 
            color={vendor.status === 'active' ? 'error' : 'success'}
            onClick={handleToggleStatus}
          >
            {vendor.status === 'active' ? 'Disable Vendor' : 'Enable Vendor'}
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Overview" />
          <Tab label="Fleet" />
          <Tab label="Drivers" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <Typography>Overview content for {vendor.name}</Typography>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <FleetPage vendorId={id} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <DriversPage vendorId={id} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Typography>Documents Placeholder</Typography>
      </TabPanel>
    </Box>
  );
}
