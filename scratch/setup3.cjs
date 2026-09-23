const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. VehicleCard.jsx
const vehicleCardCode = `
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DisableVehicleDialog from './DisableVehicleDialog';

export default function VehicleCard({ vehicle }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{vehicle.registrationNumber}</Typography>
            <Typography color="text.secondary">{vehicle.manufacturer} {vehicle.model} ({vehicle.yearOfMake})</Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label={vehicle.status} color={vehicle.status === 'active' ? 'success' : vehicle.status === 'disabled' ? 'error' : 'warning'} size="small" sx={{ mr: 1 }} />
              <Chip label={vehicle.fuelType} variant="outlined" size="small" />
            </Box>
          </Box>
          <DisableVehicleDialog vehicle={vehicle} />
        </Box>
      </CardContent>
    </Card>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'components/vehicle/VehicleCard.jsx'), vehicleCardCode.trim());

// 2. FleetPage.jsx
const fleetPageCode = `
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useApp } from '../state/AppContext';
import DataTable from '../components/common/DataTable';
import VehicleForm from '../components/vehicle/VehicleForm';
import DisableVehicleDialog from '../components/vehicle/DisableVehicleDialog';
import PermissionGate from '../components/rbac/PermissionGate';
import { ParentDisabledBanner } from '../components/vendor/ParentDisabledBanner';
import Chip from '@mui/material/Chip';

export default function FleetPage() {
  const { state } = useApp();
  const [formOpen, setFormOpen] = useState(false);

  const columns = [
    { id: 'registrationNumber', label: 'Registration' },
    { id: 'manufacturer', label: 'Make' },
    { id: 'model', label: 'Model' },
    { id: 'yearOfMake', label: 'Year', numeric: true },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip 
        label={row.status} 
        size="small" 
        color={row.status === 'active' ? 'success' : row.status === 'disabled' ? 'error' : 'warning'} 
      />
    )},
    { id: 'actions', label: 'Actions', sortable: false, render: (row) => (
      <Box>
        <DisableVehicleDialog vehicle={row} />
      </Box>
    )}
  ];

  return (
    <Box sx={{ p: 4 }}>
      <ParentDisabledBanner vendorId={state.currentVendorId} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Fleet Management</Typography>
        <PermissionGate action="fleet.write" targetId={state.currentVendorId}>
          <Button variant="contained" onClick={() => setFormOpen(true)}>
            Add Vehicle
          </Button>
        </PermissionGate>
      </Box>

      <DataTable 
        columns={columns} 
        data={state.vehicles} 
        searchPlaceholder="Search by registration, make, model..." 
      />

      {formOpen && <VehicleForm open={formOpen} onClose={() => setFormOpen(false)} />}
    </Box>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'pages/FleetPage.jsx'), fleetPageCode.trim());

// 3. FleetPage.test.jsx
const fleetPageTestCode = `
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
    <button data-testid={\`disable-btn-\${vehicle.id}\`}>
      Disable {vehicle.registrationNumber}
    </button>
  )
}));

vi.mock('../components/rbac/PermissionGate', () => ({
  default: ({ children }) => <div data-testid="permission-gate">{children}</div>
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
`;
fs.writeFileSync(path.join(srcDir, 'pages/FleetPage.test.jsx'), fleetPageTestCode.trim());

console.log('Setup 3 completed.');
