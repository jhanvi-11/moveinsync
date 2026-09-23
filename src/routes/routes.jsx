import React, { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../layouts/AppShell';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const VendorsPage = lazy(() => import('../pages/VendorsPage'));
const VendorDetailPage = lazy(() => import('../pages/VendorDetailPage'));
const FleetPage = lazy(() => import('../pages/FleetPage'));
const DriversPage = lazy(() => import('../pages/DriversPage'));
const DriverDetailPage = lazy(() => import('../pages/DriverDetailPage'));
const DocumentsPage = lazy(() => import('../pages/DocumentsPage'));
const DelegationsPage = lazy(() => import('../pages/DelegationsPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotAuthorizedPage = lazy(() => import('../pages/NotAuthorizedPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));

export const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/403', element: <NotAuthorizedPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'vendors', element: <ProtectedRoute requiredPermission="vendors.read" />, children: [
              { index: true, element: <VendorsPage /> },
              { path: ':id', element: <VendorDetailPage /> }
          ]},
          { path: 'fleet', element: <ProtectedRoute requiredPermission="fleet.read" />, children: [
              { index: true, element: <FleetPage /> }
          ]},
          { path: 'drivers', element: <ProtectedRoute requiredPermission="drivers.read" />, children: [
              { index: true, element: <DriversPage /> },
              { path: ':id', element: <DriverDetailPage /> }
          ]},
          { path: 'documents', element: <ProtectedRoute requiredPermission="documents.read" />, children: [
              { index: true, element: <DocumentsPage /> }
          ]},
          { path: 'delegations', element: <ProtectedRoute requiredPermission="delegations.manage" />, children: [
              { index: true, element: <DelegationsPage /> }
          ]},
          { path: 'reports', element: <ProtectedRoute requiredPermission="reports.read" />, children: [
              { index: true, element: <ReportsPage /> }
          ]},
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> }
        ]
      }
    ]
  }
];
