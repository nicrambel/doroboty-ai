# Case Forge I1 — implementation, step 5

## Scope and authorization

Implement the approved project-contribution prototype in the existing application.
Keep the fourth activity exactly: “Rozwiązanie działało w pilotażu; integrację wykonał programista”.
All people, materials and explanations are synthetic. E1 remains planned, without
participants, results or success thresholds. Do not change Second Brain, publish,
push, open a PR, or start step 6.

## Acceptance criteria

- Optional project, own/team/AI contributions, activities and M1–M3 in the application draft.
- Explicit unavailable-material state with an optional reason; review before submission.
- Draft/reload persistence, consent reset after content edits, immutable submission snapshot.
- Clearly separated claim, material, synthetic explanation and unknowns.
- Any substantive project/material/link edit invalidates every explanation, including on import/read.
- Employer-only rationale and next step persist without advancing recruitment stages.
- Explicit, additive and idempotent Alicja/Ewa demo loading; existing examples stay intact.
- No score for Alicja; no AI provider, database, upload or new dependency.
- Version-2 storage with validated v1 migration and original-save protection.
- Reuse Poster People host recipes; preserve the immutable reference kit.

## Validation boundary

Step 5 includes domain/integration unit tests, typecheck, lint, formatting, reference
integrity, baseline packet and build checks. The user's instruction reserves full
browser tests, visual review and final acceptance for step 6; the full verify gate
must therefore be reported as pending rather than claimed as passed.

## Results

Implemented the existing-route candidate editor/preview, optional submitted project
tab, M1–M3 disclosures, explicit missing material, synthetic explanation/unknown
labels, full-basis invalidation, separate employer rationale/next step, additive
demo loading, no-score handling and v2 migration/recovery. The fourth activity is
preserved verbatim. There is no A/B switch or experiment execution.

### Executed checks

- Typecheck: passed.
- ESLint with zero-warning requirement: passed.
- Vitest: 49 tests passed across 6 files (27 existing plus 22 new tests).
  Domain integration covers load/edit/draft/serialize/reload/submit/review, ordinary
  applications, original snapshots, missing materials, stale bases, source-text
  escaping, candidate projection and v1/v2 migration/recovery. Server-rendered
  component assertions cover plain/I1 material parity and private-data omission;
  they do not constitute browser interaction or visual acceptance.
- Static build: passed; existing Zod annotation and >500 kB chunk warnings remain.
- Formatting of all 19 changed/new files: passed.
- `git diff --check`: passed.
- Full `format:check`: failed on 137 unmodified files checked out with CRLF.
  Unmodified AGENTS.md, README.md and package.json pass the same check with a
  read-only `--end-of-line crlf` override. `core.autocrlf` is true; no Git/system
  configuration or unrelated file formatting was changed.
- `design-system:check`: failed at the raw .nvmrc hash before kit example checks.
  Read-only diagnosis across all 67 files: 31 hashes match directly, 36 match after
  CRLF-to-LF normalization, zero other mismatches. The reference kit and manifest
  have no Git diff and were not edited.
- `verify:packet`: failed on baseline.csv CRLF versus generated LF. Read-only
  comparison confirms the normalized CSV matches HEAD. No historical data changed.
- Full `scripts/verify` / `npm run check` is not claimed as passed: the above
  baseline checks fail, and browser journeys are explicitly reserved for step 6.

### File inventory

Modified:

- FEATURES.md
- docs/PARTICIPANT_GUIDE.md
- docs/architecture.md
- src/app/application.css
- src/app/records.css
- src/features/prototype/application-record.tsx
- src/features/prototype/candidate-application.tsx
- src/features/prototype/model.ts
- src/features/prototype/recruiting-application.tsx
- src/features/prototype/storage.test.ts
- src/features/prototype/storage.ts
- src/features/prototype/workspace.tsx

Added:

