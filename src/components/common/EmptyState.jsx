import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const EmptyState = ({ title, description, action }) => (
  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
    {action}
  </Box>
);
