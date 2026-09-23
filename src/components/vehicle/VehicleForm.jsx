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