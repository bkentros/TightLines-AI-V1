# River Run Copy Model and River Onboarding Standard

**Status:** Normative product standard
**Version:** 1.6
**Established:** 2026-08-09
**Applies to:** Every existing and future River Run river, species, run, state,
and public copy surface

## 1. Purpose and authority

This document defines how FinFindr researches river geography and turns River
Run determinations into consistent public copy. It exists so that every river
feels like part of one product while remaining accurate to that river's
geography, barriers, data coverage, species biology, and seasonal run.

This document is the controlling standard for:

- Public section definitions and geographic wording.
- Dam, weir, falls, fish-passage, closure, and upstream-limit research.
- The public meaning and copy ownership of all six primitives.
- Copy structure, length, tone, certainty, and required limitations.
- State-by-state copy generation and review.
- Copy QA, cross-primitive consistency, and river onboarding acceptance.

`docs/river_run_onboarding_template.md` remains useful for provider,
calibration, baseline, replay, and publication work. Engine specifications and
accepted run research remain authoritative for scoring behavior. When older
documentation conflicts with this document about public copy, geography, the
number of primitives, or copy acceptance, this document controls. When code,
research, and this standard disagree, an agent must stop, document the
mismatch, and resolve it explicitly rather than silently choosing one.

This standard does **not** authorize an agent to change a determination merely
to make copy easier. Copy must first explain the accepted engine result. A
suspected scoring defect must be reported and handled separately from a copy
rewrite.

## 2. Non-negotiable product principles

1. **Research the river before writing species copy.** Public geography is a
   river-level fact and must not be reinvented for each species.
2. **Every material barrier must be known.** A dam, weir, falls, seasonal
   barrier, lamprey barrier, fish ladder, closure, or uncertain passage point
   within the relevant migratory corridor must be researched and recorded.
3. **Never assume fish passage.** The presence of a ladder, gate, bypass, or
   historical passage claim does not prove current, unrestricted, or
   species-neutral passage.
4. **Never use a naked geographic direction.** Terms such as `upper river`,
   `middle river`, `below the dam`, or `upstream` must refer to an approved
   river section or named boundary that a user can understand.
5. **One primitive, one job.** Copy must not borrow another primitive's
   conclusion.
6. **Preserve the determination.** Simplification may remove filler but may not
   change strength, direction, confidence, seasonal meaning, or a material
   limitation.
7. **Write to the evidence's true reach.** A gauge, temperature station, or
   weather point must not be described as representing more river than the
   accepted source audit supports.
8. **Separate expectation from observation.** Calendar and historical curves
   describe what is seasonally expected; they do not confirm live fish.
9. **Use plain angler language.** Copy must be immediately understandable to a
   new user without becoming simplistic or technically false.
10. **Fail closed.** If geography, passage, capability, source scope, or a
    material fact is unresolved, do not publish confident location guidance.
11. **Do not reference a feature that does not exist.** Copy may mention a
    destination primitive or seasonal experience only when that capability is
    implemented and available to the selected river/run.
12. **River Run is not a safety system.** It does not determine whether wading,
    boating, floating, access, ice, or personal conditions are safe.
13. **A tailwater emphasis is not automatically a public section.** When an
    immediate dam area sits inside a larger approved Upper river, use it as an
    emphasis or landmark within that section instead of creating a fourth
    competing geography.
14. **Do not infer a Steelhead strain from timing alone.** Unless the engine has
    direct evidence for strain identity, describe unusually early fall fish as
    `early Steelhead`; do not label them Skamania, summer-run, or winter-run in
    public copy. When current authoritative stocking or management evidence
    proves that a separate strain is established in the selected river, copy
    may name it as separate seasonal context. It still may not identify an
    individual fish's strain from its capture date or use one fish to prove a
    broader run state.
15. **Describe the river, not the product's approval process.** Public copy must
    state the seasonal or environmental fact directly. It must not qualify that
    fact with internal workflow terms such as `accepted`, `configured`,
    `owner-approved`, `research-approved`, `audited`, or `calibrated`. For
    example, write `The river-entry window has not opened yet`, never `The
    accepted river-entry window has not opened`.

## 3. The three-layer model

All River Run copy must be derived from three layers. Whole paragraphs must not
be copied from another river and lightly renamed.

### Layer A: Primitive truth

