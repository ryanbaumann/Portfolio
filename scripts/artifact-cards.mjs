#!/usr/bin/env node
// scripts/artifact-cards.mjs — regenerate the SVG artifact cards used where
// no honest screenshot exists (see .agents/skills/portfolio-design/SKILL.md).
//
// Rule: cards state only facts that already appear in the entry's copy
// (real commands, real published stats). Never mock a product UI.
//
// Usage: node scripts/artifact-cards.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'portfolio', 'static', 'img');

const CARDS = [
  {
    file: 'work/code-assist.svg',
    eyebrow: 'SHIPPED · GOOGLE MAPS PLATFORM',
    title: 'Code Assist',
    lines: ['agent ▸ tool call ▸ retrieval ▸ official docs'],
    footer: 'Claude Code · Cursor · Antigravity · Gemini CLI',
  },
  {
    file: 'work/agent-skills.svg',
    eyebrow: 'ONE-COMMAND INSTALL',
    title: 'Agent Skills',
    lines: ['$ npx skills add googlemaps/agent-skills'],
    mono: true,
    footer: 'Web · Android · iOS · Web Services',
  },
  {
    file: 'work/agentic-evals.svg',
    eyebrow: 'THE LAUNCH BAR',
    title: 'Agentic Evals',
    lines: ['task ▸ agent run ▸ score ▸ ship or hold'],
    footer: 'benchmarked against a no-context baseline',
  },
  {
    file: 'work/agentic-growth.svg',
    eyebrow: 'PUBLIC OSS REACH',
    title: '1M+ weekly downloads',
    lines: ['@vis.gl/react-google-maps'],
    footer: 'npm downloads API · verified July 14, 2026',
  },
  {
    file: 'work/voice-of-developer.svg',
    eyebrow: 'DEMAND SENSING',
    title: 'Voice of Developer',
    lines: ['Discord + Stack Overflow + issues + support', '▾', 'ranked roadmap priorities'],
    footer: 'AI does the reading',
  },
  {
    file: 'work/geo-architecture-center.svg',
    eyebrow: 'GEO ARCHITECTURE CENTER',
    title: 'Solution architectures',
    lines: ['public diagrams · guidance · reference implementations'],
    footer: 'developers.google.com/maps/architecture',
  },
  {
    file: 'work/intelligent-product-essentials.svg',
    eyebrow: 'GOOGLE CLOUD · MANUFACTURING',
    title: '0 → launch in 9 months',
    lines: ['Intelligent Product Essentials'],
    footer: 'launched with GE Appliances',
  },
  {
    file: 'work/mapbox-boundaries-atlas.svg',
    eyebrow: 'TWO PRODUCTS, ZERO TO ONE',
    title: 'Boundaries · Atlas',
    lines: ['global boundaries · self-hosted maps'],
    footer: 'both remain in the Mapbox product portfolio',
  },
  {
    file: 'talks/geomob-vibing-with-maps.svg',
    eyebrow: 'GEOMOB SF · APRIL 2025',
    title: 'Vibe with Maps',
    lines: ['concept to prototype, fast'],
    footer: 'three live demos, prompt to working map',
  },
  {
    file: 'talks/visgl-vibe-your-viz.svg',
    eyebrow: 'VIS.GL SUMMIT · SEATTLE · OCT 2025',
    title: 'Vibe your Viz',
    lines: ['growing with AI-native makers'],
    footer: 'deck.gl · kepler.gl · AI-native visualization',
  },
  {
    file: 'talks/code-assist-video.svg',
    eyebrow: 'VIDEO · GOOGLE MAPS PLATFORM',
    title: 'Code Assist, live',
    lines: ['grounded code generation in a real agent session'],
    footer: 'youtu.be/L2V58kKIHvc',
  },
  {
    file: 'talks/agent-skills-video.svg',
    eyebrow: 'VIDEO · GOOGLE MAPS PLATFORM',
    title: 'Agent skills, introduced',
    lines: ['production-ready platform code in one install'],
    footer: 'youtu.be/NEk37sPlgaY',
  },
  {
    file: 'writing/this-weeks-learnings.svg',
    eyebrow: 'LINKEDIN SERIES',
    title: '#ThisWeeksLearnings',
    lines: ['what shipping taught me this week'],
    footer: 'traces read · evals written · opinions revised',
  },
  {
    file: 'writing/vibing-with-maps.svg',
    eyebrow: 'SUBSTACK',
    title: 'Vibing with Maps',
    lines: ['practical experiments'],
    footer: 'ryanbaumann.substack.com',
  },
  {
    file: 'writing/code-assist-launch.svg',
    eyebrow: 'LAUNCH POST · GOOGLE MAPS PLATFORM',
    title: 'Announcing Code Assist',
    lines: ['grounded platform expertise in any AI assistant'],
    footer: 'mapsplatform.google.com',
  },
];

