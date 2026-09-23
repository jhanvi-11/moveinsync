import React from 'react';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const StatusChip = ({ status, label }) => {
  let color = 'default';
  let icon = <InfoOutlinedIcon />;
  let defaultLabel = status;

  if (status === 'active' || status === 'verified' || status === 'valid') {
    color = 'success';
    icon = <CheckCircleOutlineIcon />;
  } else if (status === 'expiring_soon' || status === 'pending_verification' || status === 'maintenance') {
    color = 'warning';
    icon = <WarningAmberIcon />;
  } else if (status === 'expired' || status === 'disabled' || status === 'suspended' || status === 'rejected' || status === 'revoked') {
    color = 'error';
    icon = <ErrorOutlineIcon />;
  }

  return (
    <Chip 
      icon={icon} 
      label={label || defaultLabel} 
      color={color} 
      size="small" 
      variant="outlined" 
    />
  );
};
