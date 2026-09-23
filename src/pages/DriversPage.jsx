import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import DataTable from '../components/common/DataTable';
import DriverForm from '../components/driver/DriverForm';
import { createDriver } from '../services/drivers.service';
import { PermissionGate } from '../components/rbac/PermissionGate';
import { ParentDisabledBanner } from '../components/vendor/ParentDisabledBanner';
import { StatusChip } from '../components/common/StatusChip';
import useVendorDescendants from '../hooks/useVendorDescendants';

export default function DriversPage({ vendorId = null }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const { currentVendorId } = state;
  const targetVendorId = vendorId || currentVendorId;
  const descendants = useVendorDescendants(targetVendorId, state.vendors);

  const drivers = useMemo(() => {
    const allowedVendorIds = [targetVendorId, ...descendants.map(v => v.id)];
    return state.drivers.filter(d => allowedVendorIds.includes(d.vendorId));
  }, [state.drivers, targetVendorId, descendants]);

  const columns = [
    { 
      id: 'name', 
      label: 'Name', 
      render: (row) => `${row.firstName} ${row.lastName}` 
    },
    { 
      id: 'licenseNumber', 
      label: 'License', 
      render: (row) => <Typography sx={{ fontFamily: 'monospace' }}>{row.licenseNumber}</Typography>
    },
    { 
      id: 'phone', 
      label: 'Phone'
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => <StatusChip status={row.status} size="small" />
    },
    {
      id: 'assignedVehicleId',
      label: 'Vehicle',
      render: (row) => {
        if (!row.assignedVehicleId) return <Typography color="text.secondary" variant="body2">Unassigned</Typography>;
        const v = state.vehicles.find(v => v.id === row.assignedVehicleId);
        return v ? <Typography sx={{ fontFamily: 'monospace' }}>{v.registrationNumber}</Typography> : 'Unknown';
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      disableSort: true,
      render: (row) => (
        <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/drivers/${row.id}`); }}>
          View
        </Button>
      )
    }
  ];

  const handleCreate = (data) => {
    try {
      const action = createDriver({ ...data, vendorId: targetVendorId }, state);
      dispatch(action);
      setIsCreating(false);
    } catch (err) {
      // Handled by local form state normally, but just in case
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <ParentDisabledBanner vendorId={targetVendorId} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Drivers</Typography>
        <PermissionGate action="drivers.write" targetVendorId={targetVendorId}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreating(true)}>
            Add Driver
          </Button>
        </PermissionGate>
      </Box>

      <DataTable 
        columns={columns} 
        data={drivers} 
        onRowClick={(row) => navigate(`/drivers/${row.id}`)} 
      />

      <Dialog open={isCreating} onClose={() => setIsCreating(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <DriverForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
