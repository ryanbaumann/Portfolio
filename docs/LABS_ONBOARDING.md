# Lab demo onboarding contract

`apps.json` is a deployment and routing contract, not a general link catalog.
Every entry represents output built in this repository and served by the
gateway at an internal path. Source repositories and externally hosted demos
belong in `source_url` or portfolio content; they must never replace `path`.

## Lifecycle

1. **Classify** the project as a hosted demo, external link, or private-source
   service. Decide whether “private” means hidden deployment or confidential
   source. Confidential source cannot be committed to this public repository.
2. **Import** a hosted demo under `demos/<name>/`. Preserve useful history when
   practical. Keep the old repository until consumers and links have moved.
3. **Adapt** the app to an internal `/<name>/` base path and a home link. Browser
   keys must be referrer-restricted. Secrets stay server-side behind an
   app-scoped gateway API with input limits, upstream allowlists, timeouts,
   rate limits, and keyless `503` behavior.
4. **Register** it in `apps.json` with title, description, internal path,
   `dev_build_dir`, visibility, tags, preview, providers, and optional
   `source_url`. Use `npm run new:demo` for a new Maps/Vite app; use these same
   gates when importing an existing project.
5. **Wire** its Docker builder/runtime copy, CI package checks, Dependabot entry,
   private runtime password configuration, and preview asset.
6. **Prove** the package tests and build, `npm run check:labs`, root build,
   gateway tests, gateway smoke, and container smoke. A primary browser flow
   should use stubbed upstreams in PR CI; a quota-bounded live canary belongs
   after deployment or on an explicit schedule.
7. **Cut over** links and deployment only after production checks pass. Archive
   the former repository with a short canonical-location notice. Do not delete
   it: deletion is destructive and is not a dependable redirect strategy.

## Visibility and privacy

| Mode | Public listing | Direct route | Source confidentiality | Required checks |
|---|---|---|---|---|
| `public` | Yes | Public | None | card, tags, preview, route/assets, primary flow |
| `unlisted` | No | Public | None | absent from discovery, direct route works, `noindex` |
| `private` | No | Password-gated | None | static assets and app APIs fail closed; auth succeeds; `no-store` and `noindex` |
| Private source | No | Separate service or private artifact | Yes | private repository/IAM plus deployment checks outside this public repo |

An entry in a public `apps.json` is public metadata. Password protection only
applies to same-origin routes the gateway serves; it cannot protect GitHub or
another host. A private demo API must verify the same app session explicitly,
because generic `/api/*` routing occurs before the static-file auth gate.

## Deterministic acceptance gates

`npm run check:labs` fails when a hosted demo is missing its package contract,
lockfile, internal path, tags, public preview, Docker copy, CI matrix entry, or
Dependabot entry. Manifest validation rejects external route URLs and unsafe
source URLs. Root CI then builds every app, runs gateway tests and smoke tests,
builds the container, starts that exact image, and runs the same smoke suite
against it. Smoke checks must never silently skip a manifest entry.

For a secret-bearing API, add deterministic unit tests for valid and invalid
input, missing secret (`503`), upstream failure (`502`), timeout, response-size
cap, allowlist/SSRF defense, rate limit (`429`), and private-session denial.
The PR smoke path uses mocked upstreams; it does not need production secrets or
an LLM.

## Application to the two PR #64 candidates

| Gate | Infographic Agent | Real-World Reasoning Agent |
|---|---|---|
| Source | Public `ryanbaumann/infographic-agent` | Private `ryanbaumann/real-world-reasoning-demo` (renamed from `unlimited-maps-demo`) |
| Actual demo | A live Cloud Run URL exists; PR #64 linked the source repository instead | Standalone full-stack service; no portfolio route was added |
| Build/runtime | React/Vite single-file build; Node 18+ upstream | React/Vite plus Node server; Node 22+ upstream |
| API decision | BYOK can remain static only if CI proves no bundled key; portfolio-funded use needs a bounded Gemini proxy | Requires namespaced Maps and Gemini gateway handlers or a separately deployed service |
| Current portfolio gate | **Fail:** absent from source tree, Docker, CI, route, preview, and smoke | **Fail:** same, plus server APIs are not integrated |
| Privacy decision | Public source means password gating can hide only the running route | Keep the repo/service private if source confidentiality matters; importing would publish it |
| Recommended next step | Decide BYOK versus funded proxy, then import and onboard as `/infographic-agent/` | Decide public-source monorepo versus private separate service before any import |

PR #64's two manifest records were removed because they represented neither
routable apps nor working access control. Re-add each project only when it
passes the hosted-demo contract above. Keep both source repositories for now;
after a verified cutover, archive rather than delete them. The Infographic
Agent repository may also need to remain as a compatibility shell while its
published skill and installation URLs depend on that repository name.
