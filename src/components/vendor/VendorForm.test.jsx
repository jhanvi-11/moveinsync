import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VendorForm } from './VendorForm';
import { describe, it, expect, vi } from 'vitest';

describe('VendorForm', () => {
  const mockVendors = [
    { id: '1', name: 'Super', level: 'super' },
    { id: '2', name: 'Regional', level: 'regional' },
    { id: '3', name: 'Local', level: 'local' }
  ];

  it('level field is read-only and reflects parent choice; filters parents', async () => {
    const user = userEvent.setup();
    render(<VendorForm vendors={mockVendors} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const parentSelect = screen.getByLabelText(/Parent/i);
    await user.click(parentSelect);

    const listbox = screen.getByRole('listbox');
    expect(within(listbox).queryByText(/Local/)).not.toBeInTheDocument();
    
    await user.click(within(listbox).getByText(/Regional \(regional\)/));

    const levelInput = screen.getByLabelText(/Level/i);
    expect(levelInput).toHaveValue('city');
  });
});
