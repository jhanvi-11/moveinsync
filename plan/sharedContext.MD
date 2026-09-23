# Vendor Cab & Driver Onboarding & Hierarchy Management — Implementation Plan

## Context

The workspace `C:\Users\jhanv\OneDrive\Desktop\moveinsync` is empty. We are building a single-page React app for a multi-level vendor management system covering:

- **Hierarchy** — flexible N-level vendor tree (Super → Regional → City → Local) with role-based access.
- **Delegation** — Super vendors grant granular permissions (fleet onboarding, driver onboarding, payments, reports, override) to sub-vendors, with revoke.
- **Fleet & drivers** — vehicle and driver onboarding with required documents (DL, RC, Permit, Pollution) and expiry tracking.
- **Super oversight** — centralized dashboard, cross-vendor visibility, ability to override or disable non-compliant vehicles.

The goal is a working demo that exercises every feature end-to-end with persistent mock data, an intuitive UI, accessible and responsive surfaces, and clean architecture that demonstrates performance thinking at scale.

**Stack chosen:** React + Vite + JavaScript (no TS), Material UI v5, LocalStorage persistence, deployed on Vercel for a shareable live link. Node 22 / npm 11 are available. Directory is not yet a git repo.

---

## Visual Identity (defined up front — not default MUI)

Distinct palette + typography chosen intentionally so the app looks like a real product, not a generic MUI demo:

- **Palette** (`theme/palette.js`):
  - Primary: teal `rgb(13,148,136)` (corporate, transport-feel).
  - Secondary: warm amber `rgb(245,158,11)` (used sparingly for primary CTAs and highlights).
  - Background: `rgb(248,250,252)` (slate-50); surfaces `rgb(255,255,255)`.
  - Text: primary `rgb(15,23,42)`, secondary `rgb(71,85,105)`, disabled `rgb(148,163,184)`.
  - Semantic: success `rgb(22,163,74)`, warning `rgb(217,119,6)`, error `rgb(220,38,38)`, info `rgb(2,132,199)`.
  - Vendor-level accent chips: super = primary, regional = teal-700, city = teal-500, local = teal-300.
- **Typography** (`theme/typography.js`):
  - UI font: **Inter** (Google Fonts, self-hosted via `@fontsource/inter`).
  - Numerical/mono font for IDs, registration numbers, license numbers: **JetBrains Mono** (`@fontsource/jetbrains-mono`).
  - Display heading: Inter weight 700, tight letter-spacing.
- **Shape:** 10 px border radius; 1 px border on cards (`rgb(226,232,240)`).
- **Custom touches:** subtle gradient on the dashboard hero strip (`linear-gradient(135deg, teal-600 → teal-400)`); avatar circles generated from vendor initials with deterministic background color; data row hover uses teal-50 with a 2 px teal-600 left-border accent.
- **Logo treatment:** a small SVG mark (route icon + MONO "M" word) at `public/logo.svg` used in TopBar.

This is committed before any page is built so the visual identity is consistent from the first screen.

---

## Stack & Dependencies

**Scaffold:** `npm create vite@latest . -- --template react` (JS).

**Runtime:** `react`, `react-dom`, `react-router-dom`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `dayjs`, `notistack`, `@fontsource/inter`, `@fontsource/jetbrains-mono`.

**Dev:** `vite`, `@vitejs/plugin-react`, `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `prettier`.

**Tests:** `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.

**Deploy:** `vercel.json` (SPA rewrite), `npx vercel --prod`.

Use `crypto.randomUUID()` for IDs (no uuid dependency).

---

## MVP Cut Line (must ship vs. cut if time runs short)

### MUST SHIP (core flow + assignment criteria)

