# Architecture

One React/TypeScript application is built by Vite into static files. HashRouter renders routes under /#/; route parameters created in the browser require no hosting rewrites. The running app currently uses local CSS tokens, Timeless font and Base UI primitives. New and changed UI must follow the accepted Poster People [design system](design-system/README.md), adapted into the existing stack; installing its reference did not convert runtime styles. There is no server data/API layer.

## Data flow

JSON marketplace/person fixtures → initialState → PrototypeProvider → feature views. Local operations go through transition with shared Zod schemas and explicit role/ownership/transition checks for coherent simulation. All roles still have access to the same browser data; these checks are not security.

Candidate source notes, generated draft and approved application are distinct fields. Submission snapshots CV, candidate name, job title, scenario score and summary. Employer stage events are appended, with private-in-the-UI notes. Profile/job edits do not rewrite submitted records.

Storage writes version 2 to `doroboty.prototype.v2`. When that key is absent, it validates and migrates `doroboty.prototype.v1` in memory without changing the original bytes. A malformed v2 never silently falls back to v1. The next successful write uses v2 only. Import accepts validated v1/v2, including IDs, cross-references and stage history, before replacing state. Unreadable/incompatible saves are protected against automatic overwrite; settings can download the original raw save, import a valid file or explicitly reset. Failed/quota-limited persistence leaves the in-memory app usable and offers export. Import/export is capped at 2 MB; no binary CV storage. A v2 export cannot be imported into the older application. Reset affects the current v2 scenario; the preserved v1 key remains a recovery artifact, not an active synchronized copy.

## Case Forge I1

`project-contribution-model.ts` owns bounded Zod schemas, editable project data,
material links/unavailable reasons, basis snapshots and explanation freshness.
`editProject` preserves typing whitespace and increments the project revision for
substantive edits. Every such change invalidates all prepared explanations, even
after reverting the text. Parsing/importing also checks the actual basis content;
an imported freshness flag or reused material ID is insufficient.

ApplyPage saves the optional project in the explicit draft. Submission validates
the project, copies referenced materials only, removes stale explanation bodies,
and retains an invalidation notice. No operation edits the submitted project.
Candidate controllers project public snapshot/history fields before rendering;
employer rationale, next step, stage notes and legacy hidden fields are excluded.
Role simulation is still not a security boundary: a full scenario export contains
all roles' data.

`load_i1_demo` explicitly adds Alicja, Ewa and a prepared draft from
`data/i1-demo.json`. It requires the existing published AI Product Manager role
at BrightLabs, is idempotent, and rejects collisions rather than overwriting
records. Ewa shares BrightLabs access with Karolina. Initial fixtures and the
historical baseline packet are unchanged. Alicja has no scenario score (`null`),
and the UI displays an explicit absence rather than an invented percentage.

`contribution_review` saves rationale, next step, reviewer, timestamp and project
revision separately from stage events; terminal processes are read-only.
ProjectContribution has plain/I1 presentation props using the same declarations
and available material contents. There is no A/B switch, assignment or telemetry.
E1 remains planned; synthetic explanations do not verify authorship or competence.

## Features

src/features/prototype owns model/storage/state and page compositions. src/features/jobs retains reusable presentation/filter/description logic; src/components/ui owns Base UI controls. Keep changes small.

LocalStorage is origin-specific. Reload preserves state; another browser/device/port starts separately. No cross-tab live synchronization is provided. A browser Web Lock grants one mounted provider exclusive editing access for the origin. Other tabs show a warning and reject mutations, import and reset without claiming success; copy any unsaved form text, close the editing tab and reload to resume from the latest save. A raw-snapshot comparison before writing also rejects changes made by a non-cooperating older build. If Web Locks are unavailable (including an insecure context), the app uses memory-only work with export guidance and never attempts an unsafe persistent write. The lock is coordination, not authentication. Hash links reference records in the receiving browser, not transferred records.

## Evidence and distribution

The baseline historical CSV and JSON are separate from interactive state. Future evidence must arrive in a separately reviewed package. package:participant copies only explicit allowed files/directories, including the complete docs/design-system guide/kit, and omits docs/source, historical task notes, agent run history and .git. A packet verifier checks the baseline data; packaging also verifies a pristine file/hash manifest. Ordinary checks permit participants to edit code and generate build/test output without invalidating a distribution fingerprint. Instructor repository history is never participant-safe.

## Optional analytics

Optional analytics lives in `src/features/analytics/posthog.ts` and initializes once from `src/main.tsx`, outside React StrictMode effects. The PostHog SDK watches hash/history navigation for pageviews and autocaptures link/button clicks. A pre-send allowlist rebuilds events using route templates, memory-only random IDs and structural selectors; application state is never passed to the SDK. Missing public environment configuration or browser Do Not Track leaves analytics off. See README.md and the focused unit/browser payload tests. This is usage telemetry, not Case Forge experiment assignment or outcome measurement.

## Checks

npm run check and ./scripts/verify run formatting, design-system reference integrity/example checks, lint, types, unit tests, build and Playwright against the static preview. Playwright checks external requests, complete workflows, error/recovery behavior, keyboard controls and mobile layout. No test starts system services. npm run dev only starts Vite.
