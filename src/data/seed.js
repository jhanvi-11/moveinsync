export function getSeedState() {
  function PRNG(seed) {
    let s = seed;
    return function() {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  const rand = PRNG(12345);

  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (rand() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const iso = (offsetMs) => new Date(now + offsetMs).toISOString();

  const superVendor = { id: uuid(), name: 'MoveInSync Global', code: 'MISG', level: 'super', parentId: null, status: 'active', createdAt: iso(0) };
  
  const regionalVendors = Array.from({ length: 3 }, (_, i) => ({
    id: uuid(), name: `Regional Vendor ${i+1}`, code: `REG${i+1}`, level: 'regional', parentId: superVendor.id, status: 'active', createdAt: iso(0)
  }));

  const cityVendors = Array.from({ length: 6 }, (_, i) => ({
    id: uuid(), name: `City Vendor ${i+1}`, code: `CTY${i+1}`, level: 'city', parentId: regionalVendors[i % 3].id, status: 'active', createdAt: iso(0)
  }));

  const localVendors = Array.from({ length: 8 }, (_, i) => ({
    id: uuid(), name: `Local Vendor ${i+1}`, code: `LOC${i+1}`, level: 'local', parentId: cityVendors[i % 6].id, status: 'active', createdAt: iso(0)
  }));

  const vendors = [superVendor, ...regionalVendors, ...cityVendors, ...localVendors];

  const delegations = [
    {
      id: uuid(),
      fromVendorId: superVendor.id,
      toVendorId: regionalVendors[0].id,
      permissions: { payments: true },
      status: 'active',
      grantedAt: iso(-10 * dayMs),
      notes: "Broad grant at super"
    },
    {
      id: uuid(),
      fromVendorId: regionalVendors[0].id,
      toVendorId: cityVendors[0].id,
      permissions: { payments: true },
      status: 'revoked',
      grantedAt: iso(-4 * dayMs),
      revokedAt: iso(-1 * dayMs),
      notes: "Narrow revocation at regional beats broad grant"
    },
    {
      id: uuid(),
      fromVendorId: superVendor.id,
      toVendorId: regionalVendors[1].id,
      permissions: { reports: true },
      status: 'active',
      grantedAt: iso(-5 * dayMs)
    },
    {
      id: uuid(),
      fromVendorId: regionalVendors[1].id,
      toVendorId: cityVendors[2].id,
      permissions: { driverOnboarding: true },
      status: 'active',
      grantedAt: iso(-4 * dayMs)
    },
    {
      id: uuid(),
      fromVendorId: cityVendors[2].id,
      toVendorId: localVendors[2].id,
      permissions: { driverOnboarding: true },
      status: 'active',
      grantedAt: iso(-1 * dayMs)
    }
  ];

  const fuelTypes = ['petrol', 'diesel', 'electric', 'cng', 'hybrid'];
  const vehicles = Array.from({ length: 120 }, (_, i) => {
    const vId = uuid();
    const vendor = localVendors[i % localVendors.length];
    let status = 'active';
    let disabledReason = null;
    if (i === 0) {
      status = 'disabled';
      disabledReason = 'Missing documents';
    } else if (i === 1) {
      status = 'maintenance';
    }
    return {
      id: vId,
      vendorId: vendor.id,
      registrationNumber: `KA${String((i % 99) + 1).padStart(2, '0')}AB${String(1000 + i).padStart(4, '0')}`,
      model: 'Sedan ' + (i % 5),
      manufacturer: 'Brand ' + (i % 3),
      yearOfMake: 2018 + (i % 6),
      seatingCapacity: 4 + (i % 4),
      fuelType: fuelTypes[i % 5],
      status,
      disabledReason,
      assignedDriverId: null,
      createdAt: iso(-30 * dayMs)
    };
  });

  const drivers = [];
  const documents = [];
  
  for (let i = 0; i < 120; i++) {
    const dId = uuid();
    const vId = vehicles[i].id;
    vehicles[i].assignedDriverId = dId;
    
    drivers.push({
      id: dId,
      vendorId: vehicles[i].vendorId,
      employeeCode: `EMP${1000 + i}`,
      firstName: `DriverFirst${i}`,
      lastName: `DriverLast${i}`,
      phone: `9${String(100000000 + i)}`,
      email: `driver${i}@example.com`,
      licenseNumber: `DL${String(1000000 + i)}`,
      assignedVehicleId: vId,
      status: 'active',
      createdAt: iso(-30 * dayMs)
    });

    let dlExpiry;
    if (i < 40) {
      dlExpiry = iso(60 * dayMs);
    } else if (i < 80) {
      dlExpiry = iso(15 * dayMs);
    } else {
      dlExpiry = iso(-5 * dayMs);
    }

    documents.push({
      id: uuid(),
      driverId: dId,
      type: 'DL',
      number: `DL${1000 + i}`,
      expiryDate: dlExpiry,
      verificationStatus: 'verified',
      uploadedByVendorId: vehicles[i].vendorId
    });

    documents.push({
      id: uuid(),
      driverId: dId,
      type: 'RC',
      number: `RC${1000 + i}`,
      expiryDate: iso(100 * dayMs),
      verificationStatus: 'verified',
      uploadedByVendorId: vehicles[i].vendorId
    });
    
    documents.push({
      id: uuid(),
      driverId: dId,
      type: 'INSURANCE',
      number: `INS${1000 + i}`,
      expiryDate: iso(100 * dayMs),
      verificationStatus: 'verified',
      uploadedByVendorId: vehicles[i].vendorId
    });
  }

  return {
    schemaVersion: 1,
    currentVendorId: null,
    vendors,
    delegations,
    vehicles,
    drivers,
    documents,
    auditLog: []
  };
}
