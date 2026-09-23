import { describe, it, expect } from 'vitest';
import { can, scopeOf } from './rbac.service';

describe('rbac.service', () => {
  const state = {
    vendors: [
      { id: 'v1', level: 'super', parentId: null },
      { id: 'v2', level: 'regional', parentId: 'v1' },
      { id: 'v3', level: 'city', parentId: 'v2' },
      { id: 'v4', level: 'local', parentId: 'v3' },
      { id: 'v5', level: 'local', parentId: 'v3' }
    ],
    delegations: []
  };

  it('Super/Regional/City/Local baseline permissions', () => {
    expect(can('fleet.write', 'v4', 'v1', state)).toBe(true);
    expect(can('payments.write', 'v3', 'v2', state)).toBe(true);
    expect(can('fleet.read', 'v4', 'v3', state)).toBe(true);
    expect(can('payments.write', 'v4', 'v3', state)).toBe(false);
    expect(can('fleet.write', 'v4', 'v4', state)).toBe(true);
    expect(can('vendors.read', 'v4', 'v4', state)).toBe(false);
  });

  it('Delegation grant extends scope', () => {
    const localState = {
      ...state,
      delegations: [
        { toVendorId: 'v4', permissions: { payments: true }, status: 'active' }
      ]
    };
    expect(can('payments.write', 'v4', 'v4', localState)).toBe(true);
  });

  it('Conflict rule: narrow grant beats broad grant at same permission', () => {
    const localState = {
      ...state,
      delegations: [
        { toVendorId: 'v3', permissions: { payments: true }, status: 'active' },
        { toVendorId: 'v4', permissions: { payments: true }, status: 'revoked' }
      ]
    };
    expect(can('payments.write', 'v4', 'v4', localState)).toBe(false);
    expect(can('payments.write', 'v3', 'v3', localState)).toBe(true);
  });

  it('Conflict rule: revocation at any ancestor beats grants from less-specific ancestors', () => {
    const localState = {
      ...state,
      delegations: [
        { toVendorId: 'v2', permissions: { payments: true }, status: 'revoked' },
        { toVendorId: 'v1', permissions: { payments: true }, status: 'active' }
      ]
    };
    expect(can('payments.write', 'v4', 'v4', localState)).toBe(false);
  });

  it('scopeOf returns correct vendor IDs', () => {
    const ids = scopeOf('fleet.write', 'v3', state);
    expect(ids).toContain('v3');
    expect(ids).toContain('v4');
    expect(ids).toContain('v5');
    expect(ids).not.toContain('v2');
  });
});
