# PierCast — Environmental Data Feasibility and Source Plan

**Research date:** 2026-09-09
**Status:** Upfront provider audit complete. NOAA LMHOFS regular-grid surface temperature is the provisional primary product, and five exact candidate cells are frozen; no production representation is approved. See [Core temperature and source calibration](PierCast_Core_Temperature_and_Source_Calibration.md) and the [LMHOFS representation review](PierCast_LMHOFS_Representation_Review.md).
**Scope:** Water temperature, waves, ice, alerts, source timing, reachable-water representation, and provider failure behavior for Ludington, Grand Haven, Manistee, Frankfort, and tentative Sheboygan.
**Related:** [Master specification](PierCast_Master_Build_Spec.md) · [City coverage plan](PierCast_City_Coverage_and_Engine_Plan.md) · [Seasonal biology](PierCast_Seasonal_Temperature_Research.md)

## 1. Executive disposition

The all-five provider adapter, comparison harness, and private archive contract are implemented, but not deployed or scheduled. No PierCast score can yet be published for any candidate city.

| Capability | What the audit established | Disposition |
| --- | --- | --- |
| Hourly water-temperature forecast | NOAA LMHOFS advertises hourly, three-dimensional nowcasts/forecasts, four cycles daily, through forecast hour 120. [E001, E002] | Technically obtainable; representation and full-calendar coverage not approved. |
| Surface observations | NOAA GLSEA supplies daily satellite lake-surface temperature; seasonal NDBC buoys supply some point observations. [E004, E005] | Useful for context and diagnostics, not an automatic substitute for pier-reachable depth. |
| Waves | NOAA's Great Lakes wave guidance is available four times daily but the documented operational horizon is 84 hours. [E006] | Insufficient by itself for every interval in today-plus-four; define an explicit later-horizon fallback or mark practical conditions incomplete. |
| Ice | LMHOFS publishes ice concentration/thickness/velocity products. [E001] | Provider capability exists; pilot-local winter validation and pier access implications remain unresolved. |
| Alerts/nearshore hazards | NWS marine zones and alerts are candidate authoritative sources. | Exact zone mapping, alert semantics, expiry handling, and machine-readable endpoint tests remain implementation prerequisites. |
| Harbor/tributary plumes | The LMHOFS implementation report describes only four explicitly gauged inflows and bulk treatment of other tributaries. [E003] | Do not assume a model cell resolves river-mouth temperature or plume behavior at a pier. |

The correct failure mode is **unavailable or incomplete**, never a favorable score from a clamped or substituted temperature. Biological opportunity, practical safety, access, and confidence remain separate outputs.

## 2. Forecast-horizon audit

LMHOFS describes 00, 06, 12, and 18 UTC cycles with a six-hour nowcast and hourly forecast fields through f120. The NOAA operational FAQ documents the post-August-2024 naming convention and archives. [E001, E002]

The product promise is five **local calendar dates**, not simply 120 rolling hours. At evaluation time, the final interval of local day +4 can be more than 120 hours after the most recent cycle origin. Therefore:

1. compute interval coverage against the actual cycle timestamp;
2. never infer the missing tail from the last forecast value;
3. mark the affected date incomplete when required intervals are missing; and
4. do not promote an incomplete date under the master's headline/ranking rules.

A 120-hour provider horizon makes the five-date design plausible, but does not prove complete coverage at every refresh time. Forecast issuance lag, failed cycles, daylight-saving transitions, and archive latency need fixtures.

## 3. Live format and availability probe

On 2026-09-09, the NOAA NOS public object store contained lowercase-path LMHOFS NetCDF fields for the 00 UTC cycle, including hourly f000 onward. Sample field objects were approximately 188 MB. The corresponding station nowcast object was downloaded and identified as HDF5/NetCDF; embedded metadata showed station longitude, latitude, depth, sigma layers, time, and temperature variables. [E007]

This was a provider/format probe only. A later 2026-09-09 OPeNDAP pass froze five wet surface candidates and verified finite output at forecast hours 1, 24, 72, and 120. It still did **not** establish:

- that a frozen LMHOFS grid cell represents water reachable from a candidate pier;
- actual station names or quality flags in the file;
- a safe streaming/subsetting strategy for large whole-domain files;
- the vertical layer reachable by shore anglers;
- operational uptime or long-term archive retention guarantees; or
- winter availability at the candidate locations.

Do not ship a whole-domain download on each app request. The implemented backend adapter selects exact points with source timestamps and explicit missingness; it must be scheduled and connected to the private archive rather than invoked by user traffic.

## 4. Spatial and depth representation

