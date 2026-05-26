# Today's Bite Runoff Stale Softness Shadow Audit

Generated: 2026-05-26T12:58:22.768Z

Best candidate: productionized_v3_hybrid_surgical

Rows: 43200

Variant comparison:
| Variant | Applied | River Good+Prime delta | Negative deltas | Unsafe upgrades | Non-river changes | Copy flags | Bad rec dirs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| productionized_v3_hybrid_surgical | 322 | 56 | 0 | 0 | 0 | 0 | 0 |

Global distribution:
- baseline: 0-34:1736, 35-49:6968, 50-64:19272, 65-79:13706, 80-100:1518
- candidate: 0-34:1736, 35-49:6968, 50-64:19216, 65-79:13762, 80-100:1518

Freshwater river distribution:
- baseline: 0-34:752, 35-49:2102, 50-64:4172, 65-79:3640, 80-100:134
- candidate: 0-34:752, 35-49:2102, 50-64:4116, 65-79:3696, 80-100:134

River band moves:
- Poor->Fair: 0
- Fair->Good: 56
- Good->Prime: 0

River Good+Prime delta: 56 (3774 -> 3830)

Negative score deltas on candidate-applied rows: 0

High p7d + low recent rain:
- rows: 432
- candidate applied: 322
- avg score delta: 1.60
- max score delta: 7

Madison / Great Lakes spring rows:
| Month | Clarity | Baseline | Candidate | Band | Runoff | Applied |
| ---: | --- | ---: | ---: | --- | --- | --- |
| 4 | clear | 57 | 59 | Fair->Fair | elevated:-1.012 -> -0.808 | yes |
| 4 | stained | 57 | 59 | Fair->Fair | elevated:-1.012 -> -0.808 | yes |
| 5 | clear | 57 | 59 | Fair->Fair | elevated:-1.012 -> -0.808 | yes |
| 5 | stained | 57 | 59 | Fair->Fair | elevated:-1.012 -> -0.808 | yes |
| 6 | clear | 51 | 51 | Fair->Fair | elevated:-1.012 -> -1.012 | no |
| 6 | stained | 51 | 51 | Fair->Fair | elevated:-1.012 -> -1.012 | no |

Unsafe upgrades:
- active/heavy rain, high recent rain, or blown_out upgraded: 0
- active/heavy rain upgraded: 0
- high 24h/72h rain upgraded: 0
- blown_out upgraded: 0

Guardrails/copy failures:
- candidate-applied rows: 322
- candidate-wired copy/stale factor flags: 0
- non-river changed rows: 0

Per-region river applied rows:
- alaska: 22
- appalachian: 24
- great_lakes_upper_midwest: 22
- gulf_coast: 24
- hawaii: 24
- inland_northwest: 22
- midwest_interior: 24
- mountain_alpine: 22
- mountain_west: 22
- northeast: 24
- northern_california: 22
- pacific_northwest: 22
- south_central: 24
- southeast_atlantic: 24

Per-month river applied rows:
- 1: 28
- 10: 28
- 11: 28
- 12: 28
- 2: 28
- 3: 28
- 4: 28
- 5: 28
- 6: 14
- 7: 28
- 8: 28
- 9: 28

Recommender tier changes:
- activity tier changes: 16
- bad directions: 0
- active->neutral: 0
- neutral->suppressed: 0

Recommendation: productionized V3 passes audit guardrails
