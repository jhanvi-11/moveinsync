import { describe, it, expect, vi } from 'vitest';
import { logAction } from './auditLog.service';

describe('auditLog.service', () => {
  it('appends and caps at 200', () => {
    vi.stubGlobal('crypto', {
      randomUUID: () => Math.random().toString()
    });

    let state = { auditLog: [] };
    
    for (let i = 0; i < 205; i++) {
      state.auditLog = logAction(state, {
        actorVendorId: 'v1',
        action: 'CREATE',
        targetType: 'vehicle',
        targetId: `vh-${i}`,
        details: 'test'
      });
    }
    
    expect(state.auditLog.length).toBe(200);
    expect(state.auditLog[0].targetId).toBe('vh-204');
    expect(state.auditLog[199].targetId).toBe('vh-5');
  });
});