The invariant product meaning of the primitive and its state. `Strong Push`
must mean the same kind of conclusion on every river even though its inputs and
thresholds are river- and species-specific.

### Layer B: River geography and source coverage

The ordered migratory corridor, public sections, barriers, closures, upstream
limit, gauge reach, temperature reach, and weather scope.

### Layer C: Species/run behavior

The run calendar, distribution pattern, historical strength, seasonal presence
curve, lifecycle, migration-temperature response, run type, and any valid
handoff to another implemented experience.

The final copy combines these layers. Layer A supplies consistency. Layers B
and C supply river- and species-specific truth.

## 4. Required River Geography Profile

No river/species copy renovation or new onboarding may begin until the River
Geography Profile is researched, reviewed, and locked for the work pass.

### 4.1 River identity

Record:

- Stable river ID and public name.
- State or states, timezone, mouth waterbody, and flow direction.
- Relevant migratory mainstem and any tributary that public copy may name.
- Downstream entry point and farthest accepted upstream migration boundary.
- Authoritative maps and current source citations.
- Date on which every material geographic fact was last verified.

### 4.2 Public sections

Define two to four ordered public sections. Three is the preferred default when
the river supports it. Section count must follow the actual corridor, not force
every river into lower/middle/upper language.

Each section requires:

| Field | Requirement |
| --- | --- |
| `sectionId` | Stable internal ID; never a prose sentence. |
| `publicLabel` | Short user-facing name such as `Lower river` or `Upper accessible corridor`. |
| `orderFromMouth` | Integer establishing downstream-to-upstream order. |
| `downstreamBoundary` | Named, user-recognizable boundary. |
| `upstreamBoundary` | Named, user-recognizable boundary. |
| `anchorNames` | Only landmarks that may appear in public copy for this section. |
| `migrationAccessible` | `yes`, `no`, `seasonal`, or `unknown`, with species qualification when needed. |
| `sourceCoverage` | Which live sources can responsibly describe this section. |
| `notes` | Important interpretation, access, regulation, or uncertainty notes. |
| `citations` | Authoritative sources supporting boundaries and passage. |

Rules:

- Section boundaries are orientation ranges, not implied legal or public-access
  guarantees.
- Adjacent section boundaries must not leave unexplained gaps or overlaps.
- Public landmarks must appear in only the correct river profile.
- Before implementation, the product owner must approve the exact public
  Lower/Middle/Upper definitions and confirm that their endpoints are
  recognizable to regular anglers. Technical correctness alone is not enough.
- `Upper` always means upper **accessible migratory** water unless the copy
  explicitly states otherwise.
- A river with a short accessible corridor may use named corridor segments
  rather than lower/middle/upper.
- A river with a major barrier should normally name the upper section
  `Upper accessible corridor` and include the barrier in its boundary.
- A structure may be the product's public upstream limit even when official
  sources document limited or conditional biological passage. Store passage
  and product scope separately; never rewrite `limited passage` as
  `impassable`.
- A corridor with several passable dams must still use a small, stable public
  section model. Define sections with recognizable boundary landmarks; do not
  turn every ladder, dam, city, or jurisdiction crossing into a public section.
- Keep the complete passage sequence in the river foundation, barrier
  inventory, and permanent scope material. Routine rotating state copy should
  name the approved section and endpoint, not recite every intermediate
  passage facility.

### 4.3 Mandatory dam and barrier inventory

Every onboarding or renovation pass must actively investigate barriers. The
agent may not rely on memory, existing copy, a general map, or the absence of a
dam in current configuration.

Research all plausible barrier types within or immediately affecting the
relevant corridor:

- Hydroelectric, flood-control, diversion, mill, and low-head dams.
- Weirs, lamprey barriers, seasonal gates, and temporary control structures.
- Natural falls or rapids documented as migration barriers.
- Fish ladders, lifts, bypasses, and operational passage programs.
- Removed, breached, proposed-for-removal, reconstructed, or defunct barriers.
- Signed fishery closures or exclusion zones associated with a structure.
- Tributary barriers only when copy recommends, names, or relies on that
  tributary.

For each barrier, record:

