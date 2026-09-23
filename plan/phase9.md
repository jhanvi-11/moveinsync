### Phase 9 — Dashboard & Alerts

**Scope**
- `pages/DashboardPage.jsx` — role-aware KPIs:
  - **Fleet:** active / pending_verification / disabled counts within scope.
  - **Drivers:** active / pending drivers.
  - **Documents:** expiring (≤30 days) and expired counts.
  - **Pending verifications:** documents awaiting super action.
  - **Recent activity** widget (last 10 `auditLog` entries visible to scope).
  - **Alerts panel:** top 5 expired/expiring items needing action.
- Hero strip with teal gradient (per visual identity spec).
- Skeletons on first render (during async hydration).
- Notistack toast wired into Dashboard-level actions triggered here.

**Tests**
- `DashboardPage.test.jsx` (RTL) — KPIs compute correctly for super vs sub-vendor scopes; skeleton renders during loading state.
- `reports.service.test.js` — KPI aggregation helpers (`countActiveVehicles`, `countExpiringDocs`) return correct numbers given seed data and scope.

**Verify**
- Super dashboard shows cross-tenant totals.
- Regional dashboard shows only own + descendants.
- After uploading an expiring DL, alert pill appears on dashboard.
- Tests green.

**Commit message:**
```
feat(dashboard): role-aware KPIs, alerts, recent activity with skeletons

- Role-aware KPIs: fleet, drivers, documents, pending verifications
- Recent activity widget pulling from auditLog
- Alerts panel: top expired/expiring items needing action
- Hero strip with teal gradient per visual identity spec
- Skeletons during async hydration
- Tests: KPI computation per scope, skeleton rendering, report aggregation
