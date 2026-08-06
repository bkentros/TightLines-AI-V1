# Activity Outlook v6 — Pere Marquette Fall Chinook

Activity Outlook estimates the environmental responsiveness of Chinook already
present in the river. It is not fish abundance, catch probability, or a safety
rating.

## Production slice

- Active from staging through the late historical-presence window
- One 0–100 daily headline derived from 5–9 AM, 9 AM–1 PM, 1–5 PM, and 5–9 PM
- Switches to a clearly dated Tomorrow outlook at 9 PM local time
- Uses actual-versus-clear-sky normalized shortwave light, measured water
  temperature and trend, Scottville flow band and trend, and restrained
  precipitation context
- Daily rollup is 50% four-block average, 25% best block, and 25% second-best
- Full, Moderate, and Limited data-confidence states
- Staging copy is explicitly conditional on an early fish being present
- Continuously increasing Tapering and Ending reductions prevent favorable
  weather from overstating late-run Chinook vitality without calendar cliffs
- Copy composes four independently audited dimensions: Activity band, Chinook
  lifecycle, data confidence, and Today/Tomorrow target

## PM Chinook launch weights

| Component                  | Weight |
| -------------------------- | -----: |
| Normalized effective light |    60% |
| Measured water temperature |    15% |
| River behavior             |    15% |
| Precipitation context      |    10% |

Effective light compares actual shortwave radiation with the clear-sky value
expected for the same hour. Cloud cover is fallback and explanation context; it
receives no second score through weather. Chinook temperature uses three base
states: below preferred, preferred (50–62°F), and above preferred. The 68°F
warm-water and 70°F barrier ceilings remain independent constraints.

Missing measurements are omitted and remaining components are reweighted, but
proportional reductions prevent degraded-data outlooks from reaching an
unsupported high while preserving differences between days. Tomorrow is capped
because future river temperature and response are not observed.

Rivers without accepted temperature or flow gauges can use a weather-only
profile if explicitly configured. Missing sources receive one combined
Limited-data reduction rather than separate stacked penalties. The UI and copy
must say Limited, cannot claim measured temperature or river behavior, and
cannot reach the highest activity tier. No missing measurement is inferred or
fabricated.

Temperature, precipitation, and the river's position inside its accepted flow
ranges change smoothly rather than jumping only at category boundaries. Warm
water and extreme flow use proportional reductions. Across Tapering, the
lifecycle deduction grows continuously from 0 to 15 points; across Ending it
blends continuously into the 49% residual constraint.

Through Peak, when hourly weather, measured temperature, and current river data
are all present, underlying scores below 30 are smoothly compressed into the
20–30 range. Across Tapering that floor fades continuously to zero while the
lifecycle deduction grows. Ending and residual output receive no floor, when
very low activity can accurately reflect spawning deterioration. Limited-data
reads also receive no floor.

## Owner-review coverage

The Activity Outlook review group exposes every score band plus every copy
dimension used by the PM Chinook profile:

- Staging, beginning, building, peak, tapering, and ending biology
- Highly Active, Active, Moderate, and Reserved complete-input results; the
  shared Inactive template remains available to profiles without this
  Chinook-specific conditional floor
- Full, Moderate, and Limited data confidence
- Today and after-9-PM Tomorrow targeting
- Missing temperature, weather-only, and river-data-only degradation
- Warm-water, migration-barrier, blown-out, and late-biology caps

The templates are compositional rather than a hand-written sentence for every
possible cross-product. Tests verify that every lifecycle produces distinct copy
and that unavailable inputs cannot be selected as positive drivers.

## Interpretation boundary

An Activity score can be high while Fish In River is low. The UI therefore says
“if fish are present” and keeps Fish In River independent. Early Chinook receive
partial warm-water tolerance because lake-fresh arrivals may remain responsive;
70°F and warmer still receives a strong biological penalty. Individual late-run
condition cannot be inferred from environmental data, so lifecycle adjustment
and explicit copy remain mandatory. Late output represents expected
responsiveness for a fish of unknown condition at that point in the run. A
newly arrived or fresher fish may be more active than the score, while a
spawning, spent, or dying fish may be less active or unresponsive.
