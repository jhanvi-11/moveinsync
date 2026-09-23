import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FleetPage from './FleetPage';
import { AppContext } from '../state/AppContext';

// Mock components
vi.mock('../components/common/DataTable', () => ({
  default: ({ data }) => <div data-testid="data-table">Table with {data.length} rows</div>
}));

vi.mock('../components/vendor/ParentDisabledBanner', () => ({
  ParentDisabledBanner: () => <div data-testid="parent-disabled-banner" />
}));

vi.mock('../components/vehicle/DisableVehicleDialog', () => ({
  default: ({ vehicle }) => (
    <button data-testid={`disable-btn-${vehicle.id}`}>
      Disable {vehicle.registrationNumber}
    </button>
  )
}));

vi.mock('../components/rbac/PermissionGate', () => ({
  PermissionGate: ({ children }) => <div data-testid="permission-gate">{children}</div>
}));

describe('FleetPage', () => {
  it('renders page and data table', () => {
    const mockState = {
      currentVendorId: 'vendor-1',
      vehicles: [
        { id: '1', registrationNumber: 'KA01AB1234', status: 'active', vendorId: 'vendor-1' }
      ]
    };
    
    render(
      <AppContext.Provider value={{ state: mockState, dispatch: vi.fn() }}>
        <FleetPage />
      </AppContext.Provider>
    );

    expect(screen.getByText('Fleet Management')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toHaveTextContent('Table with 1 rows');
    expect(screen.getByText('Add Vehicle')).toBeInTheDocument();
  });
});