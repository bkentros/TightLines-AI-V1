# River Run Rollout Plan

## Agent Orientation

River Run is FinFindr's deterministic read for Great Lakes migratory river runs. A user selects an available state, river, season, and run/species, then receives five separate primitives: Run Stage, Schedule, Push, Fishability, and Fish In River.

Goal: prove one audited launch slice before expanding. The launch slice is currently `Michigan -> Pere Marquette River -> Fall -> Fall Chinook`.

What exists now:

- River Run spec: `TightLinesAI/docs/finfindr_river_run_v1_simple_spec.md`
- Launch audit note: `TightLinesAI/docs/river_run_pm_fall_chinook_launch_audit.md`
- Engine code: `TightLinesAI/supabase/functions/_shared/riverRunEngine`
- Public endpoint: `TightLinesAI/supabase/functions/river-run`
- Mobile screen: `TightLinesAI/app/river-run.tsx`
- Client contract/helper: `TightLinesAI/lib/riverRunContracts.ts`, `TightLinesAI/lib/riverRun.ts`
- Baseline seed migration: `TightLinesAI/supabase/migrations/20260709120000_seed_river_run_pm_fall_chinook_baselines.sql`
- Audit tooling: `TightLinesAI/scripts/river-run-pm-launch-audit.ts`

Important current state:

- PM Fall Chinook is public-enabled in config.
- The PM baseline seed uses USGS `04122500`, metric `flow_cfs`, baseline version `2026-07-08`.
- Copy is designed to be composition-safe: each primitive must describe only its own dimension.
- Do not add more species, rivers, or run types until the active phase's exit criteria are checked off.

How to continue:

- Start by identifying the current unchecked phase below.
- Read the spec and relevant audit note before editing code.
- Keep changes scoped to the active phase.
- Preserve deterministic scoring, explicit audit gates, and versioned config changes.

This rollout keeps River Run quality high by proving one audited slice before expanding species, rivers, and seasonal run types.

## Phase 1: Perfect PM Fall Chinook

- [ ] Deploy the River Run migrations and `river-run` Edge Function.
- [ ] Confirm `Michigan -> Pere Marquette River -> Fall -> Fall Chinook` appears in the app.
- [ ] Smoke test authenticated snapshots in the target environment.
- [ ] Monitor daily Stage, Schedule, Push, Fishability, and Fish In River outputs through real PM fall conditions.
- [ ] Compare outputs against gauge movement, weather events, known run timing, and trusted local observations.
- [ ] Log any mismatches as config/audit notes before changing formulas.
- [ ] Confirm copy remains composition-safe across mixed daily reads.

Exit criteria:

- [ ] PM Fall Chinook is stable in production.
- [ ] Baselines, live providers, auth/rate limit, storage, and UI are verified.
- [ ] Any calibration changes are versioned, tested, and documented.

## Phase 2: Add More PM Species

- [ ] Add the next PM species only after Phase 1 exit criteria pass.
- [ ] Start with species that can reuse the same river, gauge, weather point, and baseline infrastructure.
- [ ] Create species-specific run config for dates, peak, run strength, behavior profile, and audit notes.
- [ ] Add tests proving the new species appears under the correct state, river, season, and run selector.
- [ ] Keep each new species behind its public audit gate until accepted.

Initial candidates:

- [ ] PM Fall Coho
- [ ] PM Steelhead

Exit criteria:

- [ ] At least one additional PM species is audited and production-stable.
- [ ] Species-specific config differences are documented.
- [ ] No shared PM infrastructure regressions are observed.

## Phase 3: Expand To More Rivers

- [ ] Select one next river with a strong official gauge and clear run timing.
- [ ] Add river profile, gauge notes, weather point, and baseline seed.
- [ ] Generate and audit river-specific flow baselines.
- [ ] Add one species/run first, not multiple at once.
- [ ] Verify catalog, snapshot, storage, and UI behavior in staging before public enablement.

Exit criteria:

- [ ] Second river is production-stable.
- [ ] River onboarding steps are repeatable.
- [ ] Gauge/baseline audit process is documented enough to reuse.

## Phase 4: Expand Run Types

- [ ] Add non-fall behavior profiles only after fall-run expansion is stable.
- [ ] Audit each behavior profile against real seasonal logic before enabling public runs.
- [ ] Validate spring, winter, summer, and holding-pattern copy separately.
- [ ] Add representative matrix tests for each new run type.

Candidate behavior profiles:

- [ ] Spring warming / flow pulse
- [ ] Winter thaw / flow window
- [ ] Summer cool rain pulse
- [ ] Stable cool holding

Exit criteria:

- [ ] New run type behaves correctly in real conditions.
- [ ] Copy remains composition-safe.
- [ ] Tests cover profile-specific rain, flow, temperature, and data-quality behavior.

## Guiding Rule

Do not expand breadth until the current slice is trusted. Prefer one audited, explainable run over many loosely configured runs.
