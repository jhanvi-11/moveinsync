import { useApp } from '../state/AppContext';
import { can, scopeOf } from '../services/rbac.service';
import { useMemo } from 'react';

export const usePermission = (action, targetVendorId) => {
  const { state } = useApp();
  
  const isAllowed = useMemo(() => {
    const target = targetVendorId || state.currentVendorId;
    if (!target) return false;
    return can(action, target, state.currentVendorId, state);
  }, [action, targetVendorId, state.currentVendorId, state.vendors, state.delegations]);

  const scope = useMemo(() => {
    return scopeOf(action, state.currentVendorId, state);
  }, [action, state.currentVendorId, state.vendors, state.delegations]);

  return { isAllowed, scope };
};
