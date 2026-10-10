# PierCast salmonid accuracy audit — Batch 2

Reviewed: 2026-10-09

Runtime status: **1.17 app branch only; no Edge Function, database, map-data or
live-app change**

## Scope

The read-only audit covered Charlevoix, Rogers City, Alpena, Harrisville,
Oscoda, Tawas City, Caseville, Harbor Beach, Port Sanilac and Lexington for
Chinook salmon, coho salmon, steelhead, brown trout and Atlantic salmon across
the full annual calendar. Lake trout remains governed by the separate approved
October 2026 all-city recalibration.

The reconciled inventory contains 50 city/species cells: 37 numeric pairings and
13 research holds. Thirty-four numeric pairings were retained without change.
The 13 unscored cells remain unscored rather than being treated as zeroes. Three
numeric pairings receive timing-only corrections; no annual fishery-strength
ceiling changes.

## Approved corrections

### Charlevoix Chinook salmon

The prior secondary mode incorrectly peaked May 10. The Lake Michigan roadmap
and preserved Michigan Pier/Dock observations support a modest summer channel
period followed by the existing stronger fall staging period.

| Date        | Seasonal availability |
| ----------- | --------------------: |
| May 31      |                  0.00 |
| June 15     |                  0.70 |
| July 15     |                  1.00 |
| August 15   |                  0.35 |
| September 1 |                  0.00 |

The corrected summer mode retains its 4.84 prime-condition ceiling. The existing
September fall mode remains the annual maximum at 7.2.

### Rogers City Chinook salmon

Recent DNR reports consistently place adult staging in early and middle
September. October remains a documented late opportunity, but is no longer
modeled as the primary peak.

| Date         | Seasonal availability |
| ------------ | --------------------: |
| August 1     |                  0.00 |
| August 20    |                  0.50 |
| September 10 |                  1.00 |
| September 24 |                  0.75 |
| October 5    |                  0.40 |
| October 20   |                  0.10 |
| November 1   |                  0.00 |

The 6.0 annual ceiling is unchanged.

### Rogers City Atlantic salmon

The previous configuration implied substantial January and February harbor
availability and an April peak. Current official guidance and marina-wall
reports instead support a May-centered opportunity continuing into early summer,
plus a smaller fall period. Both modes now reach zero before winter so they do
not create an unsupported year-boundary seam.

Primary spring and early-summer mode:

| Date      | Seasonal availability |
| --------- | --------------------: |
| April 15  |                  0.00 |
| April 29  |                  0.45 |
| May 15    |                  1.00 |
| June 15   |                  0.65 |
| July 15   |                  0.25 |
| August 20 |                  0.00 |

Secondary fall mode:

| Date         | Seasonal availability |
| ------------ | --------------------: |
| August 20    |                  0.00 |
| September 20 |                  0.55 |
| October 20   |                  1.00 |
| November 25  |                  0.35 |
| December 15  |                  0.00 |

The primary 6.8 and secondary 5.99 ceilings are unchanged.

## Primary evidence

- [Michigan DNR Roadmap to Fishing Lake Michigan](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/LakeMichigaRoadmap.pdf?hash=60384A1DF9291773FE12BAF430E4DECE&rev=c46ad99a533d48f38b2a65b62728f501)
- [Michigan DNR Roadmap to Fishing Lake Huron](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/RoadmapLake_Huron-accessible.pdf?hash=9B8016365487EFFD33522DB5409929B7&rev=724dd584a1f04b9db8f3edc6ea5238c0)
- [Michigan DNR Weekly Fishing Report — May 13, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/41716da)
- [Michigan DNR Weekly Fishing Report — May 27, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4192706)
- [Michigan DNR Weekly Fishing Report — September 11, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b5093d)
- [Michigan DNR Weekly Fishing Report — September 10, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3f1ef58)
- [Michigan DNR Weekly Fishing Report — September 16, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/42aff44)
- [Michigan Atlantic salmon program](https://www.michigan.gov/dnr/education/michigan-species/fish-species/atlantic-salmon)

The audit also reuses the preserved Michigan Pier/Dock extract and source ledger
under `docs/onboarding/piercast/pentwater-caseville-2026-09-pass1/` and the
all-city major-species audit.

## Access and release boundary

Per owner direction, the Batch 2 score model does not exclude Lexington or any
other city merely because access is temporarily limited. Existing access notes
may inform anglers, while rankings continue to represent historical fishery
strength, seasonality, modeled water fit and current opportunity.

The corrections are applied only by the 1.17 app-side opportunity projection.
The shared server calibration remains unchanged, so live 1.14, 1.15 and 1.16
clients retain their existing responses. The same corrected evaluator feeds
leaderboards, city reports and the five-day primary-species calendar.
