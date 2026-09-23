## Phase 6 — Drivers Module

**Scope**
- `services/drivers.service.js` — CRUD, license validation, age ≥ 18 check, transactional driver ↔ vehicle assignment updating both sides.
- `components/driver/DriverForm.jsx` — license format validation, expiry date picker, warnings for expiring licenses.
- `components/driver/DriverCard.jsx`, `AssignVehicleDialog.jsx`, `DocumentList.jsx` (placeholder list rendering upcoming `DocumentRow`).
- `pages/DriversPage.jsx` — list with `DataTable`; create/edit dialogs.
- `pages/DriverDetailPage.jsx` — profile, assigned vehicle, document section (receives real `DocumentRow` in next phase).
- Integrate with `VendorDetailPage` "Drivers" tab.
- Wire `documents.service` helpers (`getDocumentStatus`) used by `DocumentList`.

**Tests**
- `drivers.service.test.js` — license regex accepts/rejects; age validation; create/update; vehicle assignment updates both `driver.assignedVehicleId` and `vehicle.assignedDriverId` atomically.
- `AssignVehicleDialog.test.jsx` (RTL) — assigning a driver to a vehicle that's already assigned to a different driver offers "Reassign" flow that clears the previous link.

**Verify**
- Add driver under local vendor; license expiry in past triggers a warning.
- Assign driver to vehicle — vehicle's `assignedDriverId` updates; refresh confirms persistence.
- Tests green.

**Commit message:**
```
feat(drivers): driver CRUD with vehicle assignment and profile pages

- Driver CRUD with license format validation and age check
- Transactional vehicle assignment (driver + vehicle sides stay in sync)
- AssignVehicleDialog with reassignment handling
- DriversPage and DriverDetailPage with full DataTable and document section
- Driver detail integrates with VendorDetailPage drivers tab
- getDocumentStatus helper exposed via documents.service for next phase
- Tests: license validation, age rule, atomic assignment, reassignment flow
