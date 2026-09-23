export const createVehicle = (vehicleData, state) => {
  if (state.vehicles.some(v => v.registrationNumber === vehicleData.registrationNumber)) {
    throw new Error('Duplicate registration number');
  }

  return {
    ...vehicleData,
    id: crypto.randomUUID(),
    status: vehicleData.status || 'active',
    createdAt: new Date().toISOString()
  };
};

export const updateVehicle = (id, updates, state) => {
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');

  if (updates.registrationNumber && updates.registrationNumber !== existing.registrationNumber) {
    if (state.vehicles.some(v => v.registrationNumber === updates.registrationNumber)) {
      throw new Error('Duplicate registration number');
    }
  }

  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const disableVehicle = (id, reason, state) => {
  if (!reason || reason.trim() === '') {
    throw new Error('Reason is required when disabling a vehicle');
  }
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');
  
  return {
    ...existing,
    status: 'disabled',
    disabledReason: reason,
    updatedAt: new Date().toISOString()
  };
};

export const toggleMaintenance = (id, state) => {
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');
  
  if (existing.status === 'disabled') throw new Error('Cannot toggle maintenance on a disabled vehicle');

  return {
    ...existing,
    status: existing.status === 'maintenance' ? 'active' : 'maintenance',
    updatedAt: new Date().toISOString()
  };
};