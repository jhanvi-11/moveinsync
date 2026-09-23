import { useMemo } from 'react';
import { useApp } from '../state/AppContext';
import { getDescendants } from '../utils/cascade';

export const useVendorDescendants = (vendorId) => {
  const { state } = useApp();
  
  return useMemo(() => {
    return getDescendants(vendorId, state.vendors);
  }, [vendorId, state.vendors]);
};
