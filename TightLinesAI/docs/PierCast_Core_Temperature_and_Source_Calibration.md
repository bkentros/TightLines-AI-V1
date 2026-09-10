# PierCast — Core Temperature and Source Calibration

**Completed:** 2026-09-09
**Status:** Implemented for private review, including the [all-five temperature pipeline](PierCast_Temperature_Pipeline_Implementation.md) and completed [representation/calibration audit](PierCast_Temperature_Representation_and_Calibration.md); all curves remain provisional, all ratings remain disabled, and all cities remain absent from the public catalog.
**Scope:** Chinook salmon, coho salmon, steelhead, and brown trout in Ludington, Grand Haven, Manistee, Frankfort–Elberta, and Sheboygan. No secondary species were calibrated.

## Decision

PierCast v1 retains exactly two numeric inputs:

`score = 1 + (seasonal opportunity ceiling - 1) × temperature suitability`

The city × species seasonal curve remains the dominant input. It establishes both timing and the maximum rating that the location can attain. Temperature is a continuous `0–1` unlock/reduction factor; it cannot lift a city above its configured seasonal ceiling. There is no permanent city baseline, depth factor, weather factor, trend bonus, or hidden third weight.

The four temperature curves in [the machine-readable calibration](PierCast_Core_Species_Temperature_Curves.json) are **FinFindr product calibrations**, not measured biological response curves. Their sourced bands constrain the high-suitability region; their shoulders are explicit provisional judgments pending observed forecast-versus-outcome testing.

## Why this multiplication is appropriately strong

Multiplication makes temperature matter most when the calendar says meaningful fishable opportunity exists. The same poor temperature cannot manufacture a strong rating in a dead week, and optimal temperature cannot exceed the pier’s seasonal ceiling.

| Seasonal ceiling | `T = 0.25` | `T = 0.50` | `T = 0.75` | `T = 1.00` |
| ---: | ---: | ---: | ---: | ---: |
| 4.0 | 1.8 | 2.5 | 3.3 | 4.0 |
| 7.0 | 2.5 | 4.0 | 5.5 | 7.0 |
| 9.0 | 3.0 | 5.0 | 7.0 | 9.0 |

Thus, moving from half-suitable to optimal water adds four rating points during a 9.0 peak, but only 1.5 points during a 4.0 shoulder. That is the intended interaction: water temperature can substantially distinguish good and poor days inside a real season, while timing and city strength still govern the opportunity envelope.

## Shared temperature curves

All curves use unrounded Celsius, piecewise-linear interpolation, and an accepted input domain of `0–26 °C`. A reading outside that domain returns unavailable rather than inheriting an endpoint. One shared curve per species is the smallest defensible v1 design; city timing is already expressed in the seasonal ceiling, so city-specific thermal curves would add false precision and risk counting seasonal behavior twice.

| Species | High-suitability design | Important restraint |
| --- | --- | --- |
| Chinook | `10–14 °C` plateau; 9 °C at 0.95 | Wisconsin DNR gives 10–14 °C, while the Lake Michigan 9 °C association was gillnet catch, not pier bite. [T001, T006] |
| Coho | `12–14 °C` plateau; gradual warm shoulder through 16.5 °C | The 12–14 °C agency band is general; a historical adult observation around 16.6 °C supports breadth, not a second optimum. [T002, T008, T013] |
| Steelhead | `12–14 °C` plateau; intentionally broad cold shoulder | A narrow agency band would incorrectly erase documented cold-season migration and pier opportunity. Lakewide modeled growth potential also failed to predict spatial angler catch well. [T003, T007, T009, T010, T032] |
| Brown trout | `10–16 °C` plateau; remains high across much of 8–18 °C | Great Lakes adult occupancy and Michigan context conflict with the Wisconsin 18–24 °C fact-sheet range, so 18–24 °C is not treated as a universal optimum. [T004, T014, T015] |

The nonzero cold and warm endpoints are deliberate. The seasonal ceiling already carries whether pier opportunity is plausible on that date; temperature should reduce that opportunity without claiming absolute absence. A zero is reserved for future empirical calibration if outcomes justify it.

## Water-temperature source architecture

The primary scoring product for all five cities is NOAA’s Lake Michigan and Huron Operational Forecast System (LMHOFS) regular-grid surface temperature. NOAA documents that LMHOFS produces water-temperature guidance to 120 hours, four times daily, and identifies it as model-generated guidance rather than observation. Its native regular-grid files expose `temp` across 25 depth levels; PierCast v1 selects only a reviewed surface cell and does not make depth a score variable. [NOAA LMHOFS](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html) · [NOAA OFS FAQ](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html)

