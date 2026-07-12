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
    eyebrow: 'DEFAULT DISTRIBUTION',
    title: 'AI Studio · Replit · Lovable',
    lines: ['present the moment a builder starts'],
    footer: '@vis.gl/react-google-maps · 500k+ weekly npm downloads',
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
    title: '40+ solution architectures',
    lines: ['diagrams · cost models · reference implementations'],
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
    lines: ['first $5M ARR'],
    footer: 'still in the Mapbox portfolio 8+ years later',
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
    footer: 'deck.gl · kepler.gl · the next million builders',
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
    eyebrow: 'WEEKLY SERIES · LINKEDIN',
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
  const blockStart = 300 - ((lineCount - 1) * 26);
  const body = lines
    .map((line, i) => `<text x="480" y="${blockStart + 92 + i * 52}" text-anchor="middle" font-family="${mono ? monoStack : sans}" font-size="30" fill="#c7d2e4">${escape(line)}</text>`)
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(`${eyebrow}: ${title}`)}">
  <rect width="${W}" height="${H}" fill="#0b1220"/>
  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" fill="none" stroke="#1f2b3f" stroke-width="3" rx="14"/>
  <circle cx="46" cy="46" r="7" fill="#26334a"/>
  <circle cx="72" cy="46" r="7" fill="#26334a"/>
  <circle cx="98" cy="46" r="7" fill="#26334a"/>
  <text x="480" y="${blockStart - 34}" text-anchor="middle" font-family="${monoStack}" font-size="19" letter-spacing="4" fill="#60a5fa">${escape(eyebrow)}</text>
  <text x="480" y="${blockStart + 30}" text-anchor="middle" font-family="${sans}" font-size="52" font-weight="700" fill="#f3f6fb">${escape(title)}</text>
  ${body}
  <line x1="120" y1="${H - 96}" x2="${W - 120}" y2="${H - 96}" stroke="#1f2b3f" stroke-width="2"/>
  <text x="480" y="${H - 56}" text-anchor="middle" font-family="${monoStack}" font-size="19" fill="#7e8aa0">${escape(footer)}</text>
</svg>
`;
}

for (const spec of CARDS) {
  const path = join(OUT, spec.file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, card(spec));
  console.log(`[artifact-cards] wrote portfolio/static/img/${spec.file}`);
}
