export const logAction = (state, { actorVendorId, action, targetType, targetId, details }) => {
  const entry = {
    id: crypto.randomUUID(),
    actorVendorId,
    action,
    targetType,
    targetId,
    timestamp: new Date().toISOString(),
    details
  };
  
  const newAuditLog = [entry, ...state.auditLog];
  
  if (newAuditLog.length > 200) {
    newAuditLog.pop();
  }
  
  return newAuditLog;
};
