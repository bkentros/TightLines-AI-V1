# River Run Agent Handoff

> **Historical handoff — superseded 2026-08-24.** Its branch checkpoint,
> five-primitive UI, and immediate-task instructions are no longer current.
> Future onboarding agents must use
> `docs/river_run_rapid_onboarding_playbook.md`. This file remains only as an
> implementation-history reference and must not override the current four
> visible primitives or Live Conditions contract.

This document is the durable engineering and product handoff for FinFindr's
River Run feature. Read it before modifying River Run. The implementation is the
ultimate source of truth when this document and code differ.

## Repository Checkpoint

- Working branch: `release/app-store-v1`
- Completed River Run checkpoint: `a5b7262`
- Checkpoint title: `Add River Run agent handoff`
- The checkpoint was pushed to `origin/release/app-store-v1`.
- Confirm the current branch, remote synchronization, and clean working tree
  before beginning new work.
- Committed code and migrations are not proof that the corresponding Supabase
  migration and Edge Function version have been deployed.

## Immediate Next Task

Do not begin by changing code.

The owner will use the in-app review gallery to inspect every reachable result
state for all five primitives. Here, "state" usually means a primitive result or
classification state rather than a geographic state.

During this review:

1. Listen to the owner's feedback on one result state at a time.
2. Critique clarity, usefulness, ambiguity, overclaiming, repetition,
   contradictions, and guide-level accuracy.
3. Explain recommended wording before making a non-obvious change.
4. Preserve the primitive's exact classification, evidence, limitations, and
   relationship to the other primitives.
5. Keep one canonical production template for each reachable primitive state.
6. Re-run copy safety, fixture, contradiction, UI, visual, and type checks.
7. Keep commits intentional and leave the repository clean when asked.

## Product Purpose

FinFindr is a premium, image-forward fishing app. River Run gives Great Lakes
migratory anglers a disciplined read of a specific river, species, run, and
season without pretending to count fish or guarantee fishing success.

The feature should feel useful to a beginner and credible to an experienced
Great Lakes migratory guide. UI quality, copy quality, evidence quality, and
logical consistency are equally important.

The long-term architecture is plug-and-play. After an appropriate movement
engine exists, adding a river/run should primarily require researched
configuration and acceptance testing—not new one-off scoring code.

## Non-Negotiable Principles

### Fail closed instead of guessing

The engine must never invent missing knowledge. Missing, stale, mismatched, or
insufficient critical evidence should produce an honest conservative state such
as `Unavailable`, `Limited`, `Evaluating`, or `Insufficient evidence`.

### Keep the model intentionally small

Use only variables that materially answer the primitive's question.

- Air temperature was deliberately removed.
- A river is unsupported without an audited measured water-temperature source.
- Flow is the primary hydraulic measurement for PM.
- Gauge height can be context but is not currently scored for PM.
- Modeled precipitation is supporting evidence and cannot replace measured river
  response.

### Keep all five primitives independent

The primitives can disagree because they answer different questions. A valid
disagreement must be explained and must never look like an accidental
contradiction.

Examples:

- Excellent Fishability can coexist with low Fish In River.
- Strong Push can coexist with poor Fishability.
- Run Timing can remain Delayed while a strong current Push occurs.
- Run Stage remains calendar-fixed even when Run Timing is Ahead.

### Scores and copy must agree

Copy is part of the product logic. It must not be treated as decoration.

Every result should:

- Explain what was determined.
- Explain the most important reason.
- Tell the angler how to use the information.
- State material limitations without burying the value.
- Avoid claims the evidence cannot support.

River Run does not:

- Count fish.
- Confirm fish entered or moved.
- Predict a bite.
- Rate wading, boating, floating, or personal safety.
- Treat one gauge as a perfect description of the entire river.

## The Five Primitives

### 1. Run Stage

Run Stage is the fixed researched seasonal calendar.

Reachable stages:

- Pre-run
- Beginning
- Building
- Peak
- Tapering
- Ending
- Post-run

