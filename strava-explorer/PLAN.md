# Strava 3D Explorer — Security, Clarity, Testing & UX Overhaul Plan

Audit date: 2026-07-03. Scope: `strava-explorer/` only (plus shared root docs/CI that reference it). This plan is written for implementation by subagents; each task lists files, exact changes, and acceptance criteria. Work on branch `claude/strava-map-audit-ux-72q65p`.

## Ground rules for all implementers (Google Maps Platform)

- This app uses: Maps JavaScript API (Photorealistic 3D / `maps3d`), Map Tiles API (3D tiles), Elevation API (JS `ElevationService`).
- **Ground every non-trivial GMP change** against live docs. In this environment `www.gstatic.com` (skills index) is proxy-blocked; use the REST fallback, which works:
  ```bash
  curl -sS -X POST 'https://mapscodeassist.googleapis.com/v1:retrieveContexts' \
    -H 'Content-Type: application/json' \
    -d '{"llmQuery": "<your question>", "source": "claude-code"}'
  ```
- Never introduce legacy APIs (`google.maps.Marker`, `PlacesService`, `DirectionsService`, `Geocoder` JS class, `HeatmapLayer`, drawing lib). The app currently uses none — keep it that way.
- Keep vanilla JS + `@googlemaps/js-api-loader` v2 (`setOptions` + `importLibrary`). No React.
- Map container must keep explicit height (CF2). Headless tests cannot assert WebGL rendering (CF3) — assert DOM/UI state only.
- Keep all ToS/attribution language in READMEs; add the usage attribution ID (task E2).

---

## Workstream A — Security (P0, do first)

### A1 — CRITICAL: Remove the Strava client secret from the browser entirely
**Problem:** `src/strava.js` reads `VITE_STRAVA_CLIENT_SECRET` (baked into the public bundle by Vite), and `.github/workflows/deploy.yml` passes `VITE_STRAVA_CLIENT_SECRET` into the production build env — meaning the deployed bundle contains the OAuth secret even though a broker exists.
**Changes:**
1. `src/strava.js`: delete `STRAVA_CLIENT_SECRET` and the entire direct-to-Strava token path in `exchangeToken()` / `refreshAccessToken()`. The client always calls a broker: `${STRAVA_AUTH_BASE_URL}/api/strava/...`, where `STRAVA_AUTH_BASE_URL` defaults to `''` (same-origin) when `VITE_STRAVA_AUTH_BASE_URL` is unset.
2. Extract the broker's three Strava handlers plus photo-proxy validation from `server/server.js` into dependency-free functions in `server/broker.js` (pass `clientId`, `clientSecret`, `fetch` in). `server/server.js` keeps only HTTP wiring.
3. `vite.config.js`: add a small dev-only plugin (`configureServer`) that mounts `/api/strava/token|refresh|deauthorize` and `/api/photo-proxy` on the Vite dev server using `server/broker.js`, reading **non-VITE** `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` via `loadEnv(mode, dir, '')`. Local dev now works with the secret never leaving Node.
4. `.github/workflows/deploy.yml`: remove `VITE_STRAVA_CLIENT_SECRET` from `env`; keep `STRAVA_CLIENT_SECRET: ${{ secrets.STRAVA_CLIENT_SECRET }}` only for the Cloud Run deploy step.
5. Update `README.md` (env var section), `HOSTING.md`, `server/README.md` to describe the new model: dev = Vite middleware broker, prod = Cloud Run broker. Remove every mention of `VITE_STRAVA_CLIENT_SECRET`.
**Accept:** `grep -r VITE_STRAVA_CLIENT_SECRET` returns nothing; `npm run dev` login works with a `.env.development.local` containing non-VITE secret; `npm run build` output contains no secret; broker unit tests (C2) pass.

### A2 — OAuth CSRF protection (`state` parameter)
`src/strava.js#getStravaAuthUrl`: generate `state` via `crypto.randomUUID()`, store in `sessionStorage`, append to the authorize URL. In `src/index.js` callback handling: read `state` from URL, compare, and refuse the code exchange (with a clear error) on mismatch. Clear stored state after use.
**Accept:** tampered/missing state aborts exchange with visible error; happy path unaffected.

