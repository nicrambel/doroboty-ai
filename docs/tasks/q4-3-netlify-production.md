# Q4.3 — Publish the PostHog integration to the existing Netlify site

## Authorization and intent

The user explicitly authorizes publishing the current local DoRoboty.ai application with PostHog to `https://doroboty-ai-case-i7me.netlify.app`, using the same local-build and `dist/` upload workflow as Deploy Pilot. Use only existing site `d4e6564c-aa7c-4c1e-a893-783ae9d79193`. Do not create/rename a site or expose credentials or ingestion tokens.

## Acceptance criteria

- Rebuild from current local source; run `./scripts/verify` using the already installed Chrome explicitly.
- Confirm that production Vite configuration has the public PostHog token and the correct EU host, and that the freshly built JavaScript contains the expected integration and configured values. Report booleans rather than token contents.
- Fingerprint source inputs and every output file, inspect distribution boundaries, and review the exact artifact before uploading it.
- Upload only `dist/` to the existing site with `--no-build --prod` and an explicit site ID. Preserve the address and hosting settings.
- Confirm the deployment's ready/production status and published site association through Netlify, then check anonymous HTTPS access, assets and browser behavior on the production URL.
- Record actual evidence and limitations. Never print auth credentials, public ingestion-token values or sensitive request payloads.

## Initial inspection

- Confirmed the repository root and read AGENTS.md, BRIEF.md, CASE_PROTOCOL.md, TODO.md and relevant FEATURES.md entries, together with previous deployment and PostHog task records.
- Existing site/name match the requested target. Before this work its current ready deploy is `6afad826575081e0325930ca`. Team login protection applies only to non-production deploys.
- Reusing the Netlify configuration/deployment skills already read in this chat. The connector supports status/project operations but has no artifact-upload operation; use the previously cached official Netlify CLI as the upload fallback.
- No product code or screen change is planned. FEATURES.md was reviewed and does not need a behavioral change for publishing the existing implementation. Preserve existing unrelated worktree changes; no Git staging, commit or push is requested.

## Results

- Rebuilt the current local worktree through `PLAYWRIGHT_CHANNEL=chrome ./scripts/verify`; exit code 0. Formatting, kit integrity and six example tests, lint, TypeScript, two tooling tests, 75 unit tests, baseline packet, build and all 41 browser tests passed. No tests skipped and no browser/system packages installed. As in the earlier run, the Windows runner stalled closing its own preview after assertions; stopped the exact test preview PID and obtained the successful final summary/exit.
- Verified the PostHog token shape and EU ingestion host without displaying their values. The fresh entry bundle contains the configured token/host, pageviews, autocapture and privacy filtering. Distribution inspection found no private credential patterns, environment files, source maps, Git history or instructor/task material.
- Saved the SHA-256 manifest of 119 source/build inputs and 35 output files to ignored `artifacts/q4-3-production-manifest.json`. Immediately before upload, every input/output still matched. A separate review checked the actual SDK configuration, artifact boundaries, passing test result, target site ID/name/address and CLI arguments. FEATURES.md still accurately describes the implemented flows and needed no update.
- Confirmed through the authenticated CLI that this existing site has no Git continuous deployment connection. Reused cached official Netlify CLI 27.19.0 with explicit `--site d4e6564c-aa7c-4c1e-a893-783ae9d79193 --dir dist --no-build --prod --json`. No remote build, site creation/rename, environment-variable update, Git staging/commit/push or visitor-access change was performed.
- New production deployment: `6afaf0b9b4c6be766dffa5cf`. The site-scoped Netlify lookup confirmed `state: ready`, `context: production`, `published_at: 2026-11-16T12:02:03.680Z`, `error_message: null`, `deploy_source: cli` and `build_id: null`. The project lookup independently confirmed this is the current deploy of the original site. The production address remains `https://doroboty-ai-case-i7me.netlify.app`.
- Anonymous HTTPS GET returned 200 and served the new entry script. All 34 non-HTML deployed assets exactly matched local SHA-256 values. The HTML references the expected new bundle; Netlify adds its own HUD script, so HTML byte identity is not assumed.
- Live Chrome smoke check passed: home and job-list navigation, zero page errors, desktop 1280px rendering and mobile 390px rendering/no horizontal overflow. Reviewed `artifacts/q4-3-production-desktop.png` and `artifacts/q4-3-production-mobile.png`.
- The live check simulated a human browser solely for the analytics check, without changing production bot filtering. Observed real `$pageview` and `$autocapture` payloads and two HTTP 200 acceptance responses from the EU ingestion endpoint. Confirmed absent private-content properties, person profiles disabled, geolocation disabled and no analytics cookies. Only synthetic navigation/clicks were used. Dashboard indexing/display was not inspected.
- An early local smoke-check selector targeted the standalone kit class instead of the host class; corrected the check to `.pp-job-card`. Its initial acceptance parser also assumed one JSON response shape; corrected it to recognize the ingestion service's success formats. These were verification-script changes only; no application edit or additional deployment was needed.
- Safe deployment and live-check summaries are stored in ignored `artifacts/q4-3-production-deploy.json` and `artifacts/q4-3-production-live-check.json`. Token values and authentication credentials were not printed. Existing Zod annotation and bundle-size warnings remain non-blocking.
