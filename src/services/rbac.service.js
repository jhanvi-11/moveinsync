import { getAncestorChain, getDescendants } from '../utils/cascade';

export const actionToDelegationKey = {
  'fleet.write': 'fleetOnboarding',
  'drivers.write': 'driverOnboarding',
  'payments.write': 'payments',
  'reports.read': 'reports',
  'overrideActions': 'overrideActions'
};

export const can = (action, targetVendorId, currentVendorId, state) => {
  const { vendors, delegations } = state;
  const currentDescendants = getDescendants(currentVendorId, vendors).map(v => v.id);
  const isTargetInScope = targetVendorId === currentVendorId || currentDescendants.includes(targetVendorId);

  const currentVendor = vendors.find(v => v.id === currentVendorId);
  if (!currentVendor) return false;

  const delegKey = actionToDelegationKey[action];
  
  if (delegKey) {
    const chain = getAncestorChain(currentVendorId, vendors);
    for (const node of chain) {
      const nodeDelegations = delegations.filter(d => d.toVendorId === node.id && d.permissions[delegKey] === true);
      if (nodeDelegations.length > 0) {
        const isRevoked = nodeDelegations.some(d => d.status === 'revoked');
        if (isRevoked) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  let baseline = false;
  if (isTargetInScope) {
    if (currentVendor.level === 'super' || currentVendor.level === 'regional') {
      baseline = true;
    } else if (currentVendor.level === 'city' || currentVendor.level === 'local') {
      const allowedActions = [
        'fleet.read', 'fleet.write', 'drivers.read', 'drivers.write', 
        'documents.read', 'documents.upload', 'reports.read'
      ];
      if (currentVendor.level === 'city' && action === 'vendors.read') {
        allowedActions.push('vendors.read');
      }
      baseline = allowedActions.includes(action);
    }
  }

  return baseline;
};

export const scopeOf = (action, currentVendorId, state) => {
  const { vendors } = state;
  return vendors.map(v => v.id).filter(id => can(action, id, currentVendorId, state));
};
