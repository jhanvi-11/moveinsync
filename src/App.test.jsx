import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AppProvider } from './state/AppContext';

describe('App', () => {
  it('renders branded hero for visual verification', async () => {
    render(
      <ThemeProvider theme={theme}>
        <AppProvider>
          <App />
        </AppProvider>
      </ThemeProvider>
    );
    const heading = await screen.findByRole('heading', { name: /MoveInSync Vendor Hub/i });
    expect(heading).toBeInTheDocument();
    
    // Verify primary color token matches rgb(13,148,136)
    expect(theme.palette.primary.main).toBe('rgb(13,148,136)');
  });
});
