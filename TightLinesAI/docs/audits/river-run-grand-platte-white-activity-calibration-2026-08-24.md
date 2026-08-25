# Grand, Platte, and White Activity calibration audit

**Status:** Hidden implementation candidates; not publicly enabled\
**Replay interval:** 2007–2025, fixed before final calibration review\
**Standard:** River Run Activity Onboarding Standard v1.1

## Decision

All nine river/species candidates use explicit `weather_only` mode. No candidate
combines measurements from different reaches:

- Grand: Fulton hydraulics and North Park measured temperature are excluded.
  Modeled Grand Rapids weather limits Activity to the Lower-river context.
- Platte: Honor hydraulics are excluded because the lakes separate that gauge
  from the lower mouth-to-weir run corridor. El Dorado weather is used.
- White: Fruitvale hydraulics and Weaver Street measured temperature are
  excluded. Pines Point weather provides below-Hesperia corridor context only.

Every result remains Limited confidence and conditional on a fish being present.
River level, clarity, and measured water temperature remain explicitly unknown.
Activity does not estimate migration, abundance, catch probability, access, or
safety.

## Versioned candidates

| Species   | Effective light | In-block precipitation | Water temperature | River behavior | Today max | Tomorrow max | Additional control                                             |
| --------- | --------------: | ---------------------: | ----------------: | -------------: | --------: | -----------: | -------------------------------------------------------------- |
| Chinook   |            0.75 |                   0.25 |                 0 |              0 |        90 |           85 | 15-point taper deduction, continuous ending blend to 49        |
| Coho      |            0.70 |                   0.30 |                 0 |              0 |        90 |           85 | 15-point taper deduction, continuous ending blend to 42        |
| Steelhead |            0.70 |                   0.30 |                 0 |              0 |        90 |           85 | 0.80 weather-only evidence scale; no salmon lifecycle behavior |

The weights and evidence scale are product calibrations, not published
biological constants. Chinook and Coho retain their species lifecycle. Steelhead
does not receive spawning mortality, taper, or ending penalties.

The Steelhead evidence scale has a specific rationale: measured water
temperature leads every accepted observed-river Steelhead profile at 50%.
Without it, the initial replay allowed secondary weather inputs to classify
every historical day as Active or Highly active. The 0.80 scale prevents light
and rain alone from claiming Highly active responsiveness; it does not pretend
to know whether water temperature is favorable.

## Fixed full-replay results

All reports achieved 100% expected weather coverage. Values below are daily
scores; every artifact additionally contains daily, pooled-block, and
stage-by-each-named-block distributions with label shares and cap/confidence
notes.

| Run              |  Days | Min | p10 |  Mean | Median | p90 | Max | Daily labels                                               | Median block spread | Invariant failures |
| ---------------- | ----: | --: | --: | ----: | -----: | --: | --: | ---------------------------------------------------------- | ------------------: | -----------------: |
| Grand Chinook    | 1,862 |  30 |  47 | 67.42 |     67 |  87 |  90 | 377 Moderate; 981 Active; 439 Highly active; 65 Reserved   |                  19 |                  0 |
| Grand Coho       | 2,147 |  28 |  45 | 65.93 |     67 |  84 |  90 | 515 Moderate; 1,155 Active; 381 Highly active; 96 Reserved |                  16 |                  0 |
| Grand Steelhead  | 2,432 |  50 |  51 | 64.40 |     66 |  73 |  78 | 685 Moderate; 1,747 Active                                 |                  13 |                  0 |
| Platte Chinook   | 1,957 |  32 |  49 | 69.05 |     69 |  87 |  90 | 423 Moderate; 961 Active; 548 Highly active; 25 Reserved   |                  18 |                  0 |
| Platte Coho      | 1,957 |  27 |  44 | 66.03 |     67 |  84 |  90 | 441 Moderate; 1,030 Active; 390 Highly active; 96 Reserved |                  17 |                  0 |
| Platte Steelhead | 2,736 |  49 |  52 | 64.91 |     67 |  74 |  79 | 719 Moderate; 2,017 Active                                 |                  12 |                  0 |
| White Chinook    | 1,862 |  30 |  53 | 70.99 |     72 |  88 |  90 | 242 Moderate; 1,000 Active; 588 Highly active; 32 Reserved |                  20 |                  0 |
| White Coho       | 1,824 |  27 |  48 | 69.02 |     70 |  87 |  90 | 298 Moderate; 941 Active; 520 Highly active; 65 Reserved   |                  17 |                  0 |
| White Steelhead  | 1,748 |  50 |  52 | 65.21 |     67 |  73 |  78 | 407 Moderate; 1,341 Active                                 |                  12 |                  0 |

No replay produced incomplete blocks, ceiling violations, a daily rollup outside
its block range, incomplete copy, missing weather-only disclosure, inferred
river claims, prohibited claims, lifecycle cliffs, or incorrect Steelhead
lifecycle changes.

## Calibration iteration ledger

### Platte Coho component balance

- Baseline: 0.75 light / 0.25 precipitation.
- Candidate: 0.70 light / 0.30 precipitation.
- Motivation: use the accepted Coho weather-only species starting point and test
  rather than inherit the earlier unevaluated Platte draft.
- Expected effect: slightly less light-driven elevation, slightly more bounded
  differentiation on wet blocks, no lifecycle or coverage change.
- Baseline replay: mean 66.92, median 68, p90 86, 441 Highly active days, median
  spread 18, zero invariant failures.
- Candidate replay: mean 66.03, median 67, p90 84, 390 Highly active days,
  median spread 17, zero invariant failures.
- Decision: accept 0.70/0.30. The effect is restrained, preserves useful block
  separation, and avoids making Platte Coho more optimistic without direct
  evidence.

### Weather-only Steelhead evidence

- Baseline: 0.70 light / 0.30 precipitation, evidence scale 1.00.
- Candidate: same component weights, evidence scale 0.80.
- Motivation: all three baseline replays produced only Active/Highly active days
  even though their dominant temperature evidence was unknown.
- Expected effect: preserve weather ranking and block isolation while stopping
  secondary inputs from independently claiming Highly active responsiveness.
- Platte baseline: mean 80.12, median 84, p90 89, 1,726 Highly active days.
- Grand baseline: mean 79.62, median 83, p90 89, 1,493 Highly active days.
- White baseline: mean 80.58, median 84, p90 89, 1,150 Highly active days.
- Final results appear in the table above; coverage and invariant counts did not
  change.
- Decision: accept 0.80 for the hidden candidates. Do not retroactively change
  accepted Betsie behavior within this onboarding change.

## Controlled acceptance results

The dedicated QA proves for all nine candidates:

- weather-only weights total one and contain zero temperature/river credit;
- no hydraulic or temperature source is silently included;
- confidence and disclosure remain Limited/explicit;
- isolated light and precipitation changes affect only their own four-hour
  block;
- daily rollup stays within the block range;
- today/tomorrow true maxima hold;
- salmon lifecycle ramps change by no more than two points per day and decline;
- Steelhead scores are stage-invariant under identical weather and remain at or
  below 80 from secondary evidence alone;
- no observed-river, clarity, temperature, or blown-out claims appear.

## Artifacts and remaining gates

The nine `river-run-*-weather-activity-replay.json` files in this directory are
the final full-replay artifacts for these candidate rules. Remaining gates are
production-derived review fixtures, copy/visual owner review, device QA, and
explicit public enablement. Nothing in this audit enables a run publicly.