| Field | Requirement |
| --- | --- |
| `barrierId` | Stable identifier. |
| `officialName` | Current authoritative name. |
| `alternateNames` | Historic, local, and mapping names used during research. |
| `type` | Dam, weir, falls, seasonal structure, closure, or other. |
| `location` | Coordinates, river mile when available, and containing section. |
| `status` | Active, removed, breached, seasonal, proposed, or uncertain. |
| `lastVerifiedOn` | Required date. |
| `passageBySpecies` | Chinook, Coho, Steelhead, or other supported species; never assume one answer applies to all. |
| `passageConditions` | Ladder operation, seasonal restrictions, flow dependence, or other conditions. |
| `publicUpstreamLimit` | Whether River Run may recommend water above it. |
| `closureOrRegulation` | Current signed or legal restriction and authoritative source. |
| `copyInstruction` | Exact public boundary wording or instruction to omit it. |
| `citations` | Sources supporting existence, status, and passage. |
| `confidence` | Confirmed, qualified, or unresolved. |

Research standard:

1. Search current authoritative sources first: state fish and wildlife agency,
   USGS, USFWS, NOAA, USACE, FERC, tribal authority, municipal owner, or the
   documented structure operator.
2. Search the official name and all reasonable historic/local names.
3. Verify both structure **existence/status** and **fish passage**. These are
   separate facts.
4. Use at least one authoritative source for every material barrier. Use a
   second independent authoritative source when passage or a legal boundary
   changes where the app sends users.
5. Reverify current operational status and regulations before public release.
   A prior-year build audit is not sufficient for a time-sensitive rule.
6. Store citations and the verification date in the river research/audit
   material even when public copy remains simple.
7. If passage remains unresolved, mark it `unknown`, end the recommended public
   corridor below the barrier, and fail any copy that confidently recommends
   above-barrier water.

Prohibited shortcuts:

- Treating a fish ladder as proof that all supported species pass freely.
- Treating a removed building or defunct operation as proof that the in-river
  barrier was removed.
- Borrowing another river's dam behavior.
- Saying `wherever passage is open` instead of researching the actual river.
- Saying `except above dams or barriers` as generic filler.
- Omitting a known barrier because it complicates lower/middle/upper wording.

### 4.4 Live-source coverage map

For every hydraulic gauge, measured-water station, and weather point, record:

- Exact source ID and public source label.
- Physical location and containing public section.
- The reach it can responsibly represent.
- Whether it is upstream or downstream of a barrier.
- Whether it is a primary source or a labeled fallback.
- Positive-credit restrictions for upstream/downstream fallbacks.
- Known regulated-tailwater, tributary, confluence, or watershed limitations.

Public copy may say `the river` only when the accepted audit supports a
river-wide interpretation. Otherwise it must name the source or its accepted
reach, for example `Scottville flow` or `the Niles mainstem reading`.

## 5. Required Species/Run Truth Profile

After river geography is locked, research and record each supported species/run
as a separate truth profile.

Required fields:

- Species and public species name.
- Season and run type.
- Implemented movement-engine fit.
- Pre-run, staging, beginning, building, peak, tapering, ending, late-tail, and
  offseason boundaries as applicable.
- Historical presence ceiling and evidence.
- Distribution scope: concentrated, sectional, or broad.
- Presence-curve anchors and direction.
- Expected section progression through the run.
- Species-specific response to every known barrier.
- Push temperature behavior and movement constraints.
- Activity biology and lifecycle behavior.
- Whether fish leave, spawn and die, remain, or hand off to another season.
- Destination capability for any handoff. A configured future destination is
  not an implemented feature.
- Evidence notes, citations, owner-calibrated assumptions, and uncertainty.

Do not infer one species from another. Shared hydraulics do not imply shared
calendar, passage, abundance, distribution, temperature response, lifecycle,
or copy strength.

## 6. Primitive ownership and public meaning

Public naming in this standard is canonical:

1. Migration Stage
2. Migration Timing (`conditionsSuggest` may remain an internal identifier)
3. Push
4. Fishability
5. Activity Outlook
6. Fish In River

### 6.1 Migration Stage

**Owns:** The researched calendar phase and the seasonally appropriate section
in which to start.

**Does not own:** Live abundance, confirmed distribution, today's movement,
presentation quality, responsiveness, or catch probability.

Stage statements must use expectation language when discussing fish:

- `Seasonal timing supports...`
- `Fish are most likely...`
- `This phase usually...`
- `Earlier arrivals may...`

