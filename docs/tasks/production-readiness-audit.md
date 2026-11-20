# Production readiness audit

## Intent

Assess the current dirty worktree as a synthetic-data teaching prototype using the production-readiness skill. Produce an offline Polish HTML report at `docs/production-readiness.html`. Do not repair product code, install tools, publish, commit or merge.

## Acceptance criteria

- Inspect every baseline requirement and relevant prototype-specific distribution, data and migration boundaries.
- Inspect scripts before running understood local checks; record actual outcomes and unavailable verification.
- Bind evidence to the current source fingerprint and inspected local configuration; keep future deployment and real-use requirements separate.
- Preserve existing worktree changes and report unknown hosting, operational ownership and release expectations explicitly.
- Validate the generated report and inspect desktop/mobile, disclosures, filtering and print layout in an available browser.
- Complete a separate read-only review of findings and scope before handoff.

## Behavior register

FEATURES.md was reviewed. This audit changes no application behavior, routes, roles or data, so the register does not need an update.

## Delivery

The HTML report is the authoritative audit result. No fixes or deployment are authorized. A later repair package requires the user's decision.
