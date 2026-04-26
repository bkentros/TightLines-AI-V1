# Recommender rebuild - slot stickiness and row inclusion audit

Generated: **2026-04-26T16:40:43.455Z**

## Executive Conclusion

Representative 30-date windows do not show remaining new-fly row additions. Sticky warm fly contexts are now better treated as fly-side structural thinness review, not missing authored rows.

## Slot Stickiness Summary

- healthy_rotation: 10
- fly_side_structural_thinness_review: 7
- honest_narrow_winter_lane: 2
- needs_selector_weight_review: 1

## Worst Sticky Contexts

- Florida LMB lake/pond warm stained surface (fly): fly_side_structural_thinness_review; S1 2 unique / 55.17% same; S2 6 unique / 20.69% same; S3 3 unique / 48.28% same; triples 17/30.
- Gulf Coast LMB lake/pond warm stained surface (fly): fly_side_structural_thinness_review; S1 2 unique / 44.83% same; S2 6 unique / 13.79% same; S3 3 unique / 27.59% same; triples 17/30.
- LMB river warm context (fly): fly_side_structural_thinness_review; S1 6 unique / 13.79% same; S2 2 unique / 75.86% same; S3 4 unique / 13.79% same; triples 18/30.
- Smallmouth lake/pond summer context (fly): fly_side_structural_thinness_review; S1 7 unique / 20.69% same; S2 2 unique / 86.21% same; S3 5 unique / 24.14% same; triples 23/30.
- Smallmouth river summer context (fly): fly_side_structural_thinness_review; S1 9 unique / 17.24% same; S2 3 unique / 79.31% same; S3 8 unique / 27.59% same; triples 27/30.
- Pike lake/pond summer context (fly): fly_side_structural_thinness_review; S1 7 unique / 10.34% same; S2 3 unique / 44.83% same; S3 4 unique / 24.14% same; triples 23/30.
- Pike river summer context (fly): fly_side_structural_thinness_review; S1 9 unique / 6.9% same; S2 3 unique / 51.72% same; S3 4 unique / 17.24% same; triples 24/30.
- Trout river summer context (fly): needs_selector_weight_review; S1 8 unique / 3.45% same; S2 3 unique / 79.31% same; S3 7 unique / 13.79% same; triples 22/30.

## Healthy Contexts

- Florida LMB lake/pond warm stained surface (lure): 23/30 unique triples.
- Gulf Coast LMB lake/pond warm stained surface (lure): 23/30 unique triples.
- LMB river warm context (lure): 24/30 unique triples.
- Smallmouth lake/pond summer context (lure): 25/30 unique triples.
- Smallmouth river summer context (lure): 24/30 unique triples.
- Pike lake/pond summer context (lure): 24/30 unique triples.
- Pike river summer context (lure): 25/30 unique triples.
- Trout river summer context (lure): 16/30 unique triples.
- Cold winter bass lake/pond context (lure): 30/30 unique triples.
- Cold winter trout river context (fly): 20/30 unique triples.

## Southern LMB Frog/Date-Rotation Summary

- Florida LMB lake/pond warm stained surface: 30 surface-slot dates; candidate/finalist/pick 100% / 100% / 66.67%.
- Gulf Coast LMB lake/pond warm stained surface: 30 surface-slot dates; candidate/finalist/pick 100% / 100% / 53.33%.

## Are Slot 1/2 Too Deterministic?

No broad slot-1/slot-2 determinism was detected in the representative set. Sticky cases are either winter/narrow or fly-side structural thinness review.

## Are Boost Reasons Dominating Slots 1/2?

1 side-contexts were flagged for selector weight review because one boost family dominated slot 1/2 chosen candidates.

## New Fly Row Inclusion Recommendations

### Warmwater Crawfish Fly (warmwater_crawfish_fly)

- Authored rows now: 172; eligible-not-authored rows: 548; recommended rows: 0.
- No row additions recommended from this audit.

### Worm Fly (warmwater_worm_fly)

- Authored rows now: 0; eligible-not-authored rows: 720; recommended rows: 0.
- No row additions recommended from this audit.

### Foam Gurgler (foam_gurgler_fly)

- Authored rows now: 247; eligible-not-authored rows: 68; recommended rows: 0.
- No row additions recommended from this audit.

### Pike Flash Fly (pike_flash_fly)

- Authored rows now: 102; eligible-not-authored rows: 18; recommended rows: 0.
- No row additions recommended from this audit.

## Rows Intentionally Left Unchanged

- Cold winter rows where narrow slow/bottom posture is biologically honest.
- Trout rows for these four new flies; none of the new flies are trout archetypes.
- Surface rows outside warm months for `foam_gurgler_fly`.
- Pike rows outside baitfish/perch upper-column posture for `pike_flash_fly`.

## Recommended Next Implementation Pass

Do not add more rows from this audit. Remaining warm fly-side stickiness should be treated as structural thinness review; inspect real scenario outputs before any selector-weight tuning.

Full machine-readable report: `docs/audits/recommender-rebuild/slot-stickiness-and-row-inclusion.json`.
