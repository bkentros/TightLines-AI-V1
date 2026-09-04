# Wisconsin and Indiana River Run Direct Push Audit

**Audit date:** 2026-09-03\
**Scope:** every configured Wisconsin and Indiana fall Chinook, Coho, Steelhead,
and lake-run Brown Trout run\
**Decision:** all 27 configured runs are enabled across eight rivers. Nineteen
runs use representative direct inputs. Eight Root and Bois Brule runs use
explicitly lower-confidence, flow-only upstream proxies capped at Elevated.

## Capability decisions

| River       | Runs | Direct inputs used                                           | Decision                                                                                                                                        |
| ----------- | ---: | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Milwaukee   |    4 | Estabrook flow; same-station temperature as constraint only  | Enable. The gauge represents the Urban Greenway. Temperature began May 4, 2026, so it cannot independently trigger Push yet.                    |
| Sheboygan   |    4 | I-43 flow                                                    | Enable flow-only. The gauge is 3.9 miles above the mouth inside the supported Urban River; no accepted current water-temperature series exists. |
| Manitowoc   |    3 | Michigan Avenue flow                                         | Retain flow-only. The gauge represents the lower/middle mainstem; the co-located temperature series ended in 2022.                              |
| Kewaunee    |    3 | County F flow; same-station temperature as constraint only   | Enable. The gauge represents the Besadny reach. Temperature began May 4, 2026 and is not mature enough to trigger independently.                |
| Trail Creek |    2 | Springland flow; same-station temperature as constraint only | Enable. The gauge represents the barrier corridor. Temperature began August 27, 2025 and has only one completed fall archive.                   |
| St. Joseph  |    3 | Niles flow and same-station temperature                      | Retain the existing shared Michigan/Indiana model. Both accepted inputs can trigger Push and constrain an event.                                |
| Root        |    4 | Horlick flow as an upstream proxy                            | Enable at lower confidence. It is capped at Elevated and explicitly warns that lower-river timing and magnitude can differ.                     |
| Bois Brule  |    4 | Brule-station flow as an upstream proxy                      | Enable at lower confidence. It is capped at Elevated and explicitly warns that downstream timing and magnitude can differ.                      |

## River-specific hydraulic calibration

Every hydraulic level requires both its absolute and percentage threshold. The
same thresholds are shared among species on one river because gauge hydrology
does not change by species. Absolute temperature constraints and active run
windows remain species-specific.

| River       |  Possible rise |  Elevated rise |       Strong rise | Historical basis                                                                                             |
| ----------- | -------------: | -------------: | ----------------: | ------------------------------------------------------------------------------------------------------------ |
| Milwaukee   |   50 CFS / 10% |  150 CFS / 28% |     370 CFS / 57% | Accepted post-Estabrook-removal 2019-2025 audit                                                              |
| Sheboygan   |    15 CFS / 7% |   50 CFS / 20% |     150 CFS / 52% | 2019-2025 positive daily rises: approximately p50 14.5/7.2%, p75 50/20.3%, p90 150/52.4%                     |
| Manitowoc   |  11 CFS / 8.9% | 37 CFS / 21.3% |    99 CFS / 48.2% | Accepted Michigan Avenue historical audit                                                                    |
| Kewaunee    |    3 CFS / 10% |   14 CFS / 35% |      90 CFS / 98% | 2019-2025 positive daily rises: approximately p50 3/9.7%, p75 13.6/35%, p90 92.1/97.8%                       |
| Trail Creek | 5.3 CFS / 9.9% | 20 CFS / 35.8% | 67.9 CFS / 101.4% | Accepted 2019-2025 Springland audit                                                                          |
| St. Joseph  |   120 CFS / 5% |  240 CFS / 11% |     450 CFS / 19% | Accepted Niles historical audit for the shared Michigan/Indiana presentation                                 |
| Root        |  7 CFS / 21.0% | 33 CFS / 57.1% |  123 CFS / 137.4% | Exact Aug. 25-Dec. 25 coverage: 302 consecutive-day rises; p50 6.85/21.1%, p75 32.75/57.1%, p90 122.5/137.4% |
| Bois Brule  |   4 CFS / 2.7% |  11 CFS / 7.2% |    33 CFS / 19.7% | Exact July 1-Nov. 10 coverage: 237 consecutive-day rises; p50 4/2.7%, p75 11/7.2%, p90 33.4/19.7%            |

Root and Bois Brule still require both the absolute and percentage threshold.
Their event is capped at level 2 (`Elevated`) before its public score,
components, and direct-signal level are exposed because the source is outside
the supported corridor. A stale reading is then reduced by one additional level.
The 48-hour event lifecycle provides a broad downstream-response window without
inventing an unvalidated travel-time offset.

