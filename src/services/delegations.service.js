import { getDescendants } from '../utils/cascade';

export const actionToDelegationKey = {
  'fleet.write': 'fleetOnboarding',
  'drivers.write': 'driverOnboarding',
  'payments.write': 'payments',
  'reports.read': 'reports',
  'overrideActions': 'overrideActions'
};

export const getActiveDelegations = (vendorId, state) => {
  return state.delegations.filter(d => 
    (d.fromVendorId === vendorId || d.toVendorId === vendorId) && 
    d.status === 'active'
  );
};

export const getDelegationHistory = (vendorId, state) => {
  return state.delegations.filter(d => 
    (d.fromVendorId === vendorId || d.toVendorId === vendorId) && 
    d.status === 'revoked'
  );
};

export const grantDelegation = (fromVendorId, toVendorId, permissions, scope, notes, state) => {
  const { vendors } = state;
  const descendants = getDescendants(fromVendorId, vendors).map(v => v.id);
  
  if (!descendants.includes(toVendorId)) {
    return { success: false, error: 'Target vendor must be a descendant' };
  }

  const hasAtLeastOne = Object.values(permissions).some(val => val === true);
  if (!hasAtLeastOne) {
    return { success: false, error: 'At least one permission must be granted' };
  }

  if (permissions.overrideActions) {
    const toVendor = vendors.find(v => v.id === toVendorId);
    if (!toVendor || (toVendor.level !== 'super' && toVendor.level !== 'regional')) {
      return { success: false, error: 'overrideActions can only be granted to regional or super vendors' };
    }
  }

  const payload = {
    id: crypto.randomUUID(),
    fromVendorId,
    toVendorId,
    permissions,
    scope,
    notes,
    status: 'active',
    grantedAt: new Date().toISOString()
  };

  return { success: true, actions: [{ type: 'GRANT_DELEGATION', payload }] };
};

export const revokeDelegation = (delegationId, state) => {
  const delegation = state.delegations.find(d => d.id === delegationId);
  if (!delegation) return { success: false, error: 'Delegation not found' };
  if (delegation.status === 'revoked') return { success: false, error: 'Delegation already revoked' };

  return { success: true, actions: [{ type: 'REVOKE_DELEGATION', payload: { id: delegationId } }] };
};
