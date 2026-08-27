# Wisconsin 2026 Missing Water-Temperature Contract

**Applies to:** any River Run without a representative current measured
water-temperature feed; currently Sheboygan and Bois Brule in this cohort

**Precedent reviewed:** Betsie, Platte, and White weather-only implementations

**Status:** `gate_3_contract_gate_4_replay_required`

## 1. Core rule

Missing water temperature is a capability boundary, not a value to estimate.
Air temperature, modeled weather, lake/buoy temperature, a discontinued sensor,
and another river's water temperature may never fill the measured river-
temperature field or receive temperature weight in scoring.

Comparing behavior with Betsie is allowed. Copying Betsie's readings,
coefficients, score output, or river conclusions is not.

## 2. Nearby-river proxy research

A nearby live temperature gauge may be researched as one predictor in a
separate modeled-temperature experiment. It may never be displayed or stored as
the target river's measured temperature merely because it is geographically
close. Distance alone does not control groundwater contribution, lake mixing,
shade, channel geometry, dam effects, travel time, or storm response.

A proxy candidate can advance only when all of these are true:

1. The target reach has enough overlapping historical measured temperature to
   calibrate and test the relationship across multiple run seasons.
2. Basin, groundwater, lake influence, elevation, channel type, and response
   lag are documented rather than assumed similar.
3. Validation holds out complete seasons and reports bias, absolute error,
   extreme/warm-period error, missingness, and stage-by-stage behavior against
   thresholds frozen before final testing.
4. The model fails closed outside its trained season/range and when any required
   live input is stale or missing.
5. Public UI calls the result `Modeled water-temperature context`, shows the
   source river and uncertainty, and never mixes it with Gauge Read.
6. Activity replay proves the modeled input improves decisions without creating
   false warm/cold, migration, or safety claims. Migration Timing remains a
   separate acceptance decision.

Bois Brule is eligible for this experiment because discontinued lower-river
USGS 04026005 supplies target observations from 2021 through January 2025.
Nearby gauges, local modeled weather, seasonality, and accepted flow may be
tested against that target record. Sheboygan is not yet eligible: no accepted
target-reach temperature history exists to validate transfer from another
river. Historical DNR/SWIMS logger data could change that after a full provenance
and coverage audit.

## 3. Product behavior by primitive

| Primitive | Without representative water temperature | Confidence/copy lock |
| --- | --- | --- |
| Gauge Read | Show independently valid discharge/height; show `No measured water-temperature source` for temperature | Partial is honest; do not collapse air and water temperature |
| Migration Stage | Continue from the independently researched species calendar and endpoint | Seasonal expectation only; never a live arrival claim |
| Fish In River | Continue from the accepted species presence curve | Seasonal opportunity only; no temperature-derived shift |
| Migration Timing | Unavailable unless a separate long-term, representative input model is researched and replayed | Do not call the run early, typical, or late from air temperature or another river |
| Push / observed movement | Unavailable without an accepted river-specific response model | Rain or weather alone cannot prove fish movement |
| Fishability | May use representative hydraulics only for the explicitly represented reach after river-specific band/replay acceptance | Never infer clarity, temperature favorability, safe wading, or whole-corridor conditions |
| Activity | Eligible only under an explicit missing-temperature mode that assigns zero temperature credit, is replayed for that river/species, and discloses Limited or otherwise capped confidence | Conditional responsiveness if fish are present; not migration, abundance, catch probability, or river-condition certainty |

## 4. Cohort decisions

### Sheboygan

- Gauge Read: discharge and height at USGS 04086000; temperature unavailable.
- The gauge directly represents part of the Urban River near I-43, so a future
  reach-scoped hydraulic Fishability model is eligible for research.
- Activity may test weather plus representative hydraulics with temperature
  weight fixed at zero, or a conservative weather-only candidate. Gate 4 replay
  must choose; neither is pre-approved here.
- Migration Timing and Push remain unavailable unless independently proven.
- If the gauge is discontinued, all stale values fail closed and any
  hydraulic-dependent feature loses eligibility automatically.

### Bois Brule

- Gauge Read: upstream flow/height context at USGS 04025500; temperature
  unavailable. The discontinued lower-river 04026005 record is history only.
- Because the accepted gauge is above Highway 2 and outside the lower product
  corridor, it cannot silently drive lower-river Activity or Fishability.
- The Gate 4 default candidate is weather-only Activity at Limited confidence,
  with zero temperature and river credits, following the Betsie/Platte/White
  safety pattern but requiring Bois-specific replay.
- Migration Timing, Push, and lower-corridor Fishability remain unavailable
  unless a representative source/model is separately accepted.
- The discontinued lower-river USGS 04026005 series may supply a same-river
  historical daily-temperature normal. For each calendar date, compute one
  quality-controlled daily mean per qualifying year, then average every
  qualifying year available for that date. Show the actual year count and range
  because the 2021–2025 record is partial and the count can vary by date.
- Public Gauge Read must continue to say current temperature is unavailable.
  A separate line may say, for example, `Historical average for Aug. 26: X °F
  across 4 qualifying years (2021–2024)`, only after coverage and calculation
  QA. It must not show a current trend, current-vs-average delta, or imply that
  today's river equals the historical mean.
- The historical daily normal may shape seasonal Presence/Stage calibration and
  typical-temperature context. It receives no live-temperature credit in
  Activity, Push, Migration Timing, or current Fishability.

## 5. Required Gate 4 proof

For every species, including lake-run Brown Trout:

1. Freeze the input mode and represented reach before calibration.
2. Set missing temperature contribution to exactly zero; do not reweight it
   implicitly into air temperature, light, rain, or flow.
3. Run multi-season replay with daily and time-block label distributions.
4. Prove single-input isolation, missingness, stale/fault recovery, true maximum,
   and disclosure invariants.
5. Compare results with Betsie and other accepted weather-only rivers as a
   reasonableness band, not an acceptance target.
6. Review lifecycle shape independently: Chinook/Coho terminal decline,
   Steelhead persistence, and Brown Trout post-spawn survival must differ.
7. Keep all candidates hidden until owner review, device QA, and explicit public
   enablement.

## 6. Public limitation copy

`No representative measured water-temperature source is available for this
river reach. Temperature-based timing and movement guidance are unavailable.
Any Activity outlook uses only the inputs named on the card, has limited
confidence, and applies only if fish are present.`

This disclosure must remain visible in source/limitation details and must not be
contradicted by headlines claiming warm, cold, ideal, active-river, or fresh-push
conditions.
