import React from 'react';
import { usePermission } from '../../hooks/usePermission';

export const PermissionGate = ({ action, targetVendorId, children, fallback = null }) => {
  const { isAllowed } = usePermission(action, targetVendorId);
  return isAllowed ? <>{children}</> : fallback;
};
