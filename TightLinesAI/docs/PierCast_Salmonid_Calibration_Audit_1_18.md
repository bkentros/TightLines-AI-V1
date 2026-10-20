# PierCast 1.18 salmonid calibration audit baseline

> Historical Pass 3 baseline. Pass 4 calibration supersedes this fingerprint;
> see `PierCast_Salmonid_Calibration_Pass4_1_18.md` for the current baseline.

Pass 3 establishes a deterministic calibration baseline before any Pass 4
seasonal curves are changed. The audit is app-local, performs no network or
production writes, and uses the same effective 1.18 opportunity evaluators as
the city report.

Run the compact audit with:

```sh
npm run audit:pier-cast:salmonid-calibration
```

Pass `-- --json` for the complete aggregate report, or `-- --rows` for one
NDJSON record per pair/date/thermal scenario. Each row records the active mode,
fishery-strength ceiling, active fishery strength, seasonal availability,
temperature modifier, internal score, Today label, season phase/trend, closure
state, internal band, and compatibility timing token.

## Reviewed Pass 3 baseline

- Audit schema: `piercast-salmonid-calibration-audit-1.18-v1`
- Calendar: leap year 2028, 366 dates
- Thermal scenarios: Excellent `1.00`, Good `0.75`, Fair `0.50`, Poor `0.20`
- Coverage: 32 cities, 6 species, 157 supported pairs
- Pair disposition: 151 scored, 6 explicit lake-trout research holds
- Matrix: 229,848 expected rows; 229,848 audited
- Row disposition: 219,592 scored, 1,472 seasonally closed, 8,784 research hold
- Structural, coverage, scoring, presentation, and deterministic-selection
  errors: **0**
- Review flags: 73
- SHA-256 fingerprint:
  `6c532b997f5485d1441db4f9a6751e30654fa4d172dd17c4de49634b0e0562b0`

Supported pair counts are Chinook 29, coho 30, steelhead 32, brown trout 27,
lake trout 32, and Atlantic salmon 7. The six lake-trout research holds remain
visible but unscored: Algoma, Kenosha, Manitowoc, Michigan City, Two Rivers, and
Waukegan.

## Pass 4 review queue

The 73 review flags are calibration prompts, not structural failures:

- 38 November transition cliffs: availability falls by at least 0.25 between
  October 15 and November 1, or the Today rating falls by more than one level.
- 33 mode-handoff gaps: the selected mode changes with an availability jump of
  at least 0.20 or a Today-rating jump of more than one level.
- 2 strong ceilings that never reach Good even with Excellent temperature fit:
  Alpena lake trout (6.2 ceiling, 5.264 maximum) and Rogers City lake trout (6.8
  ceiling, 5.756 maximum).

These flags provide the finite, reproducible queue for species and regional
calibration in Pass 4. A flag is not permission to raise a rating; evidence,
fishery archetype, seasonal behavior, and conservative user-facing accuracy must
still support each adjustment.

## Deliberate limits

Runtime pier access, ice, severe weather, and live regulation overrides are not
simulated. Configured seasonal closures are audited. The four temperature inputs
are standardized suitability scenarios, not historical or forecast water
temperatures. Research-hold cities are counted for coverage without inventing
ratings.
