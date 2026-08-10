# River Run River/Run Onboarding Template

> **Required companion standard:** Read
> `docs/river_run_copy_model.md` completely before researching geography,
> barriers, public river sections, or state copy. That document controls River
> Run copy and geography when this older calibration checklist conflicts with
> it.

Use this checklist for every new river/run/species combination. Movement-engine
code is reused; river facts and run calibration are configured.

## 1. Select an implemented movement engine

- `fall_cooling` is the only implemented engine in V1.1.
- `spring_warming`, `winter_thaw`, `summer_cooling`, and `stable_cool_holding`
  are reserved and fail validation until implemented.
- Do not copy fall logic into a spring profile or bypass the validation gate.

## 2. River profile

Enter:

- Stable river ID, display name, Great Lakes state, timezone, and mouth
  coordinates.
- One or more `hydraulicSources`; exactly one is `primary`.
- One primary weather point.
- One or more audited measured-water sources. A river without a viable source is
  not eligible for River Run.
- Reach-limitation copy.
- Proposed public Lower/Middle/Upper section definitions and exact named
  endpoints. Review these with the product owner before copy implementation;
  technically correct but unfamiliar landmarks are not acceptable boundaries.

Never average raw discharge or gage-height readings across gauges. Optional
gauges can participate only after each is normalized against its own metric,
datum, history, and role.

## 3. Hydraulic source audit

For each source, record:

- Provider/site/source IDs and human-readable name.
- Role, primary metric, available metrics, freshness limit, and usable history.
- Which river reach it represents and known limitations.
- Provider site/parameter/unit checks.

One good primary gauge is enough. Additional gauges are optional.

## 4. Water-temperature source audit

For each source, record:

- Provider, site ID, exact series ID, role, and priority.
- Same-reach, nearby, or adjusted-reference relationship.
- Freshness, physical range, maximum rate change, smoothing window, and peer
  difference.
- Adjustment, if supported by evidence.
- Reach notes, licensing, and attribution.

Score one selected source in priority order. Do not average stations. Label an
upstream fallback and cap its positive contribution. Do not use air temperature.
If every configured measured-water source is temporarily unavailable,
temperature-dependent output is unavailable.

## 5. Run profile

Research and enter:

- Species, season, run type, implemented movement engine, and an explicit
  shared species-biology profile. Reuse an existing biology profile only when
  species, regional life history, movement response, and migration-temperature
  defaults genuinely match. River timing, presence, and hydraulics remain
  separate configuration.
- `stagingStart`, river `start`, `peak`, `end`, and `lateEnd`.
- Historical-presence maximum from 1–10.
- Expected seasonal distribution scope: `concentrated`, `sectional`, or
  `broad`. This is researched independently from the maximum because a smaller
  run may still occupy several reaches, while another run may concentrate in a
  limited set of dependable areas.
- Versioned presence curve anchors and supporting evidence.
- A versioned Push block: paired absolute/relative 24-hour hydraulic response
  thresholds, low/high/severe-high values, three rain thresholds, the
  biologically supported measured-water range, warm constraints, and
  conservative caps. Enter the configured hydraulic source label and biological
  suitability label used by copy; shared engine code must not name a river,
  gauge, or species.
- Confirm that Push history uses `Possible` or stronger as supportive
  conditions, is scoped to the exact run season and published configuration,
  and is never presented as observed movement.
- Confirm Push begins on this run's configured river `start`, remains active
  through its configured `end`, and creates no score or new history entry
  outside that interval.
- Confirm the public history shows at most seven completed prior local dates,
  uses each date's strongest stored supportive window and its peak local time,
  never includes the current date, distinguishes `No supportive window` from
  `No recorded read`, and hides all numeric scores.
- Temperature source priority.
- A versioned Fishability block for the primary hydraulic source: metric,
  source label, absolute Very Low/Low/Normal/Ideal/High/Very High/Blown Out
  boundaries, conservative caps, reach/season applicability, evidence, and
  source notes. Seasonal percentiles calibrate and contextualize these
  thresholds but never replace them.
