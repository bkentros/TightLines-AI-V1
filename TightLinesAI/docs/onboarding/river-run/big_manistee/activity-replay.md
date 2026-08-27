# Big Manistee Migratory Brown Trout Activity Replay

**Run ID:** `big_manistee_fall_brown_trout` **Completed:** 2026-08-27
**Decision:** `pass_ready_for_owner_review`

## Model contract

Activity estimates the feeding or aggressive responsiveness of a migratory
Brown Trout already present near the measured Wellston/Tippy tailwater. It does
not estimate abundance, fresh entry, migration timing, catch probability, or
conditions in the Middle and Lower river.

Measured water temperature leads at 45%, effective light carries 25%, Wellston
river behavior 20%, and weather context 10%. Brown Trout are repeat spawners,
so the rules contain no Chinook/Coho mortality ramp, taper penalty, ending
ceiling, or forced post-spawn departure. Stage differences in the historical
results come from the conditions associated with those calendar periods.

## Fixed 2007-2025 replay

- Expected days: 1,881
- Complete usable days: 1,851 (98.41%)
- Daily min / p10 / median / mean / p90 / max: 7 / 19 / 76 / 64.65 / 90 / 95

| Stage | Days | Min | P10 | Median | Mean | P90 | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Pre-run / staging context | 193 | 7 | 10 | 19 | 18.64 | 22 | 60 |
| Beginning | 200 | 15 | 18 | 21 | 28.71 | 63 | 74 |
| Building | 280 | 17 | 20 | 63 | 52.88 | 75 | 85 |
| Peak | 285 | 55 | 63 | 78 | 77.70 | 88 | 93 |
| Tapering | 304 | 13 | 80 | 88 | 85.65 | 92 | 95 |
| Ending | 570 | 10 | 68 | 83 | 80.68 | 90 | 94 |
| Post-run late context | 19 | 52 | 62 | 72 | 70.89 | 79 | 84 |

Activity is deliberately not forced to peak with migration presence. The
October 1 migration Peak mean is 77.70; Tapering and Ending means are 85.65 and
80.68 because late-October and November Wellston temperatures often occupy or
move through the configured response apex. A stage nudge would incorrectly make this
conditional responsiveness primitive imitate Fish In River. Living repeat
spawners therefore receive no manufactured post-peak collapse.

## Invariants

All invariant counts were zero: incomplete blocks, incomplete copy, missing
tailwater scope, prohibited geography, daily/block range mismatch, warm-cap or
barrier-cap violations, taper misconfiguration, ending-cap violations, late
optimism, mortality language, late-stage repeat-spawner penalties, and
stage-response-shape failures.

Artifacts:

- `docs/audits/river-run-big-manistee-brown-trout-activity-replay.json`
- `docs/audits/river-run-big-manistee-brown-trout-activity-review-100.csv`

## Decision

Accept the unnudged Activity calibration for owner review. The replay supports
the configured temperature-led response, credible stage shape, complete
Wellston/Tippy scope, and living-fish lifecycle behavior. Public enablement and
deployment remain separately unauthorized.
