# Google Maps Platform Isochrones Demo

This is a small Vite + Node demo that showcases the Google Maps Platform Isochrones API on an interactive Google Map. It is designed around three common reachability workflows:

- **Delivery promise**: compare 10/20/30+ minute service areas from a hub.
- **Commute catchment**: flip travel direction to understand who can arrive at a destination within a target time.
- **Response coverage**: inspect time-band gaps for field teams, clinics, or emergency-style service planning.

The visual design uses nested, selectable isochrone polygons with a drill-down statistics panel that reports approximate area in square kilometers for each time band.

## Prerequisites

- Node.js 20 or newer.
- Google Maps Platform API keys. For security best practices:
  - **Browser Key** (`VITE_GMP_API_KEY`): Used to load the Maps JavaScript API. This should be restricted by HTTP referrer in your Google Cloud console.
  - **Server Key** (`GMP_SERVER_API_KEY`): Used for backend requests to the Isochrones API. This should be unrestricted or IP-restricted.

### Environment Setup

Create a `.env` file in this directory with the following variables:

```dotenv
# Browser key (restricted by HTTP Referrer for localhost)
VITE_GMP_API_KEY=YOUR_GOOGLE_MAPS_BROWSER_KEY

# Server key (unrestricted or IP-restricted to proxy requests)
GMP_SERVER_API_KEY=YOUR_GOOGLE_MAPS_SERVER_KEY
```

Make sure the Google Maps Platform products are enabled on the project(s) corresponding to your keys:
- Maps JavaScript API (for the browser key)
- Isochrones API (for the server key)

## Run locally

```bash
cd isochrones
npm install
npm run dev
```

Open `http://localhost:5174`.

## Build and preview

> [!IMPORTANT]
> Vite replaces `import.meta.env` variables statically at build time. Therefore, the `.env` file must be present before running the build command, or you must specify `VITE_GMP_API_KEY` inline during the build.

```bash
cd isochrones
# Build compiles static assets with the browser key
npm run build

# Preview runs the local Node.js proxy server with the server key
npm run preview
```

The app calls the Isochrones REST endpoint through `server.js` at `/api/isochrone`. This avoids browser CORS limitations for REST web services and keeps request validation in one local demo proxy.

## Notes

- Drive mode is capped at 60 minutes by the Isochrones API; the server validates this before proxying.
- Coordinates are validated in the browser and server before rendering or sending requests.
- The demo uses Map ID `556022f677234497` for Advanced Marker support in local prototyping.
