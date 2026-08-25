# {{RIVER_NAME}} River Run Acceptance

**River ID:** `{{RIVER_ID}}` **Created:** {{CREATED_ON}} **Public enablement:**
`not_authorized`

## Gate record

| Gate                                                                  | Artifact/command                        | Result  | Reviewer | Date | Blocking notes |
| --------------------------------------------------------------------- | --------------------------------------- | ------- | -------- | ---- | -------------- |
| Clean branch and protected baseline check                             |                                         | pending |          |      |                |
| River foundation and section approval                                 | `river-foundation.md`                   | pending |          |      |                |
| Barrier/passage/closure audit                                         | `river-foundation.md`                   | pending |          |      |                |
| Species-specific mouth-to-endpoint passage chains                     | foundation + run packets                | pending |          |      |                |
| Source probe and Live Conditions audit                                | `live-conditions.md`                    | pending |          |      |                |
| Chinook truth/copy/replay                                             | `runs/fall-chinook.md`                  | pending |          |      |                |
| Coho truth/copy/replay                                                | `runs/fall-coho.md`                     | pending |          |      |                |
| Steelhead truth/copy/replay                                           | `runs/fall-steelhead.md`                | pending |          |      |                |
| Code-to-packet configuration-field reconciliation                     | all run packets + config diff           | pending |          |      |                |
| Complete calendar evidence-kind/bias reconciliation                   | all run packets                         | pending |          |      |                |
| Strength/distribution portfolio comparisons                           | all run packets                         | pending |          |      |                |
| Engine configuration validation                                       | `npm run river-run:onboarding:validate` | pending |          |      |                |
| Activity historical replay                                            | run-specific artifact                   | pending |          |      |                |
| Activity stage-by-block distributions and iteration ledger            | run-specific artifact                   | pending |          |      |                |
| Activity same-reach source-pairing decision                           | run packets + config                    | pending |          |      |                |
| Cross-year replay math, where applicable                              | replay artifact/test                    | pending |          |      |                |
| Missing-weather unavailable/no-leader behavior                        | Activity QA                             | pending |          |      |                |
| Fishability replay/unavailable contract                               | run-specific artifact                   | pending |          |      |                |
| Four-primitive state fixtures                                         | generated fixtures                      | pending |          |      |                |
| Hidden-review catalog parity for every supported run                  | review-mode UI QA                       | pending |          |      |                |
| Daily copy/reach-progression replay                                   | full active-window copy audit           | pending |          |      |                |
| Stage fixture selector exposes every copy-transition boundary         | generated-fixture boundary QA           | pending |          |      |                |
| Owner-review Gauge Read uses live providers, no fixture fallback      | review-mode visual/API QA               | pending |          |      |                |
| Current Live snapshot isolates provider inputs from scenario fixtures | review-mode API/integration QA          | pending |          |      |                |
| Copy/geography/contradiction QA                                       | onboarding audit                        | pending |          |      |                |
| Live Conditions partial/stale/missing QA                              | test artifact                           | pending |          |      |                |
| Provider-fault recovery to valid numeric display                      | test artifact                           | pending |          |      |                |
| Hourly Gauge Read cadence independent of primitive cadence            | endpoint/cache QA                       | pending |          |      |                |
| Visible observation age, exact time, and unreadable/last-readable UI  | UI/device QA                            | pending |          |      |                |
| All-public-river provider health audit                                | dated live-source audit                 | pending |          |      |                |
| iOS and Android narrow-screen review                                  | screenshots/device review               | pending |          |      |                |
| Production-shaped hidden smoke                                        | smoke artifact                          | pending |          |      |                |
| Product-owner copy/visual acceptance                                  | signed decision                         | pending |          |      |                |
| Public static/database configuration-source decision                  | production secret/config audit          | pending |          |      |                |
| Public registry promotion and draft-registry removal                  | catalog/config diff                     | pending |          |      |                |
| Local/remote migration reconciliation                                 | `supabase migration list --linked`      | pending |          |      |                |
| Complete production catalog smoke for every public run                | deployed `/rivers` assertion            | pending |          |      |                |
| Deployed function version and protected refresh smoke                 | production smoke artifact               | pending |          |      |                |
| Atomic commit, pushed remote parity, and clean worktree               | Git verification                        | pending |          |      |                |

## Required release record

- Configuration version:
- Copy versions:
- Replay artifact versions:
- Configuration inventory reconciliation artifact:
- Activity stage-by-block and calibration-ledger review:
- Activity lifecycle-shape result (Peak highest; Building/Tapering shoulders;
  outside stages lower; hard caps preserved):
- Fixture generation command/result:
- Test commands/results:
- Known limitations:
- Explicitly deferred work:
- Owner acceptance date:
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
