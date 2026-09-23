### Phase 7 — Documents Module

**Scope**
- `services/documents.service.js` — full CRUD + `getDocumentStatus()` + cross-vendor aggregation helpers + vehicle auto-flag.
- `components/document/DocumentUploadDialog.jsx` — mock upload: file picker, type, number, issuing authority, issued/expiry dates, optional filename/dataURL. Validates per type (DL regex, RC no expiry, etc.).
- `components/document/DocumentRow.jsx` — type icon, status chip, expiry date, verify/reject actions.
- `components/document/DocumentSearchBar.jsx` — type/status/vendor filters.
- `components/driver/DocumentList.jsx` upgraded from placeholder to real list rendering `DocumentRow`s.
- `pages/DocumentsPage.jsx` — cross-vendor Documents center with `DataTable` + `DocumentSearchBar`; expiration sorting default.
- Vehicle auto-flag: any mandatory-doc (DL/RC/INSURANCE) expired → vehicle status → `pending_verification` on save.

**Tests**
- `documents.service.test.js` — `getDocumentStatus` for valid (90 days), expiring (15 days), expired (-5 days); vehicle auto-flag transitions; type-specific validation (DL regex; RC expiry optional).
- `DocumentUploadDialog.test.jsx` (RTL) — DL number field shows validation error on bad format; date picker enforces expiry > issued.
- `DocumentsPage.test.jsx` (RTL) — filter by "expiring" + "DL" reduces rows correctly; sorted by expiry ascending by default.

**Verify**
- Upload DL/RC/Permit; `StatusChip` color + icon + text react to expiry changes.
- DriversPage and DriverDetailPage document sections show same data.
- Vehicle shows `pending_verification` chip when its driver's DL is past expiry.
- Tests green.

**Commit message:**
```
feat(documents): document upload mock with expiry tracking and cross-vendor center

- DocumentUploadDialog with type-aware validation and mock file storage
- DocumentRow with accessible icon-only buttons (aria-label)
- getDocumentStatus returns valid / expiring_soon / expired
- Cross-vendor DocumentsPage with DocumentSearchBar filters (type, status, vendor)
- Vehicle auto-flag to pending_verification on mandatory doc expiry
- getDocumentStatus exposed via services and reused in dashboard
- Tests: expiry states, vehicle auto-flag, type validation, page filtering
