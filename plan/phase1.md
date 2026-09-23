### Phase 1 — Project Bootstrap & Visual Identity

**Scope**
- Scaffold Vite + React (JS template) in `moveinsync/`.
- Install all runtime, dev, and test dependencies.
- Configure Vite (`@/` path alias, `manualChunks`), ESLint, Prettier, Vitest config.
- Initialize git; add `.gitignore`, `.eslintrc.cjs`, `.prettierrc`, `vercel.json`, `netlify.toml`.
- Build theme (`palette.js`, `typography.js`, `theme/index.js`) with Inter + JetBrains Mono imported via `@fontsource/*`.
- Wire `main.jsx` with `ThemeProvider` + `CssBaseline` + a minimal `App.jsx` rendering a styled hero ("MoveInSync Vendor Hub") so the visual identity is immediately verifiable.
- Set up `vitest` config and a smoke test on the rendered hero.

**Tests (run `npm run test` at end of phase)**
- `App.test.jsx` — renders `<App />` and asserts the hero heading "MoveInSync Vendor Hub" appears; verifies primary color token matches `rgb(13,148,136)`.

**Verify**
- `npm run dev` — hero renders with teal primary, Inter font, JetBrains Mono on small data spot.
- `npm run build` — three chunks (`react-vendor`, `mui`, `app`) emitted.
- `npm run test` — smoke test passes.

**Commit message:**
```
chore(bootstrap): scaffold Vite + React with MUI theme, code-splitting, and dev tooling

- React + Vite (JS) project scaffold
- MUI v5 with custom teal/amber palette and Inter/JetBrains Mono typography
- Vite manualChunks split (react-vendor / mui / app)
- ESLint + Prettier + Vitest configured
- App shell renders branded hero for visual verification
- vercel.json + netlify.toml for later deployment
