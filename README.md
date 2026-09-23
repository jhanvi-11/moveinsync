# MoveInSync Vendor Hub

> Multi-tier vendor management platform with hierarchical RBAC, delegation controls, fleet & driver onboarding, and document compliance tracking.


---

## Quick Start

```bash
# Clone and install
git clone https://github.com/jhanvi-11/moveinsync.git
cd moveinsync
npm install

# Development server (http://localhost:5173)
npm run dev

# Run tests
npm run test

# Production build
npm run build
npm run preview
```

**Requirements:** Node ≥ 18, npm ≥ 9

---

## Demo Walkthrough

Follow these steps to explore every major feature on the live demo (or locally):

### 1. Login & Dashboard
Open the app. You land on the **Dashboard** as the super-vendor *MoveInSync Global*. Note the four KPI cards (Fleet, Drivers, Documents, Verifications) and the Alerts / Recent Activity panels.

### 2. Role Switcher — Experience the Hierarchy
Click the **vendor dropdown** (top-right) and switch to *Regional Vendor 1*. The dashboard KPIs update to show only data scoped to that vendor and its descendants. Switch to *City Vendor 1* or *Local Vendor 1* to see increasingly narrower scopes. Notice how sidebar navigation items stay or hide based on each vendor's role-based permissions.

### 3. Vendor Hierarchy
Navigate to **Vendors** (sidebar). The left panel shows the full vendor tree. Click a node to highlight it; the right table filters to show matching vendors. Click any vendor row to open its detail page.

### 4. Vendor Enable / Disable (Cascading Rule)
From a vendor detail page, click **Disable Vendor**. A toast confirms the action. Now switch role to a *child* of that vendor — you'll see a **"Parent Disabled" banner** and write operations are blocked for that subtree. Re-enable the parent to restore access.

### 5. Fleet Management
Navigate to **Fleet** (sidebar). Browse the paginated, sortable vehicle table. Click **Add Vehicle** to create one — a success toast appears. Click the 🚫 icon on any active vehicle to disable it with a reason.

### 6. Driver Management
Navigate to **Drivers** (sidebar). Click **Add Driver** to create a driver record. Click any driver row to open the **Driver Detail** page.

### 7. Vehicle Assignment
On a Driver Detail page, click **Assign Vehicle** to open the vehicle assignment dialog. Select a vehicle and assign it. If the vehicle is already assigned to another driver, a warning shows that it will be reassigned.

### 8. Document Center
Navigate to **Documents** (sidebar). Use the filter bar to filter by document type, status, or vendor. Documents nearing expiry (≤ 30 days) are flagged as warnings; expired documents show as errors.

### 9. Delegations — Grant & Revoke
Switch role back to *MoveInSync Global*. Navigate to **Delegations** (sidebar). Click **New Delegation**, pick a descendant vendor, check permission boxes (Fleet Onboarding, Driver Onboarding, etc.), select scope, and click **Grant Delegation**. The outbound tab updates. Click the revoke (🚫) icon to revoke a delegation — notice the info toast and the record moving to the History tab.

### 10. Delegation Conflict Rule in Action
The seed data demonstrates this: *MoveInSync Global* grants `payments` to *Regional Vendor 1* (active). Then *Regional Vendor 1* **revokes** `payments` from *City Vendor 1*. Switch role to *City Vendor 1* — the `payments` permission is blocked because the narrower revocation at the closer ancestor takes precedence over the broader grant at the root.

---

## Architecture

### Service-Layer Seam — Ready for REST

All data operations live in **`src/services/*.service.js`** modules:

| Service | Purpose |
|---|---|
| `vendors.service.js` | Create / update vendors |
| `vehicles.service.js` | Create / update / disable vehicles |
| `drivers.service.js` | Create / update drivers, assign vehicles |
| `delegations.service.js` | Grant / revoke delegations |
| `documents.service.js` | Document queries, expiry status |
| `reports.service.js` | Dashboard KPIs, alerts, activity |
| `rbac.service.js` | Permission checks (`can`, `scopeOf`) |
| `auditLog.service.js` | Audit log entries |
| `storage.js` | LocalStorage persistence |

Currently every service function reads from and writes to a React context backed by `localStorage`. To connect to a real backend, **replace each function body with a `fetch()` / `axios` call** — the function signatures and return shapes stay the same, so no component changes are needed. For example:

```js
// Before (localStorage)
export const createVehicle = (data, state) => { ... return created; }

// After (REST)
export const createVehicle = async (data) => {
  const res = await fetch('/api/vehicles', { method: 'POST', body: JSON.stringify(data) });
  return res.json();
};
```

