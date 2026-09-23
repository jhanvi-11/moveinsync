import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ErrorBoundary } from './routes/ErrorBoundary';
import { SkeletonBlock } from './components/common/SkeletonBlock';
import { routes } from './routes/routes';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';

const PageSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <SkeletonBlock height={40} width={200} />
    <Box sx={{ mt: 3 }}><SkeletonBlock height={300} /></Box>
  </Box>
);

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleQuotaError = () => {
      enqueueSnackbar('Storage quota exceeded. Some changes may not be saved.', { variant: 'error' });
    };
    window.addEventListener('storage-quota-exceeded', handleQuotaError);
    return () => window.removeEventListener('storage-quota-exceeded', handleQuotaError);
  }, [enqueueSnackbar]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
