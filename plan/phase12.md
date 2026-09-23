### Phase 12 — Settings Page (stretch)

**Scope** — `pages/SettingsPage.jsx` with audit log viewer (read-only table) and "Reset to seed" button with confirmation dialog.

**Tests** — `SettingsPage.test.jsx` — audit log renders entries from state; reset triggers confirmation + reseed.

**Commit message:**
```
feat(settings): audit log viewer and reset-to-seed flow

- Audit log viewer with read-only DataTable
- Reset to seed button with confirmation
- Tests: rendering audit log entries, reset flow
