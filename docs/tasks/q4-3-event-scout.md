# Q4.3 Event Scout — PostHog installation

## Intent

Install PostHog through `npx -y @posthog/wizard@latest` in the existing React/TypeScript/Vite prototype. Configure pageviews for hash routing and click autocapture while protecting private user content. Keep all changes local and preserve existing worktree changes.

## Acceptance criteria

- Confirm the repository root, framework and Node/npm environment before running the wizard.
- Pause when the wizard requires the user's login or a project/account decision; explain the concrete next step.
- When setup can continue, capture pageviews and clicks without sending form values, visible private text, CV content, recruiting notes, identifying attributes or sensitive URL parameters.
- Disable unrelated collection such as session replay and personal profiles, and keep credentials out of tracked source.
- Update FEATURES.md and relevant setup/privacy documentation for the implemented behavior.
- Run `./scripts/verify` (or its `npm run check` equivalent if Bash is unavailable), report actual results, and perform a separate review pass. Do not publish, push or deploy.

## Initial inspection

- Repository root: `D:\codex\doroboty-ai`; package: `doroboty-ai-case`.
- React 19, TypeScript, Vite 7 and React Router HashRouter; entry point: `src/main.tsx`.
- Node.js 24.14.0 and npm 11.9.0 are available. The PowerShell npm wrapper emits a user-prefix access warning; use the `.cmd` wrapper where needed.
- Existing worktree contains extensive tracked and untracked changes. Do not reset, stage or overwrite unrelated work.
- Reviewed BRIEF.md, CASE_PROTOCOL.md, TODO.md and FEATURES.md. SYS-03 currently declares analytics removed; update it only when analytics is actually implemented.
- Only the existing privacy-page text needs updating; no layout, controls, styles or immutable kit changes are planned. Reviewed the local design-system guide, implementation/verification companions, design.md, component API and C22 reading-block reference before editing it.

## Wizard and initial handoff

- Ran the requested command. The sandboxed attempt failed with EACCES reaching the npm registry/cache; the authorized elevated retry downloaded PostHog Wizard v2.94.0.
- The wizard requires at least 80x28 terminal dimensions. Restarted it with a 120x40 terminal and `--no-telemetry` to disable wizard run telemetry.
- Wizard detected React Router and the correct repository. Initially paused for OAuth authentication; the user subsequently confirmed login and authorized completing the local configuration.
- Paused at authentication as requested. Do not provide passwords or personal API keys in chat. The wizard also discloses that Claude reads source files for AI context, while `.env*` values stay local.
- Added the wizard's local `.posthog-wizard-cache/` to `.gitignore` so its temporary working files are not committed.

## Implemented configuration

- After login the wizard added posthog-js, a React wrapper, local public project configuration and an entry-point initializer. Stopped its additional identification/error-tracking work and replaced its broad defaults with the requested scope. Removed the unnecessary React wrapper dependency and global error boundary.
- `src/features/analytics/posthog.ts` initializes once outside React StrictMode. The SDK's explicit `{ path: true, hash: true }` pageview setting covers hash routing, history navigation and reload. The `history_change` shorthand watches only pathname in this SDK version.
- Autocapture accepts link/button clicks only. Mask text and all element attributes; exclude input/change/submit/copy, editable content and no-capture markers. A pre-send allowlist rebuilds the complete payload, replaces routes with fixed templates and discards IDs/slugs, queries, referrers, person properties, visible text, hrefs, labels, arbitrary attributes, custom properties and every unrequested event. Click selectors retain known HTML tags and numeric positions only.
- Person profiles, replay, exception capture, logs/metrics, flags, external SDK loading and other unrelated features are disabled. Random analytics IDs stay in memory and change on reload; browser Do Not Track prevents SDK initialization. Network transport metadata inherently reaches the receiver; this is content minimization, not a claim of legal anonymity.
- The ignored `.env` retains the wizard-selected public ingestion token and EU host. `.env.example` contains a blank token, is safe to track and is the only environment file included in participant packages. A checkout without configured analytics remains usable.
- Updated FEATURES.md (including SYS-03 and PUB-09), README, security/architecture guidance and Polish privacy-page copy. Existing product browser journeys set Do Not Track and retain their external-request assertions. Dedicated analytics tests intercept every PostHog request and inspect actual SDK payloads without sending test events to the service.
- No commit, push, publication, deployment or account/dashboard mutation was performed by this agent after the login handoff.

## Initial validation before login

- Ran `./scripts/verify` through the installed Git Bash. Formatting, design-system integrity and its six example tests, lint, TypeScript, two tooling tests, 52 unit tests, baseline packet verification and the static build passed.
- All 38 browser tests reported launch failures because the provisioned Playwright Chromium headless-shell executable is missing. No browser binaries or OS dependencies were installed. This is not a successful full verification or evidence of PostHog delivery.
- Build emitted warnings about dependency pure annotations and the existing bundle exceeding 500 kB.
- At this initial stage FEATURES.md still described the application accurately without analytics. The resumed implementation updates that register as described above.

## Resumed validation and review

- Focused privacy/route/configuration unit tests: 23 passed. TypeScript and a static build passed after integration.
- Using the already installed Chrome explicitly through `PLAYWRIGHT_CHANNEL=chrome`; no browser or OS packages installed.
- Initial browser payload tests exposed SDK bot filtering of `navigator.webdriver`. The tests now simulate a human browser only within the intercepted analytics suite; production keeps bot filtering enabled. A mobile keyboard navigation check initially targeted a hidden header link; it now selects the visible accessible link.
- Final `PLAYWRIGHT_CHANNEL=chrome ./scripts/verify`: passed, exit code 0. Formatting, immutable kit integrity and six example tests, lint, types, two tooling tests, 75 unit tests, baseline packet, static build and all 41 browser tests passed. The 41 include both intercepted analytics capture tests and the Do Not Track/privacy-page check; no tests were skipped in this run. After assertions finished, the Windows runner stalled closing its own preview process; stopped that exact preview PID, after which Playwright reported 41 passed and the verification command exited successfully.
- The analytics tests checked initial/hash pageviews, keyboard navigation, back/forward, reload, memory-only ID renewal, click autocapture, hostile DOM labels/attributes, private input/URL sentinels, no unexpected PostHog endpoints and no analytics cookies/localStorage/sessionStorage. Privacy copy was checked at 1280, 390 and 320px. These intercepted requests prove browser payload behavior, not receipt in the live PostHog dashboard.
- Created and verified an external local participant package. It contains only `.env.example`, with a blank token; no configured `.env`, Git history or instructor materials. No package was uploaded or distributed.
- Separate source review checked the actual SDK's hash options and wire serializer, before-send envelope/property allowlist, default bot filtering, DNT initialization guard, memory-only persistence, remote-config and independent logs/metrics controls, optional configuration fallback, package boundaries, lockfile and behavior-register accuracy. Removed the wizard's unrelated React/error wrapper, kept existing user changes, and restored npm's unrelated removal of libc metadata for 22 unchanged optional dependencies. The dependency manifest/lock retain only the intended new PostHog package tree beyond existing user work.
- Existing dependency-annotation and bundle-size warnings remain; the main JS build is approximately 1.04 MB before gzip (343 kB gzip). No publishing, CI run, live dashboard verification or human approval is claimed.