### A3 — Broker hardening (`server/server.js` / `server/broker.js`)
1. **CORS:** support comma-separated `ALLOWED_ORIGIN` list; when unset or `*`, log a prominent startup warning and (in `NODE_ENV=production`) refuse to reflect arbitrary origins for the token endpoints.
2. **Photo proxy:** allow only raster content types (`image/jpeg|png|webp|avif|gif`) — reject `image/svg+xml` (stored-XSS vector when served inline from the broker origin). Add response headers: `X-Content-Type-Options: nosniff`, `Content-Security-Policy: sandbox`, `Cross-Origin-Resource-Policy: cross-origin`.
3. **Timeouts:** `AbortSignal.timeout(10_000)` on all upstream `fetch` calls; map aborts to 504.
4. **Limits:** cap JSON request bodies (e.g. 10 KB); add a tiny in-memory fixed-window rate limiter per IP (e.g. 30 req/min) on POST endpoints and photo proxy — zero deps.
5. **Errors:** log details server-side; return generic messages to clients (don't echo `error.message`/`details` from internals or Strava).
6. **Routing:** parse `request.url` with `new URL()` once; drop `startsWith('/api/photo-proxy?')`.
7. `server/package.json`: add `"name": "strava-explorer-broker"`, `"private": true`, `"license": "MIT"`. `server/Dockerfile`: add `USER node`.
**Accept:** C2 tests cover origin allowlist, SVG rejection, oversized body, rate-limit 429.

### A4 — Scrub personal/project-specific data from a public sample
1. `scripts/deploy-gcp.sh`: remove defaults `geojson-bq-blog` / `rsbaumann@gmail.com`; require `--project`/`--account` (or env) and exit with usage otherwise.
2. `scripts/setup-github-wif.sh`: parametrize `PROJECT_ID`, `ACCOUNT`, `REPO` via env/flags with no personal defaults.
3. `.github/workflows/deploy.yml`: take project/bucket from `vars.GCP_PROJECT_ID` / `vars.GCS_BUCKET`; drop the `credentials_json` fallback (WIF only); fix `cache-dependency-path` to `strava-explorer/package-lock.json`; add `if: github.repository == ...`-style guard note or document required secrets in README.
4. `HOSTING.md`: replace personal project/email with placeholders.
5. Root `README.md` + `CHANGELOG.md`: replace all `file:///Users/ryanbaumann/...` links with relative repo links.
**Accept:** `grep -rn "rsbaumann\|geojson-bq-blog\|/Users/ryanbaumann"` in tracked files returns nothing.

### A5 — Client hygiene & supply chain
1. `src/strava.js#readStoredAuthData`: wrap `JSON.parse` in try/catch; on failure remove the key and return null. Parse non-JSON error bodies safely everywhere (`response.json().catch(() => ({}))`).
2. Reduce OAuth scope from `read_all,activity:read_all` to `activity:read_all` (drop `read_all`; app never reads private segments/routes). Document the choice in README.
3. Remove unused deps: `analytics-node`, `@mapbox/polyline`, `@turf/bbox`, `@turf/helpers`. Remove `yarn.lock` (npm is canonical; update AGENTS.md). Keep `package-lock.json`.
4. Replace the Tailwind Play CDN `<script src="https://cdn.tailwindcss.com">` (remote runtime JS — supply-chain + perf + CSP blocker) with the already-installed Tailwind v4 via `@tailwindcss/vite`: create `src/style.css` (`@import "tailwindcss";` + existing custom CSS from `index.html`), import it from `src/index.js`, delete the inline `<style>` block and CDN tag. Drop `postcss`/`autoprefixer` devDeps if the Vite plugin makes them redundant.
5. `index.html`: remove `maximum-scale=1,user-scalable=no` (a11y); keep `width=device-width,initial-scale=1`.
6. Document localStorage token storage tradeoff in README security section (sample-appropriate; XSS is the threat model; CSP + no third-party scripts is the mitigation).
**Accept:** build passes with no CDN request; `npm ls` clean; Lighthouse a11y check no longer flags viewport.

---

## Workstream B — Clarity / repo quality (P1)

### B1 — `package.json` cleanup
Set `"name": "strava-3d-explorer"`, `"private": true`, `"description"`, `"license": "MIT"`; delete the whole template `"project"` block and bogus `"main"`. Fix `"test"` to run real tests (C1). Add `"lint"` script.

### B2 — Delete dead weight
- `MIGRATION_PLAN.md` (historical Mapbox→GMP notes; stale APIs) — delete.
- `resources/strava-v3.md` (152 KB third-party library dump, unused) — delete.
- `debug.js` (uses puppeteer, which isn't even a dependency) and `scripts/curl_test.sh` — delete; superseded by C3.
- `static/line.svg` — unused, delete.
- `index.html`: remove dead `#athlete-info` block (never populated), `#photo-display` block (photos render in map popovers), `.pac-container` and `.glass-panel` CSS (no autocomplete exists), commented-out snapshot canvas.
- `src/gmp.js`: remove unused `ElevationElement`, `getElevationElementClass`, `getLatLngBoundsClass`, `getMapInstance` (verify no callers), `MapMode` if unused after review, and drop `"places"` (unused) from the loader `libraries` array (also a cost/latency win). `src/followCamera.js`: remove `setFollowCameraState` back-compat wrapper and unused `analyzeUpcomingTerrain` duplication if consolidated with `calculateTerrainClearanceAltitude`.
**Accept:** build + tests green; `rg` finds no references to removed symbols.

### B3 — Logging discipline
Add `src/log.js`: `debug()` no-ops unless `import.meta.env.DEV`; `warn/error` always pass through. Replace the ~60 `console.log` calls in `src/*.js` with `debug()`. Never log tokens (current "token: ******" line is fine to drop entirely).

### B4 — Shared utilities (kills the biggest readability wart)
- `src/geo.js`: move pure math out of `followCamera.js`/`index.js` — `haversineKm`, `bearingDeg`, `lerp`, `lerpAngle`, `clamp`, `samplePointAlongLine`, `cumulativeDistances`, `downsamplePath`, `smoothPath` (rolling average), `elevationLoss`. Operate on `{lat, lng, altitude}` literals only (no `google.*` dependency → unit-testable, C1).
- `src/units.js`: `KM_PER_MILE`, `M_PER_FT`, `mpsToMph`, formatters (`formatDistance`, `formatElevation`, `formatDuration`). Replace the five scattered `0.621371`/`3.28084` literals.
- `src/latlng.js`: `toLatLngLiteral(p)` replacing the ~20 repeated `typeof p.lat === 'function' ? p.lat() : p.lat` blocks.
**Accept:** behavior identical (verify a tour manually); unit tests target these modules.

### B5 — Docs
- Add root `LICENSE` (MIT) — root README links to one that doesn't exist.
- `README.md` (app): update env setup for A1 (no client secret), add an Architecture section (3 client modules + broker diagram in ASCII/mermaid), add cost note ("Google Maps Platform usage may incur costs; consider the free Maps Demo Key for prototyping — https://mapsplatform.google.com/maps-demo-key"), keep/refresh key-restriction and ToS sections, add "Powered by Strava" brand-compliance note.
- `AGENTS.md`: npm-only commands, mention `isochrones/`, note test commands from C.
- `CHANGELOG.md`: add entry for this overhaul.

---

## Workstream C — Testing (P1; currently `"test": "npm run build"` and zero tests)

### C1 — Unit tests (Vitest)
Add `vitest` devDep. Test `src/geo.js` (haversine known distances, sampling at 0/mid/end/degenerate, downsample keeps endpoints, smoothing window edges, elevation loss), `src/units.js` (formatting), URL-state round-trip (extract `readUrlState`/`buildUrlParams` into `src/urlState.js` first), token-expiry logic (`isTokenExpiringSoon` with fake clock), photo grouping (extract `groupPhotosByProximity` from `gmp.js` into `src/photos.js`).

### C2 — Broker tests
Vitest (node environment) against `server/broker.js` handlers with injected mock `fetch`: token/refresh happy path, missing params → 400, origin allowlist enforcement, photo proxy (disallowed host, non-image content type, SVG rejection, size cap, timeout), rate limiting.

### C3 — E2E smoke (Playwright)
`@playwright/test` devDep; use `executablePath: '/opt/pw-browsers/chromium'` in this environment (do NOT run `playwright install`). Tests: app boots without console errors; unauthenticated state shows Connect + Demo buttons; **demo mode (D1)** loads an activity: stats populate, elevation SVG has a path, tour play button enables. Mock nothing external — demo mode makes this hermetic except the Maps JS API (needs `VITE_GMP_API_KEY` in CI secrets; skip 3D assertions — WebGL absent headless (CF3), assert DOM only, and gate the map-dependent spec on the key's presence).

### C4 — CI workflow
New `.github/workflows/ci.yml` on PRs + main pushes: Node 20, `npm ci`, ESLint (add flat-config `eslint` devDep, minimal ruleset), `vitest run` (client + server), `vite build`, Playwright smoke (non-blocking if no API key secret). Keep `deploy.yml` deploy-only, gated on main.

---

## Workstream D — UI/UX: make it amazing (P1–P2, after A/B land)

### D1 — Demo Mode (highest-impact for a public sample)
"▶ Try the demo — no Strava account needed" button next to Connect. `src/demoData.js` ships 2 bundled activities (an alpine ride + a coastal run: encoded polyline, name, stats, altitude/distance stream arrays, 2–3 photos from `static/demo/*.jpg` with lat/lng) clearly labeled "Demo". Selecting demo mode drives the exact same display pipeline (`displayDetailedActivity`) with a `demo: true` flag that skips Strava calls. Exit demo → back to auth screen. This gives every visitor the full 3D-tour wow in ~10 seconds and makes E2E tests hermetic.

### D2 — Onboarding & empty state
Replace the bare connect box with a hero card: one-line value prop ("Relive your rides as cinematic 3D flythroughs"), 3 feature bullets with icons, official Connect-with-Strava button (keep brand asset), Demo button, a "Powered by Strava" logo footer (brand compliance), and a privacy line ("Your activities are fetched directly from Strava in your browser and never stored on a server"). While signed out, gently auto-orbit the globe over a scenic default (e.g. the current Yuma start → pick somewhere prettier like the Dolomites) — skip when `prefers-reduced-motion`.

### D3 — Theater mode + keyboard
During tour playback, collapse the sidebar into a floating mini-pill (play/pause, stop, progress readout, expand); map goes full-bleed. `Esc` or expand restores. Keyboard shortcuts: `Space` play/pause, `←/→` scrub ±2%, `F` fit route, `O` orbit, `?` shortcuts overlay. All handlers respect focus in inputs.

### D4 — Activity picker upgrade
Enrich the `<select>` into an accessible custom listbox (or, minimum viable: enriched option labels) showing per-activity: sport icon (🚴🏃🥾 by `activity.type`), date, distance, elevation gain. Add a text filter input and sport-type chips above the list. Group by month. Keep full keyboard operability (roving tabindex or native select fallback).

### D5 — Stats & elevation polish
- Live readout under the scrubber during playback: current distance, elevation, and grade at the camera position.
- Color the elevation area path by grade (green→amber→red segments) — pure SVG, no chart lib.
- Imperial/metric toggle (persisted to localStorage + `units=` URL param); route all formatting through `src/units.js` (B4).

### D6 — Mobile
Bottom sheet with drag handle and 3 snap points (peek 96px / half / full) replacing the fixed 33vh cap; 44px min touch targets on all controls; `env(safe-area-inset-*)` padding; sliders get bigger thumbs on coarse pointers. Verify the tour player is usable one-handed in peek state (play + scrubber visible).

### D7 — Feedback & errors
Toast notifications (aria-live polite) replacing the inline error div for transient errors; friendly copy for Strava 429 ("Strava rate limit reached — try again in ~15 min") and Maps load failure (detect `gmp-error`, show WebGL guidance). Skeleton shimmer rows while activities load.

### D8 — Share & identity
`navigator.share` when available (mobile), clipboard fallback; add favicon (SVG mountain/route glyph), `<meta name="description">`, and OG/Twitter meta tags so shared tour links unfurl. Set `og:image` to `strava-explorer.jpg`.

### D9 — Design-system pass
With Tailwind properly built (A5.4): delete the `!important` spray and duplicate glass styles; one token set (`--glass-*`, accent indigo-500, Strava orange reserved for Strava CTAs per brand rules); consistent spacing scale; single transition duration token; all animations behind `prefers-reduced-motion`. Sliders/selects styled via Tailwind utilities or one small CSS layer.

---

## Workstream E — GMP modernization (P1, small)

1. **E1:** Switch loader channel `v: 'alpha'` → `'beta'` in `src/gmp.js` (Map3DElement is documented on beta; alpha is an unnecessary stability risk). Verify `PinElement`-in-`Marker3DInteractiveElement`, `PopoverElement`, and `drawsWhenOccluded` still work (the CHANGELOG says alpha was chosen for a fixed observer loop — retest on beta; if broken, stay on alpha with a code comment citing the exact bug and re-check quarterly).
2. **E2:** Add `internalUsageAttributionIds: ['gmp_git_agentskills_v1']` to the loader `setOptions` call.
3. **E3:** Listen for `gmp-steadystate` before the first `frameRoute` flight (smoother initial load) and `gmp-error` for the D7 error card.
4. **E4:** Keep `ElevationService` (current, non-legacy) and existing batching; move the `10`-meter magic default to a named constant `DEFAULT_ALTITUDE_M`.

---

## Suggested execution order (subagent lanes)

| Phase | Tasks | Notes |
|---|---|---|
| 1 | A1, A2, A3, A4, A5 | A1+A2+A5.1-2 touch `strava.js`/`index.js` — one agent. A3 (server) and A4 (scripts/CI/docs) parallel. |
| 2 | B1–B5, E1–E4 | Refactors after security lands; B4 before C1. |
| 3 | C1–C4 | Tests target post-refactor modules. |
| 4 | D1–D9 | D1 first (unblocks C3); D9 depends on A5.4 Tailwind build. |
| 5 | Final: CHANGELOG, README polish, run full verify | `npm run lint && npm test && npm run build` + Playwright + manual tour check. |

**Verification gates for every phase:** `npm run build` green; no new console errors on `npm run dev` boot; secrets grep (A1/A4 accept criteria) stays clean.

## Compliance appendix requirements (for the final PR/report)
Implementers must keep: GMP ToS links in READMEs, cost notice, API-key restriction guidance (HTTP referrer + API scope), Strava Developer Agreement notes (no server-side storage >7 days, own-data-only display), "Powered by Strava"/Connect-with-Strava brand assets, and the `gmp_git_agentskills_v1` attribution ID (E2).
