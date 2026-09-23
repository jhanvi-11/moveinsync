import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AppProvider } from './state/AppContext';
import App from './App';
import { SnackbarProvider } from 'notistack';

describe('App', () => {
  it('renders branded hero for visual verification', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </SnackbarProvider>
      </ThemeProvider>
    );

    expect(await screen.findByText('Mock Login')).toBeInTheDocument();
    
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}{Enter}');
    
    const loginBtn = screen.getByRole('button', { name: /Go to Dashboard/i });
    await user.click(loginBtn);
    
    const vendorsLink = await screen.findByRole('link', { name: /Vendors/i });
    await user.click(vendorsLink);
    
    const vendorsHeading = await screen.findByRole('heading', { name: /Vendors/i }, { timeout: 10000 });
    expect(vendorsHeading).toBeInTheDocument();
  }, 15000);
});
