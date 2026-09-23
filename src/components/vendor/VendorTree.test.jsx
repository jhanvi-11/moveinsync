import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VendorTree } from './VendorTree';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';

describe('VendorTree', () => {
  const mockVendors = [
    { id: '1', name: 'Super', level: 'super', parentId: null, status: 'active' },
    { id: '2', name: 'Regional', level: 'regional', parentId: '1', status: 'active' }
  ];

  it('keyboard nav: ArrowRight expands, ArrowLeft collapses, Enter activates selection', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <VendorTree vendors={mockVendors} onSelect={onSelect} />
      </ThemeProvider>
    );

    const superNode = screen.getByText('Super').closest('[role="treeitem"]');
    const focusable = superNode.querySelector('[tabindex="0"]');
    await user.click(focusable);
    
    await user.keyboard('{ArrowLeft}');
    expect(screen.queryByText('Regional')).not.toBeInTheDocument();
    
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Regional')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('2');
  });
});
