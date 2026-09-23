export const getAncestorChain = (vendorId, vendors) => {
  const chain = [];
  let currentId = vendorId;
  while (currentId) {
    const vendor = vendors.find(v => v.id === currentId);
    if (!vendor) break;
    chain.push(vendor);
    currentId = vendor.parentId;
  }
  return chain;
};

export const getDescendants = (vendorId, vendors) => {
  const descendants = [];
  const getChildren = (parentId) => {
    const children = vendors.filter(v => v.parentId === parentId);
    descendants.push(...children);
    children.forEach(c => getChildren(c.id));
  };
  getChildren(vendorId);
  return descendants;
};

export const isAnyAncestorDisabled = (vendorId, vendors) => {
  const chain = getAncestorChain(vendorId, vendors);
  if (chain.length > 0 && chain[0].id === vendorId) {
    chain.shift();
  }
  return chain.some(vendor => vendor.status === 'disabled' || vendor.status === 'suspended');
};

export const isWriteAllowed = (targetVendorId, currentVendorId, vendors, canOverride) => {
  if (canOverride) return true;
  return !isAnyAncestorDisabled(targetVendorId, vendors);
};