1. Vite scaffold + dependencies + distinct theme.
2. Storage layer (async, versioned, debounced).
3. Seed data: realistic hierarchy + 120 vehicles, 120 drivers, ~360 documents.
4. AppContext + reducer (CRUD + auth switch + audit log).
5. RBAC service including conflict-resolution rule; baseline + delegation merge.
6. `RoleSwitcher` (Autocomplete), `LoginPage`, `ProtectedRoute`.
7. `AppShell` — responsive Drawer + TopBar.
8. **Vendors** page: tree (keyboard nav), list with pagination/search/sort, parent-level rule enforcement, create/edit/disable with cascading banner rule.
9. **Fleet** page: list (paginated/sorted/searched), create, assign driver, disable (super only).
10. **Drivers** page: list, create, assign to vehicle, view documents.
11. **Documents**: upload mock dialog, expiry calculation, `StatusChip` (color + icon + text), cross-vendor Documents center.
12. **Delegations**: grant/revoke with permission matrix; conflict-rule demos in seed.
13. **Dashboard**: role-aware KPIs and recent activity (with skeleton).
14. **README** explaining run, demo walkthrough, delegation conflict rule, REST-swap seam, feature matrix.
15. **Deploy** to Vercel and include the live URL.
16. **Audit log wired** so the Settings viewer shows real entries.
17. **Basic accessibility**: ARIA on tree, ARIA on RoleSwitcher, color+icon+text on StatusChip, aria-label on every icon-only button.

### STRETCH (only after must-ship is verified)

18. Reports page (basic tabular view OK).
19. Settings page (audit log viewer, reset data).
20. Per-route ErrorBoundary (one global boundary is acceptable for MVP).
21. Component-level RTL tests (`PermissionGate`, `RoleSwitcher`, `DataTable`).
22. Responsive table-to-card reflow on mobile.
23. Skip link, focus-visible globally, reduced-motion respect.

---

## Project Structure

```
moveinsync/
├── index.html
├── package.json
├── vite.config.js                  # manualChunks: react-vendor / mui / app
├── vercel.json                     # SPA rewrite
├── .eslintrc.cjs
├── .gitignore
├── README.md                       # REST-swap paragraph, delegation rule, demo walkthrough, live link
└── src/
    ├── main.jsx                    # ThemeProvider + AppProvider + BrowserRouter + ErrorBoundary + NotistackProvider
    ├── App.jsx                     # Routes (lazy + Suspense)
    ├── theme/
    │   ├── palette.js
    │   └── typography.js
    ├── data/seed.js                # Hand-authored hierarchy + deterministic 120/120 generator
    ├── services/
    │   ├── storage.js              # Async, versioned, debounced
    │   ├── vendors.service.js
    │   ├── vehicles.service.js
    │   ├── drivers.service.js
    │   ├── documents.service.js    # + getDocumentStatus()
    │   ├── delegations.service.js
    │   ├── rbac.service.js         # can() + scopeOf() + conflict-resolution rule
    │   ├── reports.service.js      # STRETCH
    │   └── auditLog.service.js     # logAction()
    ├── state/
    │   ├── AppContext.jsx
    │   ├── reducers.js             # calls logAction() on every mutation
    │   └── useApp.js
    ├── hooks/
    │   ├── usePermission.js
    │   └── useVendorDescendants.js
    ├── routes/
    │   ├── ProtectedRoute.jsx
    │   ├── ErrorBoundary.jsx       # global (MVP); per-route (stretch)
    │   └── routes.js
    ├── layouts/
    │   ├── AppShell.jsx            # Responsive Drawer (permanent md+, temporary xs/sm)
    │   └── TopBar.jsx              # RoleSwitcher (Autocomplete)
    ├── components/
    │   ├── common/
    │   │   ├── StatusChip.jsx      # Color + icon + text
    │   │   ├── EmptyState.jsx
    │   │   ├── SkeletonBlock.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── KpiCard.jsx
    │   │   └── DataTable.jsx       # Pagination + sort + search + (stretch) responsive="card"
    │   ├── rbac/
    │   │   ├── PermissionGate.jsx
    │   │   └── RoleSwitcher.jsx
    │   ├── vendor/
    │   │   ├── VendorTree.jsx      # Keyboard nav
    │   │   ├── VendorCard.jsx
    │   │   ├── VendorForm.jsx      # level-rule enforced parent dropdown
    │   │   ├── VendorSearchBar.jsx
    │   │   ├── ParentDisabledBanner.jsx
    │   │   └── DelegationDialog.jsx
    │   ├── vehicle/
    │   │   ├── VehicleForm.jsx
    │   │   ├── VehicleCard.jsx
    │   │   └── DisableVehicleDialog.jsx
    │   ├── driver/
    │   │   ├── DriverForm.jsx
    │   │   ├── DriverCard.jsx
    │   │   ├── AssignVehicleDialog.jsx
    │   │   └── DocumentList.jsx
    │   ├── document/
    │   │   ├── DocumentUploadDialog.jsx
    │   │   ├── DocumentRow.jsx
    │   │   └── DocumentSearchBar.jsx
    │   └── reports/                # STRETCH
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── VendorsPage.jsx
    │   ├── VendorDetailPage.jsx
    │   ├── FleetPage.jsx
    │   ├── DriversPage.jsx
    │   ├── DriverDetailPage.jsx
    │   ├── DocumentsPage.jsx
    │   ├── DelegationsPage.jsx
    │   ├── ReportsPage.jsx         # STRETCH
    │   ├── SettingsPage.jsx        # STRETCH
    │   ├── NotAuthorizedPage.jsx
    │   └── NotFoundPage.jsx
    └── utils/
        ├── validation.js
        ├── a11y.js
        ├── cascade.js              # isAnyAncestorDisabled, isWriteAllowed
        └── constants.js            # EXPIRY_WARN_DAYS=30, PAGE_SIZE=25, VENDOR_LEVELS
```

