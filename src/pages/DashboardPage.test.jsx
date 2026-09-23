import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DashboardPage from './DashboardPage';
import { AppContext } from '../state/AppContext';
import { getSeedState } from '../data/seed';
import { SnackbarProvider } from 'notistack';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders skeletons during loading state', () => {
    const state = getSeedState();
    
    render(
      <SnackbarProvider>
        <AppContext.Provider value={{ state, dispatch: vi.fn() }}>
          <DashboardPage />
        </AppContext.Provider>
      </SnackbarProvider>
    );

    // Should show skeleton initially
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('computes KPIs correctly for super scope after hydration', () => {
    const state = getSeedState();
    const superVendor = state.vendors.find(v => v.level === 'super');
    state.currentVendorId = superVendor.id;
    
    render(
      <SnackbarProvider>
        <AppContext.Provider value={{ state, dispatch: vi.fn() }}>
          <DashboardPage />
        </AppContext.Provider>
      </SnackbarProvider>
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();

    const fleetActive = screen.getByTestId('kpi-fleet-active');
    expect(fleetActive.textContent).not.toBe('0');
  });

  it('computes KPIs correctly for regional scope', () => {
    const state = getSeedState();
    const regionalVendor = state.vendors.find(v => v.level === 'regional');
    state.currentVendorId = regionalVendor.id;
    
    render(
      <SnackbarProvider>
        <AppContext.Provider value={{ state, dispatch: vi.fn() }}>
          <DashboardPage />
        </AppContext.Provider>
      </SnackbarProvider>
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();

    const fleetActive = screen.getByTestId('kpi-fleet-active');
    expect(fleetActive.textContent).not.toBe('0');
  });
});
