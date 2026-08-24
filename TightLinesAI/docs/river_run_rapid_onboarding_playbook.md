# FinFindr River Run Rapid Onboarding Playbook

**Status:** Normative source of truth **Version:** 1.0 **Established:**
2026-08-24 **Branch family:** `develop/cross-platform-next` **Scope:**
Researching, configuring, validating, reviewing, and handing off a new River Run
river and its supported fall Chinook, Coho, and Steelhead runs

## 1. Authority

This is the controlling workflow for future River Run onboarding. Every agent
must read it completely before researching or changing a river.

Supporting normative standards, in order:

1. `docs/river_run_copy_model.md` — public copy and geography rules.
2. `docs/river_run_activity_onboarding_standard.md` — Activity research,
   calibration, replay, copy, and acceptance.
3. `docs/river_run_live_conditions_onboarding_standard.md` — Gauge Read sources,
   date context, trends, provenance, and unavailable behavior.
4. Current engine types, validation, scoring code, and tests — runtime behavior.
5. The river’s versioned onboarding packet and accepted audit — researched
   river/run facts.

Older six-primitive, five-primitive, release-branch, Push, or Migration Timing
instructions are historical. Timing and Push may remain internal for backward
compatibility, but they are hidden and are not part of public onboarding, public
copy acceptance, navigation, or the visible primitive order.

When sources, code, or standards disagree, stop and record the contradiction. Do
not silently select the convenient answer. A change to an accepted score,
calendar, public section, capability, or biological conclusion requires an
explicit versioned decision.

## 2. Current product contract

The visible River Run order is fixed:

1. Migration Stage
2. Activity
3. Fish In River
4. Fishability

Live Conditions, presented as Gauge Read, appears above the primitives. It is an
unscored measurement surface, not a fifth primitive.

Primitive ownership:

| Surface         | Owns                                                                                                                                        | Must not claim                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Migration Stage | Fixed researched seasonal phase and the seasonally appropriate section in which to begin                                                    | Live abundance, confirmed distribution, current movement, responsiveness, catch probability                     |
| Activity        | Conditional responsiveness of fish already present and differences among four supported time blocks                                         | Abundance, migration, catch probability, exact fish location, proof of feeding                                  |
| Fish In River   | Approximate historical seasonal presence relative to that river/species ceiling                                                             | Live fish count, current movement, bite quality, exact location                                                 |
| Fishability     | Presentation control and the shape of fishable water represented by the accepted hydraulic source                                           | Abundance, responsiveness, access, wading/boating safety, the entire river unless audited                       |
| Live Conditions | Current measurements, source-appropriate precision, date-based historical context, 24-hour trend, freshness, station, and represented reach | A score, migration inference, clarity inference, safety, fish presence, whole-river conditions without evidence |

Valid tension is expected. High seasonal presence can coexist with low Activity.
Excellent Fishability can coexist with low Fish In River. Do not rewrite one
surface to make independent conclusions superficially agree.

## 3. Non-negotiable safety and release boundaries

- Start only from the clean pushed development branch specified by the owner.
- Never modify `release/app-store-v1` or release tags.
- Do not deploy, publish a configuration, or publicly enable a river without
  separate explicit authorization.
- Do not make App Store or Play Store release-version changes during ordinary
  river onboarding.
- Do not claim safety, access, legal methods, or current closure status from
  River Run section guidance.
- Fail closed when geography, passage, source scope, biological support, data
  capability, or a material copy fact is unresolved.
- Preserve unrelated user changes in a dirty worktree. Stop if they overlap the
  onboarding files and cannot safely be separated.

Acceptance, deployment, and public enablement are three separate decisions.

## 4. The unit of work

Onboard one river foundation once, then configure all supported species runs
against it.

River-level facts:

- Identity, timezone, mouth, corridor, and presentation jurisdictions.
- Public sections and named endpoints.
- Dams, barriers, passage, closures, and product limits.
- Regulations and access disclaimers.
- Hydraulic, measured-temperature, and weather sources.
- Live Conditions metrics, history, freshness, attribution, and reach.
- Target species capability.

Run-level facts:

- Species biology and run type.
- Seasonal dates and stage substates.
- Historical-presence ceiling, distribution scope, and curve.
- Activity rules, lifecycle behavior, copy, and replay.
- Fishability bands or deterministic unavailable behavior.
- Four-primitive copy matrix and terminal behavior.

Never repeat river geography research independently for each species. Never
assume shared geography means shared calendar, presence, passage, Activity, or
lifecycle.

## 5. Create the onboarding workspace

From the repository root:

```bash
npm run river-run:onboarding:init -- \
  --river-id example_river \
  --display-name "Example River" \
  --state MI
```

