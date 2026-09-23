import { describe, it, expect } from 'vitest';
import { getSeedState } from '../data/seed';
import { getDescendants } from '../utils/cascade';
import {
  countActiveVehicles,
  countExpiringDocs
} from './reports.service';

describe('reports.service', () => {
  it('countActiveVehicles returns correct count for super scope', () => {
    const state = getSeedState();
    const superVendor = state.vendors.find(v => v.level === 'super');
    const descendants = getDescendants(superVendor.id, state.vendors);
    const vendorIds = [superVendor.id, ...descendants.map(d => d.id)];
    
    const count = countActiveVehicles(state.vehicles, vendorIds);
    
    const activeVehicles = state.vehicles.filter(v => v.status === 'active');
    expect(count).toBe(activeVehicles.length);
  });

  it('countActiveVehicles returns correct count for a regional scope', () => {
    const state = getSeedState();
    const regionalVendor = state.vendors.find(v => v.level === 'regional');
    const descendants = getDescendants(regionalVendor.id, state.vendors);
    const vendorIds = [regionalVendor.id, ...descendants.map(d => d.id)];
    
    const count = countActiveVehicles(state.vehicles, vendorIds);
    
    const activeVehicles = state.vehicles.filter(v => v.status === 'active' && vendorIds.includes(v.vendorId));
    expect(count).toBe(activeVehicles.length);
  });

  it('countExpiringDocs returns correct count for super scope', () => {
    const state = getSeedState();
    const superVendor = state.vendors.find(v => v.level === 'super');
    const descendants = getDescendants(superVendor.id, state.vendors);
    const vendorIds = [superVendor.id, ...descendants.map(d => d.id)];
    
    const count = countExpiringDocs(state.documents, state.drivers, vendorIds);
    expect(count).toBeGreaterThan(0);
  });
});