Weather and water conditions cannot move these configured dates. Pre-run may
include a separate nearby staging advisory. That advisory may acknowledge rare
early river fish when the river-specific research supports it, but it must
clearly separate that possibility from dependable run presence.

For PM Fall Chinook:

- Post-run remains active through June 30.
- Pre-run watch begins July 1.
- Nearby staging context begins July 28.
- Beginning runs August 15–23.
- Building uses two deterministic copy substates: August 24–31 and September
  1–14. Both retain the public `Building` label.
- Peak runs September 15–30.
- Tapering runs October 1–18.
- Ending runs October 19–27.
- Post-run resumes October 28.

The September 1 Building copy boundary changes guidance only; it does not add a
new public stage. Post-run likewise uses late-run guidance through November 10
and true-offseason guidance beginning November 11 without adding another public
stage. This copy boundary is independent of the Fish In River tail, which now
ends November 8. The September 20 peak reference remains the anchor used by the
separately audited Run Timing baseline. Run Timing's final checkpoint remains
September 26 with a September 25 cutoff and does not inherit Run Stage's
expanded Peak end.

The owner researches and controls these dates.

### 2. Run Timing

Run Timing was previously called `Conditions Suggest`. Internal historical
identifiers may still use `conditionsSuggest`, but public copy should use
`Run Timing`.

It answers whether cumulative seasonal development appears earlier than, similar
to, or later than the researched historical pattern.

Primary public states include:

- Ahead
- Typical
- Delayed
- Evaluating
- Insufficient evidence
- Completed/underway copy after the useful timing window

Important behavior:

- Evidence accumulates from staging start.
- It uses measured water temperature and measured gauge response.
- Comparisons use researched historical baselines.
- Verdicts change only at five configured checkpoints: August 15, August 24,
  September 1, September 15, and September 26 for PM Fall Chinook.
- Each checkpoint uses completed evidence through the prior day.
- The result cannot bounce daily.
- Beginning August 24, the app shows the immediately previous timing read and
  its public date in a small context box.
- A direct Ahead-to-Delayed or Delayed-to-Ahead reversal is tempered through
  Typical.
- Run Timing eventually completes because an early/late call becomes less useful
  once the run is well underway.

Run Timing is not today's Push, a live fish count, or a replacement for Run
Stage.

### 3. Push

Push describes current measured conditions that may support fresh river entry or
movement.

It uses:

- Measured water temperature
- Measured gauge response
- Precipitation as precursor/context evidence

Important behavior:

- Rain alone cannot earn a strong signal when the river has not responded.
- Missing measured water temperature makes Push unavailable.
- Warm water, stale gauges, unknown trends, severe flow, and uncertainty apply
  conservative caps.
- Tracking begins on the configured river-run start date.
- Tracking stops at the configured main-run end.
- During the active run a dropdown shows up to seven completed prior local
  dates, newest first, with each date's latest stored Push category.
- The current date is never included in that daily history because its
  intraday read can still change.
- Missing stored dates remain visibly missing; the engine does not reconstruct
  or guess them.
- The most recent `Possible`-or-stronger signal remains secondary context below
  the daily history.
- Copy must acknowledge that fish can move without a textbook weather event.

Push never confirms that fish actually moved.

### 4. Fishability

Fishability describes how workable the river stretch represented by the
configured primary gauge is for fishing.

PM currently scores only Scottville discharge in CFS. Its bands are
river-specific and based on historical flow distribution, river knowledge, and
conservative caps.

Fishability does not score:

- Fish abundance
- Run timing
- Current Push strength
- Bite quality
- Personal safety
- Every reach of the river

### 5. Fish In River

Fish In River is a river/species/run-specific estimate of historical seasonal
presence. It is not a live count.

Each river/species/run combination has:

- A researched seasonal curve
- An internal maximum cap from 1 through 10, projected onto the public 0–100
  score as a river-specific ceiling
- River- and run-specific evidence notes

PM Fall Chinook is a signature run and can reach 100. A weaker river/run with an
internal maximum of 6 or 7 can reach only 60 or 70 on the public meter.

