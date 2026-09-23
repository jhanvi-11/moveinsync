import { describe, it, expect } from 'vitest';
import { grantDelegation, revokeDelegation } from './delegations.service';

describe('delegations.service', () => {
  const state = {
    vendors: [
      { id: 'v1', level: 'super', parentId: null },
      { id: 'v2', level: 'regional', parentId: 'v1' },
      { id: 'v3', level: 'city', parentId: 'v2' },
      { id: 'v4', level: 'local', parentId: 'v3' }
    ],
    delegations: [
      { id: 'd1', fromVendorId: 'v1', toVendorId: 'v2', status: 'active', permissions: { payments: true } }
    ]
  };

  it('grant validation: descendant relationship', () => {
    // v4 is not descendant of v3? No, v4 is descendant of v3. v2 is not descendant of v3
    const res = grantDelegation('v3', 'v2', { payments: true }, 'all', '', state);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/descendant/i);

    const res2 = grantDelegation('v3', 'v4', { payments: true }, 'all', '', state);
    expect(res2.success).toBe(true);
  });

  it('grant validation: override-actions business rule', () => {
    const res = grantDelegation('v2', 'v3', { overrideActions: true }, 'all', '', state);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/regional or super/i);

    const res2 = grantDelegation('v1', 'v2', { overrideActions: true }, 'all', '', state);
    expect(res2.success).toBe(true);
  });

  it('grant validation: at-least-one permission', () => {
    const res = grantDelegation('v2', 'v3', { payments: false, reports: false }, 'all', '', state);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/at least one/i);
  });

  it('revoke transitions', () => {
    const res = revokeDelegation('d1', state);
    expect(res.success).toBe(true);
    expect(res.actions[0].type).toBe('REVOKE_DELEGATION');

    const res2 = revokeDelegation('non-existent', state);
    expect(res2.success).toBe(false);
  });
});
