# White River observed Activity audit — 2026-08-26

Steelhead lifecycle calibration updated 2026-08-27 after owner review of the
initial stage means.

## Decision

White River Activity uses independently freshness-gated measured temperature
from Weaver Street below Hesperia Dam, measured Fruitvale Road hydraulics, and
Pines Point hourly weather. The stations are complementary corridor inputs and
remain separately identified; the read does not claim that they are co-located.

The weights use the established observed-river Michigan species calibrations:

| Species | Light | Water temperature | River behavior | Weather |
| --- | ---: | ---: | ---: | ---: |
| Chinook | 55% | 20% | 15% | 10% |
| Coho | 50% | 25% | 15% | 10% |
| Steelhead | 25% | 50% | 15% | 10% |

Chinook matches Big Manistee and Muskegon. Coho and Steelhead match Pere
Marquette, Big Manistee, Muskegon, and St. Joseph. No White-specific stage
bonus was introduced.

## Fixed historical replay

The fixed replay covers 2022–2025 and uses USGS Fruitvale daily discharge,
Monitor My Watershed Weaver Street measured temperature, and Open-Meteo hourly
weather. Means are daily Activity scores on days when all replay inputs and
temperature trend history are available.

| Stage | Chinook mean | Coho mean | Steelhead mean |
| --- | ---: | ---: | ---: |
| Pre-run | 55.33 | 58.40 | 55.36 |
| Beginning | 60.17 | 63.96 | 63.72 |
| Building | 74.89 | 70.70 | 74.74 |
| Peak | 82.54 | 83.58 | 82.74 |
| Tapering | 76.02 | 72.40 | 71.97 |
| Ending | 55.20 | 53.20 | 59.81 |
| Post-run | 39.80 | 38.26 | 54.45 |
| All usable days | 69.11 | 64.75 | 68.80 |

| Species | Expected days | Fully paired days | Coverage | Replay gate |
| --- | ---: | ---: | ---: | --- |
| Chinook | 392 | 264 | 67.35% | Below 80% |
| Coho | 384 | 272 | 70.83% | Below 80% |
| Steelhead | 368 | 303 | 82.34% | Pass |

Flow and weather have complete coverage in these windows. Missing Weaver
temperature or the required 24/72-hour temperature history accounts for the
unpaired days. A separate 2023–2025 run did not improve coverage, confirming
that this is recurring sensor coverage rather than only a partial 2022 launch
year.

All mechanical invariants pass for all three species: four complete blocks,
complete and river-scoped copy, no foreign geography, daily scores inside the
block range, warm/barrier caps, lifecycle caps, late-run semantics, and
Steelhead mortality-language and base-lifecycle protections.

## Comparison with audited Michigan rivers

White Chinook Building through Post-run is within or close to the observed
ranges from Pere Marquette, Big Manistee, Muskegon, and St. Joseph. White Coho
is also close through the main run; its Pre-run and Post-run means are higher.
The unshaped White Steelhead replay was materially higher in Pre-run and
Beginning than Peak because favorable below-dam temperatures intersected the
early configured window. The final Steelhead calibration retains the shared
25/50/15/10 measured-input weighting and adds a bounded lifecycle response
shape derived from those replay means: -25 Pre-run, -22 Beginning, unchanged
Building, +20 Peak, +12 Tapering, -3 Ending, and -10 Post-run. Peak is now the
highest stage mean, Building and Tapering form shoulders, and both early and
late stages decline. Hard-condition and missing-data caps remain authoritative.
No salmon mortality ramp or mortality copy applies. Activity remains
conditional on a fish being present and does not change the separate seasonal
Presence score.

Chinook and Coho replay results are evidence-bearing but do not satisfy the
repository's 80% completeness gate. They must not be described as fully
historically accepted until more qualifying Weaver history is available or an
additional measured below-Hesperia temperature source is independently
accepted. This limitation does not turn current Activity into weather-only:
the live model fails and recovers each measured source independently.

## Artifacts

- `docs/audits/river-run-white-chinook-activity-replay.json`
- `docs/audits/river-run-white-chinook-activity-review-100.csv`
- `docs/audits/river-run-white-coho-activity-replay.json`
- `docs/audits/river-run-white-coho-activity-review-100.csv`
- `docs/audits/river-run-white-steelhead-activity-replay.json`
- `docs/audits/river-run-white-steelhead-activity-review-100.csv`