Stage statements must not use calendar alone to say:

- `Fish can now be found throughout the river.`
- `Good numbers are present.`
- `The river has filled in.`
- `Fish have reached the upper river.`

Those are live-sounding claims that Stage cannot confirm.

`WHERE TO START` belongs to Migration Stage. It must contain:

1. One primary approved section.
2. At most one secondary approved section.
3. A concrete condition for using the secondary section.

It should not contain a long list of holes, bends, seams, gravel, access sites,
or tactics. Habitat and presentation order belong in `GUIDE'S READ`.

Canonical Stage state intents:

| State/variant | Invariant copy intent |
| --- | --- |
| Offseason / Fall run complete | This run model is inactive; name the species-specific staging checkpoint when the model resumes. |
| Before staging | Dependable river entry is not expected; nearby lake/harbor context may be named only when researched. |
| Staging | Nearby-water staging is plausible; any in-river fish are exceptions. |
| Beginning | Begin in the first accessible lower section. |
| Building—early | Lower remains primary; first middle holding section becomes secondary. |
| Building—established | Middle becomes primary; upper accessible water is conditional. |
| Building—broad | Middle and upper accessible sections are both credible; state the primary order. |
| Peak | Compare approved core sections; do not claim live fish everywhere. |
| Tapering / Late fall | Favor established holding sections; fresh lower travel water requires a Push. |
| Ending / Holding transition | Narrow to the most dependable established sections and match species lifecycle. |
| Late post-run tail | No dependable broad start; any recommendation must be explicitly low-confidence and narrow. |
| Handoff | Name the destination only if implemented; otherwise state that this model is complete. |

Off-season return copy is required. Derive it from the configured staging or
tracking boundary rather than using one universal month:

- Fall-spawn salmon: label the completed state `Fall run complete`, state when
  that species typically begins staging, and tell the user to check back then.
- Fall-entry Steelhead without an implemented destination experience: label
  the state `Fall entry complete`, state when fall movement tracking resumes,
  and do not imply that Steelhead left the river.
- Prefer `staging typically begins` or `fall movement tracking resumes` over
  `the fishing season starts`. The latter can be mistaken for a regulation.
- The normal Staging or monitoring state replaces the return message on the
  configured boundary date.

### 6.2 Migration Timing

**Owns:** Whether cumulative season-to-date river-rise response and cooling are
developing ahead of, close to, or behind the accepted historical pattern.

**Does not own:** Today's Push, exact location, live abundance, or a new Stage
date.

Timing language must accurately reflect cumulative evidence. Prefer:

- `River-rise activity and cooling have been stronger than usual.`
- `River-rise activity and cooling are close to the usual pattern.`
- `River-rise activity and cooling have been weaker than usual.`

Avoid wording that incorrectly implies only net river level or today's change.

Location guidance is a modifier of Migration Stage:

- Ahead: shift one approved section upstream from Stage's normal primary.
- Typical: keep Stage's normal primary.
- Delayed: shift one approved section downstream from Stage's normal primary.
- Mixed, reversal-tempered, Evaluating, or Insufficient: do not shift Stage.

The section shift must clamp to the accessible section graph. It may never jump
past a dam, closure, unknown passage point, or the configured upstream limit.

Canonical Timing states and variants:

- Not monitoring yet.
- Evaluating / collecting the first read.
- Ahead.
- Typical.
- Delayed.
- Typical because hydraulic and temperature signals are strongly mixed.
- Typical because an Ahead/Delayed reversal was tempered.
- Insufficient evidence, with the actual missing/mismatched evidence named.
- Timing complete while the run is underway.
- Timing complete after the run.
- Timing complete at a valid implemented handoff.

### 6.3 Push

**Owns:** Whether current measured water supports a fresh movement event.

**Does not own:** Proof that fish entered, abundance, calendar timing, exact fish
location, general fishability, or safety.

The three allowed `WHY THIS READ` jobs are:

1. Measured hydraulic response and its reach.
2. Measured water-temperature state and trend.
3. The single most material rain, cap, freshness, fallback, or uncertainty fact.

Rain must not be double counted after a measured rise. Copy should say this in
plain language only when it materially explains the result, such as `The gauge
already reflects the rain response, so rain adds no extra credit.`

Canonical Push states and variants:

