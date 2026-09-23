### Phase 5 — Fleet/Vehicles Module

**Scope**
- `components/common/DataTable.jsx` — full implementation: pagination (25/page), sortable columns, search input, optional `responsive="card"` (stretch).
- `services/vehicles.service.js` — CRUD with unique registration validator.
- `utils/validation.js` additions — registration `^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$`, year range, capacity 1–50.
- `components/vehicle/VehicleForm.jsx`, `VehicleCard.jsx`, `DisableVehicleDialog.jsx` (aria-labelled icon button; reason required when disabling).
- `pages/FleetPage.jsx` — list (paginated/sortable/searchable), add/edit dialogs.
- Vehicle assignment to driver — inverse updated through reducer (when driver assigned in a later phase, it updates `vehicle.assignedDriverId`; vice versa).
- Vehicle auto-flag to `pending_verification` when mandatory docs are expired (logic; no UI yet — surfaces via dashboard alert in Phase 9).

**Tests**
- `DataTable.test.jsx` (RTL) — pagination responds to clicks, sort flips asc/desc on header click, search input filters rows.
- `vehicles.service.test.js` — rejects duplicate registration; allows create + update; disable requires reason; flip maintenance ↔ active.
- `FleetPage.test.jsx` (RTL) — Disable button visible only to super; confirm dialog appears; entry persists after refresh.

**Verify**
- Add vehicle at local vendor; appears in list; search by registration filters; pagination visible (120 rows).
- Super disables a vehicle with reason — disabled-state visible to super and to the owning sub-vendor.
- Non-super cannot disable.
- Tests green.

**Commit message:**
```
feat(fleet): vehicle CRUD with paginated DataTable and super-only disable flow

- DataTable component: pagination (25/page) + sortable columns + search input
- Vehicle CRUD with unique registration validation and seating-capacity constraints
- DisableVehicleDialog with required reason; super-only access (PermissionGate)
- Vehicle auto-flag to pending_verification when mandatory docs expire
- FleetPage wired with VendorsPage tabs linking to filtered fleet
- Tests: DataTable pagination/sort/search, registration uniqueness, disable RBAC
