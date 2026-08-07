# Activity Outlook v1 — Muskegon Fall Chinook

**Configuration:** `2026-08-06-muskegon-chinook-activity.2`  
**Rules:** `muskegon-fall-chinook-activity-v2`

Activity estimates the environmental responsiveness of a Chinook already in
the river. It is not abundance, catch probability, Migration Timing, Push,
Fishability, or a safety rating.

## Locked river scope

The sole scored river source is USGS `04121970`, immediately below Croton Dam.
It provides daily and live discharge plus measured water temperature. The
station directly represents the regulated Croton tailwater; it is not a direct
measurement of Newaygo, the lower river, Muskegon Lake, or the channel. Croton
Dam is the hard upstream migration boundary.

## Muskegon calibration

| Component | Weight |
|---|---:|
| Effective light | 55% |
| Measured Croton water temperature | 20% |
| Croton river behavior | 15% |
| Precipitation context | 10% |

The model uses the shared four-block Activity mechanics but no PM or Big
Manistee river values. Light remains the leading reaction-window variable.
Measured Croton temperature has meaningful influence because the dam creates a
distinct regulated regime. River behavior uses the accepted Muskegon
Fishability bands continuously and does not duplicate Push. Rain remains minor
cover context.

Temperature response is favorable from 48–62°F, constrained at 68°F, and
strongly constrained at 72°F. Warm early entry is not interpreted as fish
absence, but it normally keeps Activity Reserved even when light is favorable.

## Back-half lifecycle

- Through October 12, the complete-input Chinook response floor remains active.
- October 13–25: that floor fades continuously while a 15-point lifecycle
  deduction grows.
- October 26–November 5: the result blends continuously from the completed
  deduction into a 46% residual constraint.
- November 6–12: the residual constraint remains fixed for the sparse tail.

The adjustment represents expected responsiveness for a Chinook of unknown
condition. A fresh late arrival may outperform it; a spawning, deteriorating,
spent, or dying fish may underperform it.

## Historical acceptance

The 2007–2025 mechanical replay used Croton daily mean flow and measured water
temperature with hourly archived radiation, cloud, and precipitation at the
configured Croton weather point. Coverage was 1,764/1,805 days (97.7%). All
scope, geography, copy, block, warm-water, barrier, lifecycle, and late-optimism
invariants passed.

Back-half medians were 82 at the Peak shoulder, 85 during early Tapering, 73
during late Tapering, 64 during early Ending, 42 during late Ending, and 39 in
the residual tail. Boundary tests separately prove the lifecycle mechanism has
no stage-date cliff.