- Offseason.
- Waiting for migration.
- Weak.
- No clear push.
- Possible.
- Strong.
- Very strong.
- Warm, cold-holding, high-flow, severe-flow, stale, unknown-trend, fallback,
  and no-gauge-response caps.
- Missing gauge, missing measured temperature, or unsupported run unavailable.
- Migration complete or valid implemented handoff.

The static primitive note must say: `Support for fresh movement—not proof of
new arrivals.`

### 6.4 Fishability

**Owns:** How the flow represented by the configured gauge should affect
presentation control and the shape of practical fishing water.

**Does not own:** Fish abundance, run timing, Push, responsiveness, bite
quality, access status, wading safety, boating safety, or every reach.

Available `WHY THIS READ` copy should normally contain two points:

1. The local flow band and resulting fishing shape.
2. The local trend and how it changes presentation water.

The source/reach limitation belongs in a persistent scope note rather than a
third repeated bullet.

Canonical states:

- Poor.
- Tough.
- Fishable.
- Good.
- Excellent.
- Stale reading.
- Unknown trend.
- Missing gauge unavailable.
- Missing local bands unavailable.

`GUIDE'S READ` may recommend presentation water and control. It must not tell a
user that entering, wading, boating, or floating the river is safe. In an
extreme-flow/Poor state, prefer another day and authoritative local guidance;
do not soften the conclusion with `if you fish now` tactical encouragement.

The static primitive note must say: `Presentation conditions—not fish
abundance or a safety determination.`

### 6.5 Activity Outlook

**Owns:** Conditional responsiveness of fish already present and differences
among supported time blocks.

**Does not own:** Abundance, migration movement, catch probability, exact fish
location, or proof of feeding.

Canonical labels:

- Inactive.
- Reserved.
- Moderate.
- Active.
- Highly active.

Required variants include:

- Today and tomorrow.
- Full, Moderate, and Limited confidence.
- Conditional staging presence.
- Missing weather, missing measured temperature, missing river behavior, and
  weather-only behavior.
- Warm/cold/extreme-flow caps.
- Salmon tapering, ending, and late biological uncertainty.
- Steelhead late-fall and holding behavior only while the configured model is
  valid.

`WHY THIS READ` may contain at most three points:

1. Overall responsiveness interpretation.
2. Strongest time block and primary driver, or an explicit statement that
   available inputs do not separate the blocks.
3. The most important limitation, lifecycle qualification, or confidence fact.

Rules:

- Do not name a strongest time block when blocks are tied within the accepted
  display tolerance or when the inputs needed to distinguish them are absent.
- When two leading blocks are within that tolerance, name both and plainly say
  that neither has a clear advantage. Do not describe all four blocks as
  indistinguishable when only the leaders are tied.
- Do not mention a forecast when hourly forecast data is absent.
- Inactive guidance must not simply say `Start with 5–9 AM.` It must say no
  block is broadly favorable and may identify only the least constrained block.
- Staging output must place the sparse-early-fish condition in the headline or
  immediately visible copy, not bury it in a dropdown.
- A post-run score must not imply that an unimplemented winter experience is
  available.

The static primitive note must say: `Responsiveness if fish are present—not
abundance or catch probability.`

### 6.6 Fish In River

**Owns:** Approximate seasonal presence relative to the researched ceiling for
that river/species/run.

**Does not own:** A live fish count, today's Push, current responsiveness,
Fishability, or a specific pool.

Canonical states and directions:

- Offseason.
- Not expected yet.
- Low, Limited, Moderate, High, and Peak for this river.
- Rising, near peak, and falling.
- Migration complete.
- Retained winter presence only when the fall-entry handoff is researched and
  the public behavior is explicit.

When a fall-entry model ends without an implemented destination experience,
Fish In River must return no current score. `Fall entry complete` may explain
that fish can remain, but it must not freeze the final fall value into winter
or spring.

Terminal-state display rules:

- `Fall run complete` and `Fall entry complete` render no score and no meter
  marker.
- Compact tab status may shorten either label to `COMPLETE`; expanded copy must
  preserve the exact terminal-state meaning.
- Do not replace a missing current score with zero. Zero is a scored seasonal
  estimate; complete means the model is inactive.

Public numeric standard:

