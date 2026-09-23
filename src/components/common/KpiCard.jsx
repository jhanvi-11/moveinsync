import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const KpiCard = ({ title, value, icon, color = 'primary.main' }) => (
  <Card>
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}1A`, color, width: 48, height: 48, borderRadius: '50%' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h4" component="div">{value}</Typography>
      </Box>
    </CardContent>
  </Card>
);
