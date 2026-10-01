# PierCast v4 thermal calibration — September 2026

Status: approved for next-build pilot use\
Calibration: `piercast-v4-thermal-calibration-2026-09-v1`\
Profile schema: `piercast-thermal-profile-v2`\
Reviewed: 2026-09-28

## Product meaning

`Temperature Match` describes how compatible the represented **modeled nearshore
surface temperature** is with a species-level opportunity profile. It is not a
probability of catch, a claim that fish are present, a measurement of the
temperature fish experience at depth, or a replacement for Seasonal Outlook.

The two signals remain independent:

- **Seasonal Outlook** answers whether the species is typically worth targeting
  in that region and part of the year.
- **Temperature Match** answers whether the current or forecast surface water is
  thermally compatible for that species.

This separation is why a city can have an Excellent temperature match but a Poor
seasonal outlook, or the reverse. It prevents ideal surface temperature from
recreating the false “fish must still be here” conclusion that motivated the
renovation.

## Calibration rules

1. Adult/general preference, Great Lakes field occupancy, growth evidence, and
   documented nearshore behavior can shape a curve. Spawning temperatures,
   egg/larval limits, and lethal limits cannot independently define the optimum.
2. Great Lakes adult field evidence receives more weight than laboratory or
   general-range transfers. Agency summaries and the GLFC synthesis constrain
   shoulders where applicable field evidence is sparse.
3. Exact ordinates are product calibration, not source-measured catch
   probabilities. Piecewise-linear curves avoid unsupported decimal precision.
4. The accepted `0–38 °C` range validates the modeled surface input. It is not a
   survival range. Values inside it always receive a label; values outside it
   remain unavailable rather than being mislabeled Poor.
5. Profiles are species-level and reusable across cities. No city-specific
   thermal tuning or fishery-strength input participates in Temperature Match.
6. The installed app's v3 curves remain byte-for-byte isolated. This calibration
   is consumed only by the v4 next-build conditions product.

## Label boundaries

The normalized response curve uses the same inclusive thresholds everywhere:

| Label     |  Curve value | Intended meaning                                      |
| --------- | -----------: | ----------------------------------------------------- |
| Excellent |  `0.85–1.00` | Core preference or a closely supported shoulder       |
| Good      | `0.65–<0.85` | Broadly compatible surface water                      |
| Fair      | `0.35–<0.65` | Plausible but materially displaced from the core      |
| Poor      |      `<0.35` | Strong surface-temperature mismatch, not fish absence |

The shared thresholds are retained because a normalized curve makes labels
comparable across species. Species biology belongs in each curve's temperature
locations, not in eighteen different definitions of “Good.”

## Final species calibration

| Species         | v4 optimum °C | Main evidence interpretation                                                                                          | Material change from inherited v3                                |
| --------------- | ------------: | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Chinook salmon  |         10–14 | Lake Michigan preference and distribution/catch evidence; warm surface increasingly implies depth/offshore separation | Preserved center; standardized shoulders/domain                  |
| Coho salmon     |         12–14 | Great Lakes preference plus spring and return-season context                                                          | Preserved evidence-supported center                              |
| Steelhead       |         11–14 | Lake Michigan catch relationship peaks near 12.3 °C; cold-season opportunity stays viable                             | Slightly refined center and permissive cold shoulder             |
| Brown trout     |         10–16 | Adult Great Lakes field use is broad; warmer-compatible than other salmonids                                          | Preserved broad center; standardized tails                       |
| Lake trout      |          9–12 | Agency 9–11 °C range, adult field occupancy, and colder realized niche                                                | Shifted from 8–11 to 9–12                                        |
| Smallmouth bass |         22–28 | Adult warm preference balanced against documented Great Lakes spring harbor use                                       | Shifted warmer from 20–26                                        |
| Freshwater drum |         22–27 | Adult preference, Lake Erie growth observations, and broad warm-season use                                            | Center retained; full Poor tail added                            |
| Yellow perch    |         19–22 | Agency 19–21 °C preference and adult growth evidence; winter activity remains seasonal context                        | Narrowed and shifted from 16–21                                  |
| Round whitefish |           3–8 | Sparse adult evidence; cold fall/winter occupancy and Michigan depth seasonality                                      | Shifted colder from 6–10; remains evidence-limited               |
| Channel catfish |         25–30 | Adult preference around 25 °C and growth optimum near 28–30 °C                                                        | Shifted warmer from 24–28                                        |
| Largemouth bass |         26–30 | Michigan activity range plus adult preference/growth evidence                                                         | Shifted warmer and narrowed from 21–28                           |
| Walleye         |         20–23 | Adult Great Lakes telemetry varies by lake/season; preference and growth center near 21–23 °C                         | Corrected materially from 12–20                                  |
| Atlantic salmon |          4–10 | Official marine high-preference range; broad coldwater compatibility                                                  | Narrowed from 4–12                                               |
| Northern pike   |         18–21 | Adult preference/growth around 19–21 °C with coolwater refuge behavior                                                | Refined from 16–21                                               |
| White bass      |         24–29 | Growth evidence is cooler than adult summer preference, requiring a broad warm profile                                | Shifted from 22–28                                               |
| Burbot          |          1–14 | Telemetry supports both sub-2 °C spawning aggregation and 12–14 °C non-reproductive feeding                           | Broad plateau explicitly represents two supported behaviors      |
| White perch     |         27–29 | Growth optimum near 28 °C and broad 26–32 °C growth range                                                             | Narrowed from 26–30                                              |
| Lake whitefish  |         10–14 | 2023 Lake Michigan telemetry averaged 10.8 °C in summer but showed broad realized occupancy                           | Shifted from 6–12; cold occupied water remains a strong shoulder |