---

## Data Models

All entities: `id` (UUID), `createdAt`, `updatedAt`, `tenantScope` (top-level super vendor id).

- **Vendor**: `name`, `code` (unique uppercase), `level` (super/regional/city/local), `parentId` (null only for super), `contact{email, phone, address, city, region}`, `status` (active/disabled/suspended), `contract{startDate, endDate, slaTier}`.
- **Delegation**: `fromVendorId`, `toVendorId`, `permissions{fleetOnboarding, driverOnboarding, payments, reports, overrideActions}`, `scope{onlyDescendants}`, `status` (active/revoked), `grantedAt`, `revokedAt`, `notes`.
- **Vehicle**: `vendorId`, `registrationNumber`, `model`, `manufacturer`, `yearOfMake`, `seatingCapacity`, `fuelType` (petrol/diesel/electric/cng/hybrid), `status` (active/disabled/maintenance/pending_verification), `disabledReason`, `assignedDriverId`, `insuranceExpiry`, `fitnessExpiry`.
- **Driver**: `vendorId`, `employeeCode`, `firstName`, `lastName`, `phone`, `email`, `licenseNumber`, `licenseExpiry`, `dateOfBirth`, `address`, `assignedVehicleId`, `status` (active/on_leave/terminated/pending_verification), `rating`.
- **Document**: `driverId`, `type` (DL/RC/PERMIT/POLLUTION/INSURANCE/MEDICAL/ADDRESS_PROOF), `number`, `issuingAuthority`, `issuedDate`, `expiryDate` (nullable for RC), `fileName`, `fileDataUrl`, `uploadedByVendorId`, `verifiedByVendorId`, `verificationStatus` (pending/verified/rejected), `rejectionReason`.
- **AppState** (LocalStorage root key `mis:vendor-mgmt:v1`): `schemaVersion`, `currentVendorId`, `vendors[]`, `delegations[]`, `vehicles[]`, `drivers[]`, `documents[]`, `auditLog[]`.
- **AuditEntry**: `id`, `actorVendorId`, `action`, `targetType`, `targetId`, `timestamp`, `details`.

---

## State Management

**Single `AppContext` + `useReducer`.** No Zustand/Redux. Reducer handles all CRUD plus auth switch. Writes are debounced 300 ms to LocalStorage. Selectors memoized via `useMemo`.

