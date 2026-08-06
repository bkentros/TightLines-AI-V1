# Activity Outlook v1 — Big Manistee Fall Chinook

**Configuration:** `2026-08-06-big-manistee-steelhead-activity.1`
**Rules:** `big-manistee-fall-chinook-activity-v4`

Activity Outlook estimates the feeding or aggressive responsiveness of a
Chinook already present in the river. It is not catch probability, abundance,
migration timing, fresh movement, fishability, or a safety rating.

## River-specific scope

The Big Manistee is not treated as a larger Pere Marquette. Its scored live
inputs come from USGS `04125550`, approximately 700 feet below Tippy Dam, and
the primary modeled-weather point at Wellston. The result therefore represents
the regulated Tippy tailwater and upper migratory corridor. Every explanation
states that temperature, clarity, and presentation conditions may differ below
High Bridge and farther downstream.

Michigan DNR separates the cold/cool Tippy-to-High Bridge reach from the warmer
river below High Bridge. One Wellston reading must not be presented as a direct
measurement of the full 25-mile corridor.

## Shared engine, Big Manistee calibration

The implementation reuses the shared `chinook_fall_reaction` engine and its
four blocks, deterministic rollup, confidence states, missing-input behavior,
warm and extreme-flow constraints, and semelparous lifecycle safeguards.
River-specific values live in the Big Manistee run configuration.

| Component | Weight |
|---|---:|
| Effective light | 55% |
| Measured Wellston water temperature | 20% |
| Wellston river behavior | 15% |
| Precipitation context | 10% |

Effective light remains dominant because Chinook are photosensitive. Measured
temperature carries slightly more influence than in the PM calibration because
Tippy creates a distinct, continuously measured tailwater regime. River
behavior uses the accepted Big Manistee absolute bands; Activity does not
re-award Push credit for a rise. Precipitation remains restrained cover context
and never substitutes for clarity.

## Temperature calibration

The Wellston record is materially warmer during early entry than later in the
run. The configured curve is:

- cold-side transition: 43°F
- favorable response band: 48–62°F
- continuously declining warm shoulder: above 62°F
- strong warm constraint: 68°F
- favorable-language barrier: 72°F

Warm early entry is not treated as fish absence. A lake-fresh beginning-stage
fish can retain partial responsiveness below 68°F, particularly in low light,
but warm water cannot produce an exceptional result. At 68°F every historical
complete replay day was Reserved; at 72°F and above every day remained
Reserved. These thresholds are a river/product calibration informed by the
measured tailwater record and Great Lakes Chinook biology, not a claim that one
temperature guarantees behavior.

## Hydraulic calibration

Activity uses the accepted Wellston/Tippy fishability bands as a continuous
presentation-shape input:

- very low: below 1,100 CFS
- low fishable: 1,100–1,400 CFS
- ideal: 1,400–1,900 CFS
- high fishable: 1,900–2,500 CFS
- very high: 2,500–3,500 CFS
- blown out: 3,500 CFS and above

Those values do not claim equivalent flow or clarity downstream.

## Lifecycle behavior

- Staging makes every score conditional on a sparse early Chinook already
  having entered.
- Beginning permits partial warm-water response from a lake-fresh fish without
  claiming abundance or movement.
- Building and Peak separate responsiveness from the broad seasonal presence
  shown by Fish In River.
- Across Tapering, the point deduction grows continuously from 0 immediately
  after Peak to 15 points on October 20. Exceptional conditions can still
  produce a strong read without treating all tapering fish as equally
  diminished.
- Across Ending, the score blends continuously from that 15-point deduction to
  the stronger proportional 46% lifecycle constraint on October 31. The
  residual tail then holds the 46% constraint.
- The complete-input conditional-response floor is fully active through Peak,
  then fades continuously to zero across Tapering. Ending and post-run output
  can remain genuinely very low when the environment and deteriorating fish
  condition both point that way.

Early Ending can remain Active while its constraint is still transitioning;
the final Ending day and residual tail cannot become Active or Highly active.
Tapering is reduced but not artificially prevented from reflecting unusually
strong conditions. Late copy defines the result as lifecycle-adjusted expected
responsiveness for a fish of unknown condition. A newly arrived or fresher fish
may outperform it; a spawning, spent, or dying fish may underperform it.

## 2007–2025 replay

- 1,938 expected dates; 1,886 complete usable dates (97.3%)
- Daily min/p10/median/p90/max: 3/28/65/87/97
- Block min/p10/median/p90/max: 3/27/59/87/98
- 77 unique daily scores and 80 unique block scores
- 121 days and 490 blocks reached 90+
- Beginning median 29, p90 81, maximum 89
- Building median 75, p90 89, maximum 97
- Peak median 83, p90 93, maximum 96
- Tapering median 80, p90 88, maximum 95; 101 days were Highly active
- Ending minimum 3, median 53, maximum 77 as the constraint transitions
- Residual post-run minimum 30, median 39, maximum 44
- Median block spread 7; p90 21; maximum 35
- Missing coverage: flow 0, prior flow 0, measured temperature 24,
  temperature lookback 42, weather 0
- Zero block, copy, reach-scope, geography, rollup, warm, barrier, lifecycle,
  or late-optimism invariant failures

The older 1996–2006 record was also inspected as sensitivity context but is not
the normative release replay because temperature/lookback coverage falls below
the 80% release gate when the full 1996–2025 window is required.

## Sources

- Michigan DNR Chinook species profile:
  https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon
- Michigan DNR Tippy Dam General Management Plan:
  https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf
- Michigan DNR Manistee River below Tippy Dam status report:
  https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder4/StatusReport_ManisteeRiverTippyDam_04-4.pdf
- USGS Wellston station `04125550`:
  https://waterdata.usgs.gov/nwis/dv?site_no=04125550
