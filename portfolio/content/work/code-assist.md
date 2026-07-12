---
title: Google Maps Platform Code Assist
org: Google
role: Product & engineering lead
period: 2024 – present
summary: An MCP server that gives any AI coding agent grounded Google Maps Platform expertise — taken from GitHub alpha to Google-hosted remote service.
tags: ["mcp", "applied ai", "developer platforms"]
links: [{"label": "Docs", "url": "https://developers.google.com/maps/ai/code-assist"}, {"label": "Launch blog", "url": "https://mapsplatform.google.com/resources/blog/announcing-code-assist-toolkit-bring-google-maps-platform-expertise-to-your-ai-coding-assistant/"}, {"label": "GitHub", "url": "https://github.com/googlemaps/platform-ai"}, {"label": "Video", "url": "https://youtu.be/L2V58kKIHvc"}]
featured: true
order: 1
---

## The goal

Developers no longer read docs — their agents do. If an AI generates incorrect Google Maps Platform code, developers blame the platform. The goal: make every AI coding agent generate production-ready platform code, ensuring we win the developer at the moment of first code generation.

## What shipped

I built and shipped Code Assist: an MCP server that grounds AI coding agents in official Google Maps Platform documentation, code samples, and architecture via retrieval. I led this from a GitHub alpha to a Google-hosted remote MCP service. It now runs natively in Claude Code, Cursor, Antigravity, Gemini CLI, and any MCP client. 

Agents now ground every non-trivial line in retrieved docs instead of training-data memory — producing correct API surface usage, modern best practices, and eliminating hallucinated parameters.

## Why it matters

This is developer experience treated as product. The interface is a tool call, the quality bar is an eval suite, and the distribution channel is every agent harness a developer already uses. This provides the blueprint for how any developer platform earns adoption in an agent-mediated world.
