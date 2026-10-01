# PierCast Scoring v3 — Pass 2 completion report

> **September 16 research recalibration:** The [all-pair seasonal opportunity audit](../seasonal-opportunity-audit-2026-09/README.md) updates 17 private v3 pairing calendars or ceilings after this historical completion report. Runtime scope, formula, public gates, and v2 behavior are unchanged.

**Completed:** September 16, 2026

**Implementation status:** complete

**Runtime status:** private disabled shadow only

**Production formula:** unchanged Formula v2

## Outcome

Pass 2 implements 94 evidence-admitted city/species pairs and 179 opportunity
modes across 12 live review cities. This includes the 24-pair species-expansion
handoff and four new shared species profiles: burbot, white perch, white bass,
and bluegill. Every pairing remains disabled for public promotion.

The engine now has deterministic generation, explicit year-round opportunity
modes, species-specific thermal curves, regulation handling, exact database
manifests, a private owner-review pipeline, and a private append-only shadow
archive. The Grand Haven November single-hook rule is surfaced as a method
notice and never misrepresented as a biological closure.

No public Formula v2 rating, historical snapshot, leaderboard, public report,
or prior v3 run was modified.

## Verification

- Full-year invariant audit: 171,550 bounded score evaluations across 94 pairs, 365 dates, and five thermal-fit scenarios.
- Every score remains within 1–10, monotonic in thermal fit, no higher than the selected mode potential, and no higher than its researched fishery-strength ceiling.
- Weekly replay: 24,440 deterministic rows.
- Local regression suite: 208 PierCast foundation tests plus four standings tests passed.
- Focused Pass 2 suite: 42 engine, API, ingest, and archival tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Artwork QA: all 19 species have one mapped alpha-capable PNG and normalized card scales; Atlantic Salmon remains capped at 1.07.

## Production shadow proof

Migration `20260915234500_expand_pier_cast_v3_species_manifest.sql` and the two
affected Edge Functions were deployed to the linked production project. The
verified v4 run is `5e41ef9e-b3bd-4a54-a3a4-2e1a13afcbb3`: exactly 470 rows,
94 pairs, 12 cities, five dates, and lead days 0–4 using engine
`pier-cast-opportunity-modes-v3-shadow-v1.3.0`. Every row remains preview-only
and promotion-blocked.

See [PRODUCTION_SHADOW_DEPLOYMENT.md](PRODUCTION_SHADOW_DEPLOYMENT.md) for the
manifest, isolation, and public non-regression checks.

## Promotion remains blocked

Pass 2 engineering is complete, but public promotion correctly remains blocked
on independent fisheries-specialist signoff, local surface-temperature
representation evidence, adequate prospective effort-aware outcomes, and an
explicit owner decision. These are evidence gates, not unfinished
implementation.
