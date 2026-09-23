### Phase 10 — Polish, Deployment & Documentation

**Scope**
- Toast wiring on remaining CRUD actions (Delegation grant/revoke, Vendor enable/disable, etc.) that didn't get toasts in earlier phases.
- A11y polish: focus-visible globally; verify every icon-only button has aria-label + tooltip; verify tables have visually-hidden captions.
- Responsive basic check at 375 px width (Drawer behavior, no horizontal overflow on Dashboard, Vendors, Fleet, Drivers, Documents).
- `npm run build` + `npm run preview` verification on production bundle.
- `npx vercel --prod` deploy; capture live URL.
- Write `README.md` with:
  - Live demo link at top.
  - Run instructions.
  - Demo walkthrough (numbered, what to click to see each feature).
  - Architectural seam paragraph (`services/*.service.js` → fetch() swap).
  - Delegation conflict rule paragraph with example.
  - Cascading-disabled rule paragraph.
  - Feature matrix mapped to brief criteria.

**Tests (final regression sweep)**
- `npm run test` — full unit suite green (all phases).
- Add a final smoke test: `App.test.jsx` mounts `App` with a stubbed storage returning the seed; asserts Dashboard heading, sidebar present, no console errors.

**Verify**
- Production build succeeds; chunks visible in `dist/assets/` (`react-vendor`, `mui`, `app`).
- `npx vercel --prod` produces a live URL.
- Open the live URL: dashboard loads, role switcher works, the demo walkthrough in README is reproducible.
- 375 px viewport: no horizontal overflow on Dashboard, Vendors, Fleet, Drivers, Documents.

**Commit message:**
```
chore(release): a11y polish, responsive checks, deploy to Vercel, complete README

- A11y polish: focus-visible globally, icon button aria-labels verified
- Responsive verification at 375 px (drawer behavior, no overflow)
- vercel.json SPA rewrite + live deploy via npx vercel --prod
- README: live demo link, demo walkthrough, REST-swap paragraph,
  delegation conflict rule, cascade rule, feature matrix
- Toast wiring for remaining CRUD actions
- Final smoke test: App mounts with seed, no console errors
