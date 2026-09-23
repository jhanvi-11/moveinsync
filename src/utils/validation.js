export const validateVendor = (vendor, existingVendors) => {
  const errors = {};
  if (!vendor.name || vendor.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!vendor.code || !/^[A-Z0-9_-]{2,10}$/.test(vendor.code)) {
    errors.code = 'Code must be 2-10 uppercase alphanumeric characters';
  } else if (existingVendors.some(v => v.code === vendor.code && v.id !== vendor.id)) {
    errors.code = 'Vendor code must be unique';
  }

  if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
    errors.email = 'Invalid email address';
  }

  if (vendor.phone && !/^(?:\+91|91)?[6789]\d{9}$/.test(vendor.phone)) {
    errors.phone = 'Invalid Indian phone number';
  }

  return Object.keys(errors).length ? errors : null;
};


export const validateVehicle = (vehicle, existingVehicles) => {
  const errors = {};
  
  if (!vehicle.registrationNumber || !/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(vehicle.registrationNumber)) {
    errors.registrationNumber = 'Invalid registration format (e.g. KA01AB1234)';
  } else if (existingVehicles.some(v => v.registrationNumber === vehicle.registrationNumber && v.id !== vehicle.id)) {
    errors.registrationNumber = 'Registration number must be unique';
  }

  const currentYear = new Date().getFullYear();
  if (!vehicle.yearOfMake || vehicle.yearOfMake < 1990 || vehicle.yearOfMake > currentYear) {
    errors.yearOfMake = `Year must be between 1990 and ${currentYear}`;
  }

  if (!vehicle.seatingCapacity || vehicle.seatingCapacity < 1 || vehicle.seatingCapacity > 50) {
    errors.seatingCapacity = 'Capacity must be between 1 and 50';
  }

  return Object.keys(errors).length ? errors : null;
};