- docs/tasks/case-forge-i1.md
- src/features/prototype/data/i1-demo.json
- src/features/prototype/project-contribution-editor.tsx
- src/features/prototype/project-contribution-model.test.ts
- src/features/prototype/project-contribution-model.ts
- src/features/prototype/project-contribution-review.tsx
- src/features/prototype/project-contribution.tsx

### Remaining step-6 checks and limits

- Execute real-browser candidate-to-employer flow, draft reload, preview/return,
  consent clearing, material disclosures, note retention, saved review reload and
  candidate/private-data boundaries. Run the existing browser regressions.
- Compare Poster People source/app at desktop/mobile/320px and 850/950px boundaries;
  inspect wrapped tabs, long Polish text, actual focus restoration, keyboard use,
  errors, reduced motion and storage failure messages.
- Resolve or explicitly accept the pre-existing Windows line-ending check failures
  separately; do not call reference/packet checks green on normalized evidence.
- Existing Base UI Settings semantics, npm advisories and NH-01–NH-05 remain out of
  scope and unresolved. No dependency versions or immutable kit files were changed.
- Explanations are fixed synthetic examples; edits invalidate them without
  generating replacements. Submitted projects cannot be edited. Drafts save only
  on explicit action. Ewa shares BrightLabs access with Karolina. Full JSON exports
  contain every persona's data; role selection is not security.
- Imports accept v1/v2, exports use v2, original v1 bytes remain intact. Old builds
  cannot import v2. No binary attachments, real data, AI provider or backend.

Work is on `feature/case-forge-i1`; changes are uncommitted. No push, PR,
publication, Second Brain update, E1 session or step-6 execution took place.
Q3.3 as a whole is not marked complete.

## Step 6 verification — November 14, 2026

This section appends the actual verification results. The step-5 record above is
historical and remains unchanged. User authorization permits testing and evidence
documentation, but does not permit application-code fixes. No application or test
source, dependency, Git configuration, immutable reference or Second Brain file
was changed during step 6. FEATURES.md was reviewed; there is no behavior change
to register in this verification step.

### Environment and isolation

- Branch: `feature/case-forge-i1`; the step-5 changes remain uncommitted.
- Node 24.14.0, npm 11.9.0, installed Google Chrome 157.0.8103.78, headless through
  the existing Playwright package. No tool/browser installation was performed.
- Playwright's expected bundled Chromium executable is absent. The tests below
  ran with `channel: chrome`; they are not claimed as a run with that Chromium.
- Dev app: 127.0.0.1:3001; static preview for regression: port 3106; Poster People
  reference catalog: port 8952. HEAD-before-I1 was read with git archive into the
  ignored evidence directory and served on port 3002 for two diagnostic comparisons.
- Every test used a fresh, nonpersistent browser context. Import/corruption/quota
  simulations affected these contexts only, never the user's browser profile.
- Test runners/configs, screenshots, exports and traces live under
  `artifacts/case-forge-i1-step6-2026-11-14/` and are ignored by Git.
- Before/after SHA-256 comparison of 161 source/test/reference/configuration files
  found zero changes. Evidence: `source-before.json`, `source-preservation.json`.

### Executed checks and outcomes

