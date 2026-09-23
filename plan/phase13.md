### Phase 13 — Polish extensions (stretch)

**Scope** — per-route ErrorBoundary, `DataTable` `responsive="card"` mode for mobile, skip link, reduced-motion refinement, additional RTL component tests for `PermissionGate` / `RoleSwitcher` / `DataTable`.

**Tests** — per-route ErrorBoundary catch test (force throw in a placeholder page); responsive mode test.

**Commit message:**
```
chore(polish): per-route ErrorBoundary, responsive tables, skip link, RTL component tests

- Per-route ErrorBoundary wrappers
- DataTable responsive="card" mode on xs
- Skip link to #main-content
- Reduced-motion refinement across skeletons and MUI motion
- RTL component tests: PermissionGate, RoleSwitcher, DataTable responsive