Fish In River follows the configured seasonal curve and calendar. Push and
Fishability do not directly raise or lower it.

## Current Supported Slice

The only currently supported selection is:

1. Michigan
2. Fall
3. Chinook
4. Pere Marquette River

The implemented movement engine is `fall_cooling`.

Do not force a species or run into `fall_cooling` unless its behavior actually
fits that engine.

## PM Fall Chinook Sources

### Hydraulics

- Provider: USGS
- Site: `04122500`
- Name: Pere Marquette River at Scottville, Michigan
- Scored metric: discharge/flow in CFS
- Gauge height: context only
- Reach limitation: Scottville represents a gauged lower-mainstem reach, not
  every part of the river

### Measured water temperature

Configured order:

1. Maple Leaf, Monitor My Watershed series `4939` — primary
2. Bowman Bridge/60th Street series `3209` — fallback
3. M-37 series `3201` — validation/final fallback

Fallback temperatures must be labeled honestly. An upstream reading cannot
silently claim to be the lower river, and upstream fallbacks cannot create
unsupported positive cooling credit.

### Weather

- Provider: Open-Meteo
- Audited point: near Baldwin
- Precipitation evidence is modeled grid data, not a physical rain gauge

## Refresh Behavior

Refresh cadence is required configuration on each river. A future river must not
silently inherit PM's schedule.

PM Fall Chinook:

- Active from staging start through the main run end: July 28–October 27
- Condition slots: midnight, 4 AM, 8 AM, noon, 4 PM, and 8 PM Eastern
- Outside that window: once daily at midnight
- The protected server job runs 17 minutes after the hour
- Idempotent storage prevents repeated provider calls for the same slot

Condition-sensitive primitives:

- Push
- Fishability
- Current gauge, temperature, weather, freshness, and evidence quality

Daily/checkpoint primitives:

- Run Stage
- Run Timing
- Fish In River

Run Timing can consume every configured condition slot when building its
cumulative daily evidence.

## UI and Navigation

River Run uses a controlled wizard similar in spirit to the Tackle Box:

1. Select state.
2. Select run type/season.
3. Select species.
4. Select supported river.
5. Enter the results experience.

Results-page rules:

- The public header is `Fall Chinook`, not the river name.
- This limits river exposure in screenshots and social marketing.
- The experience must match the premium visual language of the rest of FinFindr.
- Results use clickable primitive tabs instead of one extremely long page.
- Run Stage opens first.
- Every primitive has a state-aware visual meter/illustration.
- Numeric primitive scores remain internal. Public cards use the qualitative
  meter and state label without displaying a number.
- Applicable result quality is color-coded.
- The tab interaction must be visually obvious.
- Supporting "How to read today" material remains available beneath each tab.
- Review fixtures allow every result state to be inspected outside its natural
  season.

## Copy Architecture

Every reachable primitive state has one deterministic canonical template. The
previous A/B copy system was removed so the owner can perfect one version before
considering future experimentation.

Each primitive card has three separate copy jobs:

- The headline gives a one- or two-sentence answer in normal angler language.
- `WHY THIS READ` explains the evidence and limitations that matter to the
  angler without exposing dates, thresholds, scoring machinery, or other
  internal configuration.
- `GUIDE'S READ` translates the result into practical, river-aware trip and
  presentation guidance without promising fish.

`GUIDE'S READ` must lead with a concrete first action. When the evidence
supports it, the guidance should identify the river section, water type, and
order of approach. It must not return the decision to the angler with phrases
such as "let the river decide," "use your judgment," or a list of choices with
no priority. Unavailable states must say what not to infer and which dependable
primitive or direct observation to use instead.

Fishability has an additional copy boundary: every available detail must make
clear that it describes how the current flow should fish **if migratory fish
are present**. It never estimates fish abundance. Its Guide's Read should
translate the flow band and trend into the first water to fish, the water to
deprioritize, and the required level of presentation control.

Every template must preserve:

- Classification
- Score meaning
- Evidence and provenance
- Limitations
- Recommended interpretation
- Conservative strength