This creates:

```text
docs/onboarding/river-run/example_river/
├── river-foundation.md
├── live-conditions.md
├── acceptance.md
└── runs/
    ├── fall-chinook.md
    ├── fall-coho.md
    └── fall-steelhead.md
```

The scaffolder never overwrites an existing workspace. Do not rename packet
files; automation and reviewers rely on the stable layout.

The default three species files are research candidates, not an assertion that
all combinations are supported. A combination becomes public only after its own
evidence, configuration, replay, copy, and acceptance pass.

Absence of a result in one current summary page is never proof that a run does
not exist. A disabled or unsupported decision has a higher evidence burden than
a supported-but-conservative draft because a false negative removes a real
fishery from the product.

## 6. Phase A — river foundation lock

### A1. Inspect before researching

Record:

- Current branch and worktree state.
- Existing river IDs, run IDs, source IDs, and naming conventions.
- Current engine/profile availability.
- Existing shared biology profiles that might fit.
- Current UI catalog behavior for supported and disabled combinations.
- Any user work already in progress.

Do not begin by copying the nearest river configuration.

### A2. Research hierarchy

Use current primary/authoritative sources first:

1. State fish and wildlife agency and current regulations/orders.
2. USGS, NOAA, USFWS, USACE, FERC, tribal authority, municipal owner, or
   documented operator.
3. Peer-reviewed research and official technical reports.
4. Established conservation organizations or watershed operators for station
   metadata when they own the relevant monitoring network.
5. Secondary sources only to locate primary material or document local names.

Every material fact needs an evidence-ledger entry with title, authority, URL or
repository path, publication/update date when available, access date, specific
supported facts, geographic reach, and limitations.

Do not cite a search-results page. Do not turn a URL list into implied support.

### A3. Lock public geography

Define two to four ordered, recognizable sections. Three is preferred when the
river naturally supports it. Each section needs:

- Stable ID and public label.
- Named downstream and upstream boundaries.
- Order from the mouth.
- Migration accessibility by supported species.
- Accepted public landmarks.
- Gauge coverage and limitations.
- Citations.

The product owner must approve exact public labels and endpoints before state
copy begins. Technical points that normal anglers do not recognize are not
acceptable merely because they are precise.

### A4. Complete the barrier inventory

Search current and historic/local names for:

- Dams, diversions, and low-head structures.
- Weirs, lamprey barriers, gates, and temporary controls.
- Natural falls or documented rapids barriers.
- Fish ladders, lifts, bypasses, and passage programs.
- Removed, breached, defunct, reconstructed, and proposed structures.
- Associated fishing closures and exclusion zones.

Verify structure status and fish passage separately. A ladder is not proof of
unrestricted, year-round, species-neutral passage. When passage affects where
the app sends users, use a second authoritative source when possible.

An unresolved barrier ends the public corridor below it. Limited passage is not
rewritten as impassable; product scope and biological passage remain distinct.

### A5. Lock regulations and access language

Record current jurisdiction, effective dates, affected reaches, and the exact
public reminder. Section names are orientation ranges. They do not promise
public access, a uniform tackle rule, harvest legality, or safe entry.

Reverify time-sensitive rules immediately before release even when the initial
foundation research passed.

### A6. Foundation approval gate

No run implementation begins until:

- Geography and endpoints are approved.
- Barrier/passage inventory is complete or conservatively bounded.
- Source reach is explicit.
- Regulations are recorded.
- Target species are evidence-supported.
- Contradictions have decisions.
- The foundation packet says `approved` with a version and owner date.

## 7. Phase B — source and Live Conditions lock

Follow `docs/river_run_live_conditions_onboarding_standard.md`.

### B1. Probe capabilities

For each plausible source verify the real endpoint and parameter:

- Provider/site/series identifiers.
- Physical station location.
- Live metric availability and units.
- Observation cadence and actual recent freshness.
- Historical endpoint, record length, and material gaps.
- Datum or method discontinuities.
- Provisional/revised semantics.
- Attribution/license.
- Represented reach.

Do not accept a source because a station exists on a map. Prove that the exact
series and needed live/history endpoints work.

### B2. Select source roles

- One primary hydraulic source is enough.
- Never average raw discharge or gauge height across stations.
- Select measured-temperature sources by audited priority.
- Label fallbacks and constrain claims to their reach.
- Weather is a modeled point, not measured river state.
- If no gauge passes, configure an honest no-gauge state; the river can still
  support Stage, Fish In River, and a separately accepted weather-only Activity
  model.

### B3. Date context and trend

Date averages use the same calendar date ±3 days across prior years. They are
not broad seasonal averages. The product discloses record length and window.
Missing days remain part of the freshness/coverage truth.

