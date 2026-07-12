---
title: Google Maps Platform Agent Skills
org: Google
role: Product & engineering lead
period: 2025 – present
summary: Portable skill modules that teach AI agents to ship production-ready platform code across Web, Android, iOS, and Web Services — installed with one command.
tags: ["agent skills", "applied ai", "distribution"]
links: [{"label": "GitHub", "url": "https://github.com/googlemaps/agent-skills"}, {"label": "Docs", "url": "https://developers.google.com/maps/ai/agent-skills"}, {"label": "Video", "url": "https://youtu.be/NEk37sPlgaY"}]
featured: true
order: 2
---

## The goal

Grounded retrieval (Code Assist) tells an agent *what's true*; it doesn't teach an agent *how to work*. The goal: package portable expertise that turns any agent into a competent platform engineer, unlocking a new distribution surface for the platform.

## What shipped

I led the launch of Google Maps Platform agent skills: portable modules for shipping production-ready code across Web, Android, iOS, and Web Services. A single command — `npx skills add googlemaps/agent-skills` — installs the skill across AI Studio, Antigravity, Claude Code, and Replit. The repo doubles as a Gemini CLI extension and integrates into Lovable. I built the eval model that gates each skill and designed the remote hosting distribution mechanics to maximize reach with zero friction.

Skills and Code Assist run as one integrated system. Skills teach workflows through token-efficient progressive disclosure, while the MCP server grounds every line in retrieved documentation.

## Why it matters

Skills convert platform expertise into a distributable software artifact. Instead of hoping developers read a guide, the platform injects its own senior engineer into every agent session. For a developer platform, install-time becomes the new signup, and skill usage acts as a measurable leading indicator of adoption.
