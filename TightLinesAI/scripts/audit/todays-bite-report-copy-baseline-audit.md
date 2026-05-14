# Today's Bite Report Copy Baseline Audit

Generated: 2026-05-14T15:39:28.008Z

Audit-only. Generated representative Today’s Bite reports across all canonical regions, all 12 months, all four contexts, forecast offsets 0..6, and 17 archetypes. No production behavior changed.

## Executive Recommendation

- Result: report surface passes the baseline issue checks when total issues are zero. The numeric/timing engine is ready; this audit checks whether paid factors and Field Strategy explain that read clearly.
- Any next patch should remain copy-only. Keep scoring/timing untouched and keep Field Strategy separate from Tackle Box.

## Totals

- Rows audited: 102816
- Rows with issues: 0
- Total issues: 0

## Counts By Issue Type

| Issue type | Count |
| --- | --- |

## Counts By Field

| Field | Count |
| --- | --- |

## Top 20 Worst Examples

| # | Issue | Region | Month | Context | Archetype | Field | Text | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Summary Quality Findings

- Summary length issues: 0. Current deterministic summary generally respects the <=220 char target.
- Beginner-ambiguity flags: 0. Current summaries avoid the broad editorial phrases that previously sounded polished without adding tactical meaning.
- Free detail leakage flags: 0. Free surface mostly stays useful without exposing full paid detail.
- Low-reliability caveat flags: 0. Low-reliability free summaries should plainly say the read is broader or data-limited.

## Factor Label Findings

- Generic factor label flags: 0. Paid factor rows now use condition-specific copy instead of only category names such as Temperature, Wind, Rain, and Tide / Current.
- Current target: compact row headers with condition-specific copy from existing detail: temp trend/shock, pressure pattern, rain window, runoff state, wind severity, tide/current movement, and light/cloud character.

## Timing Sentence Findings

- Timing period contradictions: 0.
- Tide-without-events flags: 0; missing-tide wording flags: 0.
- Timing length flags: 0. Timing is generally compact, but repeated "Best times..." structure can feel mechanical.

## Field Strategy / Actionable Tip Findings

- Recommender-overlap flags: 0. This should stay near zero; Tackle Box owns tackle specifics.
- Recommendation: Field Strategy should say what mistake to avoid, how strict to be with timing, whether to fish patiently/aggressively, and how to use the condition read.

## Free Limited Findings

- Free limited surface is structurally sound: score + summary only, with paid sections gated. It is useful without obviously leaking timing/factor/tackle depth.
- Static paywall copy should avoid promising tackle detail on this surface; Tackle Box owns that.

## Paid Full-Report Findings

- Paid surface clearly includes why/when/how sections, and factor rows now have room to explain the condition detail behind the score.
- Section names are understandable: BITE FACTORS, WHAT'S HELPING, WATCH OUT FOR, WHEN TO GO, MOON & TIDE, FIELD STRATEGY.
- FIELD STRATEGY / FINFINDR CONDITIONS should stay focused on using the read, not tackle selection.

## Repetition Findings

| Repeated actionable tip | Count |
| --- | --- |
| Conditions give you room to be proactive. Use the best window first, then adjust with purpose. | 5783 |
| You can be more proactive today, but keep the plan tied to the strongest condition window. | 5771 |
| The read supports a more assertive plan during the best window, especially if the first signs confirm it. | 5752 |
| Start with the highest-percentage water and move when the read gives you a reason, not just from impatience. | 5721 |
| This is a patience-first read. Give the best areas time before assuming the day has no bite. | 3507 |
| The cleaner move is to slow the decision-making down and make the best window count. | 3502 |
| Expect shorter windows and fewer easy clues. Stay precise and avoid chasing every small change. | 3482 |
| This setup rewards discipline. Pick the best window, stay organized, and do not overreact early. | 3471 |
| The best plan is simple: respect the main limiter and do not let weaker signals distract you. | 2993 |
| Let the condition read set priorities today; timing and water choice matter more than extra guessing. | 2977 |


| Repeated summary opener | Count |
| --- | --- |
| This is a day to respect the strongest window | 5010 |
| Mixed conditions make timing and water choice more important | 4865 |
| This is a fair day with a tighter margin | 4855 |
| There is enough help to fish, but the main limiter still matters | 4849 |
| A defined window matters more than the full-day average | 4843 |
| This is a fishable day with a narrower best window | 4837 |
| You can fish this day, but timing and water choice matter | 4751 |
| The read is mixed enough that timing matters | 4747 |
| Some things are helping, and some are getting in the way | 4731 |
| The best window is narrower than a clean day | 4728 |

## Recommended Copy Architecture

- Keep current top-level fields for compatibility.
- Keep `report.drivers[].label` / `report.suppressors[].label` focused on concise condition-specific copy, with `variable` still available for the UI category eyebrow.
- Keep `actionable_tip` compatible as the Field Strategy text, or add a new optional `field_strategy_note` later if a cleaner contract is desired.
- Production files touched by this copy architecture: `runHowFishingReport.ts`, `summary/summaryLine.ts`, `summary/factorSurfaceLabels.ts`, `tips/buildTips.ts`, `components/fishing/RebuildReportView.tsx`, and free-surface copy in `supabase/functions/how-fishing/index.ts`.

## Protected-Path Status

- Audit script did not edit recommender production files.
- Audit script did not edit `buildNormalized.ts`.