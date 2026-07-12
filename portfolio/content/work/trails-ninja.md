---
title: Ryan Baumann Demo Lab
org: Personal
role: Builder
period: ongoing
summary: This site — the homepage you're on plus live demo apps, one container, zero secrets in the browser, agent-maintainable by design.
tags: ["side project", "self-hosted", "reference apps"]
links: [{"label": "The demos", "url": "/demos/"}, {"label": "Source", "url": "https://github.com/ryanbaumann/trails.ninja"}]
image: /previews/strava-explorer.jpg
imageAlt: The Strava 3D Explorer flying a route through Chamonix in Photorealistic 3D, with photos anchored along the path
order: 11
---

## What it is

Ryan Baumann Demo Lab is where I stay in the work — you're on it right now. This portfolio and its [live demo apps](/demos/) ship from a single Cloud Run container behind a zero-dependency Node gateway:

- **[Strava 3D Explorer](/strava-explorer/)** — I built a 3D visualization to fly rides and runs in Photorealistic 3D, anchoring photos along the route.
- **[Air Quality Map](/aqi-map/)** — I shipped a live air-quality heatmap featuring click-to-inspect pollutant detail.
- **[Isochrones](/isochrones/)** — I built live-regenerating reachability bands showing exact travel limits within 10, 20, or 30 minutes.

## Why it exists

I do not believe you can lead developer experience from a slide deck. Building and operating real applications — managing OAuth flows, API quotas, key restrictions, cold starts, and CI/CD — calibrates my judgment to actual developer friction. The platform opinions I bring to work are earned by debugging them here first.

This repo also serves as a working example of what I ship at work: it is agent-ready by design. Agent skills encode the voice and design system. `npm run new:demo` scaffolds and wires a new demo in one command, `npm run new:post` does the same for a blog post, and CI smoke-tests every route keyless. I keep the stack intentionally boring: no framework, zero client JS on the main site, a single container, and fast deploys. Boring is a feature.