const escape = (t) => String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function card({ eyebrow, title, lines, footer, mono }) {
  const W = 960;
  const H = 600;
  const sans = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const monoStack = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
  const lineCount = lines.length;
  const bodyFont = mono ? monoStack : sans;
  
  // Starting Y for vertical centering (shifted slightly up)
  const contentHeight = 40 /* eyebrow */ + 70 /* title */ + (lineCount * 55) /* lines */;
  const startY = (H - contentHeight) / 2 - 10;
  
  const body = lines
    .map((line, i) => `<text class="body" x="80" y="${startY + 125 + i * 55}" text-anchor="start" font-family="${bodyFont}" font-size="${mono ? 28 : 34}">${escape(line)}</text>`)
    .join('\n  ');

  // Exact tokens from style.css
  const styles = `
    :root {
      --bg: #faf9f6; --surface: #ffffff; --ink: #111827; --muted: #4b5563; --faint: #5f6875;
      --line: #e5e7eb; --accent: #3b82f6; --accent-ink: #2563eb;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #030712; --surface: #111827; --ink: #f9fafb; --muted: #9ca3af; --faint: #aeb7c4;
        --line: #1f2937; --accent: #60a5fa; --accent-ink: #93c5fd;
      }
    }
  `.trim();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(`${eyebrow}: ${title}`)}">
  <style>${styles}
    .surface { fill: var(--surface); }
    .bg { fill: var(--bg); }
    .border { stroke: var(--line); }
    .eyebrow { fill: var(--accent-ink); }
    .title { fill: var(--ink); }
    .body { fill: var(--muted); }
    .footer { fill: var(--faint); }
  </style>
  <rect class="surface" width="${W}" height="${H}"/>
  
  <!-- Subtle schematic grid for infographic vibe -->
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" class="border" stroke-width="1" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)" />
  
  <!-- Subtle top accent -->
  <rect x="0" y="0" width="${W}" height="8" fill="var(--accent)"/>
  
  <!-- Outer border -->
  <rect class="border" x="0" y="0" width="${W}" height="${H}" fill="none" stroke-width="2"/>

  <!-- Content -->
  <text class="eyebrow" x="80" y="${startY + 20}" text-anchor="start" font-family="${monoStack}" font-size="18" font-weight="700" letter-spacing="3">${escape(eyebrow)}</text>
  <text class="title" x="80" y="${startY + 80}" text-anchor="start" font-family="${sans}" font-size="64" font-weight="750" letter-spacing="-2">${escape(title)}</text>
  
  ${body}
  
  <!-- Footer -->
  <line class="border" x1="80" y1="${H - 96}" x2="${W - 80}" y2="${H - 96}" stroke-width="2"/>
  <text class="footer" x="80" y="${H - 54}" text-anchor="start" font-family="${monoStack}" font-size="20">${escape(footer)}</text>
</svg>
`;
}

for (const spec of CARDS) {
  const path = join(OUT, spec.file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, card(spec));
  console.log(`[artifact-cards] wrote portfolio/static/img/${spec.file}`);
}