| Check                                      | Result     | Evidence / qualification                                                                                                                                                              |
| ------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                                 | PASS       | `typecheck.log`                                                                                                                                                                       |
| ESLint                                     | PASS       | `lint.log`; zero-warning requirement retained                                                                                                                                         |
| Unit/domain/component integration          | PASS       | `test.log`; 49/49 tests                                                                                                                                                               |
| Static build                               | PASS       | `build.log`; existing Zod annotation and bundle-size warnings                                                                                                                         |
| Existing browser regression                | FAIL       | `regression.json`; 30 passed, 4 failed, 34 executed; unchanged test source                                                                                                            |
| Focused I1 browser suite                   | FAIL       | `i1-results.json`; 8 passed, 1 failed, 9 executed; failure is the 320px clipped review-save action                                                                                    |
| Supplemental diagnostics                   | PASS       | `supplement.json`; 4/4: baseline/current focus, Chrome PDF traffic, long/mobile content, measured clipping cause. One passing diagnostic deliberately confirms the defect, not a fix. |
| Incomplete-project validation              | PASS       | `validation.json`; 1/1: explicit error, section focus, no application created                                                                                                         |
| Scoped Axe scans                           | PASS       | All six main-content scans at 1280/390/320px for Alicja/Ewa contain zero violations; `axe-*.json`                                                                                     |
| Full npm check                             | FAIL       | `check.log`; stops at Prettier on 137 unchanged CRLF files                                                                                                                            |
| scripts/verify via installed Git Bash      | FAIL       | `scripts-verify.log`; same formatting gate, no skipped validation                                                                                                                     |
| Reference integrity                        | FAIL       | `design-system-check.log`; .nvmrc raw hash differs because of CRLF                                                                                                                    |
| Baseline packet                            | FAIL       | `verify-packet.log`; CSV CRLF differs from generated LF                                                                                                                               |
| Immutable reference preservation           | PASS       | No source edits; 67-file read-only hash diagnosis below                                                                                                                               |
| Bundled-Chromium execution                 | BLOCKED    | Missing executable; installed-Chrome alternative executed instead                                                                                                                     |
| Physical devices, Safari and screen reader | NOT TESTED | Responsive tests use Chrome viewport emulation; no full WCAG claim                                                                                                                    |
| E1 effectiveness with participants         | NOT TESTED | E1 is still planned; no recruitment, measurements or research findings                                                                                                                |

The first regression invocation completed its test bodies but hung during Windows
managed-preview teardown. The recorded final run manages the identical static
preview separately, executes all 34 unchanged tests and produces a complete JSON
report. Initial custom-runner selector ambiguities were corrected in ignored
harness files, not application code; final results refer to completed runs.

### Acceptance criteria

| Criterion                                                          | Result | Evidence                                                                                                                     | Problem or limitation                                                                          |
| ------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Optional project, own/team/AI work and M1–M3                       | PASS   | Focused main-flow test; `alicja-form-1280.png`                                                                               | One synthetic case; no real data                                                               |
| Exact four approved activities, including corrected fourth         | PASS   | Main-flow assertions and `main-synthetic-application.json`                                                                   | No authorship verification                                                                     |
| Missing material and optional reason; pre-submit review            | PASS   | Main flow plus unavailable-M1 test; `alicja-preview-1280.png`                                                                | Only assigned material bodies are submitted                                                    |
| Draft/reload persistence, consent clearing, immutable copy         | PASS   | Main flow: edit, explicit save, reload, preview/return, consent reset, submit, profile edit; snapshot equality               | Explicit save, not autosave                                                                    |
| Distinct declaration/material/explanation/unknowns                 | PASS   | Current and stale scenarios; `ewa-current-1280.png`, `ewa-stale-and-review-1280.png`                                         | Fixed synthetic explanations                                                                   |
| All explanations invalidate on substantive edits and import/read   | PASS   | Claim edit, material edit, imported changed M1 with unchanged ID/revision/false freshness flag                               | No automatic replacement explanation                                                           |
| Employer-only rationale and next step persist without stage change | PASS   | Main flow: save, reload, unchanged stage/events, candidate UI omission                                                       | Full scenario export includes other roles' information; simulation is not access security      |
| Explicit additive/idempotent demo; old examples remain             | PASS   | Dedicated browser test: repeated load preserves state and seven personas; existing Marek record; ordinary Anna application   | Ewa and Karolina share BrightLabs scope                                                        |
| No score for Alicja; no new provider/backend/upload/library        | PASS   | Sent score null, no project upload control, unchanged package files/source inventory                                         | Existing scenario-score behavior remains for old personas                                      |
| v2 import/export and safe v1 migration/recovery                    | PASS   | Browser roundtrip, invalid import, untouched v1 bytes, corrupt-v2 protection, unavailable storage/quota and oversized import | v2 exports require the new app; export is a complete scenario                                  |
| Poster People, readable responsive UI and immutable kit            | FAIL   | Reference screenshots, measured host styles and 18 layout measurements                                                       | New review-save button is clipped at 320px; raw integrity gate also fails on pre-existing CRLF |

