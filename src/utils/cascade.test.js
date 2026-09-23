import { describe, it, expect } from 'vitest';
import { getAncestorChain, getDescendants, isAnyAncestorDisabled, isWriteAllowed } from './cascade';

describe('cascade utils', () => {
  const mockVendors = [
    { id: '1', parentId: null, status: 'active' },
    { id: '2', parentId: '1', status: 'active' },
    { id: '3', parentId: '2', status: 'disabled' },
    { id: '4', parentId: '3', status: 'active' },
  ];

  it('isAnyAncestorDisabled returns true when any ancestor in chain is disabled', () => {
    // For vendor 4, its parent vendor 3 is disabled.
    expect(isAnyAncestorDisabled('4', mockVendors)).toBe(true);
  });

  it('isAnyAncestorDisabled returns false when none are disabled', () => {
    // For vendor 2, its parent 1 is active.
    expect(isAnyAncestorDisabled('2', mockVendors)).toBe(false);
  });
});
