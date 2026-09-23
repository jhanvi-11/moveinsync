import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { validateDocument } from '../../utils/validation';
import { useApp } from '../../state/AppContext';
import { uploadDocument } from '../../services/documents.service';

const DOC_TYPES = ['DL', 'RC', 'INSURANCE', 'PERMIT', 'FITNESS', 'OTHER'];

export default function DocumentUploadDialog({ open, onClose, driverId, vehicleId }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    type: 'DL',
    number: '',
    issuingAuthority: '',
    issuedDate: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (errors[name]) {
        setErrors(errs => ({ ...errs, [name]: null }));
      }
      return next;
    });
  };

  const handleUpload = () => {
    const validationErrors = validateDocument(formData, state.documents);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        driverId,
        vehicleId,
        vendorId: state.currentVendorId
      };
      
      const actions = uploadDocument(payload, state);
      actions.forEach(action => dispatch(action));
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

          <TextField
            select
            name="type"
            label="Document Type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.type}
            helperText={errors.type}
          >
            {DOC_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>

          <TextField
            name="number"
            label="Document Number"
            value={formData.number}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.number}
            helperText={errors.number}
            inputProps={{ 'aria-label': 'Document Number' }}
          />

          <TextField
            name="issuingAuthority"
            label="Issuing Authority"
            value={formData.issuingAuthority}
            onChange={handleChange}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="issuedDate"
              label="Issue Date"
              type="date"
              value={formData.issuedDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="expiryDate"
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              fullWidth
              required={formData.type !== 'RC'}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} variant="contained" color="primary">Upload</Button>
      </DialogActions>
    </Dialog>
  );
}
