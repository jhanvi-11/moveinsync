import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useApp } from '../state/AppContext';
import * as rbacService from '../services/rbac.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../state/AppContext', () => ({
  useApp: vi.fn()
}));

vi.mock('../services/rbac.service', () => ({
  can: vi.fn()
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when not authenticated', () => {
    useApp.mockReturnValue({ state: { currentVendorId: null } });
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to /403 when permission denied', () => {
    useApp.mockReturnValue({ state: { currentVendorId: 'vendor-1' } });
    rbacService.can.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/403" element={<div>Forbidden</div>} />
          <Route element={<ProtectedRoute requiredPermission="do.stuff" />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Forbidden')).toBeInTheDocument();
    expect(rbacService.can).toHaveBeenCalledWith('do.stuff', 'vendor-1', 'vendor-1', { currentVendorId: 'vendor-1' });
  });

  it('renders content when allowed', () => {
    useApp.mockReturnValue({ state: { currentVendorId: 'vendor-1' } });
    rbacService.can.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute requiredPermission="do.stuff" />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