## Temperature decision

No newly evaluated Wisconsin source or Trail Creek temperature source is
permitted to trigger Push in this release. This is intentional, not a missing
implementation. The already-audited St. Joseph source at Niles remains the
exception: its same-station temperature and flow can both trigger and constrain
Push.

- Milwaukee and Kewaunee continuous temperature began May 4, 2026 and have no
  completed fall replay.
- Trail Creek began August 27, 2025. Its first completed fall contained 692
  valid four-hour medians. Matched 24-hour cooling exceeded 0.75 F in 240
  windows, 1.5 F in 145, and 3 F in 59. With a 48-hour persistence rule, the
  generic thresholds could overstate ordinary cooling as repeated fresh-push
  support.
- These co-located sources remain useful as constraint-only evidence: current
  absolute temperature may reduce or suppress a measured flow event according to
  the selected species, but cooling cannot create a Push.
- A constraint-only source cannot make Push available during a flow outage. The
  engine now enforces that contract explicitly.
- Root's separate 60th Street temperature and Bois Brule's discontinued
  lower-river temperature archive are not used by their proxy models.

Temperature-trigger promotion requires at least a multi-season fall replay,
acceptable false-trigger frequency at the four-hour cadence, and retained
same-reach representation. Air temperature, Lake Michigan temperature, wind,
precipitation, gage height paired with flow, and facility counts are not scored.

## Live-source verification

The official USGS continuous API was checked on 2026-09-03. Current discharge
was present at Springland 04095300, Niles 04101500, County F 04085200, Michigan
Avenue 04085427, Estabrook 04087000, I-43 04086000, Horlick 04087240, and
Brule 04025500. Temperature was present at Springland, County F, Estabrook, and
the upstream Root 60th Street station 04087234; location and archive
maturity—not simple availability—control whether it is accepted for Push.

Primary station records:

- [Trail Creek 04095300](https://waterdata.usgs.gov/monitoring-location/USGS-04095300/)
- [St. Joseph at Niles 04101500](https://waterdata.usgs.gov/monitoring-location/USGS-04101500/)
- [Kewaunee 04085200](https://waterdata.usgs.gov/monitoring-location/USGS-04085200/)
- [Manitowoc 04085427](https://waterdata.usgs.gov/monitoring-location/USGS-04085427/)
- [Milwaukee 04087000](https://waterdata.usgs.gov/monitoring-location/USGS-04087000/)
- [Sheboygan 04086000](https://waterdata.usgs.gov/monitoring-location/USGS-04086000/)
- [Root/Horlick 04087240](https://waterdata.usgs.gov/monitoring-location/USGS-04087240/)
- [Root/60th Street 04087234](https://waterdata.usgs.gov/monitoring-location/USGS-04087234/)
- [Bois Brule 04025500](https://waterdata.usgs.gov/monitoring-location/USGS-04025500/)

## Verification contract

- All 27 profiles must validate as direct-event configurations.
- Every qualified profile must independently detect a synthetic event using its
  own river-specific flow thresholds.
- Milwaukee, Kewaunee, and Trail Creek must use temperature as constraint only.
- Sheboygan and Manitowoc must remain flow-only.
- St. Joseph must retain same-station flow and temperature as independent
  triggers and constraints.
- Root and Bois Brule must remain flow-only, identify their evidence as Lower,
  publish the upstream limitation, and cap even a sharp event at Elevated.
- A stale raw-Strong proxy event must fall to Possible, and exposed score,
  component, and direct-signal levels must agree.
- A flow outage must say the configured model is waiting for its accepted gauge,
  not that the species lacks a model.
- Missing-input quality must be monotonic and must not penalize an intentionally
  unused temperature source.
- Constraint-only temperature must never create a Push during a flow outage.

## Verification results

- Dedicated Wisconsin/Indiana Push suite: 4 passed, zero failed.
- Full River Run engine suite: 438 passed, zero failed.
- River Run endpoint suite: 64 passed, zero failed.
- River Run UI QA: 25,185 daily river/species/state cases passed.
- River Run visual QA: 59 generated public primitive states passed.
- TypeScript typecheck and repository whitespace checks passed.
- River Run function deployment succeeded on 2026-09-03. The production
  live-condition smoke passed across all 15 unique public rivers and verified
  fresh Root/Horlick and Bois Brule upstream-proxy flow sources. The configured
  production test user does not exist, so authenticated snapshot verification
  remains covered by the 64 passing endpoint tests rather than a production user
  session.
