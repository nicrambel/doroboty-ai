# Netlify deployment preparation

## Intent and authorization

Check the connected Netlify account and existing projects. Prepare local deployment
configuration and a creation plan using the complete dirty worktree. Do not create
or link a remote project, connect Git continuous deployment, upload a preview,
publish, commit, push or merge without the user's explicit approval.

## Acceptance criteria

- Confirm account access, team and existing projects through the Netlify plugin.
- Configure the existing static Vite output with Node.js 24 and npm.
- Preserve tracked modifications and untracked source files, including I1 project
  contributions, version-2 recovery and cross-tab protection, and packaging fixes.
- Keep hash routes and browser-local state; publish only rebuilt `dist/` later.
  Exclude repository history, instructor sources, task records and audit artifacts.
- Run `./scripts/verify`, inspect the output and perform a separate review pass.
- Report actual results and offer one next step. Project creation and publication
  remain separate approvals.

## Account inspection (2026-11-16)

The Netlify plugin successfully returned the authenticated account for Marcin
Bełzowski and the single team `marcin-belzowski` (Free, current user Owner).
The unfiltered project list was empty; the user profile also reported zero sites.
No project named DoRoboty.ai or another name exists in the accessible account.
This confirms read access and the reported role, not an executed write operation.

## Local configuration

`netlify.toml` selects `npm run build`, `dist/` and Node.js 24. The existing
`.nvmrc` also selects 24. No rewrite is needed because routes use HashRouter.
No database, functions or provider credentials are required by this prototype.
`.netlify/` is now ignored in `.gitignore` before any future local linking. The local config
does not create a project or trigger a deploy.

## Proposed creation and deployment sequence

1. After explicit approval, create one empty project named `doroboty-ai-case` in
   `marcin-belzowski`. The name distinguishes this teaching prototype from the
   public production portal. Check the actual returned name because availability
   has not been reserved. Do not deploy or connect automatic Git publishing.
2. After a separate deployment approval, rebuild from the current local worktree
   and upload only `dist/`. This includes untracked source imports and existing
   edits; using the remote Git HEAD now would omit them. Do not reuse old output.
   The currently exposed plugin tools can create the empty project but do not
   upload build artifacts; that later step would use the Netlify CLI or dashboard.
3. Verify the hosted root/hash links, local assets, synthetic CVs, mobile/keyboard
   flows and import/export/recovery. A new origin has separate browser storage;
   an existing local scenario needs explicit export/import. Role choice is a
   simulation and provides no confidentiality.

For any later Git-based setup, review and commit all intended source files first,
including the currently untracked I1 modules and tooling. Netlify's cloud build
uses repository content, not this computer's uncommitted files. Node selection
and npm behavior were checked against the official dependency documentation:
https://docs.netlify.com/build/configure-builds/manage-dependencies/

## Behavior register

FEATURES.md was reviewed, including SYS-06 and SYS-09 through SYS-11. This change
only prepares hosting configuration and changes no application flow, route, role,
data or persistence behavior; the register needs no update.

## Validation and separate review

- `./scripts/verify` completed with exit code 0 using Node.js 24.14.0 and
  `PLAYWRIGHT_CHANNEL=chrome`: formatting, 67-file kit integrity, six kit tests,
  lint, types, two tooling tests, 52 unit tests, 120-journey baseline validation,
  static build and all 38 browser tests passed. No browser or dependency was
  installed. The initial sandbox run needed its own server processes stopped
  during teardown; the full rerun outside the sandbox finished normally.
- Existing Zod annotation and JavaScript chunk-size warnings remain. These are
  build warnings, not failures; this task does not change dependencies or bundles.
- Parsed `netlify.toml` with Python's TOML parser and checked build property names
  and value types against the downloaded official Netlify schema. This is a
  focused configuration check, not an executed Netlify cloud build.
- Inspected all 35 generated output files. Top-level output is `assets/`, `case/`,
  `company-logos/`, `cv/` and `index.html`; the evidence directory contains only
  `baseline.csv`. No repository history, docs/instructor directories or source
  maps are present. The JavaScript includes the previously untracked Alicja I1
  scenario and v2 storage, confirming these local changes reached the build.
- A separate read-only review checked the three authored files, static-output
  boundary, HashRouter integration, preservation of existing work, ignored
  Netlify state and the approval boundary. No application or kit file was changed
  by this task. `git diff --check` passed; nothing was staged or committed.

No cloud build, deployment, CI result or human release approval is implied by
these local checks. The proposed project name has not been reserved or created.

