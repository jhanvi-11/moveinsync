
### Phase 11 — Reports Page (stretch)

**Scope** — `pages/ReportsPage.jsx` with tabs (Fleet Status, Expiring Documents, Vendor Performance) using `services/reports.service.js`.

**Tests** — `ReportsPage.test.jsx` (RTL) — tabs switch content; scope-aware filtering.

**Commit message:**
```
feat(reports): fleet status, expiring docs, vendor performance reports

- ReportsPage with three tabs and scope-aware filtering
- reports.service.js aggregations (KPI re-use)
- Tests: tab switching, scope filtering
