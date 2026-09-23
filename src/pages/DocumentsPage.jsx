import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useApp } from '../state/AppContext';
import DataTable from '../components/common/DataTable';
import DocumentSearchBar from '../components/document/DocumentSearchBar';
import DocumentRow from '../components/document/DocumentRow';
import { getDocumentStatus } from '../services/documents.service';
import { useVendorDescendants } from '../hooks/useVendorDescendants';

export default function DocumentsPage() {
  const { state } = useApp();
  const [filters, setFilters] = useState({ type: 'All', status: 'All', vendorId: 'All' });
  const descendants = useVendorDescendants(state.currentVendorId);

  const allowedVendorIds = useMemo(() => {
    return [state.currentVendorId, ...descendants.map(v => v.id)];
  }, [state.currentVendorId, descendants]);

  const filteredDocs = useMemo(() => {
    let docs = state.documents.filter(d => allowedVendorIds.includes(d.vendorId));

    if (filters.vendorId !== 'All') {
      docs = docs.filter(d => d.vendorId === filters.vendorId);
    }
    
    if (filters.type !== 'All') {
      docs = docs.filter(d => d.type === filters.type);
    }

    if (filters.status !== 'All') {
      docs = docs.filter(d => getDocumentStatus(d.expiryDate) === filters.status);
    }

    return docs.sort((a, b) => {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });
  }, [state.documents, filters, allowedVendorIds]);

  const columns = [
    { 
      id: 'document', 
      label: 'Document Details', 
      render: (row) => <DocumentRow document={row} />
    }
  ];

  const relevantVendors = state.vendors.filter(v => allowedVendorIds.includes(v.id));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Center
      </Typography>

      <Box sx={{ my: 3 }}>
        <DocumentSearchBar 
          filters={filters} 
          onFilterChange={setFilters} 
          vendors={relevantVendors}
          showVendorFilter={true}
        />
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <DataTable 
          columns={columns} 
          data={filteredDocs} 
          searchPlaceholder="Search documents by type or number..."
        />
      </Box>
    </Box>
  );
}
