---
title: Mapbox × Uber: deck.gl & kepler.gl Partnership
org: Mapbox
role: Partnership & engineering lead
period: 2018 – 2020
summary: The OSS partnership that made Mapbox the default basemap in the leading open-source geospatial visualization stack — for minimal engineering investment.
tags: ["open source", "partnerships", "growth"]
links: [{"label": "Launch post", "url": "https://blog.mapbox.com/launching-custom-layers-with-uber-2a235841a125"}, {"label": "deck.gl", "url": "https://github.com/visgl/deck.gl"}, {"label": "kepler.gl", "url": "https://github.com/keplergl/kepler.gl"}]
image: /img/work/kepler-mapbox.jpg
imageAlt: kepler.gl rendering trip data over a Mapbox satellite basemap of the San Francisco Bay Area
order: 9
---

## The goal

Uber's deck.gl and kepler.gl were rapidly becoming the default tools for data scientists and engineers visualizing geospatial data at scale. The platform that rendered the basemap under those tools would secure the default position for a generation of data-heavy applications.

## What shipped

I led the OSS partnership with Uber that integrated Mapbox GL JS custom layers directly into deck.gl and kepler.gl. I drove deep rendering integration, avoiding a superficial logo swap. Mapbox became the default basemap across the stack, leveraging shared APIs that made the combination the absolute path of least resistance. kepler.gl continues to ship on that architecture today.

## Why it matters

This is business development executed as developer experience. A highly targeted engineering investment in external open source established a durable default position across an entire ecosystem. Defaults compound: every kepler.gl tutorial, workshop, and fork since has onboarded developers onto Mapbox for free.
