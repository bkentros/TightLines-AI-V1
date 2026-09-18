# PierCast five-city onboarding: four-city public stage

Owner authorized public release on September 18, 2026 for Two Rivers, Kewaunee, Algoma, Manitowoc, and Waukegan, then directed release of the four Wisconsin cities first through the installed client. The public Formula v3 manifest includes 16 cities: the established 12 plus Two Rivers, Kewaunee, Algoma, and Manitowoc. Waukegan remains in the 17-city research and archive pipeline but is excluded from public discovery and reports until an Illinois-capable app build is distributed. The four public additions have 19 pier-supported species pairings across five forecast dates; Waukegan's five calibrated pairings remain private. The researched but unsupported pairings stay unscored; the report does not claim those species are absent.

The public city report and leaderboard use one coherent four-cohort NOAA LMHOFS cycle. Projection fails closed if a required city or five-day report is missing. Reports use the reviewed Formula v3 calibration, with scores bounded to 1–10. Normal free and paid accounts use the same public path; the temporary owner-only review path and private-review banner have been removed from the app client. Administrative research endpoints remain authorization-gated for audit and outcome work and are not used by the public app.

Algoma's south breakwater remains recorded as reported closed during construction; the north route remains unverified. The public report describes the fishery and explicitly warns about access. [USACE's project page](https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638113/algoma-harbor/) gives a tentative April 2027 completion, and its [fact sheet](https://lre-ops.usace.army.mil/OandM/factsheets/AlgomaHarbor.pdf) identifies ongoing work. The Waukegan yellow-perch May 1–June 15 closure remains unavailable in the model under the [Illinois DNR 2026 regulations](https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf). Posted signs and current legal rules control fishing access and harvest.

## Verification and rollout record

| Gate | Result |
| --- | --- |
| Production database migrations `20260917193000` and `20260918150000` | Applied and reconciled September 18, 2026 |
| Local Formula v3/Pass 3 checks and TypeScript checks | Passed September 18, 2026 |
| Current production NOAA source projection | 16 ranked public cities, five complete dates each, all four Wisconsin additions present; coherent September 18 06:00 UTC issue |
| App client | Existing 1.12 client supports MI/WI; Illinois presentation is committed for a future build |
| Production Edge Function deployment | `pier-cast` version 47, active, original JWT setting preserved |
| iOS and Android store distribution | No new build requested for this four-city stage |
| Authenticated normal-user production smoke | Passed: 16 public cities, four Wisconsin additions, five-day paid reports, four free reports, fifth-report paywall, Waukegan 404, owner route 403 |

The existing MI/WI client can now show the four Wisconsin cities through the deployed production backend. Waukegan must stay out of the public API until a store client containing Illinois support is available. The currently installed 1.12 client predates that support and cannot receive an over-the-air update because this project does not include `expo-updates`. The unrequested Android 1.13 build was canceled before completion; no new app binary was distributed for this stage.

The [Pass 3 acceptance](../five-city-2026-09-pass3/acceptance.json) and [production verification](../five-city-2026-09-pass3/production-verification.json) are historical pre-release records. Their 12-city public counts and private archive flags are intentional snapshots and must not be mistaken for post-release production checks.
