import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import { StatusChip } from '../common/StatusChip';
import { getDocumentStatus, verifyDocument, rejectDocument } from '../../services/documents.service';
import { useApp } from '../../state/AppContext';
import { PermissionGate } from '../rbac/PermissionGate';

export default function DocumentRow({ document, vendorId }) {
  const { state, dispatch } = useApp();
  
  if (!document) return null;

  const expiryStatus = getDocumentStatus(document.expiryDate);
  const isPending = document.verificationStatus === 'pending';
  
  const handleVerify = () => {
    try {
      const actions = verifyDocument(document.id, state.currentVendorId, state);
      actions.forEach(action => dispatch(action));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = () => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason) return;
    try {
      const actions = rejectDocument(document.id, reason, state.currentVendorId, state);
      actions.forEach(action => dispatch(action));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2, 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      gap: 2
    }}>
      <DescriptionIcon color="action" />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {document.type} - {document.number}
          {document.verificationStatus === 'verified' && <StatusChip status="active" label="Verified" size="small" />}
          {document.verificationStatus === 'rejected' && <StatusChip status="rejected" label={`Rejected: ${document.rejectionReason}`} size="small" />}
          {isPending && <StatusChip status="pending" label="Pending Verification" size="small" />}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          Issued: {document.issuedDate || 'N/A'} | Expiry: {document.expiryDate || 'N/A'} 
          {document.expiryDate && (
            <Box component="span" sx={{ ml: 1 }}>
              {expiryStatus === 'expired' && <StatusChip status="rejected" label="Expired" size="small" />}
              {expiryStatus === 'expiring_soon' && <StatusChip status="pending" label="Expiring Soon" size="small" />}
            </Box>
          )}
        </Typography>
      </Box>

      {isPending && (
        <PermissionGate action="documents.verify" targetVendorId={vendorId || document.vendorId}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Verify Document">
              <IconButton color="success" onClick={handleVerify} aria-label="Verify Document">
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Document">
              <IconButton color="error" onClick={handleReject} aria-label="Reject Document">
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </PermissionGate>
      )}
    </Box>
  );
}
