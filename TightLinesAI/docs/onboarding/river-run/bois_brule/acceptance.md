# Bois Brule River Run Acceptance

**Public catalog:** `owner_approved_static_release_ready` **Production
deployment:** `not_performed`

## 2026-08-29 release reconciliation

The owner approved the four Bois Brule runs for public static-catalog promotion.
All four `publicAudit` gates are enabled, the river/runs/configuration document
are in the canonical public registries, and the former draft entries are
removed. The release configuration is
`2026-08-29-bois-brule-four-species-release.6`. This supersedes older
hidden/pending state language below, which remains as historical gate evidence.
No Edge Function deployment, database publication, app build, or store
submission was performed by this approval reconciliation.

## Gate record

| Gate                                        | Artifact/result                                                           | Status                          |
| ------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| Exact river identity and namesake exclusion | Douglas County Bois Brule to Lake Superior                                | pass                            |
| Corridor and sections                       | mouth to downstream side Highway 2; three approved reaches                | owner approved                  |
| Passage and closures                        | fishway passage; permanent and seasonal refuges excluded                  | pass                            |
| Live/history source feasibility             | upstream 04025500 flow/height; historical-only lower 04026005 temperature | owner approved with limitations |
| Species portfolio                           | Chinook 2 sectional; Coho 8 broad; Steelhead 9 broad; Brown 7 broad       | owner approved                  |
| Four independent calendars and curves       | `timing-audit.md`, run packets, `boisBrule.ts`                            | pass                            |
| Steelhead/Brown lifecycle                   | living-fish semantics; no salmon terminal logic                           | pass                            |
| Restriction-first Stage copy                | Nov. 15, night rule, Box Car, Mays Ledges, permanent refuge               | pass                            |
| Stage / Fish In River                       | available for all four                                                    | pass                            |
| Activity                                    | Limited weather-only for all four species                                 | pass                            |
| Fishability                                 | upstream gauge is outside corridor; unavailable                           | pass                            |
| Push / Migration Timing                     | no accepted current same-reach baseline                                   | unavailable                     |
| Gauge Read current temperature              | unavailable; no current value or trend                                    | pass                            |
| Historical temperature                      | 101 exact-date normals, minimum two qualifying years, no imputation       | pass                            |
| Hidden draft registry; no public leak       | config and focused tests                                                  | pass                            |
| Generated four-primitive fixtures           | 1,136 scenarios across 25 hidden review runs                              | pass                            |
| Full engine/project QA                      | 358 tests; typecheck; onboarding validation/QA; review QA                 | pass                            |
| Product-owner Gate 4A truth/copy decision   | this packet                                                               | owner approved                  |
| Gate 4B Activity                            | four fixed 2007-2025 replays; all accepted invariants zero                | owner approved                  |
| Consolidated four-river review              | after Bois Brule Gate 4B                                                  | deferred                        |
| Public enablement/deployment/release        | explicit authorization required                                           | not authorized                  |

## Gate 4A decisions

- Highway 2 is a regulatory product endpoint, not a biological barrier.
- Stage guidance always states the seasonal and refuge restrictions before
  section recommendations. After the Nov. 15 close it offers no legal start.
- Chinook is the only sectional/lower-weighted run. The other three use broad
  corridor opportunity without implying uniform distribution.
- Fall Steelhead may overwinter and have a separate spring run; this model does
  not predict winter/spring behavior. Browns survive spawning, but available
  evidence does not justify one universal overwinter-versus-lake-return claim.
- Gauge Read labels 04025500 as upstream context. Historical temperature comes
  from discontinued lower station 04026005 and is never presented as today's
  measurement, a trend, or a scoring input.
- Activity and lower-corridor Fishability remain honestly unavailable in Gate
  4A. Gate 4B independently proves a Limited weather-only Activity candidate for
  each species; Fishability remains unavailable.
- Activity uses only modeled Highway 2 effective light and restrained same-block
  precipitation. The upstream gauge and historical-only temperature are excluded
  and cannot change a score.
- Chinook uses an Activity-only decline interpolation through Oct. 31 to avoid a
  daily score cliff; no Stage or Fish In River date changed. Coho uses the raw
  calibration. Steelhead has no salmon lifecycle decline. Browns use the minimum
  passing Peak-only +6 correction, still bounded by the 0.80 evidence scale and
  stage-response ceiling, without mortality or departure logic.

## Release record

- Configuration: `2026-08-27-bois-brule-fishability-source-audit.5` (hidden)
- Foundation: `bois-brule-foundation-v3-gate4a-2026-08-26`
- Live source audit: `bois-brule-live-source-v3-gate4a-2026-08-26`
- Historical-temperature baseline:
  `bois-brule-lower-approved-exact-date-temperature-2021-2023-v1`
- Fixture generation: 1,157 private scenarios across 26 supported review runs;
  generated-file parity and review-mode structural/copy QA pass.
- Test results: 374/374 engine tests, TypeScript project check, configuration
  validation, onboarding portfolio QA, and focused Brule tests pass.
- Activity replay: four fixed 2007-2025 artifacts with 100% coverage; 9,253
  total usable species-days. Complete stage/block distributions and accepted
  invariants are recorded in `activity-replay.md`.
- Known limitations: passage totals are structure-biased indices; live gauge is
  upstream of the product corridor; current measured temperature is unavailable;
  historical date coverage ends Oct. 9; no lower-corridor Fishability, Push, or
  Migration Timing model; no winter/spring Steelhead model; Brown
  winter-location share unknown.
- Owner Gate 4A acceptance date: 2026-08-26
- Owner Gate 4B acceptance date: 2026-08-26
- Public enablement authorization:
- Deployment authorization:
- Commit/push/release record:

Acceptance, public enablement, deployment, and release remain separate
decisions.