### Delegation Conflict Rule

Delegations use a **narrowest-ancestor-wins** resolution:

1. When checking whether a vendor has a delegated permission (e.g. `payments`), the system walks the vendor's ancestor chain from the vendor itself toward the root.
2. The **first** ancestor that has an active or revoked delegation for that permission determines the outcome.
3. If that closest delegation is **revoked**, access is denied — even if a broader grant exists higher in the tree.

**Example from seed data:**

```
MoveInSync Global  ──grants payments──▶  Regional Vendor 1   ✅
Regional Vendor 1  ──revokes payments──▶  City Vendor 1       ❌
```

City Vendor 1 sees the revocation first (it's closer in the ancestor chain), so `payments` is blocked despite the global grant above it.

### Cascading-Disabled Rule

When a vendor is **disabled**:

- All **descendant vendors** are blocked from write operations (create/update/delete for fleet, drivers, documents).
- A **"Parent Disabled" banner** renders on every descendant's page.
- The system walks the ancestor chain via `isAnyAncestorDisabled()` — if any ancestor is `disabled` or `suspended`, writes are blocked.
- Vendors with `overrideActions` permission bypass this restriction.
- Re-enabling the parent immediately restores write access to the entire subtree (no per-child re-enable needed).

---

## Feature Matrix

| # | Feature | Brief Criteria |
|---|---|---|
| 1 | **Multi-tier Vendor Hierarchy** | 4 levels (Super → Regional → City → Local); tree view + table |
| 2 | **Role-based Access Control** | `can(action, target)` permission check; PermissionGate component |
| 3 | **Role Switcher** | Top-bar vendor dropdown; instant context switch; scoped data |
| 4 | **Dashboard KPIs** | Fleet / Drivers / Documents / Verifications cards with alerts |
| 5 | **Fleet Management** | CRUD vehicles; disable with reason; sortable/searchable table |
| 6 | **Driver Management** | CRUD drivers; detail page; assign/unassign vehicle |
| 7 | **Document Center** | Filter by type/status/vendor; expiry tracking (expired/expiring/valid) |
| 8 | **Delegation System** | Grant/revoke delegated permissions; outbound/inbound/history tabs |
| 9 | **Delegation Conflict Resolution** | Narrowest-ancestor-wins; revocation overrides broader grant |
| 10 | **Cascading Disable** | Disabled vendor blocks writes for entire subtree; banner shown |
| 11 | **Audit Logging** | Actions recorded to audit log; recent activity on dashboard |
| 12 | **Toast Notifications** | notistack-powered toasts on all CRUD actions (success/error/warning) |
| 13 | **Lazy Loading** | Route-level code splitting with React.lazy + Suspense skeletons |
| 14 | **Error Boundary** | Catches render errors; fallback UI prevents white-screen crashes |
| 15 | **LocalStorage Persistence** | State survives page reload; quota-exceeded detection |
| 16 | **Protected Routes** | Permission-gated routing; redirect to 403 on unauthorized access |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| UI Library | MUI (Material UI) v9 |
| Routing | React Router v7 |
| State | React Context + useReducer |
| Toasts | notistack v3 |
| Persistence | localStorage (service-layer swap for REST) |
| Testing | Vitest + Testing Library |
| Linting | OxLint |
| Formatting | Prettier |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── common/       # DataTable, StatusChip, SkeletonBlock, ConfirmDialog
│   ├── driver/       # DriverForm, DriverCard, AssignVehicleDialog, DocumentList
│   ├── document/     # DocumentSearchBar, DocumentRow
│   ├── rbac/         # PermissionGate, RoleSwitcher
│   ├── vehicle/      # VehicleForm, VehicleCard, DisableVehicleDialog
│   └── vendor/       # VendorForm, VendorTree, DelegationDialog, ParentDisabledBanner
├── data/
│   └── seed.js       # Deterministic seed (120 vehicles, 120 drivers, 360 docs)
├── hooks/            # usePermission, useVendorDescendants
├── layouts/          # AppShell, Sidebar, TopBar
├── pages/            # Dashboard, Vendors, Fleet, Drivers, Documents, Delegations, ...
├── routes/           # Route config, ProtectedRoute, ErrorBoundary
├── services/         # Business logic (swappable for REST)
├── state/            # AppContext (context + reducer)
└── utils/            # cascade, validation, constants
```

---

## License

MIT
