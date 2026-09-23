import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function DocumentList({ driverId }) {
  // Placeholder for Phase 7
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>Documents</Typography>
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography color="text.secondary">
            Document management will be implemented in Phase 7.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