**Audit log wiring:** every mutation in `reducers.js` calls `logAction({action, targetType, targetId, details})`. Mutations covered: vendor create/update/disable, vehicle create/disable/override, driver create, document upload/verify/reject, delegation grant/revoke. Capped at 200 entries (FIFO trim).

A simulated 200 ms async hydration lets the skeleton states render on every cold boot.

---

## Routing & RBAC

React Router v6 with `<Outlet/>` in `AppShell`. Each page in `src/pages/` is `React.lazy()`. `App.jsx` wraps each route in `<Suspense fallback={<PageSkeleton />}>`. `vite.config.js` `manualChunks`:
- `react-vendor` (react, react-dom, react-router-dom, scheduler)
- `mui` (@mui/material, @mui/icons-material, @emotion/*)
- `app` (everything else)

| Path | Page | Permission |
|---|---|---|
| `/login` | LoginPage | public |
| `/` | DashboardPage | any |
| `/vendors`, `/vendors/:id` | VendorsPage, VendorDetailPage | vendors.read |
| `/fleet` | FleetPage | fleet.read |
| `/drivers`, `/drivers/:id` | DriversPage, DriverDetailPage | drivers.read |
| `/documents` | DocumentsPage | documents.read |
| `/delegations` | DelegationsPage | delegations.manage |
| `/reports` | ReportsPage (stretch) | reports.read |
| `/settings` | SettingsPage (stretch) | any |
| `/403` | NotAuthorizedPage | — |
| `*` | NotFoundPage | — |

**RBAC baseline:**
- Super: all permissions in tenantScope.
- Regional: all permissions on own + descendants.
- City: vendors.read, fleet.read/write, drivers.read/write, documents.read/upload, reports.read (own + descendants).
- Local: fleet.read/write, drivers.read/write, documents.read/upload, reports.read.

**Delegation conflict-resolution rule:**

> **Most specific active delegation wins; revocations always override grants.**
> `can(action, target)` walks the chain from `currentVendorId` upward; at each level the closest active delegation's per-permission flag (true = grant, status=`revoked` = deny) is read; once a level has decided the action, higher ancestors are not consulted.

**Helpers:** `services/rbac.service.js` exposes `can(action, target)`, `scopeOf(action)`, `getAncestorChain(vendorId)`. `<ProtectedRoute requiredPermission>` guards routes; `<PermissionGate action>` wraps inline UI.

---

## Cascading Effects (explicit rules)

### Vendor disabled / suspended

- **State cascade: NONE.** Children vendors, vehicles, and drivers do NOT auto-disable when a parent is disabled.
- **UI cascade: banner + write-block.** A `<ParentDisabledBanner />` appears on every page that touches entities owned by vendors in a disabled subtree: "Parent vendor `X` is disabled. Read-only until re-enabled." Banner links to the parent.
- **Mutation rules:**
  - Children of a disabled vendor cannot create/edit/disable other entities (parent must be re-enabled).
  - **Override:** super vendor can perform any mutation regardless of banner (`overrideActions`).
  - Read access is preserved everywhere.
- **Cascade helper:** `utils/cascade.js` exports `isAnyAncestorDisabled(vendorId, vendors)` (walks up parent chain) and `isWriteAllowed(targetVendorId, currentVendorId, vendors, canOverride)`.

### Parent dropdown in `VendorForm`

- A super vendor has `parentId = null`.
- A regional vendor's parent must be a super.
- A city vendor's parent must be a regional.
- A local vendor's parent must be a city.

General rule: a vendor at level `L` can have a parent at level `L-1`. The level is inferred from the parent's level (no separate `level` field at creation). Adding more levels (e.g., zone, area) is a config change to `VENDOR_LEVELS`.

---

## Forms & Document Expiry

- Validation hand-rolled in `utils/validation.js`. Live field errors via MUI `TextField error + helperText`.
- Indian formats: registration `^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$`, DL `^[A-Z]{2}\d{13}$`, phone `^[6-9]\d{9}$`.
- Driver ↔ Vehicle assignment updated transactionally inside the reducer on both sides.
- Delegation business rule: cannot grant `overrideActions` to non-regional vendors; at least one permission must be true; grantee must be a descendant of grantor.

**Document expiry (`getDocumentStatus`):** pure function returning `'valid' | 'expiring_soon' | 'expired'` based on `EXPIRY_WARN_DAYS = 30`. Vehicle auto-flags to `pending_verification` when mandatory docs (DL/RC/INSURANCE) are expired.

---

## Seed Data

`data/seed.js` exports `getSeedState()`. Hand-authored hierarchy (1 super + 3 regional + 6 city + 8 local) plus a **deterministic generator** producing **120 vehicles and 120 drivers** distributed via a seeded PRNG. ~360 documents (3 per driver). 4 delegations (3 active with varying permissions + 1 revoked). License expiries staggered: ~40 valid, ~40 expiring within 30 days, ~40 expired. Two vehicles pre-set to `disabled` and `maintenance`. One seeded delegation setup demonstrates the conflict rule: super grants `payments` to a regional (revoked) — so child cannot process payments.

---

## Loading & Skeletons

- `SkeletonBlock` — reusable tile.
- `PageSkeleton` — full-page skeleton while lazy chunks load.
- `DataTable` shows 8 skeleton rows during hydration.
- Respects `prefers-reduced-motion`.

---

## Tables & Scale

`DataTable` ships with **pagination (25 rows/page), sortable columns, and a search input** built in. The 120-item dataset visibly justifies it. `DocumentsPage` adds `DocumentSearchBar` (type/status/vendor filters). `VendorTree` has `VendorSearchBar` that filters/highlights matches without losing tree state.

---

## Toasts, Error Boundaries & UX Polish

- **Notistack** in `main.jsx`. MVP emits toasts on create/delete/disable/revoke and quota errors. STRETCH covers all CRUD.
- **`<ErrorBoundary>`** wraps the route tree (MVP: global; STRETCH: per-route).
- **`focusVisible`** styles globally enabled.
- **Icon-only buttons** carry `aria-label` + tooltip.
- **Empty states** for every list with permission-gated "Get started" CTAs.

---

## Accessibility (a11y)

- **Color is never the only signal.** `StatusChip` renders `<VerifiedIcon />` / `<WarningAmberIcon />` / `<ErrorOutlineIcon />` next to text label.
- **`VendorTree` keyboard nav:** Arrow Up/Down/Left/Right, Enter, Home/End; `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`, `aria-selected`.
- **`RoleSwitcher`:** MUI Autocomplete (full ARIA combobox); `aria-live="polite"` announcement.
- **Icon-only buttons** have `aria-label` + `title`.
- **Tables** have visually-hidden `<caption>`, `<th scope="col">`, sortable headers `aria-sort`.
- **Dialogs** use MUI `Dialog` (focus trap, `aria-modal`, restore focus, ESC).
- **Skip link** (STRETCH); **reduced-motion** respected; **WCAG AA contrast** verified.

---

## Responsive Layout

- **AppShell:** permanent drawer `md+`, temporary drawer `xs/sm` with hamburger.
- **TopBar:** collapses `RoleSwitcher` to icon on `xs`.
- **Tables:** STRETCH — collapse to cards on `xs` via `DataTable`'s `responsive="card"`.
- **VendorTree:** STRETCH — accordion on `xs`.
- **Touch targets** ≥ 44×44 on `xs`.

---

## Deployment

- `vercel.json`:
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Deploy via `npx vercel --prod`.
- README includes "Live demo" link at top.
- Netlify fallback `netlify.toml` committed alongside.

---

## README content

- **Live demo URL** at top.
- Run instructions (`npm install && npm run dev`).
- Demo walkthrough — what to click first to see each feature.
- **Architectural seam paragraph** explaining the services/→REST swap.
- **Delegation conflict rule** paragraph with example.
- **Cascading-disabled rule** paragraph.
- Feature matrix mapped to the brief's evaluation criteria.
- Screenshots / demo video link.
