import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleSwitcher } from './RoleSwitcher';
import { useApp } from '../../state/AppContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';

vi.mock('../../state/AppContext', () => ({
  useApp: vi.fn()
}));

describe('RoleSwitcher', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    vi.clearAllMocks();
  });

  it('keyboard ArrowDown + Enter selects a vendor and triggers dispatch', async () => {
    const user = userEvent.setup();
    useApp.mockReturnValue({
      state: {
        currentVendorId: '1',
        vendors: [
          { id: '1', name: 'Vendor A', level: 'super' },
          { id: '2', name: 'Vendor B', level: 'regional' }
        ]
      },
      dispatch: dispatchMock
    });

    render(
      <ThemeProvider theme={theme}>
        <RoleSwitcher />
      </ThemeProvider>
    );
    
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'SWITCH_VENDOR',
      payload: '2'
    });
  });
});
