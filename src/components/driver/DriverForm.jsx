import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { getDocumentStatus } from '../../services/documents.service';

export default function DriverForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    licenseNumber: initialData?.licenseNumber || '',
    licenseExpiry: initialData?.licenseExpiry || '',
    dateOfBirth: initialData?.dateOfBirth || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const licenseStatus = getDocumentStatus(formData.licenseExpiry);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth />
        <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth />
      </Box>
      <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
      <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
      
      <TextField 
        label="License Number" 
        name="licenseNumber" 
        value={formData.licenseNumber} 
        onChange={handleChange} 
        required 
        helperText="Format: KA0120230000000"
      />
      <TextField 
        label="License Expiry" 
        name="licenseExpiry" 
        type="date" 
        value={formData.licenseExpiry} 
        onChange={handleChange} 
        required 
        InputLabelProps={{ shrink: true }}
      />

      {formData.licenseExpiry && licenseStatus === 'expired' && (
        <Alert severity="error">License has expired.</Alert>
      )}
      {formData.licenseExpiry && licenseStatus === 'expiring_soon' && (
        <Alert severity="warning">License is expiring soon.</Alert>
      )}

      <TextField 
        label="Date of Birth" 
        name="dateOfBirth" 
        type="date" 
        value={formData.dateOfBirth} 
        onChange={handleChange} 
        required 
        InputLabelProps={{ shrink: true }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
}
