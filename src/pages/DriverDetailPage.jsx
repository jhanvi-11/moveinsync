import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useApp } from '../state/AppContext';
import DriverCard from '../components/driver/DriverCard';
import DriverForm from '../components/driver/DriverForm';
import DocumentList from '../components/driver/DocumentList';
import AssignVehicleDialog from '../components/driver/AssignVehicleDialog';
import { updateDriver } from '../services/drivers.service';
import { PermissionGate } from '../components/rbac/PermissionGate';
import { ParentDisabledBanner } from '../components/vendor/ParentDisabledBanner';

export default function DriverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const driver = state.drivers.find(d => d.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!driver) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Driver not found</Typography>
        <Button onClick={() => navigate('/drivers')} sx={{ mt: 2 }}>Back to Drivers</Button>
      </Box>
    );
  }

  // Vehicles belonging to the driver's vendor
  const availableVehicles = state.vehicles.filter(v => v.vendorId === driver.vendorId);

  const handleUpdate = (data) => {
    try {
      const action = updateDriver({ ...driver, ...data }, state);
      dispatch(action);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <ParentDisabledBanner vendorId={driver.vendorId} />

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/drivers')}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          Driver Profile
        </Typography>
        <PermissionGate action="drivers.write" targetVendorId={driver.vendorId}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
            Edit Driver
          </Button>
        </PermissionGate>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DriverCard driver={driver} />
            
            {/* Vehicle Assignment Section */}
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>Assigned Vehicle</Typography>
              {driver.assignedVehicleId ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <DirectionsCarIcon color="primary" />
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', flex: 1 }}>
                    {state.vehicles.find(v => v.id === driver.assignedVehicleId)?.registrationNumber || 'Unknown Vehicle'}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 2 }}>No vehicle assigned</Typography>
              )}
              <PermissionGate action="drivers.write" targetVendorId={driver.vendorId}>
                <Button variant="outlined" onClick={() => setIsAssigning(true)} fullWidth>
                  {driver.assignedVehicleId ? 'Change Assignment' : 'Assign Vehicle'}
                </Button>
              </PermissionGate>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <DocumentList driverId={driver.id} />
        </Grid>
      </Grid>

      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <DriverForm initialData={driver} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
          </Box>
        </DialogContent>
      </Dialog>

      <AssignVehicleDialog 
        driver={driver} 
        vehicles={availableVehicles} 
        open={isAssigning} 
        onClose={() => setIsAssigning(false)} 
      />
    </Box>
  );
}