- Preserve the exact internal score and curve fraction for engine logic.
- Display the public score in five-point increments on the 0–100 scale,
  equivalent to half-point increments on the original 0–10 scale.
- Prefix every intermediate displayed estimate with `≈`, including an internal
  value that already lands on a five-point increment.
- Quantization must be state-preserving: choose the nearest five-point value
  that remains inside the already-determined Low/Limited/Moderate/High/Peak
  band relative to the configured river ceiling.
- Zero remains zero. A ceiling remains exact. A winter retained-presence value
  may round to the nearest five because its state is `Winter holding`, not a
  Low-to-Peak band.
- Never recompute or change the engine determination merely to match a rounded
  display.
- The public meter marker and public text must use the same rounded display
  value. Raw scores remain available only to engine logic and diagnostics.

The static primitive note must say: `Seasonal estimate—not a live fish count or
today's conditions.`

## 7. Structured copy contract

The target model is structured copy. Current string fields may remain as a
rendering/transport format during migration, but canonical copy should be
authored and tested as these logical parts:

```ts
type RiverRunCopyState = {
  stateKey: string;
  headline: string;
  sectionPlan?: {
    primarySectionId: string | null;
    secondarySectionId?: string | null;
    secondaryTrigger?: string | null;
    avoidSectionIds?: string[];
  };
  whyPoints: string[];
  guide: string;
  scopeNoteKey: string;
  copyVersion: string;
};
```

### 7.1 Headline

- One sentence.
- Usually 8–16 words; hard maximum 22 words unless a documented geographic
  qualifier is essential.
- State the determination and the most important qualification.
- Do not repeat the primitive title.
- Do not include tactics, thresholds, implementation terms, or multiple
  fallback clauses.

### 7.2 Where to Start

- Rendered only when the primitive legitimately owns geographic starting
  guidance; Migration Stage is the primary owner.
- Name one primary section.
- Name at most one secondary section and its trigger.
- Target maximum 30 words.
- Use approved section labels and anchors only.
- Do not mix section selection with a long habitat checklist.
- Never recommend an inaccessible, closed, or unresolved section.

Preferred form:

> Start in the Middle river (Scottville–Maple Leaf). Add the Upper river
> (Maple Leaf–M-37) only when direct fish activity supports the move.

Barrier form for a confirmed impassable boundary:

> Start in the Upper accessible corridor, ending below the confirmed barrier.

Public-endpoint form when passage is limited, conditional, or outside product
scope:

> Start in the US-31–Homestead reach. River Run guidance ends at the current
> signed Homestead closure.

The second form sets the product boundary without claiming fish cannot pass.

### 7.3 Why This Read

- One to three bullets.
- One complete claim per bullet.
- Target maximum 20 words per bullet; hard maximum 26.
- No semicolon or em dash may be used to hide two unrelated claims in one
  bullet.
- Order bullets from determination driver to limitation.
- Include only factors that materially explain the result.
- Do not repeat the headline, Guide's Read, or permanent scope note.
- Do not expose internal scores, weights, thresholds, percentiles, checkpoint
  dates, rule IDs, or engine names.
- Do not expose internal approval or configuration language. State what is
  happening, unavailable, or not yet supported in plain user-facing terms.

### 7.4 Guide's Read

- One concrete action plan.
- One or two short sentences; target maximum 36 words.
- Lead with the first action.
- Respect primitive ownership.
- When evidence is unavailable, say what not to infer and what valid source of
  information to use instead.
- Do not return the decision to the user with unprioritized choices.
- Do not promise fish, a bite, success, access, or safety.

### 7.5 Permanent scope note

Each primitive has one persistent interpretation boundary. Do not repeat that
sentence in every `WHY THIS READ` state. The UI must keep the note available
without forcing the state copy to carry it as filler.

### 7.6 Tone and terminology

Use:

- Short sentences.
- Concrete subjects: `Scottville flow`, `measured water temperature`,
  `seasonal timing`, `hourly weather`.
- `Likely`, `supports`, `suggests`, and `typically` when evidence is
  probabilistic.
- Consistent public species naming and capitalization within the product.

Avoid:

- `Conditions look good.`
- `The river will decide.`
- `Fish should be everywhere.`
- `The river is full.`
- `A fresh wave entered.`
- `Upper river` without its approved definition.
- Filler such as `at this point in the seasonal pattern`, `it is important to
  remember`, `in terms of`, or repeated `this read` disclaimers.
