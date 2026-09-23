import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useApp } from '../../state/AppContext';
import { isAnyAncestorDisabled, getAncestorChain } from '../../utils/cascade';

export const ParentDisabledBanner = ({ vendorId }) => {
  const { state } = useApp();
  
  if (!vendorId) return null;
  
  const isDisabled = isAnyAncestorDisabled(vendorId, state.vendors);
  if (!isDisabled) return null;

  const chain = getAncestorChain(vendorId, state.vendors);
  if (chain.length > 0 && chain[0].id === vendorId) chain.shift();
  const disabledAncestor = chain.find(v => v.status === 'disabled' || v.status === 'suspended');

  return (
    <Alert severity="warning" sx={{ mb: 3 }}>
      <AlertTitle>Write Operations Disabled</AlertTitle>
      This vendor inherits a disabled state from its parent organization (<strong>{disabledAncestor?.name}</strong>). Read-only access is available.
    </Alert>
  );
};