### Full Alicja → Ewa journey

PASS. The test selected personas through the UI, loaded the demo, opened the offer
and application, checked all four activities, opened M1–M3, exercised unavailable
evidence, edited a claim, observed invalidation, saved/reloaded the draft, reviewed
and returned to editing, checked consent clearing, submitted and compared the
snapshot after profile changes. Ewa opened the record, inspected current/stale
presentations, expanded materials, saved rationale/next step, reloaded and retained
the same stage/history. Alicja's record omitted the private employer fields.
Exporting from Alicja's settings still included Ewa's rationale: this is the
documented full-scenario-export limitation, not a secure multiuser system.

Separate prepared and edited cases establish that the original explanations are
visible only when current. The exact fourth activity and its stated unknowns
survive submission. Removing M1 sharing excludes its content from the sent record.
Ordinary submissions without I1, duplicate prevention and wrong-person deep-link
recovery were also exercised. Oversized/invalid imports preserved prior state.

### Responsive and accessibility observations

- Candidate and employer layouts were measured at 1280, 951, 950, 949, 851, 850,
  849, 390 and 320px. Candidate context/form stacks at <=850px; employer history
  follows the reading sheet at <=950px. All 18 ordering assertions passed.
- All candidate controls fit the viewport. Employer controls fit except the new
  review-save button at 320px. Document scrollWidth alone is misleading here:
  root `overflow-x: clip` conceals the child overflow.
- At 1280/390px both I1 views are readable with no observed overlapping sections.
  At 320px project/evidence text and wrapped tabs remain readable; review saving
  is visually defective. Long synthetic Polish content and expanded material were
  exercised in a separate context (`alicja-long-content-390.png`,
  `ewa-expanded-material-320.png`).
- Compared against the served Poster People catalog and host rules: Geist Serif
  Regular 400 headings, Arial working text, paper/white surfaces, single ink
  contours and r24 sheets are retained. Host I1 headings use the documented 26px
  record/form scale. This is a host composition, not a pixel-identical source screen.
- Tab/Shift+Tab, visible focus, Enter/Space, material disclosure, tab arrows/Home/End,
  preview/return focus and error focus were tested. The title input's measured
  visible outline is solid 3px (`keyboard-focus.json`). Required consent and
  incomplete-project errors prevent submission. Information uses text labels.
- Axe found no violations in the scanned main content of either view at the three
  required widths. This does not prove complete WCAG compliance or screen-reader
  behavior; the 320px clipping remains a separate observed defect.

### Findings and proposed changes — not implemented

