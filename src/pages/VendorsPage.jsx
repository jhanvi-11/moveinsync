import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { useApp } from '../state/AppContext';
import { VendorTree } from '../components/vendor/VendorTree';
import { VendorSearchBar } from '../components/vendor/VendorSearchBar';
import { VendorForm } from '../components/vendor/VendorForm';
import { createVendor } from '../services/vendors.service';
import { usePermission } from '../hooks/usePermission';
import { Link, useNavigate } from 'react-router-dom';
import { StatusChip } from '../components/common/StatusChip';
import { PAGE_SIZE } from '../utils/constants';

export default function VendorsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(0);

  const { isAllowed: canCreate } = usePermission('vendors.manage');

  const handleSelect = (id) => setSelectedId(id);

  const handleCreate = (data) => {
    try {
      const newVendor = createVendor(data, state);
      dispatch({ type: 'ADD_VENDOR', payload: newVendor });
      setIsCreating(false);
      setSelectedId(newVendor.id);
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredVendors = useMemo(() => {
    return state.vendors.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [state.vendors, search]);

  const displayedVendors = useMemo(() => {
    return filteredVendors.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  }, [filteredVendors, page]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Vendors</Typography>
        {canCreate && <Button variant="contained" onClick={() => setIsCreating(true)}>Add Vendor</Button>}
      </Box>

      {isCreating ? (
        <Box sx={{ maxWidth: 600, bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Create New Vendor</Typography>
          <VendorForm vendors={state.vendors} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>Hierarchy</Typography>
              <VendorTree vendors={state.vendors} selectedId={selectedId} onSelect={handleSelect} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <VendorSearchBar value={search} onChange={(v) => { setSearch(v); setPage(0); }} />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedVendors.map((row) => (
                    <TableRow key={row.id} hover onClick={() => navigate(`/vendors/${row.id}`)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.level.toUpperCase()}</TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${row.id}`); }}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredVendors.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={PAGE_SIZE}
                rowsPerPageOptions={[PAGE_SIZE]}
              />
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