- Public mentions of configuration machinery.
- Borrowed landmarks, rivers, dams, or source names.

## 8. Cross-primitive consistency rules

Some combinations are valid and must not be “corrected” through copy:

- Strong Push with Tough or Poor Fishability.
- Good or Excellent Fishability with Low Fish In River.
- Peak Migration Stage with Weak Push.
- Delayed Migration Timing with a Strong current Push.
- Highly Active conditions with Limited seasonal presence.
- High Fish In River with Inactive responsiveness.

When such a combination is material, use the shared interpretation surface to
explain it. Do not weaken either primitive to make the page look simpler.

Invalid copy contradictions include:

- Stage claims fish are present everywhere while Fish In River is zero or low.
- Timing sends the user past an inaccessible barrier.
- Fishability claims the whole river from a reach-limited gauge.
- Activity treats abundance as a reason for a high responsiveness score.
- Push says fish moved rather than that conditions support movement.
- A winter handoff tells the user to open an unavailable experience.

## 9. Required state matrix

Every river/species/run must have an auditable matrix containing:

- Every canonical public label.
- Every calendar substate that changes copy.
- Rising, near-peak, and falling presence copy.
- Every material Push cap and data-quality state.
- Every Fishability band and trend variant.
- Every Activity confidence, lifecycle, weather, and tie state.
- Every Timing evidence, mixed-signal, reversal, insufficient, and complete
  state.
- Offseason, staging, late-tail, migration-complete, and handoff behavior.
- Representative valid cross-primitive combinations.

Each scenario must declare:

- Intended primitive and state.
- Exact input reason for reaching it.
- Actual rendered label.
- Actual headline, Why points, Guide's Read, section plan, and scope note.
- Expected river and species identifiers.

Fixture generation must fail when intended and actual labels differ. A fixture
that merely reproduces the generator's current output is not an acceptance
test.

## 10. Automated copy gates

Before owner review, require all applicable checks to pass:

### Geography and barrier gates

- Every public section ID resolves to the selected river.
- All recommended sections are migration-accessible for the selected species.
- No recommendation crosses a confirmed or unresolved upstream limit.
- Every material dam/barrier has a verification date and citation.
- Barrier-aware rivers mention the approved accessible boundary wherever
  `upper` could otherwise mislead.
- Multi-passage corridors use their approved section model and reject routine
  city-by-city, dam-by-dam, or ladder-by-ladder itineraries in state copy.
- Dam-free copy does not contain generic dam/barrier filler.

### Leakage and capability gates

- A river-specific denylist rejects every other river's names, landmarks,
  dams, gauges, and cities.
- Species copy does not name another species unless the state explicitly
  compares valid seasonal alternatives.
- Copy cannot reference a primitive or seasonal experience whose capability is
  not implemented and available.
- Every primitive, including Activity, carries a copy version.

### Copy-quality gates

- Headline, Where to Start, Why-point count, bullet length, and guide length
  satisfy this standard or have a documented exception.
- Why points contain complete, independently understandable claims.
- Repeated permanent disclaimers are absent from state bullets.
- No prohibited certainty or filler phrase appears.
- No public internal threshold, date machinery, percentile, weight, engine ID,
  reason code, `curve`, `modeled`, or similar implementation language leaks
  into copy.
- No public copy contains internal workflow qualifiers such as `accepted`,
  `configured`, `owner-approved`, `research-approved`, `audited`, or
  `calibrated`.
- Missing inputs cannot produce a specific strongest window or location that
  those inputs would be needed to support.
- Completed salmon and Steelhead states are consistent across primitives,
  expose no active seasonal score, and never hand users to an unimplemented
  seasonal experience.

### Determination and contradiction gates

- Intended fixture state equals actual rendered state.
- Copy strength agrees with the actual state and caps.
- Rounded Fish In River display remains in its determined public band.
- Stage uses expectation language rather than live confirmation.
- Valid cross-primitive tensions remain intact and receive an interpretation
  note when needed.
- Invalid contradictions fail QA.

### Safety and regulatory gates

- No primitive claims wading, boating, floating, access, ice, or personal
  safety.
- Extreme Fishability states do not encourage risky entry as a fallback.
- Time-sensitive closures and regulations are reverified before release.
- Copy distinguishes an orientation boundary from a legal access promise.

