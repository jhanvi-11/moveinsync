import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { StatusChip } from '../common/StatusChip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export const VendorCard = ({ vendor }) => {
  const theme = useTheme();
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{vendor.name}</Typography>
            <Typography variant="body2" color="text.secondary">Code: {vendor.code}</Typography>
            <Typography variant="caption" sx={{ color: theme.palette.vendorAccents[vendor.level] }}>
              {vendor.level.toUpperCase()}
            </Typography>
          </Box>
          <StatusChip status={vendor.status} />
        </Box>
      </CardContent>
    </Card>
  );
};
