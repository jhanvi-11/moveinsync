import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const DOC_TYPES = ['All', 'DL', 'RC', 'INSURANCE', 'PERMIT', 'FITNESS', 'OTHER'];
const STATUSES = ['All', 'expired', 'expiring_soon', 'valid'];

export default function DocumentSearchBar({ filters, onFilterChange, vendors, showVendorFilter = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <TextField
        select
        label="Document Type"
        name="type"
        value={filters.type || 'All'}
        onChange={handleChange}
        sx={{ minWidth: 150 }}
        size="small"
      >
        {DOC_TYPES.map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Expiry Status"
        name="status"
        value={filters.status || 'All'}
        onChange={handleChange}
        sx={{ minWidth: 150 }}
        size="small"
      >
        {STATUSES.map(status => (
          <MenuItem key={status} value={status}>
            {status === 'All' ? 'All Statuses' : status.replace('_', ' ')}
          </MenuItem>
        ))}
      </TextField>

      {showVendorFilter && (
        <TextField
          select
          label="Vendor"
          name="vendorId"
          value={filters.vendorId || 'All'}
          onChange={handleChange}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="All">All Vendors</MenuItem>
          {vendors.map(v => (
            <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
}
