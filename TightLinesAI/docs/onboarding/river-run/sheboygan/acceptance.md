# Sheboygan River River Run Acceptance

**River ID:** `sheboygan` **Created:** 2026-08-25 **Public enablement:**
`not_authorized`

## Gate record

| Gate                                                                  | Artifact/command                   | Result            | Reviewer    | Date       | Blocking notes                                                     |
| --------------------------------------------------------------------- | ---------------------------------- | ----------------- | ----------- | ---------- | ------------------------------------------------------------------ |
| Branch and protected baseline check                                   | branch/status audit                | pass              | Codex       | 2026-08-26 | Existing cohort and marketing work preserved                       |
| Cohort readiness approval, when multi-river                           | cohort decision record             | pass              | Owner       | 2026-08-26 | cohort approved                                                    |
| Cohort foundation/source-feasibility approval, when multi-river       | cohort matrix + river packets      | pass              | Owner       | 2026-08-26 | flow-only Sheboygan contract approved                              |
| Cohort species-truth portfolio approval, when multi-river             | side-by-side species matrix        | pass              | Owner       | 2026-08-26 | accepted ratings 8/8/5/8                                           |
| River foundation and section approval                                 | `river-foundation.md`              | pass              | Owner/Codex | 2026-08-26 | Harbor, Urban River, and Kohler reaches                            |
| Barrier/passage/closure audit                                         | `river-foundation.md`              | pass              | Codex       | 2026-08-26 | common upstream endpoint is Waelderhaus Dam                        |
| Species-specific mouth-to-endpoint passage chains                     | foundation + four run packets      | pass              | Codex       | 2026-08-26 | all four runs end at Waelderhaus                                   |
| Source probe and Live Conditions audit                                | `live-conditions.md`               | pass              | Codex       | 2026-08-26 | I-43 flow/height; no accepted river-temperature source             |
| Chinook truth/copy                                                    | `runs/fall-chinook.md`             | pass              | Owner/Codex | 2026-08-26 | Gate 4A approved                                                   |
| Coho truth/copy                                                       | `runs/fall-coho.md`                | pass              | Owner/Codex | 2026-08-26 | Gate 4A approved                                                   |
| Steelhead truth/copy                                                  | `runs/fall-steelhead.md`           | pass              | Owner/Codex | 2026-08-26 | nonterminal fall-entry completion approved                         |
| Lake-run Brown Trout truth/copy                                       | `runs/fall-brown-trout.md`         | pass              | Owner/Codex | 2026-08-26 | repeat-spawner lifecycle and hold/return uncertainty approved      |
| Code-to-packet configuration-field reconciliation                     | all run packets + `sheboygan.ts`   | pass              | Codex       | 2026-08-26 | Gate 4B fields reconciled                                          |
| Complete calendar evidence-kind/bias reconciliation                   | all run packets                    | pass              | Codex       | 2026-08-26 | calibrated dates distinguished from direct evidence                |
| Strength/distribution portfolio comparisons                           | all run packets                    | pass              | Owner/Codex | 2026-08-26 | 8/8/5/8, all broad                                                 |
| Engine configuration validation                                       | full suite + onboarding QA         | pass              | Codex       | 2026-08-26 | 344 tests; 2 hidden rivers/8 hidden runs                           |
| Activity historical replay                                            | `activity-replay.md` + 5 artifacts | private candidate | Codex       | 2026-08-26 | 2007-2025; complete coverage; all adjusted invariants zero          |
| Activity stage-by-block distributions and iteration ledger            | `activity-replay.md`               | pass              | Codex       | 2026-08-26 | Brown baseline failure and bounded Peak correction retained        |
| Activity same-reach source-pairing decision                           | run packets + config               | pass              | Codex       | 2026-08-26 | weather-only; I-43 hydraulics excluded; no river state inferred    |
| Cross-year replay math, where applicable                              | Brown replay artifact              | pass              | Codex       | 2026-08-26 | 2007-2025 Brown seasons cross New Year                              |
| Missing-weather unavailable/no-leader behavior                        | Activity QA + fixtures             | pass              | Codex       | 2026-08-26 | score/blocks/leader fail closed                                    |
| Fishability flow-band contract                                        | config + focused tests             | pass              | Codex       | 2026-08-26 | recent 2019–2025 I-43 distribution; reach-limited copy             |
| Four-primitive state fixtures                                         | generated fixtures                 | pass              | Codex       | 2026-08-26 | Limited Activity and missing-weather states; no temperature made up |
| Hidden-review catalog parity for every supported run                  | review-mode structural QA          | pass              | Codex       | 2026-08-26 | 787 scenarios across 17 supported review runs                      |
| Daily copy/reach-progression replay                                   | engine + corridor-copy tests       | pass              | Codex       | 2026-08-26 | restrictions first; Harbor to Waelderhaus progression              |
| Stage fixture selector exposes every copy-transition boundary         | generated-fixture boundary QA      | pass              | Codex       | 2026-08-26 | both sides of every transition present                             |
| Owner-review Gauge Read uses live providers, no fixture fallback      | review-mode visual/API QA          | pending           |             |            |                                                                    |
| Current Live snapshot isolates provider inputs from scenario fixtures | review-mode API/integration QA     | pending           |             |            |                                                                    |
| Copy/geography/contradiction QA                                       | `sheboyganDraft.test.ts`           | pass              | Codex       | 2026-08-26 | restrictions, endpoints, calendars, and repeat-spawner language    |
| Live Conditions partial/stale/missing QA                              | generated fixtures + engine tests  | pass              | Codex       | 2026-08-26 | healthy flow-only state is partial by design                       |
| Provider-fault recovery to valid numeric display                      | test artifact                      | pending           |             |            |                                                                    |
| Hourly Gauge Read cadence independent of primitive cadence            | endpoint/cache QA                  | pending           |             |            |                                                                    |
| Visible observation age, exact time, and unreadable/last-readable UI  | UI/device QA                       | pending           |             |            |                                                                    |
| All-public-river provider health audit                                | dated live-source audit            | pending           |             |            |                                                                    |
| iOS and Android narrow-screen review                                  | screenshots/device review          | pending           |             |            |                                                                    |
| Production-shaped hidden smoke                                        | smoke artifact                     | pending           |             |            |                                                                    |
| Product-owner copy/visual acceptance                                  | signed decision                    | pending           |             |            |                                                                    |
| Consolidated cohort acceptance, when multi-river                      | cohort review record               | pending           |             |            |                                                                    |
| Public static/database configuration-source decision                  | production secret/config audit     | pending           |             |            |                                                                    |
| Public registry promotion and draft-registry removal                  | catalog/config diff                | pending           |             |            |                                                                    |
| Local/remote migration reconciliation                                 | `supabase migration list --linked` | pending           |             |            |                                                                    |
| Complete production catalog smoke for every public run                | deployed `/rivers` assertion       | pending           |             |            |                                                                    |
| Deployed function version and protected refresh smoke                 | production smoke artifact          | pending           |             |            |                                                                    |
| Atomic commit, pushed remote parity, and clean worktree               | Git verification                   | pending           |             |            |                                                                    |

