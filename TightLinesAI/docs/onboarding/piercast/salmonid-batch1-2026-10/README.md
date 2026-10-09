# PierCast salmonid accuracy audit — Batch 1

Reviewed: 2026-10-09
Runtime status: **1.17 app branch only; no Edge Function, database, map-data or live-app change**

## Scope

The read-only audit covered St. Joseph, South Haven, Holland, Grand Haven,
Muskegon, Whitehall, Pentwater, Ludington, Manistee and Frankfort/Elberta for
Chinook salmon, coho salmon, steelhead, brown trout and Atlantic salmon across
the full annual calendar. Lake trout remains governed by the separate approved
October 2026 all-city recalibration.

The reviewed inventory contained 50 city/species cells: 40 numeric pairings
with 99 seasonal modes and 10 unscored Atlantic-salmon cells. Thirty-nine
numeric pairings were retained without change. The only approved revision is a
St. Joseph Chinook timing correction.

## Approved correction

St. Joseph's prior Chinook curve declined to nearly off-season by mid-September
and reached zero by September 20. Michigan DNR's September 16, 2026 report
documented Chinook and coho catches by St. Joseph pier anglers during morning
and evening periods. Its September 30 report documented continued high pier
pressure and a handful of salmon and steelhead. The wider record remains
inconsistent, so the evidence supports a modest fall window rather than a
fishery-strength increase.

The 1.17 candidate adds this mode:

| Field | Value |
|---|---|
| Mode | `fall_harbor_staging` |
| Prime-condition ceiling | 5.8 (`Fair`) |
| August 25 | 0.00 |
| September 1 | 0.35 |
| September 10 | 0.75 |
| September 16 | 1.00 |
| September 30 | 0.70 |
| October 15 | 0.25 |
| November 1 | 0.00 |

The existing 6.8 July maximum remains the annual ceiling. Therefore the
cross-city peak-strength ordering does not change. At full seasonal
availability on September 16, the seasonal timing label is `Peak` while the
best possible Today label is `Fair` before water-temperature adjustment.

## Primary evidence

- [Michigan DNR Weekly Fishing Report — September 16, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/42aff44)
- [Michigan DNR Weekly Fishing Report — September 30, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/42d38b0)
- [Michigan DNR Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel)
- [Michigan DNR Roadmap to Fishing Lake Michigan](https://www.michigan.gov/documents/dnr/Roadmap-LakeMichigan-fishing-accessible-version_621804_7.pdf)
- [Berrien County fishing access](https://www.berriencounty.org/444/Fishing-Access)

## Product boundary

The correction is applied only by the 1.17 app-side opportunity projection.
The shared Formula v3 server calibration remains unchanged so live 1.14, 1.15
and 1.16 clients retain their existing responses. The same corrected evaluator
feeds the leaderboard, city report and five-day primary-species calendar.

Atlantic salmon remains unscored in all ten Batch 1 cities. An unscored cell is
not a zero and does not enter rankings.