## First preview deployment authorization (2026-11-16)

The user subsequently approved creation of an empty project. Netlify assigned
`doroboty-ai-case-i7me` because the requested name was unavailable. Its site ID is
`d4e6564c-aa7c-4c1e-a893-783ae9d79193`, in team `marcin-belzowski`.

The user now explicitly authorizes one test deployment to this existing project
from the prepared and verified local build, including all dirty-worktree source
changes and new files. Do not use GitHub, publish production, change application
code or perform subsequent steps. Confirm the build's currency and upload only
`dist/` with `--no-build`, without `--prod` or `--prod-if-unlocked`. Confirm the
resulting deployment status, URL and preview/production classification.

The current plugin exposes project/status operations but no artifact upload.
Use the official Netlify CLI as the upload fallback; keep its cache and any local
Netlify state ignored. Existing visitor access controls remain unchanged.

### Preview result

- Uploaded the existing verified 35-file `dist/` without rebuilding, changing
  application code or using GitHub. The SHA-256 file manifest was saved under
  ignored `artifacts/netlify-first-preview-manifest.json` and matched immediately
  before the upload. All application build inputs predate the verified output.
- Used Netlify CLI 27.19.0 from an isolated ignored npm cache. The plugin session
  does not authenticate the CLI; the user approved the CLI's official login
  ticket. No credentials were copied from the plugin or placed in the project.
- CLI rejected combining `--context` with `--no-build` before uploading. Retried
  without that redundant flag; default draft mode produced `deploy-preview` as
  confirmed by Netlify. No production flag, remote build or Git trigger was used.
- Deployment ID: `6afad72ac2b1f7e4f56d13f3`.
- Preview URL:
  https://6afad72ac2b1f7e4f56d13f3--doroboty-ai-case-i7me.netlify.app
- The plugin's site-scoped deployment lookup confirmed `state: ready`,
  `context: deploy-preview`, `published_at: null`, `error_message: null`,
  `deploy_source: cli`, `build_id: null` and `commit_ref: null`.
- A separate read-only status/project review confirmed the target project/team
  and retained team-login protection for all deploys. This is a successful
  preview upload, not production publication or a new hosted usability test.
  No subsequent product, hosting, Git or release steps were performed.

## Production deployment authorization (2026-11-16)

The user now explicitly authorizes production publication to the same existing
project, using exactly the build uploaded in the successful preview. Do not
rebuild, retrieve GitHub content, change application code or perform subsequent
steps. Confirm the HTTPS production URL, deployment status and anonymous visitor
access. If access is restricted, report its cause and remedy; changing visitor
access policy is not part of this request.

Acceptance criteria: verify every local file against the saved preview SHA-256
manifest; upload that unchanged `dist/` with `--no-build --prod`; verify the
deployment through the Netlify plugin; test the production URL without cookies
or authorization headers; record the actual result. Existing local verification
remains applicable because no application source or build output is changed.

Preflight confirmed all 35 files match the preview manifest and the project's
existing protection requires team login on all deployments. The original empty
project has not been connected to Git continuous deployment in this work.

### Production result

- Successfully uploaded the unchanged 35-file preview build with Netlify CLI
  `deploy --no-build --prod`. No application code, source, dependencies or Git
  remote content was changed. Netlify reported all files already uploaded.
- Production deployment ID: `6afad826575081e0325930ca`.
- Production URL: https://doroboty-ai-case-i7me.netlify.app
- The plugin confirmed `state: ready`, `context: production`,
  `published_at: 2026-11-16T10:17:11.514Z`, `error_message: null`,
  `build_id: null` and `commit_ref: null`.
- Anonymous HTTPS GET using `curl -q`, without cookies or an Authorization
  header, returned `401 Unauthorized`; the response title is `Login Redirect`.
  Public access is therefore blocked by Netlify's team-login protection, not by
  an application login or failed deployment. The project lookup reports
  `requiresSSOTeamLogin: true` for `all` deployments.
- Remedy for the Team Owner: open Project configuration > General > Visitor
  access > Project visibility and make production Public, then save. Previews
  can remain private. No visibility or team security setting was changed.
  Dashboard settings:
  https://app.netlify.com/projects/doroboty-ai-case-i7me/configuration/general/#project-visibility
  Official instructions:
  https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/
- A separate read-only result review checked the target, production context,
  publication timestamp, exact-build manifest and independent anonymous-access
  result. Existing verification was reused; no build or application test suite
  was rerun because the artifact was intentionally unchanged. No subsequent
  actions were performed.
