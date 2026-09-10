# PierCast — LMHOFS Candidate-Cell Representation Review

**Completed:** 2026-09-09
**Status:** Five exact candidate cells frozen; the completed [temperature representation audit](PierCast_Temperature_Representation_and_Calibration.md) classifies every city as `blocked_insufficient_evidence`. None is approved for scoring or public release.
**Machine-readable record:** [PierCast LMHOFS sampling points](PierCast_LMHOFS_Sampling_Points.json)
**Implementation:** [Temperature pipeline implementation](PierCast_Temperature_Pipeline_Implementation.md)

## Outcome

PierCast now has one deterministic NOAA LMHOFS regular-grid surface cell for each pilot city. This closes the configuration ambiguity that previously left `configuredLocation=null`; it does **not** close the scientific representation question.

The selection rule is intentionally simple and reproducible: use the nearest wet grid center on the lakeward longitude side of the port's outer-light coordinate. Michigan's east-shore candidates therefore lie west of their reference lights; Sheboygan's west-shore candidate lies east. The rule never examines the temperature value and cannot choose a more favorable score dynamically.

| City | Cell `(row, column)` | Center | Model depth | Reference distance | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Ludington | `(235, 159)` | `43.95, -86.47` | 6.62 m | 404 m | Candidate |
| Grand Haven | `(146, 180)` | `43.06, -86.26` | 9.93 m | 480 m | Candidate |
| Manistee | `(265, 171)` | `44.25, -86.35` | 7.54 m | 326 m | Candidate |
| Frankfort–Elberta | `(303, 180)` | `44.63, -86.26` | 12.59 m | 622 m | Candidate |
| Sheboygan | `(215, 37)` | `43.75, -87.69` | 8.68 m | 232 m | Candidate |

The reference coordinates are authoritative outer-light positions from NOAA's current U.S. Coast Pilot 6. They are geometry anchors only—not app destinations, safe-route claims, or navigation advice. [NOAA U.S. Coast Pilot 6](https://www.nauticalcharts.noaa.gov/publications/coast-pilot/files/cp6/CPB6_WEB.pdf)

## Reproducibility checks

The 2026-09-09 12 UTC regular grid exposed 478 rows, 837 columns, a surface depth index of zero, `mask`, bathymetry `h`, and water temperature `temp`. Its grid centers follow:

- `latitude = 41.60 + 0.01 × row`
- `longitude = -88.06 + 0.01 × column`

For every selected cell, the wet mask was `1`, bathymetry was finite and positive, and adjacent cells showed the expected lakeward/shoreward orientation. Surface temperature was then checked at forecast hours 1, 24, 72, and 120. All 20 samples were finite with valid times through 2026-09-14 12 UTC. This proves that the exact cells can be extracted across one complete provider horizon; it does not prove forecast accuracy, uptime, or pier-water equivalence. [NOAA LMHOFS OPeNDAP catalog](https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/LMHOFS/MODELS/catalog.html) · [NOAA LMHOFS](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html)

## Observation audit correction

The earlier Sheboygan reference `obs_251` covers 2023 and is not a current validation feed. The configured seasonal candidate is now the Sheboygan Panther buoy `obs_709`, but the audited 2026 series contained no aggregate-QC-good `Temp0` records. Grand Haven `obs_671` supplied 332 QC-good records over 29 distinct days. Ludington's configured `obs_637` remains historical-only; supplemental `obs_62` supplied 144 QC-good surface-temperature records over 13 days and is about 7.9 km from the runtime cell. Neither source documents a numeric sensor depth in the audited ERDDAP metadata. No suitable pier-local dataset was found for Manistee or Frankfort–Elberta. [GLOS `obs_709`](https://seagull-erddap.glos.org/erddap/info/obs_709/index.html) · [GLOS `obs_671`](https://seagull-erddap.glos.org/erddap/info/obs_671/index.html) · [GLOS `obs_62`](https://seagull-erddap.glos.org/erddap/info/obs_62/index.html)

These observations are comparison points, not interchangeable pier thermometers. Their location, sensor depth, quality flags, seasonal coverage, and distance from each model cell must be retained in any validation set.

## Remaining representation risk

- A 0.01-degree model cell is much larger than a cast and can smooth sharp harbor-mouth or upwelling gradients.
- Surface output is a deliberate v1 product choice, not proof that it equals every reachable fishing depth.
- River and harbor plume treatment remains material at all five ports, especially Grand Haven and Frankfort–Elberta.
- One Frankfort cell has not yet been shown to represent both the Frankfort and Elberta structures.
- Sheboygan's structures and city inclusion remain tentative independently of this model-cell work.
- A successful single-cycle extraction does not establish year-round continuity, especially during winter.

Accordingly, runtime configuration, contracts, validation, tests, and the owner-review UI say **candidate**. Every rating remains disabled, every city remains non-public, and missing/stale data still fails closed.

## Implemented validation pass

A repeatable all-five adapter, strict GLOS comparison layer, private complete-cycle archive, scheduled ingestion, and private observation archive are deployed. The frozen historical protocol found only 18 matched forecasts per lead at Ludington and 13 per lead at Grand Haven; both samples are late-summer only. Grand Haven passed the diagnostic temperature limits through 72 hours but failed tail error at 96 and 120 hours. Ludington failed the P90 error threshold at every lead. These are risk findings, not final rejections, because prerequisite coverage and geometry gates failed.

The remaining work is to accumulate approval-grade prospective evidence rather than changing cells opportunistically:

1. accumulate at least 60 QC-good days, 30 matches per tested lead, required thermal regimes, and two operating seasons;
2. resolve sensor depth where the variable is not explicitly surface and establish pier/plume equivalence;
3. add qualified prospective observations for Manistee and Frankfort–Elberta;
4. use separate training and holdout dates for any correction or thermal-curve revision; and
5. approve or reject one city cell at a time without enabling species ratings automatically.
