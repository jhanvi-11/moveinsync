import { actionTypes } from '../state/reducers';
import { validateDriver } from '../utils/validation';

export const createDriver = (driverData, state) => {
  const errors = validateDriver(driverData, state.drivers);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  const newDriver = {
    ...driverData,
    id: crypto.randomUUID(),
    status: 'active',
    assignedVehicleId: null,
    rating: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { type: actionTypes.CREATE_DRIVER, payload: newDriver };
};

export const updateDriver = (driverData, state) => {
  const errors = validateDriver(driverData, state.drivers);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  const updatedDriver = {
    ...driverData,
    updatedAt: new Date().toISOString(),
  };

  return { type: actionTypes.UPDATE_DRIVER, payload: updatedDriver };
};

export const assignVehicle = (driverId, vehicleId) => {
  return { 
    type: actionTypes.ASSIGN_DRIVER, 
    payload: { driverId, vehicleId } 
  };
};
