# Root River River Run Acceptance

**Public catalog:** `owner_approved_static_release_ready` **Production
deployment:** `not_performed`

## 2026-08-29 release reconciliation

The owner approved the four Root runs for public static-catalog promotion. All
four `publicAudit` gates are enabled, the river/runs/configuration document are
in the canonical public registries, and the former draft entries are removed.
The current configuration is `2026-08-31-root-fish-counts.8`. This supersedes
older hidden/pending state language below, which remains as historical gate
evidence. No Edge Function deployment, database publication, app build, or store
submission is recorded by this source change.

## Gate record

| Gate                                                                | Artifact/result                                                                             | Status                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Identity, corridor, sections, operational facility, Horlick barrier | `river-foundation.md`                                                                       | owner approved                               |
| Live/history source feasibility                                     | `live-conditions.md`                                                                        | owner approved with upper-context limitation |
| Species portfolio                                                   | 8/9/7/7, all broad                                                                          | owner approved                               |
| Four species calendars, curves, Stage/Fish In River/copy            | `runs/` + `root.ts`                                                                         | Gate 4A owner approved                       |
| Activity source mode                                                | weather-only; both upstream river stations excluded                                         | pass                                         |
| Four fixed 2007-2025 Activity replays                               | `activity-replay.md` + audit JSON                                                           | pass                                         |
| Chinook/Coho lifecycle decline                                      | continuous terminal behavior                                                                | pass                                         |
| Steelhead/Brown living-fish behavior                                | no salmon mortality or forced departure                                                     | pass                                         |
| Brown calibration                                                   | rejected untuned baseline retained; bounded Peak +5 accepted                                | pass                                         |
| Push / Migration Timing                                             | no accepted paired product-corridor baseline                                                | unavailable                                  |
| Gauge Read source separation                                        | Horlick flow/height; 60th Street temperature                                                | pass; Partial by design                      |
| Fish Counts                                                         | official Root River Steelhead Facility `Total Captured` table; cache-bypassed weekly checks | pass; facility subset only                   |
| Fishability source scope                                            | both river sources are upstream of the product endpoint                                     | unavailable; fails closed                    |
| Hidden draft registry; no public leak                               | registry + tests                                                                            | pass                                         |
| Complete review fixtures                                            | 1,157 scenarios / 26 hidden review runs                                                     | pass                                         |
| Full engine and project QA                                          | commands below                                                                              | pass                                         |
| Product-owner Gate 4B behavior/replay decision                      | this packet                                                                                 | owner approved                               |
| Consolidated four-river review                                      | after Bois Brule 4B                                                                         | deferred                                     |
| Public enablement/deployment/release                                | explicit authorization required                                                             | not authorized                               |

## Gate 4B decisions

- Activity is Limited weather-only for Chinook, Coho, Steelhead, and lake-run
  Brown Trout. It scores effective light and restrained same-block precipitation
  for a fish already present.
- USGS `04087240` flow/height and `04087234` water temperature remain useful in
  their accepted non-Activity surfaces, but both are excluded from Activity.
  They are outside the product corridor, are not co-located, and cannot form a
  lower-river observed model.
- Fishability is unavailable because the Horlick gauge is upstream of the
  product endpoint below the operated Steelhead Facility. A valid upper-river
  measurement is not silently converted into a harbor-to-facility presentation
  grade.
- Copy states that product-corridor level, clarity, and measured water
  temperature are unknown. Weather does not imply river rise, clearing, cooling,
  movement, passage, abundance, or catch probability.
- Chinook and Coho retain continuous terminal lifecycle decline. Steelhead and
  Browns receive no salmon mortality or late-stage departure constraint.
- The untuned Brown replay failed one stage-shape invariant because its 64.23
  Peak mean trailed its 65.12 taper mean. A bounded Peak-only +5 correction
  produces a 65.10 Peak mean above both adjacent shoulders, remains capped at 69
  after the 0.80 evidence scale, and makes no mortality/departure claim.
- Missing weather fails Activity closed. Invented upstream flow or temperature
  inputs do not change any Root Activity score.
- Fish Counts checks the official Wisconsin DNR page without an app-side cache
  on every report request. DNR normally publishes Tuesday or Wednesday during
  fall and spring operation. Only `Total Captured` is used; `Passed Upstream`
  and `Spawned at Facility` are dispositions and are never added again. The
  primitive supports Chinook, Coho, Steelhead, and lake-run Brown Trout, and
  never changes Stage, Activity, Presence, or Fishing Shape.

## Required release record

- Configuration: `2026-08-31-root-fish-counts.8`
- Foundation: `root-foundation-v4-gate4b-2026-08-26`
- Live source audit: `root-live-source-v4-gate4b-2026-08-26`
- Activity replay: `root-*-weather-activity-v1-draft`, fixed 2007-2025.
- Fixture generation: `npm run generate:river-run:onboarding-review-fixtures` —
  1,157 scenarios across 26 review runs.
- Test results: 374/374 engine tests; focused Root/Sheboygan/corridor tests,
  TypeScript project check, onboarding validator/QA, generated-fixture check,
  and review-mode structural/copy QA pass.
- Known limitations: facility totals are operational subsets and reports are
  absent outside active processing windows; hydraulic and temperature sources
  lie upstream of the product corridor and are not co-located; temperature date
  average is unavailable pending a complete historical gap/QC audit; Activity
  does not know product-corridor level, clarity, or water temperature;
  Fishability is unavailable for the modeled corridor; no Push, Migration
  Timing, winter, or spring model; Brown hold-versus-lake-return share is
  unknown.
- Owner Gate 4A acceptance date: 2026-08-26
- Owner Gate 4B acceptance date: 2026-08-26
- Public enablement authorization:
- Deployment authorization:
- Commit/push/release record:

Acceptance, public enablement, deployment, and release remain separate
decisions.
