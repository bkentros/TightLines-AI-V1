# Audit regression baseline changelog

Practical log of when committed audit artifacts under `generated/` were last aligned with `expected-headlines.json`.

| Date (UTC) | Notes |
|------------|--------|
| 2026-04-16 | Initial baseline: 309 matrix scenarios; per-species tie caps LMB 9 / SMB 7 / trout 5 / pike 5; daily-shift 7 pairs / 14 checks; coverage all `success_targets` pass and zero intent mismatches. |

**When to add a row:** After you intentionally change tuning and re-run `npm run audit:recommender:v3:freshwater:validate`, update `expected-headlines.json` if headline metrics or tie ceilings moved, commit the new `generated/*.json`, then append a one-line entry here.