| ID      | Priority | Origin                                               | Reproduction and evidence                                                                                                                                                                                                                                                                              | Proposed correction                                                                                                                                                                                                                                                                                                                                            |
| ------- | -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I1-V01  | P2       | New I1 visual defect                                 | Ewa → Alicja → record at 320px → rationale section. Save button is 322.5px wide in a 250px container, x=35 and right=357.5; last 37.5px falls beyond the viewport. `ewa-review-320.png`, `source-style-and-clipping.json`.                                                                             | Scope `max-width: 100%` and `white-space: normal` to the contribution-review action, preserving shared controls; retest 320/390/1280, long labels and keyboard. Current cause: inherited `white-space: nowrap`, no width constraint, button outside `.record-actions`. Owners: src/features/prototype/project-contribution-review.tsx and src/app/records.css. |
| I1-T01  | P2       | Regression assertions not adapted to I1              | Existing legacy-draft tests at 1440/375 fail at prototype.spec.ts:393. HEAD-before-I1 tabs from answer to checkbox; current UI correctly tabs to “Dodaj projekt”, then checkbox. `baseline-current-keyboard.json` proves both sequences.                                                               | Update keyboard journey assertions for the new optional control and subsequent save/submit navigation; keep the real keyboard and persistence assertions. This is a test-maintenance gap, not an observed focus trap.                                                                                                                                          |
| ENV-T01 | P3       | Installed-Chrome compatibility of old PDF assertions | Two persona PDF tests reach their final external-request assertion and fail on `chrome-extension://...` PDF-viewer resources. Same traffic occurs in isolated HEAD-before-I1. Local PDFs return valid %PDF- bytes; no off-origin HTTP(S) requests were observed. `baseline-current-pdf-requests.json`. | Classify browser-internal viewer resources separately while retaining validation of application-origin HTTP(S), downloaded PDF identity and snapshot behavior; optionally confirm with approved provisioned Chromium later. No test assertions were changed or skipped.                                                                                        |
| ENV-EOL | P2       | Pre-existing checkout/tooling                        | Full formatting, kit raw hashes and baseline CSV checks fail on CRLF/LF; see diagnosis below.                                                                                                                                                                                                          | Requires a separate repository/environment decision. No bulk normalization, Git setting change, reference mutation or validator disabling was performed.                                                                                                                                                                                                       |

Previously known Base UI Settings label/button semantics, npm advisories and
NH-01–NH-05 company-page findings remain outside I1 and unresolved. This step did
not run a new npm audit or claim those problems fixed. The known Zod/chunk build
warnings remain nonblocking for these local tests.

### CRLF/LF diagnosis

`line-ending-analysis.json` records the following read-only checks:

- `core.autocrlf` is true; it was read, never modified.
- All 137 files flagged by full Prettier equal HEAD after CRLF-to-LF normalization.
  These files were not modified by I1. The step-5 changed-file set still passes
  its scoped formatting check; the complete gate remains FAIL.
- Of all 67 kit files, 31 raw hashes match the manifest; the other 36 match after
  line-ending normalization, with zero other mismatches. `.nvmrc` is the first raw
  integrity failure. No kit/manifest edits or alternate hashes were substituted.
- The normalized public baseline CSV equals HEAD. Its raw CRLF bytes differ from
  the verifier's LF-generated CSV. Historical data was not changed.
- No normalized read-only comparison is represented as a passing raw integrity
  or packet validation. Those commands retain their actual failing exit codes.

### Evidence index and commands

Evidence directory: `artifacts/case-forge-i1-step6-2026-11-14/`.

Key screenshots:

- `alicja-form-1280.png`, `alicja-preview-1280.png`
- `alicja-layout-1280.png`, `alicja-layout-390.png`, `alicja-layout-320.png`
- `alicja-activity-390.png`, `alicja-activity-320.png`
- `ewa-current-1280.png`, `ewa-stale-and-review-1280.png`
- `ewa-layout-1280.png`, `ewa-layout-390.png`, `ewa-layout-320.png`
- `ewa-evidence-390.png`, `ewa-evidence-320.png`
- `ewa-review-390.png`, **`ewa-review-320.png`** (I1-V01)
- `reference-components-1280.png`, `reference-components-390.png`
- `project-validation-error.png`, `storage-quota.png`, `storage-unavailable.png`

Machine-readable reports: `checks.json`, `regression.json`, `i1-results.json`,
`supplement.json`, `validation.json`, `layout-measurements.json`, `axe-*.json`,
`line-ending-analysis.json`, `source-preservation.json`. HTML reports and retained
failure traces are in `regression-report/`, `i1-report/` and result subdirectories.
All exported scenario files in this directory contain synthetic data only.

