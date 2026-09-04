# Michigan River Run Direct Push Audit

**Audit date:** 2026-09-03\
**Scope:** every currently configured Michigan fall Chinook, Coho, Steelhead,
and lake-run Brown Trout run\
**Decision:** 19 qualified runs enabled; six unsupported runs remain unavailable
**Release:** River Run edge function version 46 deployed 2026-09-03

## Capability decisions

| River          | Runs | Direct inputs used                       | Decision                                                                                                                             |
| -------------- | ---: | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Pere Marquette |    3 | Scottville flow                          | Enable flow-only. PMTU temperature stations are different Middle/Upper reaches and are not merged into the Scottville event.         |
| Betsie         |    3 | None accepted below Homestead            | Skip. The upstream source does not represent the modeled lower migratory corridor.                                                   |
| Big Manistee   |    4 | Wellston flow and temperature            | Enable both. Both measurements come from USGS 04125550 in the regulated Tippy tailwater.                                             |
| Muskegon       |    3 | Croton flow and temperature              | Enable both. Both measurements come from USGS 04121970 in the Croton tailwater.                                                      |
| St. Joseph     |    3 | Niles flow and temperature               | Enable both. Both measurements come from USGS 04101500 in the Niles mainstem reach.                                                  |
| Grand          |    3 | Fulton Street flow                       | Enable flow-only. North Park temperature remains valid for its separately scoped Activity model but is not same-reach Push evidence. |
| Platte         |    3 | None accepted in the lower Coho corridor | Skip. The Honor gauge is upstream of Platte Lake and cannot represent the modeled lower corridor.                                    |
| White          |    3 | Fruitvale Road flow                      | Enable flow-only. Weaver Street temperature remains valid for corridor Activity but is not merged into the Fruitvale Push event.     |

## Shared event contract

- Refresh at the six four-hour slots and retain the latest 12 reads.
- Reduce observations to trailing four-hour medians; require at least two valid
  observations in a window.
- Compare flow at matched 12- and 24-hour windows. Both each river's absolute
  and percentage thresholds must pass.
- Compare temperature at a matched 24-hour window only, avoiding ordinary
  day/night cycling. Cooling below 0.75 F remains Neutral; 1.5 F and 3 F are the
  initial Elevated and Strong thresholds.
- A flow event or an accepted temperature event can elevate the read. When both
  occur, they corroborate but do not add together.
- Freeze the first qualifying baseline. Hold through 65% retention, downgrade
  through 35-65%, clear below 35%, and expire no later than 48 hours after
  onset.
- Neutral is never negative evidence. Precipitation and wind do not score.
- Monitor only from Beginning through the end of Tapering. Severe water and
  biologically limiting absolute temperature remain constraints.

## River-specific calibration

Hydraulic thresholds are retained from each river's accepted historical flow
audit; species do not change the same gauge's hydrology. Absolute temperature
constraints remain species-specific and match the configured regional biology
profile. Brown Trout and Steelhead retain living-fish/cold-holding semantics;
they do not inherit salmon mortality language.

Configuration versions were advanced for Pere Marquette, Big Manistee, Muskegon,
St. Joseph, Grand, and White so cached legacy Push reads cannot be served under
the direct-event model.

## Verification

- All 19 qualified run profiles validate as direct-event Push configurations.
- Every qualified profile detects a synthetic river-specific flow event without
  requiring temperature, proving one-input operation.
- Big Manistee, Muskegon, and St. Joseph retain independent same-station flow
  and temperature modes.
- Betsie and Platte remain explicitly unavailable for all six configured runs.
- Full River Run engine suite: 432 passed, zero failed.
- River Run UI QA: 25,185 cases passed.
- River Run visual QA: 59 states passed.
- TypeScript typecheck passed.
- Production live-condition smoke passed across 15 unique rivers. Fresh flow
  was verified for all six enabled Michigan rivers; same-station measured
  temperature was also fresh at Big Manistee, Muskegon, and St. Joseph.
- The production catalog returned all eight Michigan rivers and all 25
  configured runs. Authenticated snapshot smoke could not run because the
  configured test-user account is absent; endpoint behavior is covered by 64
  passing local endpoint tests.