`Optimum` is the `1.0` plateau used to calculate distance-from-optimum. It is a
model center, not a promise that fishing is best throughout that interval.
Burbot is the deliberate exception to a narrow plateau because one narrow center
would contradict its two documented adult behavioral regimes.

## Evidence and limitations

The primary cross-species reference is the Great Lakes Fishery Commission's
_Temperature Relationships of Great Lakes Fishes_. Its tables explicitly keep
preference, growth, tolerance, spawning, and development data separate. Current
profiles also use the preserved `T001–T032`, `LH_THERMAL_*`, and `THERM_*`
records in `PierCast_Thermal_Evidence.json` and the species-expansion source
ledger.

Especially important modern field anchors include adult Chinook and steelhead
Lake Michigan studies, adult walleye telemetry in Lakes Huron and Erie, and 2023
lake-whitefish logger data from northwestern Lake Michigan. NOAA describes
LMHOFS as numerical nowcast/forecast guidance; therefore the surface value must
not be presented as a direct observation of fish depth or body temperature.

No reviewed source supplies an eighteen-species, Great-Lakes-wide pier-catch
function. The curves are consequently approved for **pilot product use**, not
scientific validation. Future changes require a new calibration version and
should be driven by dated outcomes, measured/model provenance, and held-out
ranking performance rather than anecdotes alone.

## Verification contract

The automated release suite now checks:

- all 18 roster species have unique, traceable v4 profiles;
- every profile is continuous, bounded, single-peaked, and contains all four
  user-facing labels;
- every optimum point is exactly `1.0`, with monotonic cold and warm shoulders;
- exact threshold inclusion and out-of-domain unavailable behavior;
- every evidence ID resolves to a preserved ledger;
- the legacy v3 thermal dataset retains its frozen SHA-256 fingerprint;
- annual seasonal evaluation, leaderboard hierarchy, city reports, map frames,
  saved reports, missing/stale data, and public API isolation still pass.

## Principal sources

- Great Lakes Fishery Commission, _Temperature Relationships of Great Lakes
  Fishes_: https://www.glfc.org/pubs/SpecialPubs/Sp87_3.pdf
- NOAA, Lake Michigan and Huron Operational Forecast System:
  https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html
- USGS, lake whitefish thermal ecology in northwestern Lake Michigan:
  https://pubs.usgs.gov/publication/70256484
- USGS, seasonal thermal ecology of adult walleye in Lakes Huron and Erie:
  https://pubs.usgs.gov/publication/70159488
- USGS, Atlantic salmon species profile:
  https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=926
- Harrison et al., burbot thermal-habitat selection:
  https://pubmed.ncbi.nlm.nih.gov/27125426/
