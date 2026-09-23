import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Tabs, Tab, Chip, IconButton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useApp } from '../state/AppContext';
import DataTable from '../components/common/DataTable';
import DelegationDialog from '../components/vendor/DelegationDialog';
import { getActiveDelegations, getDelegationHistory, revokeDelegation } from '../services/delegations.service';
import { useVendorDescendants } from '../hooks/useVendorDescendants';

export default function DelegationsPage() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const descendants = useVendorDescendants(state.currentVendorId);

  const activeDelegations = getActiveDelegations(state.currentVendorId, state);
  const historyDelegations = getDelegationHistory(state.currentVendorId, state);

  const outbound = activeDelegations.filter(d => d.fromVendorId === state.currentVendorId);
  const inbound = activeDelegations.filter(d => d.toVendorId === state.currentVendorId);

  const handleRevoke = (id) => {
    const res = revokeDelegation(id, state);
    if (res.success) {
      res.actions.forEach(dispatch);
    }
  };

  const getVendorName = (id) => {
    const v = state.vendors.find(v => v.id === id);
    return v ? v.name : id;
  };

  const columns = useMemo(() => {
    const cols = [
      { id: 'fromVendorId', label: 'From Vendor', render: (row) => getVendorName(row.fromVendorId) },
      { id: 'toVendorId', label: 'To Vendor', render: (row) => getVendorName(row.toVendorId) },
      { 
        id: 'permissions', 
        label: 'Permissions', 
        render: (row) => {
          return Object.entries(row.permissions)
            .filter(([_, v]) => v)
            .map(([k]) => <Chip key={k} label={k} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
        }
      },
      { id: 'grantedAt', label: 'Granted At', render: (row) => new Date(row.grantedAt).toLocaleDateString() }
    ];

    if (tab === 2) {
      cols.push({ id: 'revokedAt', label: 'Revoked At', render: (row) => row.revokedAt ? new Date(row.revokedAt).toLocaleDateString() : 'N/A' });
    }

    if (tab === 0) {
      cols.push({
        id: 'actions',
        label: 'Actions',
        sortable: false,
        render: (row) => (
          <IconButton aria-label="Revoke Delegation" color="error" onClick={() => handleRevoke(row.id)}>
            <BlockIcon />
          </IconButton>
        )
      });
    }

    return cols;
  }, [tab, state]);

  let data = [];
  if (tab === 0) data = outbound;
  if (tab === 1) data = inbound;
  if (tab === 2) data = historyDelegations;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Delegations</Typography>
        {descendants.length > 0 && (
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            New Delegation
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Outbound" />
          <Tab label="Inbound" />
          <Tab label="History" />
        </Tabs>
      </Box>

      <DataTable 
        columns={columns}
        data={data}
        defaultSort="grantedAt"
        defaultSortDirection="desc"
      />

      <DelegationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
