# PierCast five-city public release

Owner authorized public release on September 18, 2026 for Two Rivers, Kewaunee, Algoma, Manitowoc, and Waukegan. The public Formula v3 manifest now includes all 17 cities. The five added reports cover 24 pier-supported species pairings across five forecast dates. The 20 researched but unsupported pairings stay unscored; the report does not claim those species are absent.

The public city report and leaderboard use one coherent four-cohort NOAA LMHOFS cycle. Projection fails closed if a required city or five-day report is missing. Reports use the reviewed Formula v3 calibration, with scores bounded to 1–10. Normal free and paid accounts use the same public path; the temporary owner-only review path and private-review banner have been removed from the app client. Administrative research endpoints remain authorization-gated for audit and outcome work and are not used by the public app.

Algoma's south breakwater remains recorded as reported closed during construction; the north route remains unverified. The public report describes the fishery and explicitly warns about access. [USACE's project page](https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638113/algoma-harbor/) gives a tentative April 2027 completion, and its [fact sheet](https://lre-ops.usace.army.mil/OandM/factsheets/AlgomaHarbor.pdf) identifies ongoing work. The Waukegan yellow-perch May 1–June 15 closure remains unavailable in the model under the [Illinois DNR 2026 regulations](https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf). Posted signs and current legal rules control fishing access and harvest.

## Verification and rollout record

| Gate | Result |
| --- | --- |
| Production database migrations `20260917193000` and `20260918150000` | Applied and reconciled September 18, 2026 |
| Local Formula v3/Pass 3 checks and TypeScript checks | Passed September 18, 2026 |
| Current production NOAA source projection | 17 ranked cities, five complete dates each, all five added cities present; coherent September 18 06:00 UTC issue |
| App client | Illinois state presentation and access warning added; version 1.13 source prepared |
| Production Edge Function deployment | Pending |
| iOS and Android store distribution | Pending |
| Authenticated normal-user production smoke | Pending production deployment |

The production backend should be enabled only when a store client containing Illinois support is available to users. The currently installed 1.12 client predates that support and cannot receive an over-the-air update because this project does not include `expo-updates`. A Git push alone does not change the live app.

The [Pass 3 acceptance](../five-city-2026-09-pass3/acceptance.json) and [production verification](../five-city-2026-09-pass3/production-verification.json) are historical pre-release records. Their 12-city public counts and private archive flags are intentional snapshots and must not be mistaken for post-release production checks.
