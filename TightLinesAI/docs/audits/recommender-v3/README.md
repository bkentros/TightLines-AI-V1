# Recommender V3 — Full Report Audit Charter

This audit evaluates the **full surface of the Lure/Fly Recommender V3 report**
for accuracy, coherence, and guide-level correctness. It is the follow-on to
Phase 1 (explicit `column_range` / `pace_range` / `presence_range` archetype
authoring) and the `topThreeSelection` derivation fix.

The audit is **species-at-a-time**, 5 scenarios per species, 20 scenarios total.
Scenarios are hand-curated to represent:

- the most important regions for each species (guide-level consensus), and
- the most commonly-fished months within those regions.

Environmental inputs are synthetic but realistic — hand-authored to produce
reproducible output so the audit can be repeated after every tuning pass.

## Out of scope

- "How's Fishing Right Now" scoring / summaries / tips (not being audited).
- Saltwater species (V3 is freshwater-only).
- Live archive weather fetch — scenarios are deterministic by design.

## What the auditor evaluates, per scenario

1. **Day read** — do `posture_band`, `reaction_window`, `surface_window`,
   `opportunity_mix`, and `daily_preference` match what a guide would deduce
   from the environment in this scenario?
2. **Primary forage** — does `seasonal_row.monthly_baseline.primary_forage`
   make biological sense for species + region + month?
3. **Archetype selections (top 3 lures + top 3 flies)** — are the picks
   reasonable for this species/water/season/region?
4. **Per-rec authored dimensions** — do each rec's `primary_column`, `pace`,
   `presence`, `is_surface` match the lure/fly's real-world use? Phase 1
   range fields are the source of truth — flag any that still look wrong.
5. **Why-chosen copy accuracy** — does each `why_chosen` string cite drivers
   that are actually true for this lure + this day?
6. **How-to-fish copy accuracy** — does each `how_to_fish` describe the
   correct technique for this archetype, consistent with its authored
   column/pace/presence/is_surface?
7. **Trio coherence** — do the 3 picks form a sensible diverse-but-compatible
   set? Any pair that should not coexist under today's gates?
8. **Auto-flags** — confirm or dismiss every machine-detected flag with
   reasoning.

## Severity tags

Apply one to every finding:

- `[BLOCKER]` invariant violation / report is misleading / safe to ship = no
- `[BUG]`     wrong but report still usable
- `[POLISH]`  accurate but could be improved
- `[FYI]`     observation worth noting, not a defect

## How to run the harness

```sh
cd TightLinesAI

# One species at a time
deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts smallmouth
deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts largemouth
deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts pike
deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts trout

# Or all four in one shot
deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts all
```

Outputs land in `docs/audits/recommender-v3/<species>/`:

- `<scenario-id>.md` — one full report per scenario, with auditor checklist and
  empty "Auditor notes" section.
- `_summary.md` — species rollup with a scenario table + "Species findings"
  section to fill in after all 5 are audited.
- `_lane_fit_diagnostics.md` (at the species-parent level) — Phase 1 narrowing
  regressions where a seasonal-row pool entry's authored range no longer
  overlaps the row's allowed lanes.

## How the audit is kicked off

The auditing agent is invoked with a copy-paste prompt maintained by the
project maintainer (not stored in this repo). The prompt points the agent
here, tells it which scripts to run, and defines the layer-by-layer
evaluation structure. This charter is the reference the prompt points to.

## Deliverables

### Per scenario

Edit the scenario's `.md` file in place. Fill in the **Auditor notes** section
with findings. Be specific: cite archetype ids, quote copy excerpts, tag
severity, recommend a concrete fix (file path + function name when possible).

### Per species

Edit `<species>/_summary.md`. Fill in the **Species findings** section at the
bottom with:

- Top 3 themes observed (with severity distribution).
- Archetypes that misbehave across multiple scenarios.
- Copy patterns that are consistently wrong.
- Concrete tuning/architecture recommendations.

### Cross-species rollup

After all 4 species are audited, create
`docs/audits/recommender-v3/_cross_species_findings.md` with:

- Patterns common across species (e.g. a recurring copy-template misuse).
- Engine-level vs archetype-level issues.
- Prioritized fix queue: `[BLOCKER] > [BUG] > [POLISH]`.
- Explicit recommendation for each lane-fit diagnostic entry
  (broaden archetype / remove from row / widen row).

## Ground truth references

When judging whether an output is "correct", treat these files as the authored
source of truth:

- Archetype column/pace/presence:
  - `supabase/functions/_shared/recommenderEngine/v3/candidates/lures.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/candidates/flies.ts`
- Seasonal monthly baselines per species:
  - `supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/seasonal/pike.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/seasonal/trout.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/seasonal/tuning.ts`
- Daily payload resolution:
  - `supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/resolveFinalProfile.ts`
- Scoring / ranking / top-3 selection:
  - `supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts`
  - `supabase/functions/_shared/recommenderEngine/v3/scoring/`
  - `supabase/functions/_shared/recommenderEngine/v3/topThreeSelection.ts`
- Copy rendering:
  - `supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.ts`

If a biological claim contradicts the authored range, that's a **finding to
flag** — do not silently accept it.

## Known open question (for auditor to resolve)

- `docs/audits/recommender-v3/_lane_fit_diagnostics.md` lists
  seasonal-row ↔ archetype pairs where the post-Phase-1 archetype range has
  zero overlap with the row's allowed lanes. The hard throw was softened to
  unblock the audit; the auditor must decide resolution for each entry and
  once resolved, the softening in `validateSeasonalRow.ts` (marked with a
  "TEMPORARY (Phase 1 narrowing audit)" comment) should be reverted.

## Do / Do not

**Do:**
- Read the Intent at the top of each scenario first.
- Quote the exact copy you're flagging — don't paraphrase.
- Cite file paths and function names when recommending a fix.
- Note patterns that span multiple scenarios; they are the highest-value
  findings.

**Do not:**
- Edit engine source code (audit-only; the maintainer will apply fixes).
- Re-litigate Phase 1 authoring choices without a clear biological case.
- Dismiss auto-flags without writing down your reasoning.
