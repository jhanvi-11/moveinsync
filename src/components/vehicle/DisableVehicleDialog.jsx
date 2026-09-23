import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import BlockIcon from '@mui/icons-material/Block';
import Tooltip from '@mui/material/Tooltip';
import { useApp } from '../../state/AppContext';
import { disableVehicle } from '../../services/vehicles.service';
import { PermissionGate } from '../rbac/PermissionGate';

export default function DisableVehicleDialog({ vehicle }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { state, dispatch } = useApp();
  const { enqueueSnackbar } = useSnackbar();

  const handleDisable = () => {
    try {
      const updated = disableVehicle(vehicle.id, reason, state);
      dispatch({ type: 'DISABLE_VEHICLE', payload: { id: vehicle.id, reason } });
      setOpen(false);
      enqueueSnackbar(`Vehicle ${vehicle.registrationNumber} disabled`, { variant: 'warning' });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <PermissionGate action="fleet.write" targetId={vehicle.vendorId}>
        <Tooltip title="Disable Vehicle">
          <IconButton 
            color="error" 
            aria-label="disable vehicle" 
            onClick={() => setOpen(true)}
            disabled={vehicle.status === 'disabled'}
          >
            <BlockIcon />
          </IconButton>
        </Tooltip>
      </PermissionGate>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Disable Vehicle {vehicle.registrationNumber}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for disabling"
            type="text"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDisable} color="error" variant="contained">
            Disable
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}