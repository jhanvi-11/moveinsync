### Phase 8 — Delegations Module

**Scope**
- `services/delegations.service.js` — grant, revoke, active-only filtering; permission matrix validation (at least one permission; overrideActions only for regional+).
- `components/vendor/DelegationDialog.jsx` — checkbox matrix UI: 5 permission columns × vendor row; scope selector (`onlyDescendants` toggle); notes field.
- `pages/DelegationsPage.jsx` — current vendor's outbound delegations + inbound grants + history (revoked).
- Conflict-rule demo seed data wired into `data/seed.js` so reviewers see the rule in action.
- Side-effect: revoking an active delegation triggers immediate RBAC recompute (visible via PermissionGate flip).

**Tests**
- `delegations.service.test.js` — grant validation (descendant relationship, override-actions business rule, at-least-one permission); revoke transitions.
- `rbac.service.test.js` (extended) — explicit conflict-rule scenarios:
  - Broad grant at super + narrow grant at regional → narrow wins for shared permission.
  - Revocation at any ancestor (super) beats grants at less-specific descendants.
- `DelegationsPage.test.jsx` (RTL) — granting `fleetOnboarding` updates the table; revoking removes the row and triggers visible PermissionGate change.

**Verify**
- Super grants to regional; flipping role shows new capabilities in FleetPage; revoking removes them.
- Conflict-rule demo loads correctly: reviewer's `payments` permission visibly denied despite broad grant at top.
- Tests green.

**Commit message:**
```
feat(delegations): permission matrix with grant/revoke and conflict-resolution demos

- DelegationDialog: 5-permission matrix + scope (onlyDescendants) + notes
- DelegationsPage: outbound, inbound, and history (revoked) tabs
- Conflict-rule seed demo loaded so reviewers see the rule in action
- Revoking a delegation immediately flips downstream PermissionGate behavior
- Tests: grant validation, revocation transitions, conflict-rule precedence, page interactions
