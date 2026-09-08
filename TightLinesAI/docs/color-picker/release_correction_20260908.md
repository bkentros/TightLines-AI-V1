# Color Match release correction — September 8, 2026

## Decision

Color Match is a practical, evidence-informed starting point, not a prediction of the color that will catch the most fish. FinFindr confidently presents its two picks for the day, but the interface does not rank them or expose their random ordering. Water clarity and light select reviewed eligible pools; other factors such as local forage, depth, presentation, background, and species remain outside this feature.

## Corrected contract

- Generate two distinct, equal-status picks from every distinct reviewed light pool.
- Sample uniformly inside each pool. Bright/direct and low/diffuse draws are independent; cross-section overlap is honest and is not minimized.
- If both light pools contain the same patterns, draw once and present one “Across changing light” section.
- Use no automatic weather or location. Send and store only request ID, bait type, clarity, local date, and timezone.
- Cache by authenticated user, bait type, clarity, and local date. Request replay and concurrent insert-or-return-winner behavior remain deterministic.
- Store new envelopes as schema 2 with selection version 4.0.0. Redact legacy coordinates and weather during migration.
- Enforce canonical UUID report IDs at the endpoint and validate persisted report bindings and group structure in PostgreSQL.

## Release gate

Do not deploy or create a production build until engine, service, TypeScript, Deno, database-migration, catalog, routing, artwork, and whitespace checks pass. Run the authenticated production smoke only after the migration and edge function are deployed. Any remaining native-device visual review is reported separately rather than implied by automated checks.

## Verification and deployment

- All 30 engine, report-service, endpoint, pool, palette, and explanation tests pass.
- Research QA passes all 336 reviewed cells; all 138 live cells and the unbiased overlapping-pool probability test pass.
- Catalog and routing QA pass all 80 recommender archetypes. Artwork QA passes 85 asset hashes and 680 undistorted card-fit cases.
- TypeScript and Deno checks pass. The isolated PostgreSQL test passes legacy privacy redaction, schema-2 privacy enforcement, clarity-scoped uniqueness, eight concurrent commits, replay, isolation, and permissions.
- Color Match images were reduced from 34 MB to 16 MB at 768px; recommender-only illustrations were reduced from 83 MB to 59 MB at 960px. The unused 32 MB historical selector set was removed. Representative resized assets were visually inspected.
- Migration `20260908160000_color_picker_privacy_and_clarity_lock.sql` and the `color-picker` edge function were deployed to the linked project. The authenticated production smoke passed concurrent winner, replay, reopen, separate clarity/bait, shared-light, and privacy checks, then removed its disposable account and reports.
- No EAS or other mobile production build was created. Native-device review remains a separate pre-build gate.
