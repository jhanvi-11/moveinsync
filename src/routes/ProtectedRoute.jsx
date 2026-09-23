import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { can } from '../services/rbac.service';

export const ProtectedRoute = ({ requiredPermission }) => {
  const { state } = useApp();
  
  if (!state?.currentVendorId) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const isAllowed = can(requiredPermission, state.currentVendorId, state.currentVendorId, state);
    if (!isAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};
