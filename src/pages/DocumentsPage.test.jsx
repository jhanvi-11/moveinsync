import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DocumentsPage from './DocumentsPage';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../state/AppContext', async () => {
  const actual = await vi.importActual('../state/AppContext');
  return {
    ...actual,
    useApp: () => ({
      state: { 
        currentVendorId: 'vendor1',
        vendors: [{ id: 'vendor1', name: 'Vendor 1' }],
        documents: [
          { id: 'doc1', vendorId: 'vendor1', type: 'DL', number: 'KA0120230000000', expiryDate: '2024-01-15T00:00:00Z', verificationStatus: 'pending' },
          { id: 'doc2', vendorId: 'vendor1', type: 'RC', number: 'KA01AB1234', expiryDate: '2026-01-01T00:00:00Z', verificationStatus: 'verified' }
        ]
      },
      dispatch: vi.fn(),
    }),
  };
});

describe('DocumentsPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('filters by "expiring" + "DL" reduces rows correctly', async () => {
    const { container } = render(<MemoryRouter><DocumentsPage /></MemoryRouter>);

    expect(screen.getByText(/KA0120230000000/)).toBeInTheDocument();
    expect(screen.getByText(/KA01AB1234/)).toBeInTheDocument();

    const typeInput = container.querySelector('input[name="type"]');
    fireEvent.change(typeInput, { target: { value: 'DL' } });

    expect(screen.getByText(/KA0120230000000/)).toBeInTheDocument();
    expect(screen.queryByText(/KA01AB1234/)).not.toBeInTheDocument();
  });
});
