import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export const SkeletonBlock = ({ height = 100, width = '100%' }) => (
  <Skeleton variant="rectangular" width={width} height={height} sx={{ borderRadius: 1 }} />
);
