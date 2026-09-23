import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDocumentStatus } from './documents.service';

describe('getDocumentStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns valid for null expiry', () => {
    expect(getDocumentStatus(null)).toBe('valid');
  });

  it('returns expired for past date', () => {
    expect(getDocumentStatus('2023-12-31T00:00:00Z')).toBe('expired');
  });

  it('returns expiring_soon within 30 days', () => {
    expect(getDocumentStatus('2024-01-30T00:00:00Z')).toBe('expiring_soon');
  });

  it('returns valid for > 30 days', () => {
    expect(getDocumentStatus('2024-02-05T00:00:00Z')).toBe('valid');
  });
});

import { uploadDocument, verifyDocument, rejectDocument } from './documents.service';
import { actionTypes } from '../state/reducers';

describe('document CRUD and vehicle auto-flag', () => {
  const mockState = {
    drivers: [
      { id: 'driver1', assignedVehicleId: 'vehicle1' }
    ],
    vehicles: [
      { id: 'vehicle1', status: 'active' }
    ],
    documents: [
      { id: 'doc1', driverId: 'driver1', type: 'DL', expiryDate: '2024-01-15T00:00:00Z' } // expiring soon
    ]
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uploads document without flagging vehicle if valid', () => {
    const docData = { driverId: 'driver1', type: 'RC', expiryDate: '2025-01-01T00:00:00Z' };
    const actions = uploadDocument(docData, mockState);
    
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(actionTypes.UPLOAD_DOCUMENT);
  });

  it('uploads document and flags vehicle if expired', () => {
    const docData = { driverId: 'driver1', type: 'INSURANCE', expiryDate: '2023-12-31T00:00:00Z' };
    const actions = uploadDocument(docData, mockState);
    
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toBe(actionTypes.UPLOAD_DOCUMENT);
    expect(actions[1].type).toBe(actionTypes.UPDATE_VEHICLE);
    expect(actions[1].payload.status).toBe('pending_verification');
  });

  it('verifyDocument flags vehicle if an existing mandatory doc is already expired', () => {
    const stateWithExpiredDL = {
      ...mockState,
      documents: [
        { id: 'doc1', driverId: 'driver1', type: 'DL', expiryDate: '2023-12-31T00:00:00Z' }
      ]
    };
    const actions = verifyDocument('doc1', 'vendor1', stateWithExpiredDL);
    
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toBe(actionTypes.VERIFY_DOCUMENT);
    expect(actions[1].type).toBe(actionTypes.UPDATE_VEHICLE);
  });
});
