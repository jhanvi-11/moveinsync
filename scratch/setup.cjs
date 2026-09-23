const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. DataTable.jsx
const dataTableCode = `
import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { PAGE_SIZE } from '../../utils/constants';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function DataTable({ columns, data, searchable = true, searchPlaceholder = "Search..." }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(row => 
      columns.some(col => {
        const val = row[col.id];
        return val != null && String(val).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort(getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  }, [sortedData, page]);

  return (
    <Box sx={{ width: '100%' }}>
      {searchable && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                {columns.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={{ border: 0, clip: 'rect(0 0 0 0)', height: '1px', m: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: '1px' }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id || index}>
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.numeric ? 'right' : 'left'}>
                        {col.render ? col.render(row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {paginatedData.length === 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={columns.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[PAGE_SIZE]}
          component="div"
          count={filteredData.length}
          rowsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'components/common/DataTable.jsx'), dataTableCode.trim());

// 2. vehicles.service.js
const vehiclesServiceCode = `
export const createVehicle = (vehicleData, state) => {
  if (state.vehicles.some(v => v.registrationNumber === vehicleData.registrationNumber)) {
    throw new Error('Duplicate registration number');
  }

  return {
    ...vehicleData,
    id: crypto.randomUUID(),
    status: vehicleData.status || 'active',
    createdAt: new Date().toISOString()
  };
};

export const updateVehicle = (id, updates, state) => {
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');

  if (updates.registrationNumber && updates.registrationNumber !== existing.registrationNumber) {
    if (state.vehicles.some(v => v.registrationNumber === updates.registrationNumber)) {
      throw new Error('Duplicate registration number');
    }
  }

  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const disableVehicle = (id, reason, state) => {
  if (!reason || reason.trim() === '') {
    throw new Error('Reason is required when disabling a vehicle');
  }
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');
  
  return {
    ...existing,
    status: 'disabled',
    disabledReason: reason,
    updatedAt: new Date().toISOString()
  };
};

export const toggleMaintenance = (id, state) => {
  const existing = state.vehicles.find(v => v.id === id);
  if (!existing) throw new Error('Vehicle not found');
  
  if (existing.status === 'disabled') throw new Error('Cannot toggle maintenance on a disabled vehicle');

  return {
    ...existing,
    status: existing.status === 'maintenance' ? 'active' : 'maintenance',
    updatedAt: new Date().toISOString()
  };
};
`;

fs.writeFileSync(path.join(srcDir, 'services/vehicles.service.js'), vehiclesServiceCode.trim());

// 3. vehicles.service.test.js
const vehiclesServiceTestCode = `
import { describe, it, expect } from 'vitest';
import { createVehicle, updateVehicle, disableVehicle, toggleMaintenance } from './vehicles.service';

describe('Vehicles Service', () => {
  const mockState = {
    vehicles: [
      { id: '1', registrationNumber: 'KA01AB1234', status: 'active' },
      { id: '2', registrationNumber: 'KA01AB5678', status: 'disabled' },
      { id: '3', registrationNumber: 'KA01AB9999', status: 'maintenance' }
    ]
  };

  it('rejects duplicate registration on create', () => {
    expect(() => createVehicle({ registrationNumber: 'KA01AB1234' }, mockState)).toThrow('Duplicate registration number');
  });

  it('allows create valid vehicle', () => {
    const vehicle = createVehicle({ registrationNumber: 'MH02CD1234' }, mockState);
    expect(vehicle.id).toBeDefined();
    expect(vehicle.registrationNumber).toBe('MH02CD1234');
    expect(vehicle.status).toBe('active');
  });

  it('rejects duplicate registration on update', () => {
    expect(() => updateVehicle('1', { registrationNumber: 'KA01AB5678' }, mockState)).toThrow('Duplicate registration number');
  });

  it('allows update valid vehicle', () => {
    const updated = updateVehicle('1', { registrationNumber: 'MH02CD1234' }, mockState);
    expect(updated.registrationNumber).toBe('MH02CD1234');
  });

  it('disable requires reason', () => {
    expect(() => disableVehicle('1', '', mockState)).toThrow('Reason is required when disabling a vehicle');
  });

  it('flip maintenance ↔ active', () => {
    const act = toggleMaintenance('1', mockState);
    expect(act.status).toBe('maintenance');
    
    const act2 = toggleMaintenance('3', mockState);
    expect(act2.status).toBe('active');
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'services/vehicles.service.test.js'), vehiclesServiceTestCode.trim());

// 4. Update validation.js
const validationPath = path.join(srcDir, 'utils/validation.js');
let validationContent = fs.readFileSync(validationPath, 'utf8');
validationContent += `

export const validateVehicle = (vehicle, existingVehicles) => {
  const errors = {};
  
  if (!vehicle.registrationNumber || !/^[A-Z]{2}\\d{2}[A-Z]{1,2}\\d{4}$/.test(vehicle.registrationNumber)) {
    errors.registrationNumber = 'Invalid registration format (e.g. KA01AB1234)';
  } else if (existingVehicles.some(v => v.registrationNumber === vehicle.registrationNumber && v.id !== vehicle.id)) {
    errors.registrationNumber = 'Registration number must be unique';
  }

  const currentYear = new Date().getFullYear();
  if (!vehicle.yearOfMake || vehicle.yearOfMake < 1990 || vehicle.yearOfMake > currentYear) {
    errors.yearOfMake = \`Year must be between 1990 and \${currentYear}\`;
  }

  if (!vehicle.seatingCapacity || vehicle.seatingCapacity < 1 || vehicle.seatingCapacity > 50) {
    errors.seatingCapacity = 'Capacity must be between 1 and 50';
  }

  return Object.keys(errors).length ? errors : null;
};
`;
fs.writeFileSync(validationPath, validationContent);

console.log('Setup basic files completed.');
