import { getDocumentStatus } from './documents.service';

export const getScopedVehicles = (vehicles, vendorIds) => {
  return vehicles.filter(v => vendorIds.includes(v.vendorId));
};

export const getScopedDrivers = (drivers, vendorIds) => {
  return drivers.filter(d => vendorIds.includes(d.vendorId));
};

export const countActiveVehicles = (vehicles, vendorIds) => {
  return getScopedVehicles(vehicles, vendorIds).filter(v => v.status === 'active').length;
};

export const countPendingVehicles = (vehicles, vendorIds) => {
  return getScopedVehicles(vehicles, vendorIds).filter(v => v.status === 'pending_verification').length;
};

export const countDisabledVehicles = (vehicles, vendorIds) => {
  return getScopedVehicles(vehicles, vendorIds).filter(v => v.status === 'disabled').length;
};

export const countActiveDrivers = (drivers, vendorIds) => {
  return getScopedDrivers(drivers, vendorIds).filter(d => d.status === 'active').length;
};

export const countPendingDrivers = (drivers, vendorIds) => {
  return getScopedDrivers(drivers, vendorIds).filter(d => d.status === 'pending_verification').length;
};

export const getScopedDocuments = (documents, drivers, vendorIds) => {
  const driverIdsInScope = new Set(getScopedDrivers(drivers, vendorIds).map(d => d.id));
  return documents.filter(doc => driverIdsInScope.has(doc.driverId));
};

export const countExpiringDocs = (documents, drivers, vendorIds) => {
  return getScopedDocuments(documents, drivers, vendorIds).filter(
    doc => getDocumentStatus(doc.expiryDate) === 'expiring_soon'
  ).length;
};

export const countExpiredDocs = (documents, drivers, vendorIds) => {
  return getScopedDocuments(documents, drivers, vendorIds).filter(
    doc => getDocumentStatus(doc.expiryDate) === 'expired'
  ).length;
};

export const countPendingVerifications = (documents, drivers, vendorIds) => {
  return getScopedDocuments(documents, drivers, vendorIds).filter(
    doc => doc.verificationStatus === 'pending'
  ).length;
};

export const getAlerts = (documents, drivers, vendorIds) => {
  const scopedDocs = getScopedDocuments(documents, drivers, vendorIds);
  const actionNeededDocs = scopedDocs.filter(doc => {
    const status = getDocumentStatus(doc.expiryDate);
    return status === 'expired' || status === 'expiring_soon';
  });

  actionNeededDocs.sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  return actionNeededDocs.slice(0, 5);
};

export const getRecentActivity = (auditLog, vendorIds) => {
  // We assume actorVendorId or targetId might relate, but usually audit entries 
  // might just need actorVendorId in scope, or we could just filter by actorVendorId in vendorIds
  // Actually, 'auditLog' entries visible to scope. If a user acts, actorVendorId is recorded.
  return auditLog
    .filter(entry => vendorIds.includes(entry.actorVendorId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
};
