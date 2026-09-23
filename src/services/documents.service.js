import { EXPIRY_WARN_DAYS } from '../utils/constants';
import { actionTypes } from '../state/reducers';

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

const checkVehicleFlag = (driverId, state, additionalDoc = null) => {
  const driver = state.drivers.find(d => d.id === driverId);
  if (!driver || !driver.assignedVehicleId) return null;

  const vehicle = state.vehicles.find(v => v.id === driver.assignedVehicleId);
  if (!vehicle) return null;

  const docs = state.documents.filter(d => d.driverId === driverId);
  if (additionalDoc) {
    const existingIdx = docs.findIndex(d => d.id === additionalDoc.id);
    if (existingIdx >= 0) docs[existingIdx] = additionalDoc;
    else docs.push(additionalDoc);
  }

  const mandatoryTypes = ['DL', 'RC', 'INSURANCE'];
  const hasExpiredMandatory = docs.some(d => 
    mandatoryTypes.includes(d.type) && getDocumentStatus(d.expiryDate) === 'expired'
  );

  if (hasExpiredMandatory && vehicle.status !== 'pending_verification') {
    return {
      type: actionTypes.UPDATE_VEHICLE,
      payload: { ...vehicle, status: 'pending_verification' }
    };
  }

  return null;
};

export const uploadDocument = (docData, state) => {
  const newDoc = {
    ...docData,
    id: crypto.randomUUID(),
    verificationStatus: 'pending',
    uploadedAt: new Date().toISOString(),
  };

  const actions = [{ type: actionTypes.UPLOAD_DOCUMENT, payload: newDoc }];
  const flagAction = checkVehicleFlag(newDoc.driverId, state, newDoc);
  if (flagAction) actions.push(flagAction);

  return actions;
};

export const verifyDocument = (id, vendorId, state) => {
  const doc = state.documents.find(d => d.id === id);
  if (!doc) throw new Error("Document not found");

  const verifiedDoc = { ...doc, verificationStatus: 'verified', verifiedByVendorId: vendorId };
  const actions = [{ type: actionTypes.VERIFY_DOCUMENT, payload: verifiedDoc }];
  
  const flagAction = checkVehicleFlag(doc.driverId, state, verifiedDoc);
  if (flagAction) actions.push(flagAction);

  return actions;
};

export const rejectDocument = (id, reason, vendorId, state) => {
  const doc = state.documents.find(d => d.id === id);
  if (!doc) throw new Error("Document not found");

  const rejectedDoc = { ...doc, verificationStatus: 'rejected', rejectionReason: reason, verifiedByVendorId: vendorId };
  const actions = [{ type: actionTypes.REJECT_DOCUMENT, payload: rejectedDoc }];

  const flagAction = checkVehicleFlag(doc.driverId, state, rejectedDoc);
  if (flagAction) actions.push(flagAction);

  return actions;
};
