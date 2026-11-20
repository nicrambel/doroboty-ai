# Participant guide

## Start

Use the prepared baseline package and Node.js 24 with npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. If Node or registry access is blocked by your organization, ask your instructor/IT rather than bypassing the policy.

## Try a complete flow

1. Choose Anna Kowalska and browse offers.
2. Save an offer, edit the profile and submit an approved application. Source notes and the editable proposal are separate.
3. Choose Karolina Wiśniewska for BrightLabs and review its candidates.
4. Record review, invitation, conversation and the next decision.
5. Return to Anna and inspect the application history.

Karolina and Tomasz see their respective companies in the interface; this is role simulation. All data is local and synthetic. CVs are prepared text examples, not real uploads. AI proposals and scores simulate the scenario.

## Optional Case Forge I1 walkthrough

1. Open `/#/auth/sign-in` and click **Wczytaj fikcyjny scenariusz I1**. This adds
   Alicja, Ewa and a draft without replacing existing personas or applications.
2. Choose **Alicja**, open **AI Product Manager**, then **Aplikuj**. The prepared
   **Twój wkład w projekt** section describes Papierowy Most, four declarations,
   M1–M3 and the unavailable integration material. Own work, team work and AI help
   are separate fields. Use synthetic data only.
3. Edit the project/materials or choose **Nie mogę udostępnić materiału** for an
   activity. Any substantive change invalidates all prepared explanations; the
   prototype does not generate replacements. **Zapisz szkic** saves the project
   and answer for reload. There is no autosave.
4. Use **Sprawdź projekt przed wysłaniem**, return to editing if needed, then
   explicitly approve and send the application. Editing content clears approval.
   Only assigned materials are included in the immutable submitted copy.
5. Choose **Ewa**, open **Kandydaci**, select **Alicja**, then **Wkład w projekt**.
   Expand M1–M3 and distinguish declarations, material contents, synthetic
   explanations and unknowns. The original fourth declaration is:
   “Rozwiązanie działało w pilotażu; integrację wykonał programista”.
6. Save **Uzasadnienie i następny krok**. This does not change the recruitment
   stage. Existing stage buttons remain separate. Candidate views omit recruiter
   rationale and private notes; the shared browser scenario/export is not secure
   role-based storage. Ewa and Karolina both represent BrightLabs.

Reloading the demo does not reset edits or create duplicate records. Full reset
in settings returns to the original baseline; loading I1 again is then explicit.
No new Match Score is generated for Alicja. All people, documents, explanations
and outcomes in the example are synthetic. E1 remains planned, without research
participants, measurements or findings. Browser and visual acceptance of I1 is
reserved for Case Forge step 6.

## Save, share and recover

Changes survive reload in this browser. Settings can export a JSON file, import a scenario or reset to fixtures. Import/reset asks before replacing state. If a save is incompatible, download the original before resetting. Storage failure is shown explicitly; export before closing the tab. Only one tab can edit the scenario. Other tabs show a warning and cannot save, import or reset. To resume there, copy any unsaved form text, close the editing tab and refresh the other tab. It then loads the latest saved scenario. If the browser cannot provide the safe editing lock, changes stay in memory; export before closing. This does not add confidentiality between personas.

Current exports use version 2. Valid version-1 files migrate on import/read; the
original v1 browser key is preserved, and writes use v2. Older application builds
cannot import v2 exports. Do not use an older build to edit the same scenario.

A URL shares the interface, not your local changes. To transfer a scenario, share the exported file and import it in the other browser. Exports include all personas, applications and notes; never enter real personal data.

## Static build

Run npm run build. Serve dist/ through any static HTTP host. No provider account is needed for local development. Do not open index.html via file://; ES modules need HTTP. Hash links work without route rewrite configuration.

## Verification

Run ./scripts/verify or npm run check. Browser tests require provisioned Playwright Chromium; a missing test browser does not prevent npm run dev. Do not let an agent install system dependencies automatically. If Chrome is already installed, explicitly set PLAYWRIGHT_CHANNEL=chrome (PowerShell: `$env:PLAYWRIGHT_CHANNEL="chrome"`) to run the same browser checks with it. The default remains the provisioned Chromium.
