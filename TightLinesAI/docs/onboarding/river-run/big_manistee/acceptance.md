# Big Manistee Migratory Brown Trout Acceptance

**Public enablement:** `not_authorized` **Current gate:**
`gate_4b_ready_for_owner_review`

| Gate item | Status |
| --- | --- |
| DNR biology, fishery, and trophy evidence | complete |
| 5/10 sectional candidate and Oct. 1 reference peak | implemented |
| Repeat-spawner Stage and Fish In River copy | focused tests pass |
| Wellston observed Activity and Brown temperature branch | implemented |
| Michigan selector: all rivers visible; only Big Manistee eligible | UI QA passes |
| Hidden draft registry; no public-catalog leak | focused tests pass |
| Owner-review fixture generation | 1,183 scenarios generated |
| Fixed 2007-2025 Activity replay | pass; 1,851/1,881 days, 98.41% coverage |
| Activity safety and score-shape invariants | pass; zero failures |
| Full engine/project QA | pass; replay artifact and generated fixtures verified |
| Product-owner calibration decision | pending |
| Public enablement, deployment, or store release | not authorized |

The fixed 2007-2025 replay was rerun on August 27, 2026 after the calendar was
corrected from an October 20 to an October 1 reference peak. Overall daily
scores had a 64.65 mean, 76 median, 19 p10, 90 p90, and 7-95 range. Migration
Peak mean was 77.70; Tapering and Ending response means were 85.65 and 80.68 as
historical water entered the Brown Trout thermal apex. That is intentional:
Activity describes response conditions for a fish already present, not run
strength or migration stage. No stage nudge is used to make Activity imitate
Fish In River. All copy, reach, score-range, warm/barrier, late-stage, and
repeat-spawner invariants passed with zero failures. See `activity-replay.md`.

Acceptance, public enablement, deployment, and release remain separate
decisions. This hidden candidate cannot affect the currently released store
builds.
