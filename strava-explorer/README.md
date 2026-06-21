# Strava Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A focused static web app for connecting Strava, selecting recent activities, and exploring routes in Google Maps Platform Photorealistic 3D. The app syncs route rendering, endpoint markers, activity photos, elevation, stats, and camera controls so a route can be reviewed like a short 3D flythrough.

## Features

- Strava OAuth2 connection for recent activities.
- Activity filtering and first-activity auto-selection.
- Terrain-clamped Google Maps JavaScript 3D route polylines.
- 3D start/finish markers plus interactive photo billboard markers with map-anchored popovers.
- Camera shortcuts for fit route, fly to start, fly to finish, orbit, and follow-camera tours.
- Reduced-motion-aware map and UI animation behavior.
- Activity stats and an imperial elevation profile.

## Tech stack

- Vanilla JavaScript modules, HTML, and Tailwind CDN utilities.
- Vite for local development and production bundling.
- Google Maps Platform Maps JavaScript API `weekly` channel with `maps3d`, `marker`, `elevation`, `geometry`, and `core` libraries.
- Strava V3 API.


## 3D map implementation notes

- Maps loading is centralized in `src/gmp.js` with `@googlemaps/js-api-loader`, followed by `google.maps.importLibrary()` calls. Do not add a second script tag or parallel loader.
- Activity routes use `Polyline3DElement` with `AltitudeMode.CLAMP_TO_GROUND` so the route follows the photorealistic terrain mesh.
- Start/finish and tour-position markers use 3D marker elements with relative-to-ground altitude offsets for readability over the mesh.
- Activity photos render as `Marker3DInteractiveElement` billboards with map-anchored `PopoverElement` details. Custom 3D marker content must be supplied as an `HTMLTemplateElement` or `PinElement`; appending a raw `div`, `img`, or other DOM node causes Maps 3D slot validation warnings.
- Strava photo marker images are loaded through the Cloud Run broker's CORS-enabled `/api/photo-proxy` when `VITE_STRAVA_AUTH_BASE_URL` is configured. This is required for deployed Google Maps 3D marker images because Strava's CloudFront photo URLs do not send browser-readable CORS headers.
- Photo billboard altitude is visual and relative to the ground. Do not add Elevation API altitude to a relative-to-ground marker or the marker will float far above terrain.
- Keep photo marker sets bounded to the selected activity and clear markers/popovers when the route changes.

## Follow-camera tuning notes

The follow-camera tour is tuned for a stable route review rather than strict GPS playback:

- Route samples and terrain/elevation values are precomputed before playback; never call Elevation per animation frame.
- Camera duration scales with route distance so short routes stay brisk and long routes avoid frantic ground speed.
- The camera samples nearby and future terrain before setting altitude so it maintains mesh clearance on climbs, ridgelines, and turns.
- Heading is based on multiple look-ahead bearings plus a filtered, frame-rate-aware yaw limit. This prevents abrupt turn snaps while avoiding the rubber-band lag caused by overly low LERP values.
- Current default controls are mesh clearance `120m`, camera distance `760m`, view angle `64°`, and smoothness `0.18`. Keep `index.html`, `src/index.js`, and `src/followCamera.js` synchronized if those defaults change.
- Scrubbing should snap directly to the selected progress; playback should smooth continuously. Reset heading-filter state whenever loading or clearing a route.

## Prerequisites

- Node.js 20 or newer.
- npm, or Yarn if you prefer matching the existing lockfile workflow.
- A Strava API application.
- A Google Maps Platform project with billing enabled.

## Environment variables

Create `strava-explorer/.env.development` for local development. For production, prefer `VITE_STRAVA_AUTH_BASE_URL` plus the Cloud Run broker so the Strava client secret stays server-side:

```dotenv
VITE_STRAVA_CLIENT_ID=YOUR_STRAVA_CLIENT_ID
VITE_STRAVA_REDIRECT_URI=http://localhost:5173/
VITE_GMP_API_KEY=YOUR_GOOGLE_MAPS_BROWSER_KEY
# Use one of these auth options:
VITE_STRAVA_AUTH_BASE_URL=https://YOUR_CLOUD_RUN_BROKER_URL
# Local-only fallback; never publish this in a static production build.
VITE_STRAVA_CLIENT_SECRET=YOUR_STRAVA_CLIENT_SECRET
```

Never commit `.env.*` files. All `VITE_` variables are browser-exposed after build, so restrict the Google Maps browser key by API and HTTP referrer and do not publish `VITE_STRAVA_CLIENT_SECRET` in a static production build.

## Service setup

### Strava

1. Open <https://www.strava.com/settings/api>.
2. Set the local authorization callback domain to `localhost`.
3. Add the local redirect URI used by `VITE_STRAVA_REDIRECT_URI`, typically `http://localhost:5173/`.
4. Add the production callback domain and redirect URI before deploying.

### Google Maps Platform

Enable the APIs needed by the current app runtime:

- Maps JavaScript API with the `weekly` channel for 3D Maps.
- Map Tiles API / Photorealistic 3D Tiles.
- Elevation API.

Recommended browser-key restrictions:

- API restrictions limited to the required APIs above.
- HTTP referrer restrictions for local origins such as `http://localhost:5173/*` plus the production origin.
- Billing budgets, quota alerts, and monitoring for Elevation API usage. Elevation lookups are batched, but photo markers and follow-camera samples can still consume quota.

## Install

```bash
cd strava-explorer
npm install
# or: yarn install
```

## Run locally

```bash
npm run dev -- --host 0.0.0.0
# or: yarn dev --host 0.0.0.0
```

Open the Vite URL printed in the terminal, connect Strava, select an activity, and use the camera controls in the activity panel.

## Build

```bash
npm run build
# or: yarn build
```

Vite writes static production assets to `dist/`.

## Preview the production build

```bash
npm run preview -- --host 0.0.0.0
# or: yarn preview --host 0.0.0.0
```

## Test and validation

```bash
npm test
```

`npm test` currently runs the production build. For map, OAuth, camera, or responsive UI changes, also complete the manual browser checklist below with valid development credentials.

## Hosting and Deployment

For detailed deployment strategies, two-tier architecture options (GCS static frontend + Cloud Run OAuth broker), security guidelines, compliance checklists, GCP command-line deploys, and Strava API migration details, refer to the [HOSTING.md](HOSTING.md) guide.

## Manual QA checklist

1. App loads with a valid Google Maps browser key and shows the 3D globe.
2. Strava connect redirects to the configured callback and returns to the app.
3. Activity filters fetch activities and the first activity auto-loads.
4. Route polyline, start/finish markers, elevation profile, and stats appear.
5. `Fit route`, `Fly start`, `Fly finish`, `Orbit 3D`, and `Follow Camera` all move the same selected route.
6. Photo billboard markers render without Maps 3D slot warnings, open one popover at a time, and do not expose access tokens in committed source.
7. Mobile layout avoids horizontal scrolling and keeps the map usable behind the bottom sheet.
8. Follow-camera playback turns smoothly through switchbacks without hard heading snaps or rubber-banding, and keeps the camera clear of the terrain mesh.
9. With `prefers-reduced-motion: reduce`, camera shortcuts avoid long cinematic movement.

## Contributing

Keep changes small, app-scoped, and validated with the narrowest relevant command plus a production build when practical.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
