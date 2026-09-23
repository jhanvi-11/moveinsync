import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssignVehicleDialog from './AssignVehicleDialog';
import { AppProvider } from '../../state/AppContext';

vi.mock('../../state/AppContext', async () => {
  const actual = await vi.importActual('../../state/AppContext');
  return {
    ...actual,
    useApp: () => ({
      state: { currentVendorId: 'vendor1' },
      dispatch: vi.fn(),
    }),
  };
});

vi.mock('../rbac/PermissionGate', () => ({
  PermissionGate: ({ children }) => <div data-testid="permission-gate">{children}</div>
}));

describe('AssignVehicleDialog', () => {
  const mockDriver = { id: 'd1', firstName: 'John', lastName: 'Doe', vendorId: 'vendor1', assignedVehicleId: null };
  const mockVehicles = [
    { id: 'v1', registrationNumber: 'KA01AB1234', model: 'Sedan', assignedDriverId: null },
    { id: 'v2', registrationNumber: 'MH02XY9876', model: 'SUV', assignedDriverId: 'd2' }
  ];

  it('renders correctly and assigns an unassigned vehicle', async () => {
    const user = userEvent.setup();
    render(<AssignVehicleDialog driver={mockDriver} vehicles={mockVehicles} open={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Assign Vehicle to John Doe')).toBeInTheDocument();
    
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}{Enter}'); // Selects first vehicle (v1)
    
    const assignBtn = screen.getByRole('button', { name: 'Assign' });
    expect(assignBtn).not.toBeDisabled();
  });

  it('warns when assigning a vehicle that is already assigned to someone else', async () => {
    const user = userEvent.setup();
    render(<AssignVehicleDialog driver={mockDriver} vehicles={mockVehicles} open={true} onClose={vi.fn()} />);
    
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}'); // Selects second vehicle (v2)
    
    expect(await screen.findByText(/currently assigned to another driver/i)).toBeInTheDocument();
    
    const reassignBtn = screen.getByRole('button', { name: 'Reassign' });
    expect(reassignBtn).toBeInTheDocument();
    expect(reassignBtn).not.toBeDisabled();
  });
});
