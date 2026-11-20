# Q4.1 Launch Inspector

## Intent and authorized scope

Repair the technical release blockers recorded in the production-readiness report. Preserve the existing dirty-worktree functionality and Poster People appearance. Do not publish, commit, merge or change hosting/authentication policy.

## Acceptance criteria

- Establish reproducible LF source checkouts without changing canonical reference-kit content or weakening its hashes, packet checks or formatting rules.
- Repair participant packaging for a safe external Windows destination, retaining the allowlist, pristine manifest and instructor/history exclusions.
- Run every browser regression with an explicitly selected available browser; distinguish the browser's internal PDF resources from application network requests while still rejecting external HTTP(S).
- Prevent a second tab from silently replacing the first tab's persisted scenario, including import/reset. Keep damaged-save protection, v1 migration, export and memory-only recovery.
- Correct destructive-action text contrast, including hover/focus, without changing the rest of the visual direction.
- Inspect current dependency advisories and their actual call paths. Do not apply forced/downgrade upgrades or change unused-tool policy without a reasoned decision.
- Update the relevant stable FEATURES.md entries and participant guidance; execute ./scripts/verify, focused conflict/recovery/accessibility checks and a separate review pass.
- Refresh the schema-2 production-readiness report after implementation; retain the original completed audit, recheck applicable requirements and validate desktop/mobile/print behavior.

## UI integration

Reuse the existing Notice/status recipe (C19), settings outlined panels, Base UI Button/ConfirmDialog (C01/C18), hash routes and storage boundaries. The new cross-tab state needs a Polish explanation, a safe recovery path and keyboard-accessible export/reload guidance. Keep the immutable kit unchanged; contrast changes belong in the host token/primitive layer.

## Decisions outside this package

Hosting, operational owner, acceptable downtime/data loss, cohort size and budget remain unassigned. They are not authorization to publish. Any unresolved package/tool policy decision will be presented after independent authorized work is complete.

## Results and separate review

- Final full `./scripts/verify` passed with `PLAYWRIGHT_CHANNEL=chrome`: formatting, 67-file immutable-kit integrity and six kit tests, zero-warning lint, types, two tooling tests, 52 unit tests, 120-journey packet, build and all 38 browser tests. No tests were skipped. Tests ran outside the Windows sandbox so their owned server processes could close correctly; no browser or OS tool was installed.
- Explicit Chrome selection is documented and optional. The default remains provisioned Chromium. PDF assertions still compare actual bytes, downloads and immutable snapshots; exact-origin network checks now classify only known internal viewer resources separately, with negative tests for external origins and origin lookalikes.
- Participant packaging succeeded to an external C: destination from the D: repository and passed pristine verification. The allowlist excludes Git history, instructor sources, task records and this audit. Resolved aliases into the source/ancestors are rejected; missing volumes and dangling links fail rather than looping or following an unsafe destination.
- One tab holds an exclusive browser Web Lock. Other tabs reject save/import/reset; a raw-snapshot check also rejects an older non-cooperating writer. Startup waits for the access check before showing interactive routes. Missing lock support keeps work in memory and permits export, without unsafe persistent writes. Corrupt saves, quota failures, v1 migration and original-byte protection remain covered.
- Destructive actions retain the red background and geometry, using black text and a lighter hover in ordinary and portal contexts. Settings/confirmation scans and keyboard/reflow checks pass at 1280/390/320px. Workspace header landmarks and the v1 reset explanation were corrected without changing layout.
- Current npm metadata and advisories were reviewed. The installed tree still has 12 affected development-tool positions from two underlying advisories; the production dependency audit has no findings. The latest shadcn 4.23.0 still uses deepmerge 4.3.1 and ts-morph/minimatch 10; the latest typescript-eslint 8.72.2 still declares minimatch 10. The user's explicit decision is to leave dependencies unchanged and review a separate repair package. No dependency versions, lockfile entries, npm overrides or audit exclusions were changed. This is not acceptance of the risk or release approval.
- Separate source review checked lock ownership/release, React effect replay, reload handoff, stale writes, import/reset return values, original-save protection, host-only contrast changes, packaging boundaries and retained network assertions. Early integration failures exposed invalid lock options and a startup/reload race; both were corrected and the complete gate was rerun successfully. Canonical kit and package-lock Git blob hashes are unchanged. LF restoration changed worktree bytes only to their canonical repository representation; no global Git configuration or staging operation was performed.

The final HTML report retains the earlier completed audit and records the new source fingerprint. It remains a local preparation assessment, not a deployed-site or course-release approval. Existing bundle-size/Zod annotation warnings, unreviewed company-page findings and untested physical-device/Safari/screen-reader behavior are not claimed resolved. Nothing was published or committed.
