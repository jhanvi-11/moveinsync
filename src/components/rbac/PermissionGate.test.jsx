import React from 'react';
import { render, screen } from '@testing-library/react';
import { PermissionGate } from './PermissionGate';
import { usePermission } from '../../hooks/usePermission';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../hooks/usePermission', () => ({
  usePermission: vi.fn()
}));

describe('PermissionGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when allowed', () => {
    usePermission.mockReturnValue({ isAllowed: true });
    
    render(
      <PermissionGate action="do.stuff">
        <div>Allowed Content</div>
      </PermissionGate>
    );

    expect(screen.getByText('Allowed Content')).toBeInTheDocument();
  });

  it('renders fallback when denied', () => {
    usePermission.mockReturnValue({ isAllowed: false });
    
    render(
      <PermissionGate action="do.stuff" fallback={<div>Fallback Content</div>}>
        <div>Allowed Content</div>
      </PermissionGate>
    );

    expect(screen.getByText('Fallback Content')).toBeInTheDocument();
    expect(screen.queryByText('Allowed Content')).not.toBeInTheDocument();
  });

  it('renders nothing when denied and no fallback provided', () => {
    usePermission.mockReturnValue({ isAllowed: false });
    
    const { container } = render(
      <PermissionGate action="do.stuff">
        <div>Allowed Content</div>
      </PermissionGate>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
