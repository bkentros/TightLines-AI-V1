# Color picker — pass three selection engine

> Historical implementation record. The September 8 release correction supersedes its history-aware sampler and weather handoff.

Status: completed. Catalog `2026-09-05.4`, selection version `1.0.0`, saved schema `1`. The engine lives in `supabase/functions/_shared/colorPickerEngine/selectionEngine.ts` and has no network, persistence, UI or implicit clock dependency.

## Implemented behavior

- Validate the bait ID, clarity, one or two distinct light groups, user/request/report identity, and canonical UTC generation time. The weather adapter supplies light groups; the engine does not infer weather.
- Draw exactly three distinct patterns from each explicit reviewed condition pool. No fallback, scores, ranks or condition broadening. Sunny and cloudy pools can overlap; returned groups use a consistent sunny-then-cloudy order.
- Prefer patterns absent from the last ten distinct relevant reports per light group. If fewer than three are unseen, fill from the oldest last-seen tier first. Ties are sampled uniformly; presentation order is independently shuffled so it does not communicate recency priority.
- Production randomness uses Web Crypto with rejection sampling for unbiased bounded integers. Tests inject a bounded integer source. Recency intentionally changes draw probabilities without predicting effectiveness.
- Return color names, physical descriptions, concise pattern/condition copy, image requirement IDs, pool size and `canRotate`. Incidental hardware is not described as a recommended color. Copy does not invent forage observations or an optical reason for a light distinction that the matrix does not establish.
- Save ordered selected IDs, exact versions, input context, report/request IDs and generation time. Replay validates membership and versions, uses no randomness and preserves card order. Returned objects do not expose mutable catalog internals.
- A supplied persisted retry, or matching request in supplied history, returns the existing report. A reused request with different bait/clarity/light context fails. A new request must have a new report ID. History is scoped by user, type, clarity, light and versions.
- Typed errors distinguish invalid input, invalid catalog, invalid randomness, invalid report, version mismatch and request conflict. An invalid catalog fails closed rather than substituting another bait's colors.

## Service integration contract for pass four

Create the engine once per service instance. Derive `userId` from the authenticated session, never trust a client-supplied identity. Use `draw(input, { history, retryReport })` only after loading relevant persisted records. Use `replay(savedReport, authenticatedUserId)` to reopen a report; do not call draw during navigation or component renders.

The pure function cannot serialize simultaneous HTTP calls. The report service must atomically enforce a unique `(user_id, request_id)` key and globally unique report ID, return the persisted winner on a conflict, and update history only for committed reports. A durable request lookup must occur before drawing even when the request has aged out of the short rotation window. Do not describe the pure engine alone as providing distributed idempotency.

Persist the normalized weather snapshot and location/date context with the saved color report in the service envelope. Pass four owns the 70% boundary, forecast-hour normalization, timezone/daylight handling, coverage checks, access controls, manual fallback and endpoint behavior. No cloud threshold is duplicated here.

Keep the saved catalog and selection version available for historical replay, or retain an immutable rendered snapshot in the report envelope. This engine explicitly rejects other versions; it never silently substitutes current colors for an old report. Pattern image IDs describe required assets, not already-generated files.

## Validation

Thirteen behavior tests cover every catalog cell, exact uniform combination counts by exhaustive random-path enumeration, unseen/partial/exhausted history, scope isolation, bounded and duplicate history, small pools, cross-group overlap, replay and persisted retries, invalid inputs/randomness/reports, version mismatch, caller mutation, chronological conflicts, and broken-catalog rejection. Targeted TypeScript compilation and the existing catalog/research QA also pass.

Run:

```sh
node --import tsx --test supabase/functions/_shared/colorPickerEngine/__tests__/selectionEngine.test.ts
node --import tsx scripts/color-picker-research-qa.ts
node --import tsx scripts/color-picker-catalog-qa.ts
```

No production endpoint, schema, artwork, or existing lure/fly recommendation was changed in this pass.
