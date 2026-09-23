import { describe, it, expect } from 'vitest';
import { createVendor, updateVendor } from './vendors.service';

describe('vendors.service', () => {
  const mockState = {
    vendors: [
      { id: '1', code: 'SUPER', level: 'super' },
      { id: '2', code: 'REGIONAL', level: 'regional', parentId: '1' }
    ]
  };

  it('rejects creating a regional without super parent', () => {
    expect(() => createVendor({ code: 'NEW', level: 'regional' }, mockState)).toThrow('must have a parent');
  });

  it('rejects creating a local with regional parent', () => {
    expect(() => createVendor({ code: 'NEW', level: 'local', parentId: '2' }, mockState)).toThrow('Parent of local vendor must be a city vendor');
  });

  it('rejects duplicate code', () => {
    expect(() => createVendor({ code: 'SUPER', level: 'city', parentId: '2' }, mockState)).toThrow('Duplicate vendor code');
  });

  it('allows disable/enable', () => {
    const updated = updateVendor('2', { status: 'disabled' }, mockState);
    expect(updated.status).toBe('disabled');
  });
});
