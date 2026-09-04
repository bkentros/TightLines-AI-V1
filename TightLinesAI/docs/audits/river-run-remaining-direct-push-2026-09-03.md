# Remaining River Run Push audit — 2026-09-03

## Decision

The remaining catalog and review inventory contains eight rivers. Five support
new Push models, while three remain intentionally unavailable.

| River              | Status                  | Model basis                                                                                                  | Confidence ceiling          |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------- |
| Salmon River, NY   | Enabled                 | Pineville flow in the supported middle/upper mainstem                                                        | Full four-level event scale |
| Lower Genesee, NY  | Enabled                 | Ford Street upstream-basin flow proxy                                                                        | Elevated                    |
| Green/Duwamish, WA | Enabled in owner review | Auburn/Big Soos flow in a supported migration reach                                                          | Full four-level event scale |
| Puyallup, WA       | Enabled in owner review | Lower-mainstem flow at river mile 6.6                                                                        | Full four-level event scale |
| Cowlitz, WA        | Enabled in owner review | Castle Rock lower-mainstem flow                                                                              | Full four-level event scale |
| Oak Orchard, NY    | Unavailable             | Shelby is separated from the run corridor by the Erie Canal crossing, Waterport Reservoir, and Waterport Dam | Not applicable              |
| Platte, MI         | Unavailable             | Honor is separated from the lower run corridor by Platte and Loon lakes                                      | Not applicable              |
| Betsie, MI         | Unavailable             | No accepted live hydraulic or measured-temperature source                                                    | Not applicable              |

The exclusions are deliberate. A four-hour upstream change cannot be assigned a
defensible lower-river time on Oak Orchard or Platte, and no invented
travel-time offset is used. Historical-only temperature is never treated as a
live trigger.

## Reproducible calibration method

- Source: USGS approved daily mean discharge, parameter `00060`, statistic
  `00003`.
- Fixed interval: 2019-2025 inclusive.
- River window: exact union from the earliest species `start` through the latest
  species `taperingEnd` using that source.
- Rise sample: positive changes between consecutive calendar dates only. Missing
  dates are not bridged.
- Event thresholds: paired absolute and relative p50, p75, and p90 of positive
  daily rises. Both members of a pair must pass.
- Live evaluation: trailing four-hour medians, 12/24-hour like-window
  comparisons, 48-hour decaying persistence, stale downgrade, and severe-high
  fail-safe.
- Temperature, precipitation, wind, turbidity, fish counts, and operational
  cause are unscored unless explicitly configured. None are configured here.

The reusable calculator is `scripts/river-run-push-calibration-audit.ts`; it
enforces the fixed yearly window and consecutive-date rule and prints coverage
plus every recorded percentile.

## Calibration results

| River / site             | Exact window    | Usable days | Positive rises | Seasonal flow p10 / p25 / p75 / p90 / p95 CFS | Possible p50 abs / % | Elevated p75 abs / % | Strong p90 abs / % |
| ------------------------ | --------------- | ----------: | -------------: | --------------------------------------------- | -------------------- | -------------------- | ------------------ |
| Salmon / 04250200        | Aug. 25-Dec. 20 |         826 |            298 | 219.5 / 386 / 716.75 / 1,330 / 1,870          | 20 / 4.2%            | 80 / 13.8%           | 354 / 51.0%        |
| Lower Genesee / 04231600 | Sept. 5-Dec. 20 |         749 |            335 | 451 / 668 / 1,800 / 3,658 / 5,040             | 140 / 16.9%          | 340 / 36.1%          | 726 / 66.0%        |
| Green / 12113000         | July 20-Nov. 15 |         833 |            372 | 268 / 303 / 527 / 1,110 / 1,662               | 11 / 3.0%            | 38 / 8.5%            | 144 / 24.0%        |
| Puyallup / 12101500      | July 15-Nov. 10 |         833 |            342 | 1,040 / 1,250 / 1,940 / 2,598 / 3,244         | 90 / 6.2%            | 210 / 13.4%          | 674 / 33.8%        |
| Cowlitz / 14243000       | Aug. 1-Nov. 30  |         854 |            311 | 2,660 / 3,062.5 / 5,015 / 7,289 / 10,135      | 230 / 5.2%           | 720 / 16.4%          | 1,310 / 30.8%      |

Green, Puyallup, and Cowlitz retain their previously accepted longer-record
Fishing Shape safeguards; the recent distribution above documents the direct
Push calibration interval rather than silently replacing those safety bands.
Salmon and Lower Genesee use the listed distribution only for Push safeguards;
it does not enable Fishing Shape.

## Existing proxy correction

The same consecutive-date rule was rerun for Root and Bois Brule. Root has 302,
not 306, valid positive rises; its paired thresholds are now 7/21.0%, 33/57.1%,
and 123/137.4%. Bois Brule has 237, not 238, valid positive rises; its
thresholds are 4/2.7%, 11/7.2%, and 33/19.7%. Both remain lower-confidence and
capped at Elevated. Rule versions were advanced so incompatible historical reads
are not reused.

## Scientific and source constraints

NOAA recognizes streamflow and temperature as factors that can alter Pacific
salmon migration timing and survival. That supports measuring a hydraulic event;
it does not support claiming that fish entered. The public result therefore says
“environmental support for possible fresh movement” and always disclaims entry
and abundance. Regulated Salmon and Cowlitz events are scored from the measured
river response without guessing whether a reservoir release, tributary runoff,
or precipitation caused it.

Primary references:

- USGS Water Data daily-values API and station records for 04250200, 04231600,
  12113000, 12101500, and 14243000.
- NOAA Fisheries, “Climate Impacts to Salmon of the Pacific Northwest.”
- NYSDEC Salmon River management status and river dossier.
- WDFW/tribal river dossiers and Tacoma Power Cowlitz project/fish-report
  records already bound to the Washington configurations.

## Verification contract

- Every enabled run validates with hydraulic trigger, disabled temperature,
  river-specific rules, and 48-hour persistence.
- A synthetic p90 event reaches Strong only for a direct, gauge-represented
  model.
- Lower Genesee cannot exceed Elevated, including on a p90 event.
- Missing trigger flow returns Unavailable rather than Neutral.
- Oak Orchard, Platte, and Betsie expose no Push rules.
- Root and Bois Brule retain lower confidence after their corrected thresholds.

## Completed verification

- River Run engine tests: 442 passed, 0 failed.
- River Run endpoint tests: 64 passed, 0 failed.
- TypeScript typecheck: passed.
- River Run UI QA: 25,185 cases passed.
- River Run visual QA: 59 states passed.
- Review-mode QA: 121 local scenarios and 1,657 onboarding scenarios passed.
- Calibration utility typecheck: passed; a live rerun for Salmon River site
  04250200 reproduced the recorded coverage, rise counts, and thresholds.
- Generated review fixtures were regenerated after the final scoring and copy
  changes.
- The `river-run` function was deployed successfully on Sept. 3, 2026.
- The post-deploy production live-conditions smoke passed for all 15 public
  rivers (`ok: true`) and confirmed fresh Salmon and Lower Genesee source data.
  The optional authenticated snapshot check could not run because the configured
  production test user does not exist; the smoke audited protected refresh
  storage instead.
