import { describe, it, expect } from 'vitest';
import { createDriver, updateDriver, assignVehicle } from './drivers.service';
import { actionTypes } from '../state/reducers';

describe('drivers service', () => {
  const mockState = {
    drivers: [
      { id: '1', licenseNumber: 'KA0120230000000' }
    ]
  };

  const validDriverData = {
    firstName: 'John',
    lastName: 'Doe',
    licenseNumber: 'MH0220230000000',
    dateOfBirth: '1990-01-01',
    licenseExpiry: '2030-01-01'
  };

  it('rejects duplicate license number', () => {
    const data = { ...validDriverData, licenseNumber: 'KA0120230000000' };
    expect(() => createDriver(data, mockState)).toThrow(/License number must be unique/);
  });

  it('rejects invalid license format', () => {
    const data = { ...validDriverData, licenseNumber: 'INVALID' };
    expect(() => createDriver(data, mockState)).toThrow(/Invalid license format/);
  });
  
  it('rejects age under 18', () => {
    const nextYear = new Date().getFullYear() + 1;
    const data = { ...validDriverData, dateOfBirth: `${nextYear - 17}-01-01` };
    expect(() => createDriver(data, mockState)).toThrow(/at least 18/);
  });

  it('creates driver successfully', () => {
    const action = createDriver(validDriverData, mockState);
    expect(action.type).toBe(actionTypes.CREATE_DRIVER);
    expect(action.payload.firstName).toBe('John');
    expect(action.payload.id).toBeDefined();
    expect(action.payload.status).toBe('active');
  });

  it('updates driver successfully', () => {
    const data = { ...validDriverData, id: '2', firstName: 'Jane' };
    const action = updateDriver(data, mockState);
    expect(action.type).toBe(actionTypes.UPDATE_DRIVER);
    expect(action.payload.firstName).toBe('Jane');
  });

  it('assigns vehicle returning ASSIGN_DRIVER action', () => {
    const action = assignVehicle('driver1', 'vehicle1');
    expect(action.type).toBe(actionTypes.ASSIGN_DRIVER);
    expect(action.payload).toEqual({ driverId: 'driver1', vehicleId: 'vehicle1' });
  });
});