The configuration now freezes the provider, product family, variable, cycles, horizon, freshness policy, fail-closed behavior, and one exact wet surface candidate per city. The five locations are documented in the [LMHOFS representation review](PierCast_LMHOFS_Representation_Review.md). Every `gridCellStatus` remains `candidate`: freezing a reproducible sample is necessary for validation, but does not approve its pier-water representation or enable scoring.

| City | Frozen candidate cell | Seasonal observational check | Current disposition |
| --- | --- | --- | --- |
| Ludington | `(235,159)` at `43.95,-86.47` | Historical configured `obs_637`; supplemental surface feed `obs_62` | 13 QC-good days and 18 forecast matches/lead; blocked for coverage, depth, winter, and plume transfer. |
| Grand Haven | `(146,180)` at `43.06,-86.26` | GLOS `obs_671` | 29 QC-good days and 13 matches/lead; blocked for coverage, cold regime, depth, winter, and Grand River transfer. |
| Manistee | `(265,171)` at `44.25,-86.35` | None found in the official GLOS city search | Extractable candidate; spatial and prospective review still required. |
| Frankfort–Elberta | `(303,180)` at `44.63,-86.26` | None found in the official GLOS city search | Extractable candidate; Betsie influence and two-structure equivalence unresolved. |
| Sheboygan | `(215,37)` at `43.75,-87.69` | GLOS `obs_709`; no QC-good records in the audited 2026 series | Unevaluable under the frozen strict-QC rule; tentative coverage and harbor/plume transfer not approved. |

The GLOS datasets are observations and seasonal validation references, not five-day forecasts or automatic pier thermometers: [Ludington `obs_637`](https://seagull-erddap.glos.org/erddap/info/obs_637/index.html), [Grand Haven `obs_671`](https://seagull-erddap.glos.org/erddap/info/obs_671/index.html), and [Sheboygan `obs_709`](https://seagull-erddap.glos.org/erddap/info/obs_709/index.html). Their metadata describes temperature through the water column. Ludington is historical-only; seasonal gaps must never be filled by persisting the last observation.

## Safety and activation state

- The 20 seasonal curves and four thermal curves are present in runtime configuration only for owner review.
- Every species and city × species `ratingEnabled` flag remains `false`.
- Every city `publicEnabled` flag remains `false`; the public catalog is empty.
- All curve and source calibration statuses remain `provisional`.
- Every source uses `fallbackPolicy="unavailable"`.
- A source cannot be approved merely because its candidate cell is now frozen and extractable.
- January–March results retain the separate open-water-only notice; PierCast is never an ice-safety assessment.

## Required next validation

1. Operate the deployed private model and observation archives until approval-grade prospective overlap accumulates for the frozen indices.
2. Re-run the frozen protocol by city, season, temperature range, forecast lead, and rapid-change event; do not tune and evaluate on the same dates.
3. Establish a review dataset of dated pier outcomes for the four species and score the unchanged two-input model prospectively.
4. Inspect calibration, discrimination, rank stability, missingness, and city/species edge cases. Adjust shoulders only through a new version with recorded evidence.
5. Approve one city/species pilot at a time. Do not bulk-enable all 20 pairings.

## Evidence links

- **T001:** [Wisconsin DNR Chinook salmon fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_chinooksalmon.pdf)
- **T002:** [Wisconsin DNR coho salmon fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_cohosalmon.pdf)
- **T003:** [Wisconsin DNR rainbow trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf)
- **T004:** [Wisconsin DNR brown trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf)
- **T006:** [Adlerstein et al., Lake Michigan Chinook movement and assessment catch](https://academic.oup.com/tafs/article/137/3/736/7888693)
- **T007:** [USGS, steelhead growth-potential model and angler catch comparison](https://www.usgs.gov/publications/landscape-scale-measures-steelhead-oncorhynchus-mykiss-bioenergetic-growth-rate)
- **T008:** [Michigan DNR coho salmon profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon)
- **T009:** [Wisconsin DNR Lake Michigan steelhead strains](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_steelhead.pdf)
- **T010:** [Wisconsin DNR Root River Steelhead Facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf)
- **T013:** [Great Lakes Fishery Commission, Temperature Relationships of Great Lakes Fishes](https://www.sealamprey.org/pubs/SpecialPubs/Sp87_3.pdf)
- **T014:** [Haynes et al., Great Lakes brown trout movement and temperatures](https://www.sciencedirect.com/science/article/pii/S0380133087716402)
- **T015:** [Michigan DNR brown trout profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout)
- **T032:** [Michigan DNR steelhead profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)