Executed Playwright configurations are retained in the ignored evidence directory:
`regression.config.ts` (34 unchanged existing tests on the static preview),
`i1.config.ts` (9 focused tests on the dev app), `supplement.config.ts` (4 diagnostic
tests at execution time), `validation.config.ts` (the added focused validation test).
The later validation test was appended to the supplemental harness; its separate
result is `validation.json`, not part of the earlier 4-test report.

### Readiness and recommendation

The full candidate-to-recruiter workflow passed at desktop. The 390px layouts
passed the measured readability/control checks; mobile keyboard/submission were
exercised separately. Do not accept the prototype unconditionally across required viewports:
I1-V01 fails the 320px criterion, the existing browser suite has four failing
assertions, and complete repository checks remain red for the documented reasons.
Recommendation: approve the scoped visual fix and test-assertion updates, then
retest the affected flow/widths and regression. Resolve or explicitly assess the
pre-existing line-ending blocker separately without hiding its failed checks.

No application-code fix was made. No commit, push, PR, publication, Second Brain
edit or E1 session occurred. Q3.3 is not marked complete; step 7 was not started.
Browser checks establish interface behavior only, not the effectiveness of I1 for
recruiters, real authorship or competence, or the outcome of the planned E1.

## Step 6A — approved fixes and retest, November 14, 2026

### Intent and acceptance criteria

The user authorized the minimal I1-V01 review-action wrapping fix and updates to
the two I1-T01 keyboard regression cases. Keep the PDF assertions, CRLF/LF policy,
Git configuration, immutable reference and existing dependency warnings unchanged.
Do not start step 7, commit, push, publish or execute E1.

- Scope review-button sizing to `.contribution-review`; preserve global controls.
- Verify container/viewport fit, readable wrapping, height, keyboard focus and
  successful saving at 320/390/850/950/1280px.
- Assert the actual answer → Add project → consent → Send → Save draft keyboard
  order in both legacy-draft cases, retaining source isolation and persistence.
- Verify keyboard project addition and reaching approval in a separate test.
- Rerun typecheck, lint, units, build, focused I1 and available-Chrome regression.
- Record actual remaining failures and a new 320px screenshot; preserve step-6 history.

### Results

Both authorized issues are resolved in the tested scope. I1-V01 and I1-T01 are
closed by the new evidence below; ENV-T01 and ENV-EOL remain open. Earlier step-6
findings/results above are historical observations, not overwritten outcomes.

#### Exact change scope

1. `src/app/records.css`: added a single local rule for
   `.contribution-review [data-slot="button"]` with `max-width: 100%` and
   `white-space: normal`. The existing shared button height, typography, padding,
   color, border and focus rules remain in control. No global button component or
   token was changed.
2. `tests/e2e/prototype.spec.ts`: updated the common body of the two parameterized
   legacy-draft keyboard cases (1440px and 375px). The test explicitly asserts
   answer → Add project → consent → Send → Save draft, Shift+Tab back to Add project,
   keyboard draft save and reload, consent via Space and submission via Enter.
   Existing hidden-source/generated-text checks and persistence assertions remain.
   No tests were skipped, removed or relaxed.
3. `docs/tasks/case-forge-i1.md`: appended step-6A intent, executed results and
   evidence. FEATURES.md was reviewed: this restores the existing responsive
   contract and updates test expectations, without adding/changing product flows.

These are the only three repository-file changes relative to the start of 6A.
Test runners and evidence are under the ignored
`artifacts/case-forge-i1-step6a-2026-11-14/` directory. Comparing 161 source/test/
reference/configuration files with the start-of-step hashes found exactly the
two authorized source/test changes. The PDF-test prefix remains byte-identical;
the edited test file retains CRLF throughout (997 original lines, 1014 after the
added assertions), with no line-ending policy change. See `source-preservation.json`.

#### Before and after

