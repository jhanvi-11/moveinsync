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

export const validateDriver = (driver, existingDrivers) => {
  const errors = {};

  if (!driver.firstName || driver.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }
  
  if (!driver.lastName || driver.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!driver.licenseNumber || !/^[A-Z]{2}\d{13}$/.test(driver.licenseNumber)) {
    errors.licenseNumber = 'Invalid license format (e.g. KA0120230000000)';
  } else if (existingDrivers.some(d => d.licenseNumber === driver.licenseNumber && d.id !== driver.id)) {
    errors.licenseNumber = 'License number must be unique';
  }

  if (driver.phone && !/^(?:\+91|91)?[6789]\d{9}$/.test(driver.phone)) {
    errors.phone = 'Invalid Indian phone number';
  }

  if (driver.dateOfBirth) {
    const dob = new Date(driver.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      errors.dateOfBirth = 'Driver must be at least 18 years old';
    }
  } else {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (!driver.licenseExpiry) {
    errors.licenseExpiry = 'License expiry is required';
  }

  return Object.keys(errors).length ? errors : null;
};

export const validateDocument = (doc, existingDocs) => {
  const errors = {};
  
  if (!doc.type) {
    errors.type = 'Document type is required';
  }

  if (!doc.number || doc.number.trim() === '') {
    errors.number = 'Document number is required';
  } else if (doc.type === 'DL' && !/^[A-Z]{2}\d{13}$/.test(doc.number)) {
    errors.number = 'Invalid DL format (e.g. KA0120230000000)';
  }

  if (doc.type !== 'RC' && !doc.expiryDate) {
    errors.expiryDate = 'Expiry date is required for this document type';
  }

  if (doc.issuedDate && doc.expiryDate && new Date(doc.expiryDate) <= new Date(doc.issuedDate)) {
    errors.expiryDate = 'Expiry date must be after issued date';
  }

  return Object.keys(errors).length ? errors : null;
};
