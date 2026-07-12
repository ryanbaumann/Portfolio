---
title: Agentic Eval Suite & Agent Engine Optimization
org: Google
role: Strategy & engineering lead
period: 2024 – present
summary: Task-based evals that gate every AI launch on the platform, plus an AEO program that benchmarks and grows the platform's share of voice across agent engines.
tags: ["evals", "context engineering", "growth"]
featured: true
order: 3
---

## The goal

You can't grow what you can't measure. "The demo looked good" is not a launch bar. The platform required objective answers to two questions: *Does our context actually make agents better at building with us?* and *When a developer asks an agent to build something in our category, do we win?*

## What shipped

I built the agentic eval suite for Google Maps Platform. These task-based evaluations measure grounded code-generation accuracy, tool-call behavior, token cost, and end-to-end task completion across agent harnesses and models. I benchmarked results against a no-context baseline — using real user traces — to set the strict quality bar for every launch, including Code Assist and agent skills.

I also launched Agent Engine Optimization (AEO) to track our share of voice across agent engines. We benchmark end-to-end workflows externally in Claude Code, Codex, and Antigravity. I partnered directly with model teams, providing evals, curated context, and fine-tuning signals from real developer usage to materially improve Gemini's performance on platform developer tasks.

## Why it matters

This measurement layer turns developer experience from a cost center into a growth system. Every context investment now carries a baseline, a delta, and a business decision — applying the discipline of performance marketing to how agents build on your platform.
