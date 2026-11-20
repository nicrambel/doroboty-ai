# DoRoboty.ai — AIPH3 prototype

A frontend-only job marketplace for participants to extend and test. Built with React, TypeScript and Vite, using Base UI components. The required visual direction for new and changed screens is the accepted Poster People design system.

## Design system — start here for UI work

Read [project integration instructions](docs/design-system/README.md), [host implementation rules](docs/design-system/IMPLEMENTATION.md) and [application acceptance checklist](docs/design-system/VERIFICATION.md), then [design.md](docs/design-system/agent-kit/design.md), [component API](docs/design-system/agent-kit/components/API.md) and the relevant [human documentation](docs/design-system/agent-kit/reference/index.html). The complete 67-file kit is stored under docs/design-system/agent-kit, including reusable CSS/JS, component states, listing/offer examples, screenshots, Geist Serif with license and illustration. No other chat or global skill is required.

```sh
npm run design-system:check
npm run design-system:dev
```

With Node 24, the first command verifies the preserved kit and examples; the second serves a separate local preview at http://127.0.0.1:8952/. No kit installation is needed. The main app uses port 3001 as below.

Build UI from this system, adapting its anatomy and visual roles into the existing React/Base UI components and host tokens. Preserve application behavior and hash routing; do not replace product state with the standalone demo fixtures/controllers. The application has a host adaptation. For every UI task, compare the affected anatomy, type roles, state and keyboard behavior with the reference; passing kit checks alone does not establish visual acceptance. See the integration guide for exact reading order, assets, React mapping, responsive rules and verification. AGENTS.md and CLAUDE.md enforce the same direction.

## Run

Requirements: **Node.js 24 and npm**.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. No environment file, account, database or additional service is required. Package installation requires access to the npm registry.

Select Anna or Marek as a candidate, Karolina or Tomasz as an employer, or the instructor. Publish a job, apply, switch person and record the employer decision. Changes survive reload in this browser; settings provide export, import and reset. AI and scores simulate prepared scenarios. Use example CVs only.

## Optional PostHog analytics

The Q4.3 integration was started with `npx -y @posthog/wizard@latest` and narrowed to pageviews and click autocapture. The local `.env` contains the selected project's public ingestion token and host; it is ignored by Git and excluded from participant packages. No personal API key belongs in this frontend.

To enable analytics in another checkout, copy `.env.example` to `.env`, supply the project's public token and its EU or US ingestion host, and restart Vite. The prototype works without this file. Vite embeds these public values at build time; remove the token and rebuild to disable analytics. Do not deploy this change until separately authorized.

Hash navigation, back/forward and reload produce `$pageview`; clicks on links/buttons produce `$autocapture`. A pre-send allowlist replaces routes with fixed templates and strips query strings, record IDs/slugs, referrers, text, attributes and all custom properties. Click selectors retain tags and numeric positions only, so dashboards cannot group clicks by button text. Session replay, person profiles, exception/console/metrics collection, flags and extra SDK scripts are disabled. Analytics IDs remain in memory and change on reload; browser Do Not Track prevents SDK initialization. HTTP connections still expose network metadata to the receiving service; these controls protect application content and do not establish legal anonymity.

`tests/e2e/analytics.spec.ts` intercepts SDK requests and checks privacy on desktop/mobile, hash navigation and Do Not Track. Its two capture tests need the optional local configuration; without it they are explicitly skipped. Existing product journeys use Do Not Track and retain their no-external-request assertions. An intercepted payload proves what the browser attempted to send, not receipt in the PostHog dashboard. For a manual check, open the app, visit a few screens/click links, and inspect `$pageview` and `$autocapture` in the selected project's live events. Use synthetic data only.

## Build and verify

```sh
npm run build
npm run preview
./scripts/verify
```

The static output is dist/. Browser checks require an already provisioned Playwright Chromium; starting the app never installs it. To deliberately use an already installed Chrome instead, set PLAYWRIGHT_CHANNEL=chrome before running the same checks (PowerShell: `$env:PLAYWRIGHT_CHANNEL="chrome"`). The result records that browser; no tests are skipped or silently switched. See [participant guide](docs/PARTICIPANT_GUIDE.md), [architecture](docs/architecture.md), [current features](FEATURES.md) and [case protocol](docs/case/CASE_PROTOCOL.md).

To distribute a baseline participant package, run npm run package:participant -- /absolute/output/directory. This excludes Git history and instructor source material. Never distribute this repository’s history as a stage-safe packet.
