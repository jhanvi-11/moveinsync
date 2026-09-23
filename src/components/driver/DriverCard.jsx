import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { StatusChip } from '../common/StatusChip';
import { getDocumentStatus } from '../../services/documents.service';

export default function DriverCard({ driver }) {
  if (!driver) return null;

  const initials = `${driver.firstName?.[0] || ''}${driver.lastName?.[0] || ''}`;
  const licenseStatus = getDocumentStatus(driver.licenseExpiry);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {initials.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {driver.firstName} {driver.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              {driver.licenseNumber}
            </Typography>
          </Box>
          <StatusChip status={driver.status} />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Phone</Typography>
            <Typography variant="body2">{driver.phone || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
            <Typography variant="body2">{driver.dateOfBirth || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">License Expiry</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{driver.licenseExpiry || 'N/A'}</Typography>
              {licenseStatus === 'expired' && <StatusChip status="rejected" label="Expired" size="small" />}
              {licenseStatus === 'expiring_soon' && <StatusChip status="pending" label="Expiring Soon" size="small" />}
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Rating</Typography>
            <Typography variant="body2">{driver.rating || 0} / 5</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
