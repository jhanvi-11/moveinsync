import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useApp } from '../../state/AppContext';
import { assignVehicle } from '../../services/drivers.service';
import { PermissionGate } from '../rbac/PermissionGate';

export default function AssignVehicleDialog({ driver, vehicles, open, onClose }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { dispatch } = useApp();

  // If driver already has an assigned vehicle, default to it
  React.useEffect(() => {
    if (open) {
      if (driver?.assignedVehicleId) {
        const v = vehicles.find(v => v.id === driver.assignedVehicleId);
        setSelectedVehicle(v || null);
      } else {
        setSelectedVehicle(null);
      }
    }
  }, [open, driver, vehicles]);

  const handleAssign = () => {
    if (!selectedVehicle) return;
    dispatch(assignVehicle(driver.id, selectedVehicle.id));
    onClose();
  };

  const handleUnassign = () => {
    dispatch(assignVehicle(driver.id, null));
    onClose();
  };

  // Check if selected vehicle is already assigned to someone else
  const isReassigning = selectedVehicle && selectedVehicle.assignedDriverId && selectedVehicle.assignedDriverId !== driver.id;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Vehicle to {driver?.firstName} {driver?.lastName}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={vehicles}
            getOptionLabel={(option) => `${option.registrationNumber} (${option.model})`}
            value={selectedVehicle}
            onChange={(e, newValue) => setSelectedVehicle(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Vehicle" />}
          />

          {isReassigning && (
            <Alert severity="warning">
              This vehicle is currently assigned to another driver. Proceeding will reassign it to {driver?.firstName} and remove the previous assignment.
            </Alert>
          )}

          {!selectedVehicle && driver?.assignedVehicleId && (
            <Typography variant="body2" color="text.secondary">
              Selecting no vehicle will not clear assignment automatically unless you click "Unassign".
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {driver?.assignedVehicleId && (
          <Button onClick={handleUnassign} color="error" sx={{ mr: 'auto' }}>
            Unassign
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <PermissionGate action="drivers.write" targetVendorId={driver?.vendorId} fallback={<Button disabled>Assign</Button>}>
          <Button 
            onClick={handleAssign} 
            variant="contained" 
            disabled={!selectedVehicle || selectedVehicle.id === driver?.assignedVehicleId}
          >
            {isReassigning ? 'Reassign' : 'Assign'}
          </Button>
        </PermissionGate>
      </DialogActions>
    </Dialog>
  );
}