- Confirm every configured primitive label maps to the correct qualitative
  meter stop, including unavailable/waiting states. Confirm Fish In River uses
  an absolute public 0–100 seasonal presence index, visibly marks and masks
  above the river/species ceiling, and places the current marker at the
  state-preserving rounded public value while retaining the exact raw score for
  engine logic. Always display the configured historical run-strength tier:
  Limited for maximum 1–3, Moderate for 4–7, or Strong for 8–10. Relative
  presence states must say `for this run`.
- Research/source notes.

Staging context must never raise Fish In River before the river start.

## 6. Draft, validate, replay, publish

1. Create a new numbered `draft` configuration revision.
2. Run structural/source/engine validation.
3. Generate versioned seasonal level and change baselines.
4. Generate the Conditions Suggest baseline from at least five matching
   historical years:
   - Use the primary hydraulic source and one dedicated measured-water source.
   - The dedicated source may differ from Push's first-priority temperature
     source when another audited station has materially better historical
     continuity.
   - Use that same dedicated source for current Conditions Suggest evidence.
   - Generate cumulative windows from `stagingStart` through river start,
     building start, peak start, and peak complete.
   - Record each checkpoint's observation start, cutoff, expected days, minimum
     coverage, source provenance, and every historical gap.
   - Require the configured cumulative coverage (80% by default) and a usable
     cutoff date.
   - Return `Insufficient evidence` for an uncovered checkpoint; never mix
     stations or weaken the five-year gate.
   - Replay sequential transitions and prove direct Ahead/Delayed reversals are
     tempered to Typical.
   - Confirm the first tapering date returns `Timing complete` and stops later
     timing reclassification.
   - Confirm dates before `stagingStart` and after `postRunLateCopyEnd` return
     `Not monitoring yet`, not `Evaluating` or a stale completed read.
5. Replay representative dry, cooling, rain-before-rise, fishable-rise,
   high-water, stale, missing, primary-temp, and fallback-temp cases. Prove
   Strong requires a measured positive hydraulic response, rain loses credit
   once that response is measured, warm/severe caps hold, and every replay row
   has complete bounded copy.
6. Replay the entire run window against at least five years of primary-gauge
   history. Verify every Fishability band, cap, score label, and copy branch,
   including Strong Push plus Tough/Poor Fishability.
7. Review scores, labels, copy, reason codes, and interpretation together.
   Confirm terminal and offseason behavior follows the River Run Copy Model:
   fall-spawn runs use `Fall run complete` with their species-specific return
   checkpoint; fall-entry runs without an implemented handoff use `Fall entry
   complete` with no current presence or Activity score. Fishability remains
   current but explicitly scoped and separate from seasonal abundance.
8. Publish atomically; the previous revision becomes archived.
9. Deploy hidden and observe live transitions before public enablement.

## 7. Expansion definition of done

A new combination is not complete until:

- The product owner approved the recognizable public section definitions
  before state copy was implemented.
- Every primitive has deterministic unavailable/insufficient behavior.
- No primitive contradicts another without an interpretation note.
- Lower Fish In River caps cannot reach a stronger river's maximum.
- Presence, stage, and interpretation copy uses the ceiling-derived opportunity
  tier (`limited` 1–3, `moderate` 4–7, `strong` 8–10) and the separately
  researched distribution scope; lower tiers never inherit signature-run
  abundance wording.
- Unsupported movement engines fail closed.
- Provider provenance appears in stored/API output.
- Conditions Suggest has five-year coverage for all five cumulative checkpoints
  or a deterministic `Insufficient evidence` gap.
- Daily collection begins by `stagingStart`, or any backfill preserves exact
  source provenance and daily-representative rules.
- The product owner accepts the dates, thresholds, outputs, and copy.
- Runtime public enablement remains a separate explicit action.
