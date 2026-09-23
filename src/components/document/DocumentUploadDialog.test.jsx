import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DocumentUploadDialog from './DocumentUploadDialog';

vi.mock('../../state/AppContext', async () => {
  const actual = await vi.importActual('../../state/AppContext');
  return {
    ...actual,
    useApp: () => ({
      state: { currentVendorId: 'vendor1', documents: [] },
      dispatch: vi.fn(),
    }),
  };
});

describe('DocumentUploadDialog', () => {
  it('DL number field shows validation error on bad format', async () => {
    const user = userEvent.setup();
    render(<DocumentUploadDialog open={true} onClose={vi.fn()} driverId="driver1" />);

    // DL is default type
    const numberInput = screen.getByLabelText(/Document Number/i);
    await user.type(numberInput, 'BAD123');

    const uploadBtn = screen.getByRole('button', { name: /Upload/i });
    await user.click(uploadBtn);

    expect(await screen.findByText(/Invalid DL format/i)).toBeInTheDocument();
  });

  it('date picker enforces expiry > issued', async () => {
    const user = userEvent.setup();
    render(<DocumentUploadDialog open={true} onClose={vi.fn()} driverId="driver1" />);

    const numberInput = screen.getByLabelText(/Document Number/i);
    await user.type(numberInput, 'KA0120230000000');

    // For date inputs, use fireEvent.change
    const issuedInput = screen.getByLabelText(/Issue Date/i);
    fireEvent.change(issuedInput, { target: { value: '2024-10-01' } });
    
    const expiryInput = screen.getByLabelText(/Expiry Date/i);
    fireEvent.change(expiryInput, { target: { value: '2024-09-01' } });

    const uploadBtn = screen.getByRole('button', { name: /Upload/i });
    await user.click(uploadBtn);

    expect(await screen.findByText(/Expiry date must be after issued date/i)).toBeInTheDocument();
  });
});
