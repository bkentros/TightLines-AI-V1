# Root River River Run Acceptance

**Public enablement:** `not_authorized` **Current gate:**
`gate_4b_hidden_owner_review`

## Gate record

| Gate | Artifact/result | Status |
| --- | --- | --- |
| Identity, corridor, sections, operational facility, Horlick barrier | `river-foundation.md` | owner approved |
| Live/history source feasibility | `live-conditions.md` | owner approved with upper-context limitation |
| Species portfolio | 8/9/7/7, all broad | owner approved |
| Four species calendars, curves, Stage/Fish In River/Fishability/copy | `runs/` + `root.ts` | Gate 4A owner approved |
| Activity source mode | weather-only; both upstream river stations excluded | pass |
| Four fixed 2007-2025 Activity replays | `activity-replay.md` + audit JSON | pass |
| Chinook/Coho lifecycle decline | continuous terminal behavior | pass |
| Steelhead/Brown living-fish behavior | no salmon mortality or forced departure | pass |
| Brown calibration | rejected untuned baseline retained; bounded Peak +5 accepted | pass |
| Push / Migration Timing | no accepted paired product-corridor baseline | unavailable |
| Gauge Read source separation | Horlick flow/height; 60th Street temperature | pass; Partial by design |
| Hidden draft registry; no public leak | registry + tests | pass |
| Complete review fixtures | 971 scenarios / 21 hidden review runs | pass |
| Full engine and project QA | commands below | pass |
| Product-owner Gate 4B behavior/replay decision | this packet | owner approved |
| Consolidated four-river review | after Bois Brule 4B | deferred |
| Public enablement/deployment/release | explicit authorization required | not authorized |

## Gate 4B decisions

- Activity is Limited weather-only for Chinook, Coho, Steelhead, and lake-run
  Brown Trout. It scores effective light and restrained same-block
  precipitation for a fish already present.
- USGS `04087240` flow/height and `04087234` water temperature remain useful in
  their accepted non-Activity surfaces, but both are excluded from Activity.
  They are outside the product corridor, are not co-located, and cannot form a
  lower-river observed model.
- Copy states that product-corridor level, clarity, and measured water
  temperature are unknown. Weather does not imply river rise, clearing,
  cooling, movement, passage, abundance, or catch probability.
- Chinook and Coho retain continuous terminal lifecycle decline. Steelhead and
  Browns receive no salmon mortality or late-stage departure constraint.
- The untuned Brown replay failed one stage-shape invariant because its 64.23
  Peak mean trailed its 65.12 taper mean. A bounded Peak-only +5 correction
  produces a 65.10 Peak mean above both adjacent shoulders, remains capped at
  69 after the 0.80 evidence scale, and makes no mortality/departure claim.
- Missing weather fails Activity closed. Invented upstream flow or temperature
  inputs do not change any Root Activity score.

## Required release record

- Configuration: `2026-08-27-root-steelhead-local-peak.3` (hidden)
- Foundation: `root-foundation-v4-gate4b-2026-08-26`
- Live source audit: `root-live-source-v4-gate4b-2026-08-26`
- Activity replay: `root-*-weather-activity-v1-draft`, fixed 2007-2025.
- Fixture generation: `npm run generate:river-run:onboarding-review-fixtures`
  — 971 scenarios across 21 review runs.
- Test results: 351/351 engine tests; focused Root/Sheboygan/corridor tests,
  TypeScript project check, onboarding validator/QA, generated-fixture check,
  and review-mode structural/copy QA pass.
- Known limitations: facility totals are operational subsets; hydraulic and
  temperature sources lie upstream of the product corridor and are not
  co-located; temperature date average is unavailable pending a complete
  historical gap/QC audit; Activity does not know product-corridor level,
  clarity, or water temperature; Fishability does not represent harbor/downtown
  shape; no Push, Migration Timing, winter, or spring model; Brown
  hold-versus-lake-return share is unknown.
- Owner Gate 4A acceptance date: 2026-08-26
- Owner Gate 4B acceptance date: 2026-08-26
- Public enablement authorization:
- Deployment authorization:
- Commit/push/release record:

Acceptance, public enablement, deployment, and release remain separate
decisions.