| Check                                                | Step 6 before                                    | Step 6A after                                                        | Evidence                                                   |
| ---------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| Review-save action at 320px                          | FAIL: width 322.5px; parent 250px; right 357.5px | PASS: width 250px; right 285px; two readable text lines; height 70px | `review-measurements-320.json`, `ewa-review-fixed-320.png` |
| Two legacy-draft keyboard cases                      | 0/2 PASS                                         | 2/2 PASS, no skips                                                   | `keyboard.json`                                            |
| Full existing Chrome regression                      | 30/34 PASS; four failures                        | 32/34 PASS; two unchanged PDF failures                               | `regression.json`                                          |
| Focused I1 browser suite                             | 8/9 PASS                                         | 9/9 PASS                                                             | `i1-results.json`                                          |
| Five-width review action + keyboard project addition | Not covered by a dedicated save/focus matrix     | 6/6 PASS                                                             | `responsive.json`                                          |
| Unit/integration tests                               | 49/49 PASS                                       | 49/49 PASS                                                           | `test.log`                                                 |
| TypeScript                                           | PASS                                             | PASS                                                                 | `typecheck.log`                                            |
| ESLint                                               | PASS                                             | PASS                                                                 | `lint.log`                                                 |
| Build                                                | PASS with known warnings                         | PASS with the same Zod/chunk warning categories                      | `build.log`                                                |
| Full check / scripts/verify                          | FAIL: CRLF/LF                                    | FAIL: CRLF/LF; no bypass                                             | `check.log`, `scripts-verify.log`                          |
| Reference integrity / baseline packet                | FAIL: raw CRLF/LF differences                    | FAIL: unchanged causes                                               | `design-system-check.log`, `verify-packet.log`             |

Browser: existing installed Chrome 157.0.8103.78 through Playwright; no installation
or dependency changes. Dev server 3001 and static regression preview 3106 used
separate fresh browser contexts. The default provisioned Playwright Chromium is
still absent; these are available-Chrome results, not a claim about that executable.

The old step-6 JSON/HTML reporter paths were resolved relative to their config
directory and are nested under
`artifacts/case-forge-i1-step6-2026-11-14/artifacts/case-forge-i1-step6-2026-11-14/`.
The step-6A reporter uses absolute output paths; its JSON and HTML reports are
directly in the step-6A evidence directory named above.

#### Responsive and keyboard verification

Each width used a fresh complete synthetic submission and employer review.
The test reaches the save button with Tab from the next-step field, checks
Shift+Tab/Tab, measures a solid 3px focus outline, saves by Space (320px) or Enter,
reloads and verifies the stored rationale and unchanged stage/history. It also
asserts every text-line rectangle fits inside the button, the button fits its
container/viewport, and document scrollWidth does not exceed the viewport.

| Viewport | Container width | Button width × height | Right edge | Result                                                |
| -------- | --------------- | --------------------- | ---------- | ----------------------------------------------------- |
| 320px    | 250px           | 250 × 70px            | 285px      | PASS: wrapped label, visible focus and persisted save |
| 390px    | 320px           | 320 × 70px            | 355px      | PASS                                                  |
| 850px    | 516px           | 322.5 × 49px          | 595.5px    | PASS                                                  |
| 950px    | 584px           | 322.5 × 49px          | 627.5px    | PASS                                                  |
| 1280px   | 652.78px        | 322.5 × 49px          | 880.72px   | PASS                                                  |

All five new screenshots were visually inspected. Label wrapping is readable,
the button stays in the reading surface, and no control/section overlap or
horizontal overflow was observed. The 320/390px height grows naturally; wide
screens retain the original one-line 49px action.

A separate 320px keyboard-only test activates Add project with Enter, tabs to the
new title input, types the project/context/own/team/AI/activity fields, reaches
consent, approves with Space and submits with Enter. After inserting the fields,
the next Tab reaches the project title (the DOM active element is temporarily
BODY immediately after the removed Add button). No focus trap or restart through
the page header occurred. Evidence: `keyboard-add-project.json`.