Avoid:

- Ambiguous pronouns or unclear subjects
- Generic phrases such as "conditions look good"
- Claims that fish definitely moved
- Claims of live fish counts
- Confusing Run Timing with Push
- Confusing Fishability with fish abundance or bite quality
- Safety claims
- Excessive disclaimers that erase useful advice
- Technical language a beginner cannot interpret
- Simplistic language an advanced angler would dismiss
- Public references to researched/configured dates, baselines, checkpoints,
  percentiles, engines, or source labels

## Important Code Locations

### App and visuals

- `app/river-run.tsx`
- `components/river-run/RiverRunVisual.tsx`
- `lib/riverRunVisuals.ts`
- `lib/riverRunContracts.ts`
- `lib/riverRunReviewFixtures.generated.ts`
- `scripts/generate-river-run-review-fixtures.ts`
- `scripts/river-run-visual-qa.ts`

### Engine

- `supabase/functions/_shared/riverRunEngine/config/rivers.ts`
- `supabase/functions/_shared/riverRunEngine/config/runs.ts`
- `supabase/functions/_shared/riverRunEngine/scoring/runStage.ts`
- `supabase/functions/_shared/riverRunEngine/scoring/conditionsSuggest.ts`
- `supabase/functions/_shared/riverRunEngine/scoring/push.ts`
- `supabase/functions/_shared/riverRunEngine/scoring/fishability.ts`
- `supabase/functions/_shared/riverRunEngine/scoring/fishInRiver.ts`
- `supabase/functions/_shared/riverRunEngine/copy/interpretation.ts`
- `supabase/functions/_shared/riverRunEngine/copy/species.ts`
- `supabase/functions/_shared/riverRunEngine/copy/version.ts`
- `supabase/functions/_shared/riverRunEngine/snapshot/refreshSlots.ts`
- `supabase/functions/_shared/riverRunEngine/validation.ts`
- `supabase/functions/river-run/index.ts`

### Documentation and migrations

- `docs/finfindr_river_run_v1_simple_spec.md`
- `docs/river_run_rollout_plan.md`
- `docs/river_run_pm_integrated_audit.md`
- `supabase/migrations/20260729120000_configure_river_run_refresh_cadence.sql`

## Verification Commands

Run from `TightLinesAI`:

```bash
deno test -A \
  supabase/functions/_shared/riverRunEngine/tests \
  supabase/functions/river-run/index.test.ts

npm run check:river-run:review-fixtures
npm run qa:river-run:ui
npm run qa:river-run:visuals
npx tsc --noEmit
```

At the completed River Run checkpoint:

- 162 River Run engine and endpoint tests passed.
- 85 review fixture scenarios matched production copy.
- River Run UI QA passed.
- River Run visual QA passed.
- TypeScript passed.

## Roadmap After Copy Approval

1. Finish owner review and approval of every copy/result state.
2. Add appropriate additional PM fall-run species and configure each
   independently.
3. Add more Michigan rivers.
4. Expand into other Great Lakes states.
5. Add new movement engines only when the supported run biology requires them.

Possible future species include Coho salmon, lake-run brown trout, steelhead,
Atlantic salmon, and pink salmon. Their presence on the PM or any other river
must be established through research rather than assumed.

Every new river/species/run needs:

- Researched run and staging dates
- Audited hydraulic and measured-temperature sources
- Historical baselines
- River-specific Fishability configuration
- Historical-presence cap and curve
- Movement-engine fit
- Evidence and source notes
- Replay and copy review
- Acceptance tests and public audit gate

## Expected First Response From a New Agent

After reading this document and inspecting the code, the new agent should:

1. Confirm branch, commit history, remote state, and working-tree cleanliness.
2. Explain the five primitives in its own words.
3. Summarize the non-negotiable product principles.
4. Confirm how it will support the owner's in-app copy audit.
5. Identify any genuine mismatch between this document and the implementation.
6. Ask only questions that materially block understanding.
7. Make no code, configuration, deployment, commit, or scope changes yet.