The LMHOFS grid ranges from tens of metres near some shorelines to kilometres offshore and uses 21 terrain-following vertical layers. The model is not a measurement at the fishing rail. [E002, E003]

The five exact candidates, grid indices, bathymetry, reference-light geometry, and deterministic selection rule are frozen in [the machine-readable sampling record](PierCast_LMHOFS_Sampling_Points.json). A reviewer must still resolve:

- exact assessed structure and casting-water polygon;
- distance from structure and relationship to the harbor mouth/channel;
- whether an inside-harbor, channel, lake-side, or mixed sample is represented;
- known river/plume, upwelling, seiche, ice, or stratification limitations; and
- species-specific reachable-depth rationale.

One city may legitimately require different samples for a shallow harbor bass profile and a lake-side salmonid profile. That is still one engine: the difference belongs in versioned forecast-area configuration. Never choose whichever sample scores highest that day.

### Candidate-city status

| City | Physical scope after access research | Temperature representation status | Production consequence |
| --- | --- | --- | --- |
| Ludington | North Breakwater initially; stub alias unresolved | Candidate `(235,159)` frozen; Pere Marquette Lake/channel plume representation untested | All numerical species scores blocked; stub-dependent species remain narrower/disabled. |
| Grand Haven | South Pier initially; North Pier excluded while closure status is unresolved/closed | Candidate `(146,180)` frozen; Grand River mouth gradients untested | All numerical scores blocked; no North Pier coverage claim. |
| Manistee | North Pier initially; South Breakwater connector excluded until reopening is confirmed | Candidate `(265,171)` frozen; no pier-local comparison observation | All numerical scores blocked; do not splice harbor and lake sides. |
| Frankfort | North Breakwater and Elberta South Breakwater are candidate structures | Candidate `(303,180)` frozen; Betsie transfer and two-structure equivalence untested | All numerical scores blocked; each structure needs approach/access and representation review. |
| Sheboygan | North/South structures remain tentative | Candidate `(215,37)` frozen; river/harbor versus lake-side scope unresolved | City remains tentative and all numerical scores blocked. |

## 5. Validation evidence and its limits

The LMHOFS implementation skill assessment evaluated June 2018–April 2019. Reported surface-temperature errors generally met the report's navigation-oriented criterion, but that does not validate fish-opportunity scoring or subsurface temperature at these piers. Fifteen of twenty temperature stations used in the assessment were seasonal buoys, leaving an important winter-observation gap. [E003]

The same report says major gauged tributaries were St. Marys, St. Clair, Saginaw, and Fox; other tributary forcing was estimated in bulk, and forecast flow/temperature could be held constant through 120 hours or replaced with climatology when observations were absent. [E003] This is a material limitation for Ludington, Grand Haven, Manistee, Frankfort, and Sheboygan harbor mouths.

The provider is suitable for a prospective comparison, not automatic acceptance. For each fixed area, compare model samples with independent observations across:

- spring turnover and nearshore warming;
- summer stratification, upwelling, and seiche events;
- fall turnover and river-return periods;
- ice/near-freezing winter conditions; and
- rapid weather transitions.

Record bias, absolute error, missingness, timing error, and whether discrepancies would change a species score category. A surface-only match cannot validate a deeper selected layer.

## 6. Observation and fallback hierarchy

| Priority | Candidate source | Permitted use | Prohibited shortcut |
| --- | --- | --- | --- |
| 1 | Reviewed LMHOFS node/layer or station product | Forecast input after local representation and operational validation | Treating the nearest coordinate as representative without review |
| 2 | Fixed local sensor with documented depth/QA, if later found | Observation, bias monitoring, possibly near-term input under a reviewed contract | Assuming a marina/river sensor represents lake-side casts |
| 3 | GLSEA satellite SST | Surface context, anomaly diagnostics, provider comparison | Substituting surface skin temperature for reachable subsurface water |
| 4 | Seasonal NDBC buoy | Offshore context and validation where location/depth applies | Treating Ludington buoy 45024 as a pier thermometer or expecting winter continuity |
| 5 | Climatology | Clearly labeled research baseline or confidence context only | Filling a missing forecast while presenting it as current conditions |

No observation source found in this pass supplies a verified year-round, pier-local temperature measurement for all five cities. Ludington buoy 45024 is offshore and seasonal. Sheboygan C-MAN station SGNW3 exposes meteorological observations, but current availability did not establish a dependable water-temperature series. [E004]

## 7. Waves, ice, weather, and safety

Practical-condition inputs do not modify the biological temperature score.