The 9-test I1 suite repeats the full Alicja → project → M1–M3/unavailable evidence →
edit/invalidation → draft/reload → preview → consent reset → submit → Ewa →
rationale/save/reload flow. Snapshot immutability, private-field omission, no
automatic stage change, ordinary applications, idempotent demo, import/export,
v1 migration and storage-recovery cases also pass. The responsive suite additionally
verifies saving from the keyboard at every requested width, including 320px.

#### Current acceptance assessment

| I1 criterion                                                               | Current result                                         | Evidence                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Optional project, own/team/AI work and exact approved declarations         | PASS                                                   | Focused browser suite and 49-test unit/integration run                                    |
| M1–M3, missing material and pre-submit review                              | PASS                                                   | Focused main/material tests                                                               |
| Draft reload, consent clearing and immutable submission                    | PASS                                                   | Focused full journey                                                                      |
| Declaration/material/synthetic explanation/unknowns distinction            | PASS                                                   | Current/stale scenarios and screenshots                                                   |
| Invalidation after edits/import/read                                       | PASS                                                   | Claim/material/import tests                                                               |
| Private rationale/next step, persistence and no automatic stage change     | PASS                                                   | Main journey and all five width-specific keyboard saves                                   |
| Additive demo, ordinary/old applications, no invented score or new service | PASS                                                   | Focused suite and unchanged dependencies                                                  |
| v1/v2 migration, import/export and recovery                                | PASS                                                   | Focused suite                                                                             |
| Poster People responsive action and keyboard traversal                     | PASS in tested scope                                   | 9/9 focused tests, 2/2 updated keyboard cases and 6/6 dedicated responsive/addition cases |
| Immutable reference preserved                                              | PASS for preservation; raw integrity gate remains FAIL | Start/end source hashes; no reference edits                                               |

All tested technical I1 acceptance criteria are satisfied in the agreed local
Chrome scope. This does not establish full WCAG compliance, physical-device/
cross-browser coverage, authorship/competence verification or E1 effectiveness.

#### Open issues and recommendation

- ENV-T01 remains **OPEN / FAIL**: the two unchanged persona PDF tests still count
  Chrome's internal PDF-viewer resources as external requests. All 34 regression
  tests ran; the full suite must not be labeled PASS.
- ENV-EOL remains **OPEN / FAIL**: full formatting, raw kit hashes and generated
  baseline CSV checks still fail on preserved CRLF/LF differences. The edited
  legacy test keeps its original CRLF convention, so its default LF format check
  remains among the failures. No mass normalization, Git setting change, reference
  mutation or validator disabling was performed. Local CSS formatting passes;
  read-only formatting of the test with its existing CRLF convention also passes.
- Existing npm advisories, Base UI Settings semantics, Zod/chunk warnings and
  NH-01–NH-05 findings remain untouched and are not claimed resolved.

Recommendation: the agreed I1 verification scope of step 6 can be closed, with
I1-V01/I1-T01 resolved and the above unrelated failures explicitly carried forward.
This is not a green full-repository gate, permission to publish, or completion of
Q3.3. The user retains the final acceptance decision; step 7 was not started.

New screenshot:
`artifacts/case-forge-i1-step6a-2026-11-14/ewa-review-fixed-320.png`.
Focus evidence: `ewa-review-focus-320.png`. Other widths use the same filename
pattern with 390, 850, 950 and 1280. JSON: `responsive-summary.json`,
`review-measurements-*.json`, `keyboard.json`, `responsive.json`, `i1-results.json`,
`regression.json`, `checks.json` and `source-preservation.json`. HTML reports:
`i1-report/index.html`, `regression-report/index.html`.

No commit, push, publication, Second Brain modification, E1 execution or new
library installation occurred. The branch remains `feature/case-forge-i1` and all
work is uncommitted. Q3.3 is not marked complete.
