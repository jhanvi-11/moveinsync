import { EXPIRY_WARN_DAYS } from '../utils/constants';

export const getDocumentStatus = (expiryDate) => {
  if (!expiryDate) return 'valid';
  
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  
  if (expiry < now) {
    return 'expired';
  }
  
  const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
  
  if (daysUntilExpiry <= EXPIRY_WARN_DAYS) {
    return 'expiring_soon';
  }
  
  return 'valid';
};