Twenty-four-hour change uses an accepted prior observation near the target time.
Missing prior evidence produces an unknown trend, never a fabricated stable
result.

### B4. Live Conditions gate

Test fresh, partial, delayed, older-than-24-hours, missing, fallback, historical
unavailable, and long-station-name states on narrow iOS and Android widths.

## 8. Phase C — configure all species/run truth profiles

Research all candidate species together after the foundation locks. This lets
the agent resolve river-level evidence once while preserving species-specific
truth.

For each species:

1. Complete the candidate capability audit below, then confirm the run and
   movement-engine fit.
2. Select or create an evidence-matched biology profile.
3. Set staging, entry, building, peak, tapering, ending, tail, and return
   boundaries.
4. Record which dates are directly sourced and which are owner-calibrated.
5. Set a river-specific presence ceiling and independently researched
   distribution scope.
6. Build versioned presence anchors with biological/observational reasons.
7. Define species-specific barrier response.
8. Define lifecycle and terminal behavior.
9. Configure Fishability or deterministic unavailability.
10. Complete the dedicated Activity track.

Do not infer Coho dates from Chinook, Steelhead lifecycle from salmon, or run
strength from river size or reputation.

### C1. Mandatory candidate capability audit

Before either `supported` or `unsupported` is allowed, search each candidate
independently using the scientific name and local aliases such as `king`,
`silver`, `rainbow`, and `steelhead`. Record affirmative and contradictory
findings from all applicable source classes:

1. Current agency fishery assessments and destination/species lists.
2. Current stocking database records, including the receiving water and life
   stage; hatchery production alone is not river stocking evidence.
3. Weir, ladder, harvest, egg-take, creel, and passage reports, including the
   agency technical-report archive.
4. Current agency field observations, conservation-officer reports, and advisory
   minutes.
5. Regulations and closures as context only; legal coverage does not prove a
   biological run.

Separate four questions in the packet: `occurs in system`, `recurring run`,
`dependable public opportunity`, and `calibration quality`. A sparse, stray, or
wild run may justify a lower ceiling and concentrated scope; it must not be
rewritten as absent. Weak date or abundance calibration blocks precision, not
the already-established existence of a run.

An `unsupported` decision requires affirmative exclusion evidence or a logged
contradiction search across every applicable source class. “Not found,” an
omission from a curated list, no direct stocking, and evidence for a different
season are insufficient individually or together. If existence evidence and
calibration evidence conflict, mark the combination `research_unresolved`, keep
it hidden, and escalate it for independent verification—never gray it as
unsupported.

The independent verifier must attempt to falsify every capability decision,
including checking historic reports that predate current web summaries. A
species/run cannot enter review fixtures until that contradiction search is
recorded.

## 9. Phase D — dedicated Activity track

Follow `docs/river_run_activity_onboarding_standard.md` completely.

Activity is the most calibration-sensitive public primitive. Shared scoring
mechanics do not authorize borrowed weights or thresholds.

Minimum deliverables per river/species:

- Explicit observed-river or weather-only mode.
- Source and reach contract.
- Species/lifecycle evidence.
- Component weights with rationale.
- Temperature response and constraints.
- River-behavior input and limitations.
- Restrained precipitation behavior.
- Four-block and day-rollup contract.
- Today/tomorrow schedule behavior.
- Missing-data/confidence contract.
- Multi-year replay with coverage and distribution statistics.
- Controlled single-variable tests.
- Warm/cold/extreme/missing boundary tests.
- Lifecycle continuity tests.
- State copy and foreign-geography checks.

Activity remains blocked until historical replay and owner review pass.

## 10. Phase E — write public copy

Follow `docs/river_run_copy_model.md`.

Write copy from structured state truth, not by copying paragraphs from an
existing river. Every reachable state requires:

- State key and exact trigger.
- Public label.
- One-sentence headline.
- Stage section plan when applicable.
- One to three Why This Read points.
- One prioritized Guide’s Read.
- Permanent scope note key.
- Copy version.

Copy review order:

1. Migration Stage across the full calendar.
2. Fish In River curve/direction/terminal states.
3. Fishability bands, trends, freshness, and unavailability.
4. Activity blocks, confidence, lifecycle, and today/tomorrow states.
5. Valid cross-primitive combinations.

Required leakage checks include foreign river/dam/city/station names, internal
reason codes, thresholds, weights, percentiles, engine IDs, source IDs,
configuration language, and provider implementation names.

## 11. Phase F — configuration implementation

Keep new work isolated by river and run whenever practical. Shared registries
are changed once by the integration owner after foundation and run profiles
validate.

Implementation order:

