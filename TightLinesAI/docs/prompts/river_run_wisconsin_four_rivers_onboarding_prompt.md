# One-click prompt — Wisconsin River Run onboarding

Copy everything inside the block below into a new Codex conversation opened at
the repository root.

```text
Continue FinFindr development in this repository. Work with high effort and
disciplined evidence handling. Your task is to onboard four new Wisconsin River
Run rivers from research through private owner-review readiness:

1. Milwaukee River — Wisconsin, Lake Michigan tributary.
2. Sheboygan River — Wisconsin, Lake Michigan tributary.
3. Root River — Racine, Wisconsin, Lake Michigan tributary.
4. Bois Brule River — Wisconsin Lake Superior tributary, commonly called the
   Brule River.

Identity warning: the intended fourth river is the Bois Brule River flowing
north through the Brule River State Forest to Lake Superior. Do not confuse it
with the separate Brule River in the Wisconsin–Michigan boundary/Upper Green Bay
system. Reverify this identity from authoritative sources and record the
excluded same-name river in the foundation packet before doing species work.

Before researching or editing, read these files completely in this order:

1. docs/river_run_rapid_onboarding_playbook.md
2. docs/river_run_copy_model.md
3. docs/river_run_activity_onboarding_standard.md
4. docs/river_run_live_conditions_onboarding_standard.md
5. docs/templates/river_run_river_foundation_template.md
6. docs/templates/river_run_live_conditions_template.md
7. docs/templates/river_run_species_run_template.md
8. docs/templates/river_run_acceptance_template.md

Then inspect the current engine types, validation, public/draft registries,
provider adapters, replay scripts, generated-fixture tooling, endpoint tests,
UI QA, production smoke script, and the completed Grand/Platte/White packets in
docs/onboarding/river-run/. Treat the playbook as controlling when older handoff
or rollout documents disagree.

Mandatory execution and approval gates:

This is one complete prompt for the entire four-river project, but it does not
authorize doing the project in one uninterrupted pass. Follow section 1.2 of
the rapid onboarding playbook exactly. Stop after each gate, give me the named
artifacts and a compact decision summary, and wait for my explicit approval.
Approval advances only one gate unless I explicitly say otherwise. Do not do
later-gate work in the background while waiting.

1. Readiness — all four rivers. Report the section 18 readiness items, branch,
   worktree, runtime/configuration contract, current portfolio, provider
   adapters, exact proposed identities, and overlaps. STOP.
2. Foundation and source feasibility — all four rivers. Deliver one foundation
   and source-feasibility packet per river covering identity, sections,
   barriers, preliminary species support, regulations, gauges, weather, and
   verified live/history endpoint behavior. STOP.
3. Species-truth portfolio — all four rivers. Deliver the side-by-side support,
   relative-strength, distribution, evidence-quality, calendar-anchor, and
   species-endpoint matrix. Explicitly exclude unsupported combinations. STOP.
4. Milwaukee River truth/non-Activity implementation. Complete detailed
   species packets, field reconciliation, calendars, corridor copy, Migration
   Stage, Fish In River, Fishability, Gauge Read, and hidden configuration.
   STOP for truth/copy approval. Then perform Milwaukee Activity calibration,
   full replay, fixtures, QA, and rendered private review. STOP for acceptance.
5. Repeat the same two mandatory stops for the Sheboygan River.
6. Repeat the same two mandatory stops for the Root River.
7. Repeat the same two mandatory stops for the Bois Brule River.
8. Consolidated cohort review. Present every accepted river/species calendar,
   strength, endpoint, source capability, Activity stage mean, limitation, and
   test result. STOP for cohort acceptance.
9. Release remains separately gated. Do not promote, deploy, publicly enable,
   commit a release, or push release work unless I explicitly authorize release.

If I correct research, copy, configuration, scoring, or UI behavior at any
gate, update the source packet and generalized guidance where applicable, rerun
every affected downstream audit, and return to the affected gate. Never treat a
request to begin onboarding as advance approval for all nine gates.

Start by reporting, in your own words, the readiness items required by section
18 of the rapid onboarding playbook. Also report the current branch/worktree,
existing public river/run counts, production configuration-source contract if
discoverable, and any overlapping user changes. Do not begin by copying a nearby
river configuration.

Research requirements:

- Use current authoritative primary sources first: Wisconsin DNR, USGS, NOAA,
  USFWS, USACE, FERC, tribal authorities, municipalities/operators, official
  technical reports, and peer-reviewed research. Secondary sources may locate
  primary material but must not carry material facts when a primary source is
  available.
- Build one shared foundation/evidence bundle per river and one side-by-side
  species comparison matrix before implementation.
- Do not assume Chinook, Coho, and Steelhead are all supported on every river.
  Research occurrence, recurring migration, dependable angling opportunity,
  strength, distribution, lifecycle, and evidence quality separately. Create a
  public run only for combinations that pass their own evidence and audit.
- Distinguish migration/passage timing from harvest, spawning, egg-take,
  stocking, facility-operation, and publication dates.
- Inventory every permanent, seasonal, operational, removed, proposed, and
  natural barrier from the mouth to each proposed endpoint. Verify the complete
  mouth-to-endpoint passage chain independently for each species. A ladder or
  passage at the final structure does not prove passage through earlier ones.
- Lock two to four recognizable public sections, current regulations/closures,
  access disclaimers, and species endpoints before writing run copy.
- Inventory every runtime configuration field for every supported river/species
  combination. Trace each value to direct evidence, an explicit portfolio
  comparison, or a clearly labeled owner calibration.
- Compare run strength and distribution against the full accepted portfolio.
  Strength and distribution are separate decisions; neither is a fish count or
  catch promise.

Live Conditions requirements:

- Probe actual live and historical endpoints, not station metadata or HTTP
  status alone. Verify station/series/parameter identity, units, timestamp,
  numeric values, cadence, history, gaps, provisional/qualifier behavior, null
  and Eqp/EQUIP sentinels, datum/method changes, licensing, and represented
  reach.
- Resolve the latest usable observation independently for each metric because
  flow, gauge height, and temperature may publish at different times.
- Decide Gauge Read, Fishability, Activity, and contextual eligibility
  independently. Never borrow or average a gauge merely to make a primitive
  available.
- Gauge Read must use the species-independent hourly live-conditions contract.
  Provider observation time, FinFindr refresh time, and device time are distinct.
- Public UI/copy must visibly distinguish CURRENT, DELAYED, PARTIAL,
  UNREADABLE, and no-accepted-gauge states; show observation age and exact time;
  suppress values older than 24 hours; retain the last readable timestamp during
  outages; and recover automatically when valid provider data resumes.
- Weather-only Activity is allowed only after an independent replay and must be
  explicitly Limited. Weather is not a substitute for a measured river gauge or
  water temperature.

Activity and copy requirements:

- Select observed-river, weather-only, or unavailable Activity from the
  same-reach evidence decision; do not blend mismatched reaches silently.
- Calibrate Activity independently for every supported river/species run across
  the longest fixed reliable historical interval. Report overall, per-stage,
  per-block, and stage-by-block distributions, label shares, cap frequency,
  confidence, missing modes, leaders/ties, and lifecycle continuity.
- Peak must be the highest stage mean; Building and Tapering should form
  credible shoulders; Pre-run, Beginning, Ending, and residual stages should be
  lower without unexplained cliffs. Diagnose evidence/calendar/thresholds before
  applying any bounded, versioned stage-response adjustment. Hard temperature,
  barrier, extreme-flow, blown-out, and missing-data caps remain authoritative.
- Rerun the full fixed replay after every calendar, source, weight, breakpoint,
  cap, lifecycle, or scoring change. Preserve before/after audit artifacts.
- Replay every day and every copy transition. Add intermediate corridor copy
  boundaries where long stage gaps would leave materially stale location advice.
- Audit all four visible primitives—Migration Stage, Activity, Fish In River,
  and Fishability—plus Gauge Read across fresh/delayed/partial/unreadable states,
  terminal behavior, cross-year dates, narrow screens, and valid contradictory
  combinations.

Implementation and review requirements:

- Scaffold versioned packets under docs/onboarding/river-run/<river-id>/ using
  the canonical templates. Keep shared river facts in the foundation and
  species facts in separate run packets.
- Implement candidates in isolated onboarding files and draft/private review
  registries first. Do not enable publicAudit or add them to public registries
  before all gates and explicit owner authorization.
- Add/update validators, provider-normalization tests, endpoint tests, replay
  scripts, generated review fixtures, catalog selection, copy-transition QA,
  UI QA, and production-smoke expectations as required. Never hand-edit
  generated fixtures.
- Generate complete owner-review scenarios and prove every supported
  State → Season → Species → River path is selectable. Current Live must use
  authenticated real providers; Scenario Fixtures must remain isolated.
- Run formatting, diff checks, full engine/endpoint tests, onboarding QA,
  Activity replay QA, fixture checks, UI/copy QA, and TypeScript checks. Record
  exact commands and results in each acceptance packet.
- Present a consolidated owner review with river/species calendars, strengths,
  endpoints, source capabilities, Activity stage means, known limitations, and
  any decisions that require owner calibration.

Release boundary:

Research and implementation do not authorize deployment or public enablement.
Stop at private owner-review readiness unless I explicitly approve release. If I
later approve release, follow Phases H and I of the rapid playbook exactly:
promote public registries, remove promoted drafts, update audit versions and
complete catalog counts, reconcile static-versus-database configuration source,
compare linked migrations, invalidate caches with the appropriate versions, run
the complete release gate, deploy once, smoke every public run in production,
audit all public live providers, record function/migration results, commit/push
atomically, and prove the worktree and remote are clean and synchronized.

Authoritative identity starting points (starting points only, not complete
research):

- Wisconsin DNR Root River Steelhead Facility:
  https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER
- Wisconsin DNR Lake Superior tributary FAQ (Bois Brule species/timing context):
  https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/lakesuperiortribFAQs.html
- Wisconsin DNR Brule River State Forest (Bois Brule identity):
  https://dnr.wisconsin.gov/topic/StateForests/bruleriver
- Wisconsin DNR boundary-water definitions (separate WI–MI Brule River):
  https://dnr.wisconsin.gov/topic/Fishing/seasons/definitions.html

Be disciplined, preserve unrelated work, cite every material external claim,
and convert every generalized lesson or correction into the playbook,
template, validator, or QA safeguard that would prevent a future recurrence.
```