## Required release record

- Configuration version: `2026-08-27-sheboygan-steelhead-local-peak.3`
  (hidden)
- Copy versions:
- Replay artifact versions: four adjusted weather-only JSON artifacts plus the
  Brown no-stage-adjustment baseline under `docs/audits/`.
- Configuration inventory reconciliation artifact:
- Activity stage-by-block and calibration-ledger review: complete in
  `activity-replay.md`; Brown Peak +5 is the only stage adjustment.
- Activity lifecycle-shape result (Peak highest; Building/Tapering shoulders;
  outside stages lower; hard caps preserved): Chinook and Coho decline after
  Peak; Steelhead remains nonterminal; Brown Peak exceeds adjacent shoulders;
  all adjusted invariant sets are zero.
- Fixture generation command/result:
  `npm run generate:river-run:onboarding-review-fixtures` — 787 private
  scenarios across 17 runs; current-file and structural QA pass.
- Test commands/results: full engine suite — 344 passed; onboarding validator,
  onboarding QA, weather-only QA, and review-mode structural/copy QA pass.
- Known limitations: no accepted live or historical Sheboygan River temperature
  source; I-43 gauge does not directly measure the harbor and USGS warns it may
  be discontinued on 2026-10-01 without replacement funding; no adult-return
  census; Brown post-spawn lake-return versus river-holding timing is not
  counted locally.
- Explicitly deferred work: owner Gate 4B behavior/visual acceptance,
  authenticated Current Live/device review, production smoke, public enablement,
  deployment, and release.
- Owner acceptance date:
- Multi-river gate approvals and dates, when applicable:
- Deployment authorization:
- Public enablement authorization:
- Production configuration source (`static` or `database`):
- Cache-invalidating engine/config/copy/data versions:
- Linked migration reconciliation result:
- Deployed function version/update time:
- Production catalog unique river/run counts and new IDs:
- Protected refresh/provider smoke result:
- Mobile UI availability (already live or requires next build):
- Commit(s), remote branch, ahead/behind, and clean-status result:

## Post-review correction and generalized-learning ledger

Complete one row for every owner-review correction. When the cause could recur,
the canonical guide/template/validator/QA update is part of the correction—not
optional future cleanup.

| Finding | Root-cause class | Before/after truth | Config/copy/artifacts corrected | Full reruns performed | General safeguard added | Reviewer/date |
| ------- | ---------------- | ------------------ | ------------------------------- | --------------------- | ----------------------- | ------------- |
|         |                  |                    |                                 |                       |                         |               |

Acceptance, deployment, and public enablement are three separate decisions. The
onboarding workflow must not perform the latter two automatically.
