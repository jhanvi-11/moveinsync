### Phase 4 — Vendors Module

**Scope**
- `utils/cascade.js` — `isAnyAncestorDisabled()`, `isWriteAllowed()`.
- `utils/constants.js` — `VENDOR_LEVELS`, `PAGE_SIZE`, `EXPIRY_WARN_DAYS`.
- `utils/validation.js` — vendor field validators (name, code unique uppercase, email, Indian phone).
- `components/vendor/VendorTree.jsx` — recursive, full keyboard nav (Arrow keys + Enter + Home/End), ARIA tree roles.
- `components/vendor/VendorCard.jsx`, `components/vendor/VendorForm.jsx` (level-rule enforced parent dropdown), `components/vendor/VendorSearchBar.jsx`.
- `components/vendor/ParentDisabledBanner.jsx`.
- `services/vendors.service.js` — CRUD plus parent rule + code uniqueness + cascading-disabled checks.
- `pages/VendorsPage.jsx` — tree + table (paginated/sortable/searchable `DataTable`).
- `pages/VendorDetailPage.jsx` — tabs: Overview, Fleet, Drivers, Documents (placeholders until next phases).
- Disable/Enable vendor flow with cascade banner appearance verification.

**Tests**
- `cascade.test.js` — `isAnyAncestorDisabled` returns true when any ancestor in chain is disabled; false when none are.
- `vendors.service.test.js` — rejects creating a regional without super parent; rejects creating a local with regional parent; rejects duplicate code; allows disable/enable.
- `VendorForm.test.jsx` (RTL) — parent dropdown shows only vendors at level `L-1`; level field is read-only and reflects parent choice.
- `VendorTree.test.jsx` (RTL with `user-event`) — `ArrowRight` expands, `ArrowLeft` collapses, `Enter` activates selection.

**Verify**
- Create city under regional — appears in tree; dropdown rejected for wrong level.
- Disable regional — banner appears on its city/local descendants; tree shows disabled badge.
- Re-enable regional — banner disappears, child writes work again.
- Tests green.

**Commit message:**
```
feat(vendors): hierarchy CRUD with level-rule enforcement and cascade banners

- VendorTree with full keyboard nav (Arrow keys, Enter, Home/End) and ARIA tree roles
- VendorForm enforces one-level-up parent rule; level inferred from parent
- ParentDisabledBanner + cascade helpers (isAnyAncestorDisabled, isWriteAllowed)
- VendorsPage: tree + DataTable (pagination/sort/search)
- VendorDetailPage with tabs (Overview/Fleet/Drivers/Documents placeholders)
- Disable/enable vendor flow with cascade banner verification
- Tests: cascade helpers, parent-level rule, duplicate code rejection, tree keyboard nav