## 11. Fast river renovation and onboarding workflow

The product owner intends to renovate and onboard rivers efficiently. Use three
phases per river, not a separate phase for every primitive or species.

### Phase 1: River foundation and decision lock

Complete once for the river:

1. Inspect current code, copy, fixtures, tests, and research notes.
2. Research and lock the River Geography Profile.
3. Complete the dam/barrier inventory and current passage verification.
4. Map live-source reach coverage.
5. Complete or verify all species/run truth profiles together.
6. Identify scoring defects separately from copy defects.
7. Resolve shared product decisions such as handoffs, numeric display, section
   names, and permanent scope notes.
8. Obtain explicit product-owner approval for the exact public section
   definitions and recognizable endpoint landmarks.

**Gate:** No state copy implementation begins until geography, barriers,
source scope, public section definitions, recognizable endpoint landmarks, and
unresolved product decisions are explicit and the section language is approved
by the product owner.

### Phase 2: One bundled copy implementation

Implement all supported species for the river in one pass:

1. Apply the canonical state registry and structured copy contract.
2. Rewrite all six primitives and all reachable states.
3. Preserve engine determinations and river/species differences.
4. Add/update fixtures and automated gates in the same change.
5. Remove stale, duplicated, leaked, or capability-invalid copy.
6. Regenerate review artifacts from production scoring code.

This is one implementation phase even though work may be internally ordered by
primitive.

### Phase 3: One acceptance and correction pass

1. Run the complete state matrix and automated copy gates.
2. Review all species together in the in-app gallery/device surface.
3. Record owner feedback by state and primitive.
4. Make one consolidated correction pass.
5. Rerun tests, generate the final audit, version the copy, and obtain explicit
   owner acceptance.
6. Keep public enablement/deployment as a separate authorized release action.

Do not split ordinary wording review into repeated research, species, primitive,
and cleanup phases. Split only when a real scoring, research, safety, legal, or
product-capability decision blocks the bundled pass.

## 12. Required audit artifact

Every completed river must have a concise versioned audit recording:

- Geography profile and approved public sections.
- Dam/barrier inventory, status, passage conclusion, citations, and
  verification date.
- Gauge/temperature/weather source scopes.
- Supported species/runs and copy versions.
- State-matrix scenario count and coverage.
- Known owner-calibrated assumptions.
- Copy defects corrected.
- Scoring defects corrected or explicitly deferred.
- Automated commands and results.
- Owner acceptance date.
- Public release status, which remains separate from copy acceptance.

## 13. Definition of done

A river is copy-complete only when:

- Geography was researched before species copy.
- Every material dam/barrier is confirmed, qualified, or conservatively treated
  as unresolved.
- Every public section has unambiguous named boundaries.
- All supported species use the same primitive and state model.
- All six primitives and all reachable states have canonical copy.
- Copy is simple without changing any determination.
- Why This Read never exceeds three meaningful points.
- Stage owns starting geography; other primitives modify or inform it without
  replacing it.
- Source-limited primitives state the correct reach.
- No foreign geography or unavailable feature reference remains.
- Fish In River precision follows the public quantization standard.
- All state, geography, barrier, capability, copy-quality, contradiction, and
  safety gates pass.
- The product owner has reviewed the generated states and explicitly accepted
  the river.

## 14. Instructions for future agents

When asked to configure or renovate a River Run river:

1. Read this file completely before changing code or copy.
2. Inspect the current implementation and working tree; do not assume older
   audit documents match current behavior.
3. Explain the six primitives and their ownership boundaries in your own words.
4. Produce or verify the River Geography Profile first.
5. Explicitly report the dam/barrier research result, including a confirmed
   `none in the relevant corridor` conclusion when applicable. Silence is not a
   barrier audit.
6. Produce or verify the live-source coverage map.
7. Audit all supported species for the river together.
8. Separate scoring defects from copy defects and obtain direction when a fix
   would change the accepted determination.
9. Implement the river in the three phases in Section 11.
10. Do not claim completion until the complete state matrix and gates pass.

The goal is not for every river to use identical sentences. The goal is for
every river to use the same reasoning, structure, certainty, primitive
boundaries, and quality standard while expressing the facts that make that
river and species distinct.
