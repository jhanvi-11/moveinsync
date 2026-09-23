const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. DataTable.test.jsx
const dataTableTestCode = `
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTable from './DataTable';
import { PAGE_SIZE } from '../../utils/constants';

describe('DataTable', () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age', numeric: true }
  ];
  const data = Array.from({ length: 30 }, (_, i) => ({ id: i, name: \`Person \${i}\`, age: 20 + i }));

  it('renders correctly and paginates', () => {
    render(<DataTable columns={columns} data={data} />);
    
    // First page should show PAGE_SIZE items
    expect(screen.getByText('Person 0')).toBeInTheDocument();
    expect(screen.queryByText(\`Person \${PAGE_SIZE}\`)).not.toBeInTheDocument();

    // Click next page
    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(\`Person \${PAGE_SIZE}\`)).toBeInTheDocument();
  });

  it('sorts columns when header clicked', () => {
    render(<DataTable columns={columns} data={data} />);
    
    // Initially ascending by first column, so Person 0 is first.
    // Let's click the Name header to sort descending.
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader); // Click once to sort desc

    // Wait, the data sorting might have different string comparisons. Person 9 vs Person 29
    // Let's sort by age instead
    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader); // Click age (asc)
    fireEvent.click(ageHeader); // Click age again (desc)

    // Age is descending now, so the highest age (49) should be first
    const rows = screen.getAllByRole('row');
    // First row is header, second row is data
    expect(rows[1]).toHaveTextContent('49');
  });

  it('filters rows based on search input', () => {
    render(<DataTable columns={columns} data={data} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Person 29' } });

    expect(screen.getByText('Person 29')).toBeInTheDocument();
    expect(screen.queryByText('Person 0')).not.toBeInTheDocument();
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'components/common/DataTable.test.jsx'), dataTableTestCode.trim());

// 2. DisableVehicleDialog.jsx
const disableVehicleDialogCode = `
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import BlockIcon from '@mui/material/Block';
import Tooltip from '@mui/material/Tooltip';
import { useApp } from '../../state/AppContext';
import { disableVehicle } from '../../services/vehicles.service';
import PermissionGate from '../rbac/PermissionGate';

export default function DisableVehicleDialog({ vehicle }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { state, dispatch } = useApp();

  const handleDisable = () => {
    try {
      const updated = disableVehicle(vehicle.id, reason, state);
      dispatch({ type: 'DISABLE_VEHICLE', payload: { id: vehicle.id, reason } });
      setOpen(false);
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
`;
if (!fs.existsSync(path.join(srcDir, 'components/vehicle'))) {
  fs.mkdirSync(path.join(srcDir, 'components/vehicle'));
}
fs.writeFileSync(path.join(srcDir, 'components/vehicle/DisableVehicleDialog.jsx'), disableVehicleDialogCode.trim());

// 3. VehicleForm.jsx (Basic)
const vehicleFormCode = `
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useApp } from '../../state/AppContext';
import { createVehicle, updateVehicle } from '../../services/vehicles.service';
import { validateVehicle } from '../../utils/validation';
import MenuItem from '@mui/material/MenuItem';

export default function VehicleForm({ open, onClose, vehicle = null }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState(
    vehicle || {
      registrationNumber: '',
      model: '',
      manufacturer: '',
      yearOfMake: '',
      seatingCapacity: '',
      fuelType: 'diesel',
      vendorId: state.currentVendorId
    }
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const data = {
      ...formData,
      yearOfMake: parseInt(formData.yearOfMake, 10),
      seatingCapacity: parseInt(formData.seatingCapacity, 10)
    };
    const validationErrors = validateVehicle(data, state.vehicles);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (vehicle) {
        const updated = updateVehicle(vehicle.id, data, state);
        dispatch({ type: 'UPDATE_VEHICLE', payload: updated });
      } else {
        const created = createVehicle(data, state);
        dispatch({ type: 'CREATE_VEHICLE', payload: created });
      }
      onClose();
    } catch (e) {
      setErrors({ form: e.message });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber}
            fullWidth
          />
          <TextField
            label="Manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            fullWidth
          />
          <TextField
            label="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            fullWidth
          />
          <TextField
            label="Year of Make"
            type="number"
            value={formData.yearOfMake}
            onChange={(e) => setFormData({ ...formData, yearOfMake: e.target.value })}
            error={!!errors.yearOfMake}
            helperText={errors.yearOfMake}
            fullWidth
          />
          <TextField
            label="Seating Capacity"
            type="number"
            value={formData.seatingCapacity}
            onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
            error={!!errors.seatingCapacity}
            helperText={errors.seatingCapacity}
            fullWidth
          />
          <TextField
            select
            label="Fuel Type"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            fullWidth
          >
            {['petrol', 'diesel', 'electric', 'cng', 'hybrid'].map((option) => (
              <MenuItem key={option} value={option}>
                {option.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
          {errors.form && <Box color="error.main">{errors.form}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {vehicle ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'components/vehicle/VehicleForm.jsx'), vehicleFormCode.trim());

console.log('Done script 2');
