# Prototype data boundary

This static frontend has no trusted server or real authentication. Role-specific UI and local transition checks organize the scenario; anyone using the browser can inspect all stored data. Use synthetic data only.

No API keys, credentials, real CVs or private material belong in frontend source, JSON, localStorage or exports. Exports include private-in-the-UI source/recruiter notes.

Optional PostHog uses only a public project ingestion token in an ignored local `.env`; never add a personal API key. The pre-send allowlist in `src/features/analytics/posthog.ts` permits pageviews and clicks only. It replaces record routes with fixed templates and removes form/DOM text, attributes, referrers, query strings, person properties and arbitrary custom data. Session replay, personal profiles, exceptions, console logs, metrics and remote SDK configuration are disabled. Analytics identifiers are memory-only; Do Not Track prevents initialization. Requests inherently expose transport metadata to the destination, so content minimization is not a claim of legal anonymity. Keep synthetic-data use and review the payload tests whenever changing instrumentation.

Render imported text through React text nodes, validate imports with shared Zod schemas, reject unsupported versions, duplicate IDs, broken references and oversized files. Never overwrite an unreadable save automatically.
