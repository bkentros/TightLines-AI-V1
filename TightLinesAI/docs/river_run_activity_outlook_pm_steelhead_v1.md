# Activity Outlook v1 — Pere Marquette Fall Steelhead

Activity Outlook estimates feeding or aggressive responsiveness for Steelhead
already present in the river. It is not catch probability, abundance, migration
timing, a fresh-fish push, fishability, or safety.

## Biological distinction

Great Lakes Steelhead are migratory rainbow trout. Michigan DNR states that many
enter tributaries in fall, overwinter, spawn in spring, and can survive to spawn
again. The PM fall-entry endpoint is therefore a transition into winter holding,
not terminal deterioration or disappearance.

PM and St. Joseph River telemetry found adult upstream movement strongly tied to
water temperature; adding flow did not substantially improve that movement
model. Activity deliberately does not reuse that finding as migration credit.
Instead, it treats temperature as the leading feeding-response constraint while
Push separately owns fresh movement.

Rainbow-trout literature supports temperature-sensitive feeding and meaningful
dawn/dusk behavior, but it does not provide a PM adult-Steelhead lure-response
formula. Exact weights and score shapes are therefore product calibration,
checked against the historical PM replay rather than presented as biological
constants.

## V1 calibration

| Component                  | Weight |
| -------------------------- | -----: |
| Measured water temperature |    50% |
| Effective light            |    25% |
| River behavior             |    15% |
| Precipitation context      |    10% |

The preferred fall feeding band is 44–56°F, with a narrower 48–54°F apex. That
apex can contribute up to 95 temperature points, allowing an exceptional overall
result only when river position, effective light, and precipitation context also
align. The shoulders of the preferred band remain favorable but score lower.
Responsiveness declines progressively below 44°F, steepens near the approximately
39°F cold-holding transition, and also declines above 56°F. Unusually warm fall
water receives strong constraints at 64°F and 68°F. The exact apex is product
calibration rather than a claim that one measured temperature guarantees feeding.

Effective light still chooses among four-hour windows, but dark skies cannot
erase cold-water restraint. Scottville flow position describes current
presentation shape. A rising river receives no Steelhead Activity bonus because
Push already owns measured movement response. Rain remains restrained cover
context and is not inferred clarity.

Steelhead receive no Chinook or Coho lower-tail floor. A living fish can
honestly receive a low responsiveness score in very cold, unusually warm, or
extreme-flow conditions. Steelhead also receive no tapering, ending, or post-run
mortality ceiling. December scores change through measured temperature and
conditions while copy transitions toward winter holding.

## Lifecycle copy

- Staging is conditional on an occasional early Steelhead already being present.
- Beginning describes early fall fish with feeding or aggressive response
  potential without claiming fresh movement.
- Building separates established river presence, responsiveness, movement, and
  abundance.
- Peak acknowledges broad fall presence while keeping Activity conditional.
- Tapering explains shorter, more selective cold-water responses.
- Ending states that fish remain alive and are entering winter holding.
- Post-run preserves living fish and directs the angler toward the dedicated
  winter read when available.

Every result names the strongest four-hour window, its strongest available
factor, its main limitation, lifecycle context, and Full, Moderate, or Limited
data state. Missing measurements cannot be promoted as positive reasons.

## 2021–2025 replay

- 570 expected days; 515 complete usable days
- Daily min/p10/median/p90/max: 17/60/76/90/95
- Block min/p10/median/p90/max: 15/59/75/89/97
- 49 unique daily scores and 61 unique block scores
- 55 days and 187 blocks reached 90+
- Sub-36°F days: median 58; seven Moderate and two Active
- 36–43°F days: median 70
- 44–56°F days: median 86, maximum 95
- Above-56°F days: median 67 with the complete lower tail preserved
- Best block: 5–9 AM 267 days, 9 AM–1 PM 68, 1–5 PM 80, 5–9 PM 100
- Median block spread 6; maximum 16; 95 days reached 10+ and none reached 20+
- Controlled isolated-cloud test improved only 9 AM–1 PM by 12 points and made
  it the best block
- Missing coverage: flow 20 days, prior flow 19, temperature 26,
  temperature history 31, weather 0
- Zero rollup, cap, copy, salmon-mortality, unavailable-input, or weather-leakage
  invariant failures

## Sources

- Michigan DNR, Steelhead species profile:
  https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead
- Workman et al. (2002), PM and St. Joseph temperature-based adult movement
  model:
  https://academic.oup.com/tafs/article-pdf/131/3/463/61133607/tafs0463.pdf
- Great Lakes Fishery Commission, PM Steelhead telemetry report:
  https://www.glfc.org/pubs/pdfs/research/reports/Snell_Coon.pdf
- EPA, salmonid temperature review:
  https://www.epa.gov/sites/default/files/2018-01/documents/r10-water-quality-temperature-issue-paper5-2001.pdf
- USGS, winter rainbow-trout feeding periodicity:
  https://www.usgs.gov/publications/feeding-periodicity-diet-composition-and-food-consumption-subyearling-rainbow-trout
