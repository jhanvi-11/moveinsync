import { VENDOR_LEVELS } from '../utils/constants';

export const createVendor = (vendorData, state) => {
  if (state.vendors.some(v => v.code === vendorData.code)) {
    throw new Error('Duplicate vendor code');
  }

  if (vendorData.level !== 'super') {
    if (!vendorData.parentId) {
      throw new Error(`${vendorData.level} vendor must have a parent`);
    }
    const parent = state.vendors.find(v => v.id === vendorData.parentId);
    if (!parent) throw new Error('Parent not found');

    const expectedParentLevelIndex = VENDOR_LEVELS.indexOf(vendorData.level) - 1;
    if (VENDOR_LEVELS.indexOf(parent.level) !== expectedParentLevelIndex) {
      throw new Error(`Parent of ${vendorData.level} vendor must be a ${VENDOR_LEVELS[expectedParentLevelIndex]} vendor`);
    }
  } else if (vendorData.parentId) {
    throw new Error('Super vendor cannot have a parent');
  }

  return {
    ...vendorData,
    id: crypto.randomUUID(),
    status: 'active',
    createdAt: new Date().toISOString()
  };
};

export const updateVendor = (id, updates, state) => {
  const existing = state.vendors.find(v => v.id === id);
  if (!existing) throw new Error('Vendor not found');

  if (updates.code && updates.code !== existing.code) {
    if (state.vendors.some(v => v.code === updates.code)) {
      throw new Error('Duplicate vendor code');
    }
  }

  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};
