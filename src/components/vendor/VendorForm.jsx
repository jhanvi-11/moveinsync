import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { VENDOR_LEVELS } from '../../utils/constants';

export const VendorForm = ({ vendors, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    parentId: initialData?.parentId || '',
    level: initialData?.level || ''
  });

  const parentOptions = vendors.filter(v => VENDOR_LEVELS.indexOf(v.level) < VENDOR_LEVELS.length - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'parentId') {
        const parent = vendors.find(v => v.id === value);
        if (parent) {
          const parentIndex = VENDOR_LEVELS.indexOf(parent.level);
          next.level = VENDOR_LEVELS[parentIndex + 1];
        }
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
      <TextField label="Code" name="code" value={formData.code} onChange={handleChange} required />
      
      {!initialData && (
        <TextField 
          select 
          label="Parent" 
          name="parentId" 
          value={formData.parentId} 
          onChange={handleChange} 
          required 
        >
          {parentOptions.map(v => (
            <MenuItem key={v.id} value={v.id}>
              {v.name} ({v.level})
            </MenuItem>
          ))}
        </TextField>
      )}

      <TextField label="Level" name="level" value={formData.level} InputProps={{ readOnly: true }} inputProps={{ readOnly: true }} />
      <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
      <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};
