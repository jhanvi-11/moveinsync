import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useApp } from '../state/AppContext';
import DataTable from '../components/common/DataTable';
import VehicleForm from '../components/vehicle/VehicleForm';
import DisableVehicleDialog from '../components/vehicle/DisableVehicleDialog';
import { PermissionGate } from '../components/rbac/PermissionGate';
import { ParentDisabledBanner } from '../components/vendor/ParentDisabledBanner';
import Chip from '@mui/material/Chip';

export default function FleetPage() {
  const { state } = useApp();
  const [formOpen, setFormOpen] = useState(false);

  const columns = [
    { id: 'registrationNumber', label: 'Registration' },
    { id: 'manufacturer', label: 'Make' },
    { id: 'model', label: 'Model' },
    { id: 'yearOfMake', label: 'Year', numeric: true },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip 
        label={row.status} 
        size="small" 
        color={row.status === 'active' ? 'success' : row.status === 'disabled' ? 'error' : 'warning'} 
      />
    )},
    { id: 'actions', label: 'Actions', sortable: false, render: (row) => (
      <Box>
        <DisableVehicleDialog vehicle={row} />
      </Box>
    )}
  ];

  return (
    <Box sx={{ p: 4 }}>
      <ParentDisabledBanner vendorId={state.currentVendorId} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Fleet Management</Typography>
        <PermissionGate action="fleet.write" targetId={state.currentVendorId}>
          <Button variant="contained" onClick={() => setFormOpen(true)}>
            Add Vehicle
          </Button>
        </PermissionGate>
      </Box>

      <DataTable 
        columns={columns} 
        data={state.vehicles} 
        searchPlaceholder="Search by registration, make, model..." 
      />

      {formOpen && <VehicleForm open={formOpen} onClose={() => setFormOpen(false)} />}
    </Box>
  );
}