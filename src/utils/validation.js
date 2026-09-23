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
