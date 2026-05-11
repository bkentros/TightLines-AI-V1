# FinFindr Daily Picks Recommender Audit Handoff

Last updated: 2026-05-11

## Purpose

This document hands off the guide-level audit process for FinFindr's deterministic daily lure/fly recommender. The immediate next species are northern pike and trout. Largemouth bass and smallmouth bass have gone through the full hard-audit cycle and should be treated as the baseline standard.

The recommender must feel credible to an experienced angler. It should not simply avoid hard failures. It must recommend species-realistic lures and flies, respect season and region biology, use daily archived weather conditions meaningfully, preserve user-facing variety, and still let each species' staple profiles show up when their conditions call for them.

## Working Model

There are two agent roles:

- Master auditor: reads reports, thinks like a guide, judges whether results are credible, and gives one-click prompts to a builder/worker agent.
- Builder/worker agent: implements bounded changes, runs tests/audits, and returns a concise report. The worker should not make broad speculative changes.

The user will paste the worker result back to the master auditor. The master auditor then evaluates and writes the next worker prompt.

## Relevant Files

Core daily-picks engine:

- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`

Candidate catalog:

- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`

Daily-picks tests:

- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/dailyScenario.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/previewQualityFixtures.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`
- `supabase/functions/recommender/dailyPicksSession.test.ts`

Archive-backed audit harness and reports:

- `scripts/audit/run-daily-picks-archive-audit.ts`
- `scripts/audit/daily-picks-archive-audit.lmb.md`
- `scripts/audit/daily-picks-archive-audit.lmb.jsonl`
- `scripts/audit/daily-picks-archive-audit.smb.md`
- `scripts/audit/daily-picks-archive-audit.smb.jsonl`

Smoke outputs may also exist for local checking:

- `scripts/audit/daily-picks-archive-audit.lmb.smoke.md`
- `scripts/audit/daily-picks-archive-audit.lmb.smoke.jsonl`
- `scripts/audit/daily-picks-archive-audit.smb.smoke.md`
- `scripts/audit/daily-picks-archive-audit.smb.smoke.jsonl`

## Engine Goals

Species truth comes first:

- Bass, smallmouth, pike, and trout should only see biologically credible lures/flies.
- No trout spinnerbait nonsense.
- No surface bait in closed/caution conditions unless the surface gate allows it.
- Row copy or UI should not rewrite lure reality.

Seasonal and regional biology controls eligibility:

- Month, region, water type, column, pace, surface windows, and seasonal/candidate pools decide what is allowed.
- Daily weather should rank and select within credible options, not bypass biology.

Daily conditions matter:

- Wind, light, activity, thermal mode, clarity, runoff/current, confidence, and surface gate should change what rises.
- Clear/bright/calm/suppressed should elevate subtle, slow, finesse, or clear-water options.
- Stained/dirty/windy/active should elevate reaction, vibration, current, and visibility tools.
- Heat-limited situations should let heat finesse and slow bottom choices surface.
- Big Fish should favor bigger profile and higher-upside choices without becoming reckless.

Goal matters:

- All Purpose favors reliability, action, versatility, and condition fit.
- Big Fish favors high-upside profiles, but still respects weather, season, water type, and safety.

Variety matters:

- Top and honorable on the same side must never be the same family.
- Top and honorable may have similar presentation if families differ.
- Set B should be a true second opinion and should avoid exact ID repeats.
- Set B same-family or same-presentation overlap with Set A is advisory/watch only, not a hard invariant.
- Adjacent-day sameness should be reduced without weak novelty.

Staple visibility matters:

- Every valid lure/fly should receive some recommendations across a broad audit.
- Species-defining staples should not be muted in their home windows.
- Staples do not need equal overall usage. They need meaningful use when region, month, water type, clarity, goal, and daily conditions call for them.
- Niche profiles may stay low, but must have a truthful reason.

User-facing repetition standard:

- Actual recommendation slot share is the main repetition metric.
- No profile should exceed 20 percent actual combined, top-slot, honorable-slot, lure-side, or fly-side share.
- Home-window selected/opportunity rate is a diagnostic, not the user-facing repetition metric.

## Stabilized LMB/SMB State

After Pass 2R, LMB and SMB are considered frozen unless a future change clearly regresses them.

Final core state:

- LMB: 888 expanded runs, 0 hard fails, 0 likely misses, 0 top/HM same-family, 0 Set B exact-ID, 0 surface-closed finalist violations.
- SMB: 612 expanded runs, 0 hard fails, 0 likely misses, 0 top/HM same-family, 0 Set B exact-ID, 0 surface-closed finalist violations.
- Big Fish upside: LMB 81.1 percent, SMB 72.5 percent.
- True dirty/stained wind misses: LMB 1, SMB 1.
- Actual slot-share maxes remain far below 20 percent.

Final key distribution notes:

- LMB Bladed Jig recovered from over-correction to 26/360 home-window wins without dominance.
- SMB Ned Rig was fixed from 7/216 to 14/216 home-window wins by correcting Set B novelty logic.
- SMB Ned AP home moved from 6/108 to 13/108.
- Tube Jig, Big Smallmouth Tube, Drop-Shot, Finesse Jig, Texas Craw, Hair Jig, Suspending Jerkbait, and Magnum Jerkbait stayed stable enough after the Ned fix.
- No broad score weighting, caps, quotas, or fake tags were introduced.

## Important Implementation Decisions Already Made

Selection:

- Top and honorable both use seeded uniform finalist selection.
- Score is used for credible pool eligibility, tiers, and quality bands, not final weighting.
- Commanding raw score should not auto-win a slot.
- Finalist pools expand enough to maintain variety, while preserving hard gates and surface safety.
- Close all-purpose active specialists can re-enter finalist pools when condition-active and close enough:
  - stained/dirty active reaction specialists
  - slow/bottom finesse/craw specialists in cold/clear/heat finesse windows
- Set B exact-ID repeat is a real failure unless scarcity makes it unavoidable.
- Set B same-presentation overlap is not a hard failure.

Catalog/scoring:

- Bladed Jig had been overdominant. It was narrowed by removing overbroad goal/wind search pressure. It now participates as a dirty/vibration/stained/dirty baitfish profile.
- Lipless and Spinnerbait were narrowed from overbroad search/versatile pressure.
- Paddle-Tail Swimbait was narrowed after becoming too broad.
- Soft Plastic Jerkbait gained `reliable_action` after proving zero-selected/under-visible.
- Bucktail Streamer and Conehead Streamer gained `wind_reaction` for guide-correct river streamer use.
- Football Jig lost `reliable_action` and `secondary_pace: medium`; it remains a slow craw/bottom/cold/structure Big Fish profile.

Big Fish upside:

- This is an audit metric, not a catch-rate claim.
- It measures how often Big Fish goal selections include explicit high-upside/big-fish fit.
- Too low means Big Fish mode is too safe/general.
- Too high can mean the engine is reckless and suppresses condition-correct finesse/tube/jerkbait choices.
- LMB around 80 percent and SMB around 72.5 percent are acceptable final floors.

## Audit Acceptance Criteria

For every species audit pass, preserve or reach:

- `deno check scripts/audit/run-daily-picks-archive-audit.ts` passes.
- Daily-picks tests pass.
- Full archive audit runs with 0 skipped unless there is a clear external data reason.
- 0 hard fails.
- 0 likely misses.
- 0 top/HM same-family on the same side.
- 0 avoidable Set B exact-ID repeats.
- 0 surface-closed finalist violations.
- Actual slot-share max <= 20 percent across combined, top, honorable, lure-side, and fly-side.
- Big Fish upside should meet species-specific floors once established.
- True dirty/stained wind misses should be very low, target <= 3.
- All profiles should get some use unless the report proves no meaningful home-window coverage.
- Species staples should be healthy in home windows.

## How To Audit Pike And Trout Faster

Do not restart from first principles. Use the LMB/SMB process:

1. Add or confirm species scenario coverage in `run-daily-picks-archive-audit.ts`.
2. Run smoke audit first.
3. Run full audit.
4. Read the report through these lenses:
   - hard fails and likely misses
   - actual slot-share maxes
   - surface-closed finalist violations
   - same-family top/HM
   - Set B exact-ID
   - Big Fish upside or species equivalent
   - true condition misses, especially wind/dirty, cold/clear, heat/low-oxygen, current/runoff
   - zero-selected and low-use profiles
   - species-staple floor table
5. Fix audit rubric false positives before production logic.
6. Make production changes only when a structural issue is proven.
7. Prefer selector/pool corrections over fake catalog tags.
8. Prefer guide-correct tag corrections over selector hacks when a tag is genuinely false or missing.
9. Re-run LMB/SMB after shared selector or catalog changes to ensure no regression.

## Pike Guide-Quality Expectations

Pike staples should include, depending on season, water type, clarity, and conditions:

- Spoons
- Spinnerbaits and large inline spinners
- Large swimbaits
- Jerkbaits and glide baits
- Lipless/crankbait style reaction baits where credible
- Topwater/wake/buzz style options only in valid warm/open-surface windows
- Large baitfish streamers, deceivers, bunny/leech patterns, articulated streamers

Pike Big Fish mode should favor larger profile, slower/pausing, high-upside options without recommending reckless surface or oversized picks in closed/suppressed windows.

Pike daily-condition expectations:

- Dirty/wind/stained should elevate vibration/flash/profile.
- Clear/calm/bright should avoid reckless loudness and favor more natural/controlled presentations.
- Cold should slow the pace and avoid inappropriate topwater.
- Warm stable low light can open topwater and big-profile ambush tools.

## Trout Guide-Quality Expectations

Trout is the highest-risk species because lure/fly credibility and water temperature/current matter heavily. Avoid bass/pike logic bleeding into trout.

Trout staples should include, depending on water type, season, and conditions:

- Nymphs and small subsurface flies where present in catalog
- Streamers in current, stained water, high flows, low light, or larger-fish windows
- Woolly Bugger/leech/sculpin/minnow patterns
- Inline spinners and small spoons where allowed and species credible
- Jerkbait/minnow style hard baits only if the catalog explicitly supports trout and conditions make sense
- Surface/dry/topwater only in valid seasonal/surface windows if supported by catalog

Trout must not receive bass-only or biologically silly recommendations.

Trout daily-condition expectations:

- Current/runoff and stain should elevate streamer/current-swing choices.
- Clear/bright/low water should elevate subtle/natural/smaller/slower choices.
- Heat stress should be conservative.
- Cold water should not automatically mean uselessly fast presentations.
- Big Fish trout should favor streamers, larger meals, and high-upside windows only when credible.

## Commands

Use these from repo root `TightLinesAI`:

```bash
deno check scripts/audit/run-daily-picks-archive-audit.ts
deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__ supabase/functions/recommender/dailyPicksSession.test.ts
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species largemouth_bass
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species smallmouth_bass
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species northern_pike --smoke --no-aux
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species northern_pike
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species trout --smoke --no-aux
deno run -A scripts/audit/run-daily-picks-archive-audit.ts --species trout
```

If species flags differ, inspect `scripts/audit/run-daily-picks-archive-audit.ts` and use the supported IDs.

## Master Auditor Operating Rules

- Think like a guide first, engineer second.
- Keep prompts to the worker bounded and unambiguous.
- Ask the worker for concise output, not raw report dumps.
- Treat audit metrics as signals, not truth by themselves.
- Distinguish user-facing repetition from home-window dominance.
- Never fix variety by weakening credible recommendations into nonsense.
- Never fix a low-use staple by adding fake tags.
- Always preserve LMB/SMB by re-running them after shared logic changes.
- Move fast by diagnosing first, then changing the smallest structural thing that explains the issue.

## First Task For The New Master Auditor

The new master auditor should read this document and immediately give the user a one-click-copy prompt for a new worker agent to start the northern pike audit.

The prompt should ask the worker to:

- Parameterize or confirm pike support in the archive harness.
- Build diverse pike scenario coverage across all months, with stronger spring/summer/fall emphasis.
- Use archived weather data.
- Include regions/fisheries/water types/clarities/goals that make biological sense for pike.
- Run smoke and full pike audits.
- Make audit/report changes only at first.
- Make no production changes unless the harness cannot run.
- Return concise metrics and top findings.

