import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTable from './DataTable';
import { PAGE_SIZE } from '../../utils/constants';

describe('DataTable', () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age', numeric: true }
  ];
  const data = Array.from({ length: 30 }, (_, i) => ({ id: i, name: `Person ${String(i).padStart(2, '0')}`, age: 20 + i }));

  it('renders correctly and paginates', () => {
    render(<DataTable columns={columns} data={data} />);
    
    // First page should show PAGE_SIZE items
    expect(screen.getByText('Person 00')).toBeInTheDocument();
    expect(screen.queryByText(`Person ${String(PAGE_SIZE).padStart(2, '0')}`)).not.toBeInTheDocument();

    // Click next page
    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(`Person ${PAGE_SIZE}`)).toBeInTheDocument();
  });

  it('sorts columns when header clicked', () => {
    render(<DataTable columns={columns} data={data} />);
    
    // Initially ascending by first column, so Person 0 is first.
    // Let's click the Name header to sort descending.
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader); // Click once to sort desc

    // Wait, the data sorting might have different string comparisons. Person 9 vs Person 29
    // Let's sort by age instead
    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader); // Click age (asc)
    fireEvent.click(ageHeader); // Click age again (desc)

    // Age is descending now, so the highest age (49) should be first
    const rows = screen.getAllByRole('row');
    // First row is header, second row is data
    expect(rows[1]).toHaveTextContent('49');
  });

  it('filters rows based on search input', () => {
    render(<DataTable columns={columns} data={data} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Person 29' } });

    expect(screen.getByText('Person 29')).toBeInTheDocument();
    expect(screen.queryByText('Person 00')).not.toBeInTheDocument();
  });
});