### Phase 2 — Data Layer, RBAC & Audit Log

**Scope**
- `services/storage.js` — async (200 ms simulated), versioned (`schemaVersion: 1`), debounced (300 ms), cross-tab `storage` event listener, quota-error toast hook.
- `data/seed.js` — hand-authored hierarchy + deterministic 120/120 generator using seeded PRNG.
- `state/AppContext.jsx` + `state/reducers.js` — single store, action types for every CRUD + auth switch, debounced persistence.
- `services/auditLog.service.js` — `logAction()` helper.
- `services/rbac.service.js` — `can()`, `scopeOf()`, `getAncestorChain()`, baseline + delegation merge with conflict-resolution rule.
- `hooks/usePermission.js` + `hooks/useVendorDescendants.js`.
- Audit log wiring: every mutation in `reducers.js` calls `logAction()` (FIFO cap 200).

**Tests**
- `storage.test.js` — round-trips AppState; honors `schemaVersion`; debounce coalesces writes.
- `rbac.test.js` — covers:
  - Super/Regional/City/Local baseline permissions.
  - Delegation grant extends scope.
  - **Conflict rule:** narrow grant beats broad grant at same permission.
  - **Conflict rule:** revocation at any ancestor beats grants from less-specific ancestors.
  - `scopeOf('fleet.write')` returns correct vendor IDs.
- `auditLog.test.js` — `logAction` appends and caps at 200.
- `getDocumentStatus` (in `documents.service.js`) — `valid`, `expiring_soon` (29 days), `expired` (-1 day).

**Verify**
- Unit tests green.
- `storage.test.js` runs in jsdom and round-trips a sample state.
- Manual: in `main.jsx` wire a temporary debug log of the loaded state to confirm seed shape.

**Commit message:**
```
feat(data): storage layer, seed data, RBAC service with conflict rule, audit log

- Async, versioned, debounced LocalStorage wrapper with cross-tab sync
- Seed: 1 super + 3 regional + 6 city + 8 local + deterministic 120 vehicles + 120 drivers + ~360 documents + 4 delegations
- AppContext + reducer for full CRUD + auth switch
- RBAC service: baseline + delegation merge with conflict-resolution rule
  (most specific wins; revocations always override grants)
- Audit log middleware: logAction() called from every mutation, FIFO cap 200
- Tests: storage round-trip, RBAC scenarios (incl. conflict rule), getDocumentStatus, audit log
