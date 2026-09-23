import { logAction } from '../services/auditLog.service';

export const actionTypes = {
  SET_STATE: 'SET_STATE',
  SWITCH_VENDOR: 'SWITCH_VENDOR',
  CREATE_VENDOR: 'CREATE_VENDOR',
  UPDATE_VENDOR: 'UPDATE_VENDOR',
  DISABLE_VENDOR: 'DISABLE_VENDOR',
  CREATE_VEHICLE: 'CREATE_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DISABLE_VEHICLE: 'DISABLE_VEHICLE',
  CREATE_DRIVER: 'CREATE_DRIVER',
  UPDATE_DRIVER: 'UPDATE_DRIVER',
  UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
  VERIFY_DOCUMENT: 'VERIFY_DOCUMENT',
  REJECT_DOCUMENT: 'REJECT_DOCUMENT',
  GRANT_DELEGATION: 'GRANT_DELEGATION',
  REVOKE_DELEGATION: 'REVOKE_DELEGATION',
  ASSIGN_DRIVER: 'ASSIGN_DRIVER'
};

export const appReducer = (state, action) => {
  let nextState = state;
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_STATE:
      return payload;
    case actionTypes.SWITCH_VENDOR:
      return { ...state, currentVendorId: payload };
    
    case actionTypes.CREATE_VENDOR:
      nextState = { ...state, vendors: [...state.vendors, payload] };
      break;
    case actionTypes.UPDATE_VENDOR:
      nextState = { ...state, vendors: state.vendors.map(v => v.id === payload.id ? payload : v) };
      break;
    case actionTypes.DISABLE_VENDOR:
      nextState = { ...state, vendors: state.vendors.map(v => v.id === payload.id ? { ...v, status: 'disabled' } : v) };
      break;

    case actionTypes.CREATE_VEHICLE:
      nextState = { ...state, vehicles: [...state.vehicles, payload] };
      break;
    case actionTypes.UPDATE_VEHICLE:
      nextState = { ...state, vehicles: state.vehicles.map(v => v.id === payload.id ? payload : v) };
      break;
    case actionTypes.DISABLE_VEHICLE:
      nextState = { ...state, vehicles: state.vehicles.map(v => v.id === payload.id ? { ...v, status: 'disabled', disabledReason: payload.reason } : v) };
      break;

    case actionTypes.CREATE_DRIVER:
      nextState = { ...state, drivers: [...state.drivers, payload] };
      break;
    case actionTypes.UPDATE_DRIVER:
      nextState = { ...state, drivers: state.drivers.map(d => d.id === payload.id ? payload : d) };
      break;
    
    case actionTypes.ASSIGN_DRIVER:
      {
        const { vehicleId, driverId } = payload;
        const vehicles = state.vehicles.map(v => {
          if (v.id === vehicleId) return { ...v, assignedDriverId: driverId };
          if (v.assignedDriverId === driverId) return { ...v, assignedDriverId: null };
          return v;
        });
        const drivers = state.drivers.map(d => {
          if (d.id === driverId) return { ...d, assignedVehicleId: vehicleId };
          if (d.assignedVehicleId === vehicleId) return { ...d, assignedVehicleId: null };
          return d;
        });
        nextState = { ...state, vehicles, drivers };
      }
      break;

    case actionTypes.UPLOAD_DOCUMENT:
      nextState = { ...state, documents: [...state.documents, payload] };
      break;
    case actionTypes.VERIFY_DOCUMENT:
      nextState = { ...state, documents: state.documents.map(d => d.id === payload.id ? { ...d, verificationStatus: 'verified' } : d) };
      break;
    case actionTypes.REJECT_DOCUMENT:
      nextState = { ...state, documents: state.documents.map(d => d.id === payload.id ? { ...d, verificationStatus: 'rejected', rejectionReason: payload.reason } : d) };
      break;
      
    case actionTypes.GRANT_DELEGATION:
      nextState = { ...state, delegations: [...state.delegations, payload] };
      break;
    case actionTypes.REVOKE_DELEGATION:
      nextState = { ...state, delegations: state.delegations.map(d => d.id === payload.id ? { ...d, status: 'revoked', revokedAt: new Date().toISOString() } : d) };
      break;

    default:
      return state;
  }

  if (type !== actionTypes.SET_STATE && type !== actionTypes.SWITCH_VENDOR) {
    let targetType = 'system';
    let targetId = 'unknown';
    if (payload?.id) {
      targetId = payload.id;
      if (type.includes('VENDOR')) targetType = 'vendor';
      else if (type.includes('VEHICLE')) targetType = 'vehicle';
      else if (type.includes('DRIVER')) targetType = 'driver';
      else if (type.includes('DOCUMENT')) targetType = 'document';
      else if (type.includes('DELEGATION')) targetType = 'delegation';
    } else if (type === actionTypes.ASSIGN_DRIVER) {
      targetType = 'vehicle-driver-assignment';
      targetId = `${payload.vehicleId}-${payload.driverId}`;
    }

    const auditState = { ...nextState };
    auditState.auditLog = logAction(auditState, {
      actorVendorId: nextState.currentVendorId,
      action: type,
      targetType,
      targetId,
      details: JSON.stringify(payload)
    });
    nextState = auditState;
  }

  return nextState;
};