1. River profile and foundation.
2. Source configs and refresh schedule.
3. Biology profile only when an existing profile is not a genuine fit.
4. Run profiles.
5. Catalog/configuration document.
6. Review fixtures and audit artifacts.
7. UI catalog coverage and disabled-state behavior.

Requirements:

- Stable snake_case IDs.
- Version every configuration, presence curve, Activity ruleset, copy set, and
  audit.
- Keep source/provider IDs in configuration, not public prose.
- Preserve hidden legacy fields only where current engine validation requires
  them; do not expose them or let them control public acceptance.
- Do not relax validation to make incomplete research pass.
- Do not enable `publicAudit` until all gates are complete.

## 12. Phase G — replay and generated acceptance

### G1. Structural and portfolio validation

```bash
npm run river-run:onboarding:validate
npm run river-run:onboarding:audit
npm run river-run:onboarding:validate-packet -- --river-id example_river
```

The audit checks configuration validation, registry uniqueness, biology/run
matching, target-species coverage, foundation completeness, source-capability
coherence, Activity mode invariants, public-audit gates, visible primitive
order, and expected Live Conditions metrics. Packet validation fails when a
required file is absent or a template remains research-incomplete, unresolved,
pending, blocked, or unrendered.

### G2. Activity replay

Run the generic or accepted run-specific replay across the longest reliable
fixed historical window. Record why the window begins and ends where it does. Do
not select years after inspecting results solely to improve the distribution.

### G3. Fishability replay

Replay every band and trend against accepted historical hydraulics. Confirm that
rare/excessive states are reachable for defensible reasons and extreme states
never become safety advice.

### G4. State fixtures

Fixtures must declare intended state and compare it with actual production
output. A fixture that snapshots whatever the current generator emitted is not
an acceptance test.

Cover:

- All Stage substates and terminal states.
- All presence bands and directions.
- All Fishability bands/trends/freshness states or unavailable state.
- All Activity labels, confidence states, four blocks, leader ties,
  today/tomorrow states, lifecycle phases, caps, and missing modes.
- Representative valid cross-primitive tensions.
- Live Conditions fresh/partial/stale/missing/history states.

### G5. Cross-platform visual review

Review real device or faithful simulator output on iOS and Android, including
the narrowest supported widths and dynamic text wrapping. Inspect the complete
page, Gauge Read collapsed/expanded, every primitive tab, terminal states, and
long station/section names.

## 13. Definition of done

A river is onboarding-complete only when:

- Foundation, sections, barriers, and current regulations are versioned and
  approved.
- Live Conditions capability and reach are audited.
- Every supported run has independent truth, presence, Activity, Fishability,
  and copy acceptance.
- All four public primitives have complete reachable-state fixtures.
- No hidden Timing/Push surface or language is exposed.
- Activity replay coverage, distributions, boundaries, and copy invariants pass.
- Date-average ±3-day behavior and 24-hour trends pass where supported.
- Catalog species/state behavior is correct, including intentionally disabled
  combinations.
- Portfolio validation, copy QA, UI QA, type checks, and production-shaped smoke
  tests pass.
- The product owner accepts public geography, copy, and visual output.
- Deployment and enablement remain unperformed unless separately authorized.

## 14. Multi-agent operating protocol

The preferred future team structure is:

| Role                   | Owns                                                                    | Must hand off                                      |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| River lead             | Foundation, source reach, sections, barriers, regulations, decision log | Approved foundation version and unresolved list    |
| Species/run researcher | Calendar, presence, lifecycle, biology evidence                         | Completed run truth packet with evidence IDs       |
| Activity specialist    | Calibration, replay, boundary tests, Activity copy states               | Versioned rules and replay report                  |
| Copy reviewer          | Four-primitive state matrix and geography/certainty checks              | State-by-state corrections and copy version        |
| Integration owner      | Configuration, registries, fixtures, shared QA                          | Clean diff, commands, results, acceptance artifact |
| Independent verifier   | Re-runs gates and inspects claims against evidence                      | Pass/fail report; no silent fixes                  |

Parallel work begins only after the river foundation locks. Give each agent
isolated files. Only the integration owner edits shared registries. A handoff
must state files changed, commands/results, citations, owner-calibrated
decisions, unresolved issues, and whether deployment or enablement occurred.

## 15. Required agent start response

Before changing a future river, an agent must be able to state in its own words:

- The four visible primitives and their ownership.
- Why Live Conditions is separate and unscored.
- The river-level versus run-level split.
- The barrier/passage fail-closed rule.
- The difference between observed-river and weather-only Activity.
- Why Activity requires a river/species replay.
- The date-average ±3-day rule.
- The separation of acceptance, deployment, and public enablement.

If the agent cannot do so after reading the standards, it is not ready to
onboard the river.
