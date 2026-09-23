### Phase 3 — App Shell, Mock Auth & Routing

**Scope**
- `layouts/AppShell.jsx` — responsive Drawer (permanent `md+`, temporary `xs/sm`); top bar; main content area with skip link target `#main-content`.
- `layouts/TopBar.jsx` — logo, page title, current vendor chip with level badge.
- `components/rbac/RoleSwitcher.jsx` — MUI `Autocomplete` (full ARIA combobox), `aria-live` announcement region.
- `components/common/StatusChip.jsx`, `EmptyState.jsx`, `SkeletonBlock.jsx`, `ConfirmDialog.jsx`, `KpiCard.jsx`.
- `components/rbac/PermissionGate.jsx`.
- `routes/routes.js`, `routes/ProtectedRoute.jsx`, `routes/ErrorBoundary.jsx` (global).
- `pages/LoginPage.jsx` (mock vendor picker).
- Placeholder pages for every route (`DashboardPage`, `VendorsPage`, etc.) so routing/navigation work end-to-end before domain logic lands.
- `App.jsx` — `<Suspense>` per route with `<PageSkeleton />`.
- Notistack provider in `main.jsx`; toasts only on quota error at this stage.

**Tests**
- `ProtectedRoute.test.jsx` — redirects to `/login` when not authenticated; redirects to `/403` when permission denied.
- `PermissionGate.test.jsx` — renders children when allowed; renders fallback (or nothing) when denied.
- `RoleSwitcher.test.jsx` — keyboard `ArrowDown` + `Enter` selects a vendor and triggers `currentVendorId` change (RTL with `user-event`).
- Smoke test: `App.test.jsx` extended — clicking "Vendors" in sidebar when authed reaches `<VendorsPage />` placeholder.

**Verify**
- `npm run dev` — login screen → pick super → land on dashboard with sidebar populated; role switcher shows current vendor and lists all vendors; sidebar hides nav items based on role.
- `npm run test` — gate tests pass.

**Commit message:**
```
feat(shell): responsive app shell, mock auth, permission-aware routing

- Responsive AppShell: permanent drawer on md+, temporary on xs/sm
- TopBar with RoleSwitcher (MUI Autocomplete, full ARIA combobox)
- PermissionGate and ProtectedRoute components with tested behavior
- Global ErrorBoundary + per-route Suspense/PageSkeleton
- Common components: StatusChip, EmptyState, SkeletonBlock, ConfirmDialog, KpiCard
- LoginPage with mock vendor picker
- Placeholder pages for every route wired into App.jsx
- Notistack provider for toasts (quota error wired)
- Tests: ProtectedRoute, PermissionGate, RoleSwitcher keyboard nav
