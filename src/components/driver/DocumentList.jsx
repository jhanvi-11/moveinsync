import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../state/AppContext';
import DocumentRow from '../document/DocumentRow';
import DocumentUploadDialog from '../document/DocumentUploadDialog';
import { PermissionGate } from '../rbac/PermissionGate';

export default function DocumentList({ driverId }) {
  const { state } = useApp();
  const [uploadOpen, setUploadOpen] = useState(false);

  const driver = state.drivers.find(d => d.id === driverId);
  const documents = state.documents.filter(d => d.driverId === driverId);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Documents</Typography>
          <PermissionGate action="documents.write" targetVendorId={driver?.vendorId}>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          </PermissionGate>
        </Box>
        
        {documents.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography color="text.secondary">No documents uploaded yet.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {documents.map(doc => (
              <DocumentRow key={doc.id} document={doc} vendorId={driver?.vendorId} />
            ))}
          </Box>
        )}
      </CardContent>

      <DocumentUploadDialog 
        open={uploadOpen} 
        onClose={() => setUploadOpen(false)} 
        driverId={driverId}
      />
    </Card>
  );
}
