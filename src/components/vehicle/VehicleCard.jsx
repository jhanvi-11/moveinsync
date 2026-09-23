import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DisableVehicleDialog from './DisableVehicleDialog';

export default function VehicleCard({ vehicle }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{vehicle.registrationNumber}</Typography>
            <Typography color="text.secondary">{vehicle.manufacturer} {vehicle.model} ({vehicle.yearOfMake})</Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label={vehicle.status} color={vehicle.status === 'active' ? 'success' : vehicle.status === 'disabled' ? 'error' : 'warning'} size="small" sx={{ mr: 1 }} />
              <Chip label={vehicle.fuelType} variant="outlined" size="small" />
            </Box>
          </Box>
          <DisableVehicleDialog vehicle={vehicle} />
        </Box>
      </CardContent>
    </Card>
  );
}