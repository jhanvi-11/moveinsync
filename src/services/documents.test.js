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
