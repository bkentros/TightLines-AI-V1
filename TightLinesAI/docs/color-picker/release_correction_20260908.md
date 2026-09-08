# Color Match release correction — September 8, 2026

## Decision

Color Match is a practical, evidence-informed starting point, not a prediction of the color that will catch the most fish. FinFindr confidently presents its two picks for the day, but the interface does not rank them or expose their random ordering. Water clarity and light select reviewed eligible pools; other factors such as local forage, depth, presentation, background, and species remain outside this feature.

## Corrected contract

- Generate two distinct, equal-status picks for sunny/direct light and two for cloudy/diffuse light.
- Sample uniformly inside each pool. Bright/direct and low/diffuse draws are independent; cross-section overlap is honest and is not minimized.
- Always display both clearly labeled light sections. If both pools contain the same patterns, draw once and repeat that pair in both sections rather than inventing a difference.
- Use no automatic weather or location. Send and store only request ID, lure/fly type, clarity, local date, and timezone.
- Cache by authenticated user, lure/fly type, clarity, and local date. Request replay and concurrent insert-or-return-winner behavior remain deterministic.
- Store new envelopes as schema 2 with selection version 4.0.0. Redact legacy coordinates and weather during migration.
- Enforce canonical UUID report IDs at the endpoint and validate persisted report bindings and group structure in PostgreSQL.
- Treat displayed swatches as equal, approximate references. Their widths do not claim a manufactured color ratio or measured underwater spectrum.

## Release gate

Do not deploy or create a production build until engine, service, TypeScript, Deno, database-migration, catalog, routing, artwork, and whitespace checks pass. Run the authenticated production smoke only after the migration and edge function are deployed. Any remaining native-device visual review is reported separately rather than implied by automated checks.

## Verification and deployment

- All 30 engine, report-service, endpoint, pool, palette, and explanation tests pass.
- Research QA passes all 336 reviewed cells; all 138 live cells and the unbiased overlapping-pool probability test pass.
- Catalog and routing QA pass all 80 recommender archetypes. Artwork QA passes 85 asset hashes and 680 undistorted card-fit cases.
- TypeScript and Deno checks pass. The isolated PostgreSQL test passes legacy privacy redaction, schema-2 privacy enforcement, clarity-scoped uniqueness, eight concurrent commits, replay, isolation, and permissions.
- Color Match images were reduced from 34 MB to 16 MB at 768px; recommender-only illustrations were reduced from 83 MB to 59 MB at 960px. The unused 32 MB historical selector set was removed. Representative resized assets were visually inspected.
- Migration `20260908160000_color_picker_privacy_and_clarity_lock.sql` and the `color-picker` edge function were deployed to the linked project. The authenticated production smoke passed concurrent winner, replay, reopen, separate clarity/lure, shared-light, and privacy checks, then removed its disposable account and reports.
- No EAS or other mobile production build was created. Native-device review remains a separate pre-build gate.

## Subscriber release audit

The final pre-build audit corrected release-facing presentation without changing catalog eligibility or ranking colors:

- Public setup and report copy now consistently says lure/fly instead of implying live bait or excluding flies. The accidental `FINFINDr` capitalization was corrected.
- The field card always labels Sunny / Direct Light and Cloudy / Diffuse Light separately, with two equal-status choices in each. Captions tell the angler which section to use without claiming that glare itself improves a recommendation.
- Palette swatches are equal-width approximate references. The former enlarged first swatch was removed because it implied a manufactured body/accent ratio the data does not establish.
- Saved-report ownership is checked before rendering. A stale local bookmark is removed after a confirmed not-found response and the user receives a recoverable instruction instead of a repeatedly broken link.
- A static release guard now rejects ranked/outcome language, the retired combined-light presentation, proportional swatches, terminology regressions, missing ownership recovery, and changes to the two-by-two report contract.

Post-correction verification passed: the static release guard, all 30 Deno engine/service/explanation tests, all 336 research cells and 138 live cells, TypeScript, whitespace validation, and a fresh iOS Expo export. Local and remote migrations match through `20260908160000`. After the reconciled edge function was deployed, the authenticated production smoke passed daily concurrency, replay, reopen, separate clarity/lure reports, identical-pool handling, and privacy minimization; its disposable account and reports were deleted.

Full per-pattern lure artwork remains a future enhancement, not an unstated capability of this release. The current report deliberately shows a neutral lure/fly profile image plus named, described, equal-width approximate color references. No production mobile build was created by this audit; final native-device visual review remains the pre-build gate.
