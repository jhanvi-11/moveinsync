import { describe, it, expect } from 'vitest';
import { createVehicle, updateVehicle, disableVehicle, toggleMaintenance } from './vehicles.service';

describe('Vehicles Service', () => {
  const mockState = {
    vehicles: [
      { id: '1', registrationNumber: 'KA01AB1234', status: 'active' },
      { id: '2', registrationNumber: 'KA01AB5678', status: 'disabled' },
      { id: '3', registrationNumber: 'KA01AB9999', status: 'maintenance' }
    ]
  };

  it('rejects duplicate registration on create', () => {
    expect(() => createVehicle({ registrationNumber: 'KA01AB1234' }, mockState)).toThrow('Duplicate registration number');
  });

  it('allows create valid vehicle', () => {
    const vehicle = createVehicle({ registrationNumber: 'MH02CD1234' }, mockState);
    expect(vehicle.id).toBeDefined();
    expect(vehicle.registrationNumber).toBe('MH02CD1234');
    expect(vehicle.status).toBe('active');
  });

  it('rejects duplicate registration on update', () => {
    expect(() => updateVehicle('1', { registrationNumber: 'KA01AB5678' }, mockState)).toThrow('Duplicate registration number');
  });

  it('allows update valid vehicle', () => {
    const updated = updateVehicle('1', { registrationNumber: 'MH02CD1234' }, mockState);
    expect(updated.registrationNumber).toBe('MH02CD1234');
  });

  it('disable requires reason', () => {
    expect(() => disableVehicle('1', '', mockState)).toThrow('Reason is required when disabling a vehicle');
  });

  it('flip maintenance ↔ active', () => {
    const act = toggleMaintenance('1', mockState);
    expect(act.status).toBe('maintenance');
    
    const act2 = toggleMaintenance('3', mockState);
    expect(act2.status).toBe('active');
  });
});