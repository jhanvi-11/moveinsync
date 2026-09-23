import React, { useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useSnackbar } from 'notistack';

import { useApp } from '../state/AppContext';
import { useVendorDescendants } from '../hooks/useVendorDescendants';
import { getDocumentStatus } from '../services/documents.service';
import { SkeletonBlock } from '../components/common/SkeletonBlock';
import {
  countActiveVehicles, countPendingVehicles, countDisabledVehicles,
  countActiveDrivers, countPendingDrivers,
  countExpiringDocs, countExpiredDocs, countPendingVerifications,
  getAlerts, getRecentActivity
} from '../services/reports.service';

export default function DashboardPage() {
  const { state } = useApp();
  const { enqueueSnackbar } = useSnackbar();
  const descendants = useVendorDescendants(state.currentVendorId);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [state.currentVendorId]);
  
  const vendorIds = useMemo(() => {
    return [state.currentVendorId, ...descendants.map(d => d.id)];
  }, [state.currentVendorId, descendants]);

  const kpis = useMemo(() => {
    if (!state.vehicles || !state.drivers || !state.documents) return null;
    return {
      fleetActive: countActiveVehicles(state.vehicles, vendorIds),
      fleetPending: countPendingVehicles(state.vehicles, vendorIds),
      fleetDisabled: countDisabledVehicles(state.vehicles, vendorIds),
      driversActive: countActiveDrivers(state.drivers, vendorIds),
      driversPending: countPendingDrivers(state.drivers, vendorIds),
      docsExpiring: countExpiringDocs(state.documents, state.drivers, vendorIds),
      docsExpired: countExpiredDocs(state.documents, state.drivers, vendorIds),
      pendingVerifications: countPendingVerifications(state.documents, state.drivers, vendorIds),
      alerts: getAlerts(state.documents, state.drivers, vendorIds),
      recentActivity: getRecentActivity(state.auditLog || [], vendorIds),
    };
  }, [state, vendorIds]);

  if (loading || !kpis) {
    return (
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }} data-testid="dashboard-skeleton">
        <Box sx={{ mb: 4 }}>
          <SkeletonBlock height={120} />
        </Box>
        <Grid container spacing={3}>
          {[1,2,3,4].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SkeletonBlock height={160} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <SkeletonBlock height={300} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SkeletonBlock height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, rgb(13,148,136), rgb(45,212,191))', 
          color: 'white',
          boxShadow: 2
        }}
      >
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Overview for current vendor and descendants
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DirectionsCarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">Fleet</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }} data-testid="kpi-fleet-active">{kpis.fleetActive}</Typography>
              <Typography variant="body2" color="text.secondary">Active Vehicles</Typography>
              <Typography variant="body2" color="warning.main">{kpis.fleetPending} Pending</Typography>
              <Typography variant="body2" color="error.main">{kpis.fleetDisabled} Disabled</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">Drivers</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }} data-testid="kpi-drivers-active">{kpis.driversActive}</Typography>
              <Typography variant="body2" color="text.secondary">Active Drivers</Typography>
              <Typography variant="body2" color="warning.main">{kpis.driversPending} Pending</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">Documents</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }} data-testid="kpi-docs-expiring">{kpis.docsExpiring}</Typography>
              <Typography variant="body2" color="text.secondary">Expiring Soon (≤30d)</Typography>
              <Typography variant="body2" color="error.main" data-testid="kpi-docs-expired">{kpis.docsExpired} Expired</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">Verifications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }} data-testid="kpi-pending-verifications">{kpis.pendingVerifications}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Actions</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Alerts (Top 5)</Typography>
              <Divider />
              {kpis.alerts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  No urgent alerts.
                </Typography>
              ) : (
                <List disablePadding sx={{ mt: 1 }}>
                  {kpis.alerts.map(doc => {
                    const status = getDocumentStatus(doc.expiryDate);
                    return (
                      <ListItem key={doc.id} disableGutters data-testid="alert-item">
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {status === 'expired' ? (
                            <ErrorOutlineIcon color="error" />
                          ) : (
                            <WarningAmberIcon color="warning" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${doc.type} (${doc.number})`}
                          secondary={`Driver ID: ${doc.driverId.slice(0, 8)} • ${status === 'expired' ? 'Expired' : 'Expiring'} ${new Date(doc.expiryDate).toLocaleDateString()}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              <Divider />
              {kpis.recentActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  No recent activity found.
                </Typography>
              ) : (
                <List disablePadding sx={{ mt: 1 }}>
                  {kpis.recentActivity.map(entry => (
                    <ListItem key={entry.id} disableGutters data-testid="activity-item">
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HistoryIcon color="disabled" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={entry.action}
                        secondary={`${new Date(entry.timestamp).toLocaleString()} • ${entry.targetType} (${entry.targetId.slice(0, 8)})`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
