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