- **Waves:** use a reviewed Great Lakes wave-model point/area and retain cycle, valid time, units, and coverage. Because the documented horizon is 84 hours, later dates require another reviewed source or an incomplete practical assessment. [E006]
- **Ice:** distinguish modeled lake ice, ice on a pier surface, and a legal/physical access closure. LMHOFS lake-ice output cannot declare a walkway safe.
- **Wind/weather:** review NWS forecast grid/zone mapping and local exposure rules independently. A city forecast point cannot by itself describe waves on an exposed breakwater.
- **Alerts:** ingest authoritative identifiers, onset/expiry, status, severity, affected zone, and update/cancel messages. Preserve the raw source and never paraphrase an expired alert as current.
- **Visibility/lightning:** add only with a supported provider contract and explicit practical rule. They are not thermal modifiers.

## 8. Source contracts and implementation status

The LMHOFS adapter now implements and tests:

1. cycle discovery and maximum acceptable age;
2. expected variables, dimensions, units, fill values, and vertical coordinates;
3. point/area extraction and interpolation policy;
4. forecast valid-time normalization to each city's timezone;
5. provider revision and late-cycle behavior;
6. observation-versus-forecast separation;
7. partial-day and partial-horizon completeness;
8. retry/backoff, cached-last-cycle labeling, and hard expiry;
9. raw-input archival sufficient to reproduce an issued outlook; and
10. per-field reason codes and confidence effects.

The first eight contracts are enforced in the adapter, raw point provenance is carried into the private archive contract, and provider failure classes remain explicit. Deployment scheduling and long-duration operating evidence are still absent. Provider outage, stale data, out-of-domain values, and a failed representation check must never be collapsed into zero biological opportunity.

## 9. Launch blockers and bounded next work

| Blocker | Affected capability | Resolution evidence |
| --- | --- | --- |
| Frozen LMHOFS candidates lack casting-water/plume validation | Every city/species numerical forecast | Reproducible casting-water maps plus historical and prospective comparison results |
| No prospective local temperature validation | Temperature scoring and confidence | Seasonal comparison set including transitions and winter |
| Five-calendar-date tail not guaranteed | Date +4 completeness | Cycle-aware coverage tests and a reviewed fallback/incomplete policy |
| Wave horizon shorter than product horizon | Later-date practical assessment | Approved second source or explicit incompleteness |
| No exact NWS zone/alert map | Safety notices | Tested jurisdiction/zone mapping and alert lifecycle fixtures |
| Current access feeds absent | Live access status | Authoritative source contract or clearly static/unknown presentation |
| Winter local observations sparse | Winter confidence | Validated winter source or explicit low-confidence/unavailable state |

These are launch blockers for the affected forecasts, not reasons to invent defaults. Archive deployment, scheduled ingestion, source-QA review, and prospective data collection can proceed while the blockers are resolved.

## 10. Evidence index

- **E001:** [NOAA LMHOFS operational page](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html) — operational system, temperature and ice products, four daily cycles, hourly 120-hour forecast.
- **E002:** [NOAA OFS FAQ](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html) — cycle/file conventions, station and three-dimensional fields, archives, and forecast hours.
- **E003:** [NOAA Technical Report 091, LMHOFS implementation and skill assessment](https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techrpt_091_LMHOFS_2019.pdf) — grid, vertical layers, 2018–2019 skill period, observation coverage, and tributary forcing.
- **E004:** [NDBC Ludington 45024](https://www.ndbc.noaa.gov/station_page.php?station=45024) and [Sheboygan SGNW3](https://www.ndbc.noaa.gov/station_page.php?station=sgnw3) — current station metadata/availability checks; neither establishes universal pier representation.
- **E005:** [NOAA Great Lakes CoastWatch SST](https://coastwatch.glerl.noaa.gov/satellite-data-products/sea-surface-temperature-sst/) — daily satellite surface-temperature products and sensor resolution.
- **E006:** [NOAA/NCEP Great Lakes wave-model description](https://polar.ncep.noaa.gov/waves/index2.shtml) and [NOMADS GLWU filter](https://nomads.ncep.noaa.gov/cgi-bin/filter_glwu.pl) — operational guidance and file discovery; documented 84-hour horizon governs until a longer contract is verified.
- **E007:** [NOAA NOS OFS public object listing](https://noaa-nos-ofs-pds.s3.amazonaws.com/?list-type=2&prefix=lmhofs/netcdf/) — live 2026-09-09 availability/format probe. Object existence is not a service-level guarantee.

All URLs were accessed on 2026-09-09. Dynamic pages and object listings require captured metadata at ingestion time. This document reports what was verified publicly; it does not claim provider endorsement of PierCast.
