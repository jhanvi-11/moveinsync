import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControlLabel, Checkbox, 
  FormGroup, Typography, Select, MenuItem, InputLabel, FormControl, Alert, Box 
} from '@mui/material';
import { useApp } from '../../state/AppContext';
import { useVendorDescendants } from '../../hooks/useVendorDescendants';
import { grantDelegation } from '../../services/delegations.service';

export default function DelegationDialog({ open, onClose }) {
  const { state, dispatch } = useApp();
  const { enqueueSnackbar } = useSnackbar();
  const descendants = useVendorDescendants(state.currentVendorId);
  const [toVendorId, setToVendorId] = useState('');
  const [permissions, setPermissions] = useState({
    fleetOnboarding: false,
    driverOnboarding: false,
    payments: false,
    reports: false,
    overrideActions: false
  });
  const [scope, setScope] = useState('all');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handlePermissionChange = (e) => {
    setPermissions(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const handleSave = () => {
    setError(null);
    if (!toVendorId) {
      setError('Please select a target vendor');
      return;
    }

    const res = grantDelegation(state.currentVendorId, toVendorId, permissions, scope, notes, state);
    if (res.success) {
      res.actions.forEach(dispatch);
      setToVendorId('');
      setPermissions({ fleetOnboarding: false, driverOnboarding: false, payments: false, reports: false, overrideActions: false });
      setScope('all');
      setNotes('');
      onClose();
      enqueueSnackbar('Delegation granted successfully', { variant: 'success' });
    } else {
      setError(res.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Delegation</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        
        <FormControl fullWidth size="small">
          <InputLabel>Target Vendor</InputLabel>
          <Select
            label="Target Vendor"
            value={toVendorId}
            onChange={(e) => setToVendorId(e.target.value)}
          >
            {descendants.map(v => (
              <MenuItem key={v.id} value={v.id}>{v.name} ({v.level})</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle2" gutterBottom>Permissions</Typography>
          <FormGroup row>
            <FormControlLabel control={<Checkbox name="fleetOnboarding" checked={permissions.fleetOnboarding} onChange={handlePermissionChange} />} label="Fleet Onboarding" />
            <FormControlLabel control={<Checkbox name="driverOnboarding" checked={permissions.driverOnboarding} onChange={handlePermissionChange} />} label="Driver Onboarding" />
            <FormControlLabel control={<Checkbox name="payments" checked={permissions.payments} onChange={handlePermissionChange} />} label="Payments" />
            <FormControlLabel control={<Checkbox name="reports" checked={permissions.reports} onChange={handlePermissionChange} />} label="Reports" />
            <FormControlLabel control={<Checkbox name="overrideActions" checked={permissions.overrideActions} onChange={handlePermissionChange} />} label="Override Actions" />
          </FormGroup>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Scope</InputLabel>
          <Select
            label="Scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <MenuItem value="all">Apply to all sub-vendors</MenuItem>
            <MenuItem value="onlyDescendants">Only target vendor descendants</MenuItem>
            <MenuItem value="targetOnly">Target vendor only</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          fullWidth
          size="small"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Grant Delegation</Button>
      </DialogActions>
    </Dialog>
  );
}
