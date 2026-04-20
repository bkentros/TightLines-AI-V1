# Catalog gap analysis (v4)

> **Gate blocked — Phase 3 must not begin** until every **critical** row below has an explicit disposition (expand catalog / accept thinness / mark unreachable) and any required Appendix or catalog change is merged. *`Pending product-owner sign-off — [REVIEWER_INITIALS] — [DATE]`*

## Summary

- **Total cells:** 288
- **ok** (lure ≥ 4 and fly ≥ 3): **19**
- **thin** (below ok but lure ≥ 2 and fly ≥ 2): **13**
- **critical** (lure < 2 or fly < 2): **256**

## Method (§17.9)

Cross-product: `(species × water_type × column × pace × clarity)`. Count lures and flies where `species ∈ species_allowed`, `water_type ∈ water_types_allowed`, `column` matches, `pace` matches `primary_pace` or `secondary_pace`, and `clarity ∈ clarity_strengths`.

| Verdict | condition |
|---|---|
| ok | lure_count ≥ 4 **and** fly_count ≥ 3 |
| thin | below ok, but lure_count ≥ 2 **and** fly_count ≥ 2 |
| critical | lure_count < 2 **or** fly_count < 2 |

## Critical pattern aggregates

Buckets by `(lure_count, fly_count)` for critical cells — use for batch disposition. *Implementing-agent note: many critical cells are driven by Appendix A fly `water_types_allowed` (e.g. river-only bottom streamers) and `column` coverage; full cross-product includes combinations that may never co-occur in seasonal rows — product owner must confirm **mark unreachable** vs **expand catalog** vs **accept thinness** per §17.9.*

| lure_count | fly_count | critical cells | example (species, water, column, pace, clarity) |
|---:|---:|---:|---|
| 0 | 0 | 105 | largemouth_bass, freshwater_lake_pond, bottom, fast, clear |
| 0 | 1 | 16 | northern_pike, freshwater_lake_pond, upper, slow, clear |
| 0 | 2 | 2 | trout, freshwater_lake_pond, bottom, slow, stained |
| 0 | 3 | 3 | trout, freshwater_lake_pond, mid, slow, dirty |
| 0 | 4 | 4 | trout, freshwater_lake_pond, mid, slow, stained |
| 0 | 5 | 1 | trout, freshwater_river, mid, slow, stained |
| 1 | 0 | 26 | largemouth_bass, freshwater_lake_pond, upper, slow, dirty |
| 1 | 1 | 23 | largemouth_bass, freshwater_lake_pond, mid, fast, clear |
| 1 | 2 | 2 | smallmouth_bass, freshwater_lake_pond, mid, slow, dirty |
| 1 | 3 | 3 | largemouth_bass, freshwater_lake_pond, mid, slow, dirty |
| 1 | 4 | 3 | northern_pike, freshwater_lake_pond, mid, slow, stained |
| 1 | 5 | 2 | northern_pike, freshwater_river, mid, slow, stained |
| 1 | 6 | 2 | northern_pike, freshwater_lake_pond, mid, medium, dirty |
| 2 | 0 | 6 | largemouth_bass, freshwater_lake_pond, upper, medium, dirty |
| 2 | 1 | 19 | largemouth_bass, freshwater_lake_pond, mid, slow, clear |
| 3 | 0 | 3 | largemouth_bass, freshwater_lake_pond, bottom, medium, dirty |
| 3 | 1 | 10 | largemouth_bass, freshwater_lake_pond, upper, medium, clear |
| 4 | 0 | 8 | largemouth_bass, freshwater_lake_pond, bottom, medium, clear |
| 4 | 1 | 7 | largemouth_bass, freshwater_lake_pond, mid, fast, stained |
| 5 | 1 | 4 | largemouth_bass, freshwater_river, bottom, slow, dirty |
| 6 | 0 | 1 | largemouth_bass, freshwater_river, bottom, slow, clear |
| 6 | 1 | 1 | largemouth_bass, freshwater_lake_pond, bottom, slow, dirty |
| 7 | 1 | 1 | largemouth_bass, freshwater_river, bottom, slow, stained |
| 8 | 0 | 2 | largemouth_bass, freshwater_lake_pond, bottom, slow, clear |
| 8 | 1 | 1 | smallmouth_bass, freshwater_lake_pond, bottom, slow, stained |
| 9 | 1 | 1 | largemouth_bass, freshwater_lake_pond, bottom, slow, stained |

## Critical cells — disposition log

Per §17.9: for each **critical** row choose **expand catalog** | **accept thinness** | **mark unreachable**, with reviewer initials + date. *Implementing-agent default: **pending PO** for all rows until reviewed.*

| species | water_type | column | pace | clarity | lure_count | fly_count | disposition | initials | date |
|---|---|---|---|---:|---:|---|---|---|---|
| largemouth_bass | freshwater_lake_pond | bottom | slow | clear | 8 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | slow | stained | 9 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | slow | dirty | 6 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | medium | clear | 4 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | medium | stained | 4 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | medium | dirty | 3 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | mid | slow | clear | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | mid | slow | dirty | 1 | 3 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | mid | fast | clear | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | mid | fast | stained | 4 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | mid | fast | dirty | 4 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | slow | clear | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | slow | stained | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | slow | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | medium | clear | 3 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | medium | stained | 4 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | medium | dirty | 2 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | fast | stained | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | upper | fast | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | slow | clear | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | slow | dirty | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | medium | clear | 3 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | medium | dirty | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | fast | stained | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_lake_pond | surface | fast | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | slow | clear | 6 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | slow | stained | 7 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | slow | dirty | 5 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | medium | clear | 2 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | medium | stained | 2 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | medium | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | fast | stained | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | bottom | fast | dirty | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | mid | slow | clear | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | mid | slow | dirty | 1 | 3 | pending PO | | |
| largemouth_bass | freshwater_river | mid | fast | clear | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | mid | fast | stained | 4 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | mid | fast | dirty | 4 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | upper | slow | clear | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | upper | slow | stained | 2 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | upper | slow | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | upper | medium | clear | 3 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | upper | medium | stained | 4 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | upper | medium | dirty | 2 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | upper | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | upper | fast | stained | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | upper | fast | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | surface | slow | clear | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | surface | slow | stained | 1 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | surface | slow | dirty | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | surface | medium | clear | 3 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | surface | medium | stained | 4 | 1 | pending PO | | |
| largemouth_bass | freshwater_river | surface | medium | dirty | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | surface | fast | clear | 0 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | surface | fast | stained | 1 | 0 | pending PO | | |
| largemouth_bass | freshwater_river | surface | fast | dirty | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | clear | 8 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | stained | 8 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | dirty | 5 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | clear | 4 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | stained | 4 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | dirty | 3 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | mid | slow | dirty | 1 | 2 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | mid | fast | clear | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | mid | fast | stained | 5 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | mid | fast | dirty | 4 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | slow | clear | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | slow | stained | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | slow | dirty | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | medium | clear | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | medium | stained | 4 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | medium | dirty | 2 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | fast | stained | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | upper | fast | dirty | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | slow | clear | 1 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | slow | stained | 1 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | slow | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | medium | clear | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | medium | stained | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | medium | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | fast | stained | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | medium | clear | 3 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | medium | stained | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | medium | dirty | 1 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | fast | stained | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | bottom | fast | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | mid | slow | dirty | 1 | 2 | pending PO | | |
| smallmouth_bass | freshwater_river | mid | fast | clear | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | mid | fast | stained | 5 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | mid | fast | dirty | 4 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | slow | clear | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | slow | stained | 2 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | slow | dirty | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | medium | stained | 4 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | medium | dirty | 2 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | fast | stained | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | upper | fast | dirty | 1 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | slow | clear | 1 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | slow | stained | 1 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | slow | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | medium | clear | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | medium | stained | 3 | 1 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | medium | dirty | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | fast | clear | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | fast | stained | 0 | 0 | pending PO | | |
| smallmouth_bass | freshwater_river | surface | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | slow | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | slow | stained | 1 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | slow | dirty | 1 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | medium | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | medium | stained | 1 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | medium | dirty | 1 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | slow | clear | 1 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | slow | stained | 1 | 4 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | slow | dirty | 1 | 4 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | medium | dirty | 1 | 6 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | fast | clear | 2 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | fast | stained | 2 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | mid | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | slow | clear | 0 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | slow | stained | 0 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | slow | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | medium | clear | 0 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | medium | stained | 0 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | medium | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | upper | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | slow | clear | 1 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | slow | stained | 2 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | slow | dirty | 1 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | medium | clear | 1 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | medium | stained | 2 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | medium | dirty | 1 | 1 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | slow | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | slow | stained | 1 | 1 | pending PO | | |
| northern_pike | freshwater_river | bottom | slow | dirty | 1 | 1 | pending PO | | |
| northern_pike | freshwater_river | bottom | medium | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | medium | stained | 1 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | medium | dirty | 1 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | bottom | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | mid | slow | clear | 1 | 1 | pending PO | | |
| northern_pike | freshwater_river | mid | slow | stained | 1 | 5 | pending PO | | |
| northern_pike | freshwater_river | mid | slow | dirty | 1 | 4 | pending PO | | |
| northern_pike | freshwater_river | mid | medium | dirty | 1 | 6 | pending PO | | |
| northern_pike | freshwater_river | mid | fast | clear | 2 | 1 | pending PO | | |
| northern_pike | freshwater_river | mid | fast | stained | 2 | 1 | pending PO | | |
| northern_pike | freshwater_river | mid | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | upper | slow | clear | 0 | 1 | pending PO | | |
| northern_pike | freshwater_river | upper | slow | stained | 0 | 1 | pending PO | | |
| northern_pike | freshwater_river | upper | slow | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | upper | medium | clear | 0 | 1 | pending PO | | |
| northern_pike | freshwater_river | upper | medium | stained | 0 | 1 | pending PO | | |
| northern_pike | freshwater_river | upper | medium | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | upper | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | upper | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | upper | fast | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | slow | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | slow | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | slow | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | medium | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | medium | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | medium | dirty | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | fast | clear | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | fast | stained | 0 | 0 | pending PO | | |
| northern_pike | freshwater_river | surface | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | slow | clear | 0 | 1 | pending PO | | |
| trout | freshwater_lake_pond | bottom | slow | stained | 0 | 2 | pending PO | | |
| trout | freshwater_lake_pond | bottom | slow | dirty | 0 | 1 | pending PO | | |
| trout | freshwater_lake_pond | bottom | medium | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | medium | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | medium | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | mid | slow | clear | 0 | 2 | pending PO | | |
| trout | freshwater_lake_pond | mid | slow | stained | 0 | 4 | pending PO | | |
| trout | freshwater_lake_pond | mid | slow | dirty | 0 | 3 | pending PO | | |
| trout | freshwater_lake_pond | mid | medium | dirty | 0 | 4 | pending PO | | |
| trout | freshwater_lake_pond | mid | fast | clear | 1 | 1 | pending PO | | |
| trout | freshwater_lake_pond | mid | fast | stained | 1 | 1 | pending PO | | |
| trout | freshwater_lake_pond | mid | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | slow | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | slow | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | slow | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | medium | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | medium | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | medium | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | upper | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | slow | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | slow | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | slow | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | medium | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | medium | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | medium | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | bottom | slow | clear | 1 | 3 | pending PO | | |
| trout | freshwater_river | bottom | slow | stained | 1 | 5 | pending PO | | |
| trout | freshwater_river | bottom | slow | dirty | 0 | 4 | pending PO | | |
| trout | freshwater_river | bottom | medium | clear | 1 | 0 | pending PO | | |
| trout | freshwater_river | bottom | medium | stained | 1 | 1 | pending PO | | |
| trout | freshwater_river | bottom | medium | dirty | 0 | 1 | pending PO | | |
| trout | freshwater_river | bottom | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_river | bottom | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_river | bottom | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | mid | slow | clear | 0 | 3 | pending PO | | |
| trout | freshwater_river | mid | slow | stained | 0 | 5 | pending PO | | |
| trout | freshwater_river | mid | slow | dirty | 0 | 3 | pending PO | | |
| trout | freshwater_river | mid | medium | dirty | 0 | 4 | pending PO | | |
| trout | freshwater_river | mid | fast | clear | 1 | 1 | pending PO | | |
| trout | freshwater_river | mid | fast | stained | 1 | 1 | pending PO | | |
| trout | freshwater_river | mid | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | slow | clear | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | slow | stained | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | slow | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | medium | clear | 0 | 1 | pending PO | | |
| trout | freshwater_river | upper | medium | stained | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | medium | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_river | upper | fast | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | surface | slow | clear | 0 | 1 | pending PO | | |
| trout | freshwater_river | surface | slow | stained | 0 | 1 | pending PO | | |
| trout | freshwater_river | surface | slow | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | surface | medium | clear | 0 | 1 | pending PO | | |
| trout | freshwater_river | surface | medium | stained | 0 | 1 | pending PO | | |
| trout | freshwater_river | surface | medium | dirty | 0 | 0 | pending PO | | |
| trout | freshwater_river | surface | fast | clear | 0 | 0 | pending PO | | |
| trout | freshwater_river | surface | fast | stained | 0 | 0 | pending PO | | |
| trout | freshwater_river | surface | fast | dirty | 0 | 0 | pending PO | | |

## Thin cells (optional log)

*Count: 13* — per §17.9, thin may proceed; see full matrix.

## Full matrix

| species | water_type | column | pace | clarity | lure_count | fly_count | verdict |
|---|---|---|---|---:|---:|---:|---|
| largemouth_bass | freshwater_lake_pond | bottom | slow | clear | 8 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | slow | stained | 9 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | slow | dirty | 6 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | medium | clear | 4 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | medium | stained | 4 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | medium | dirty | 3 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | mid | slow | clear | 2 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | mid | slow | stained | 3 | 3 | thin |
| largemouth_bass | freshwater_lake_pond | mid | slow | dirty | 1 | 3 | critical |
| largemouth_bass | freshwater_lake_pond | mid | medium | clear | 4 | 4 | ok |
| largemouth_bass | freshwater_lake_pond | mid | medium | stained | 8 | 6 | ok |
| largemouth_bass | freshwater_lake_pond | mid | medium | dirty | 6 | 5 | ok |
| largemouth_bass | freshwater_lake_pond | mid | fast | clear | 1 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | mid | fast | stained | 4 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | mid | fast | dirty | 4 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | upper | slow | clear | 2 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | upper | slow | stained | 2 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | upper | slow | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | upper | medium | clear | 3 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | upper | medium | stained | 4 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | upper | medium | dirty | 2 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | upper | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | upper | fast | stained | 1 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | upper | fast | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | surface | slow | clear | 1 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | surface | slow | stained | 2 | 2 | thin |
| largemouth_bass | freshwater_lake_pond | surface | slow | dirty | 1 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | surface | medium | clear | 3 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | surface | medium | stained | 5 | 2 | thin |
| largemouth_bass | freshwater_lake_pond | surface | medium | dirty | 2 | 1 | critical |
| largemouth_bass | freshwater_lake_pond | surface | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | surface | fast | stained | 1 | 0 | critical |
| largemouth_bass | freshwater_lake_pond | surface | fast | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | slow | clear | 6 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | slow | stained | 7 | 1 | critical |
| largemouth_bass | freshwater_river | bottom | slow | dirty | 5 | 1 | critical |
| largemouth_bass | freshwater_river | bottom | medium | clear | 2 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | medium | stained | 2 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | medium | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | fast | stained | 0 | 0 | critical |
| largemouth_bass | freshwater_river | bottom | fast | dirty | 0 | 0 | critical |
| largemouth_bass | freshwater_river | mid | slow | clear | 2 | 1 | critical |
| largemouth_bass | freshwater_river | mid | slow | stained | 3 | 3 | thin |
| largemouth_bass | freshwater_river | mid | slow | dirty | 1 | 3 | critical |
| largemouth_bass | freshwater_river | mid | medium | clear | 4 | 4 | ok |
| largemouth_bass | freshwater_river | mid | medium | stained | 8 | 6 | ok |
| largemouth_bass | freshwater_river | mid | medium | dirty | 6 | 5 | ok |
| largemouth_bass | freshwater_river | mid | fast | clear | 1 | 1 | critical |
| largemouth_bass | freshwater_river | mid | fast | stained | 4 | 1 | critical |
| largemouth_bass | freshwater_river | mid | fast | dirty | 4 | 0 | critical |
| largemouth_bass | freshwater_river | upper | slow | clear | 2 | 1 | critical |
| largemouth_bass | freshwater_river | upper | slow | stained | 2 | 1 | critical |
| largemouth_bass | freshwater_river | upper | slow | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_river | upper | medium | clear | 3 | 1 | critical |
| largemouth_bass | freshwater_river | upper | medium | stained | 4 | 1 | critical |
| largemouth_bass | freshwater_river | upper | medium | dirty | 2 | 0 | critical |
| largemouth_bass | freshwater_river | upper | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_river | upper | fast | stained | 1 | 0 | critical |
| largemouth_bass | freshwater_river | upper | fast | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_river | surface | slow | clear | 1 | 1 | critical |
| largemouth_bass | freshwater_river | surface | slow | stained | 1 | 1 | critical |
| largemouth_bass | freshwater_river | surface | slow | dirty | 0 | 0 | critical |
| largemouth_bass | freshwater_river | surface | medium | clear | 3 | 1 | critical |
| largemouth_bass | freshwater_river | surface | medium | stained | 4 | 1 | critical |
| largemouth_bass | freshwater_river | surface | medium | dirty | 1 | 0 | critical |
| largemouth_bass | freshwater_river | surface | fast | clear | 0 | 0 | critical |
| largemouth_bass | freshwater_river | surface | fast | stained | 1 | 0 | critical |
| largemouth_bass | freshwater_river | surface | fast | dirty | 1 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | clear | 8 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | stained | 8 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | slow | dirty | 5 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | clear | 4 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | stained | 4 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | medium | dirty | 3 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | mid | slow | clear | 2 | 2 | thin |
| smallmouth_bass | freshwater_lake_pond | mid | slow | stained | 3 | 3 | thin |
| smallmouth_bass | freshwater_lake_pond | mid | slow | dirty | 1 | 2 | critical |
| smallmouth_bass | freshwater_lake_pond | mid | medium | clear | 5 | 5 | ok |
| smallmouth_bass | freshwater_lake_pond | mid | medium | stained | 9 | 6 | ok |
| smallmouth_bass | freshwater_lake_pond | mid | medium | dirty | 6 | 4 | ok |
| smallmouth_bass | freshwater_lake_pond | mid | fast | clear | 2 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | mid | fast | stained | 5 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | mid | fast | dirty | 4 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | slow | clear | 2 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | slow | stained | 2 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | slow | dirty | 1 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | medium | clear | 3 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | medium | stained | 4 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | medium | dirty | 2 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | fast | stained | 1 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | upper | fast | dirty | 1 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | slow | clear | 1 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | slow | stained | 1 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | slow | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | medium | clear | 3 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | medium | stained | 3 | 1 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | medium | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | fast | stained | 0 | 0 | critical |
| smallmouth_bass | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | bottom | slow | clear | 7 | 3 | ok |
| smallmouth_bass | freshwater_river | bottom | slow | stained | 7 | 5 | ok |
| smallmouth_bass | freshwater_river | bottom | slow | dirty | 4 | 4 | ok |
| smallmouth_bass | freshwater_river | bottom | medium | clear | 3 | 0 | critical |
| smallmouth_bass | freshwater_river | bottom | medium | stained | 3 | 1 | critical |
| smallmouth_bass | freshwater_river | bottom | medium | dirty | 1 | 1 | critical |
| smallmouth_bass | freshwater_river | bottom | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | bottom | fast | stained | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | bottom | fast | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | mid | slow | clear | 2 | 3 | thin |
| smallmouth_bass | freshwater_river | mid | slow | stained | 3 | 4 | thin |
| smallmouth_bass | freshwater_river | mid | slow | dirty | 1 | 2 | critical |
| smallmouth_bass | freshwater_river | mid | medium | clear | 5 | 7 | ok |
| smallmouth_bass | freshwater_river | mid | medium | stained | 9 | 8 | ok |
| smallmouth_bass | freshwater_river | mid | medium | dirty | 6 | 4 | ok |
| smallmouth_bass | freshwater_river | mid | fast | clear | 2 | 1 | critical |
| smallmouth_bass | freshwater_river | mid | fast | stained | 5 | 1 | critical |
| smallmouth_bass | freshwater_river | mid | fast | dirty | 4 | 0 | critical |
| smallmouth_bass | freshwater_river | upper | slow | clear | 2 | 1 | critical |
| smallmouth_bass | freshwater_river | upper | slow | stained | 2 | 1 | critical |
| smallmouth_bass | freshwater_river | upper | slow | dirty | 1 | 0 | critical |
| smallmouth_bass | freshwater_river | upper | medium | clear | 3 | 2 | thin |
| smallmouth_bass | freshwater_river | upper | medium | stained | 4 | 1 | critical |
| smallmouth_bass | freshwater_river | upper | medium | dirty | 2 | 0 | critical |
| smallmouth_bass | freshwater_river | upper | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | upper | fast | stained | 1 | 0 | critical |
| smallmouth_bass | freshwater_river | upper | fast | dirty | 1 | 0 | critical |
| smallmouth_bass | freshwater_river | surface | slow | clear | 1 | 1 | critical |
| smallmouth_bass | freshwater_river | surface | slow | stained | 1 | 1 | critical |
| smallmouth_bass | freshwater_river | surface | slow | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | surface | medium | clear | 3 | 1 | critical |
| smallmouth_bass | freshwater_river | surface | medium | stained | 3 | 1 | critical |
| smallmouth_bass | freshwater_river | surface | medium | dirty | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | surface | fast | clear | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | surface | fast | stained | 0 | 0 | critical |
| smallmouth_bass | freshwater_river | surface | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | slow | clear | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | slow | stained | 1 | 1 | critical |
| northern_pike | freshwater_lake_pond | bottom | slow | dirty | 1 | 1 | critical |
| northern_pike | freshwater_lake_pond | bottom | medium | clear | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | medium | stained | 1 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | medium | dirty | 1 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | mid | slow | clear | 1 | 0 | critical |
| northern_pike | freshwater_lake_pond | mid | slow | stained | 1 | 4 | critical |
| northern_pike | freshwater_lake_pond | mid | slow | dirty | 1 | 4 | critical |
| northern_pike | freshwater_lake_pond | mid | medium | clear | 4 | 3 | ok |
| northern_pike | freshwater_lake_pond | mid | medium | stained | 4 | 7 | ok |
| northern_pike | freshwater_lake_pond | mid | medium | dirty | 1 | 6 | critical |
| northern_pike | freshwater_lake_pond | mid | fast | clear | 2 | 1 | critical |
| northern_pike | freshwater_lake_pond | mid | fast | stained | 2 | 1 | critical |
| northern_pike | freshwater_lake_pond | mid | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | upper | slow | clear | 0 | 1 | critical |
| northern_pike | freshwater_lake_pond | upper | slow | stained | 0 | 1 | critical |
| northern_pike | freshwater_lake_pond | upper | slow | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | upper | medium | clear | 0 | 1 | critical |
| northern_pike | freshwater_lake_pond | upper | medium | stained | 0 | 1 | critical |
| northern_pike | freshwater_lake_pond | upper | medium | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | upper | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | upper | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | upper | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | surface | slow | clear | 1 | 0 | critical |
| northern_pike | freshwater_lake_pond | surface | slow | stained | 2 | 1 | critical |
| northern_pike | freshwater_lake_pond | surface | slow | dirty | 1 | 1 | critical |
| northern_pike | freshwater_lake_pond | surface | medium | clear | 1 | 0 | critical |
| northern_pike | freshwater_lake_pond | surface | medium | stained | 2 | 1 | critical |
| northern_pike | freshwater_lake_pond | surface | medium | dirty | 1 | 1 | critical |
| northern_pike | freshwater_lake_pond | surface | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | surface | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | bottom | slow | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | bottom | slow | stained | 1 | 1 | critical |
| northern_pike | freshwater_river | bottom | slow | dirty | 1 | 1 | critical |
| northern_pike | freshwater_river | bottom | medium | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | bottom | medium | stained | 1 | 0 | critical |
| northern_pike | freshwater_river | bottom | medium | dirty | 1 | 0 | critical |
| northern_pike | freshwater_river | bottom | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | bottom | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_river | bottom | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | mid | slow | clear | 1 | 1 | critical |
| northern_pike | freshwater_river | mid | slow | stained | 1 | 5 | critical |
| northern_pike | freshwater_river | mid | slow | dirty | 1 | 4 | critical |
| northern_pike | freshwater_river | mid | medium | clear | 4 | 4 | ok |
| northern_pike | freshwater_river | mid | medium | stained | 4 | 8 | ok |
| northern_pike | freshwater_river | mid | medium | dirty | 1 | 6 | critical |
| northern_pike | freshwater_river | mid | fast | clear | 2 | 1 | critical |
| northern_pike | freshwater_river | mid | fast | stained | 2 | 1 | critical |
| northern_pike | freshwater_river | mid | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | upper | slow | clear | 0 | 1 | critical |
| northern_pike | freshwater_river | upper | slow | stained | 0 | 1 | critical |
| northern_pike | freshwater_river | upper | slow | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | upper | medium | clear | 0 | 1 | critical |
| northern_pike | freshwater_river | upper | medium | stained | 0 | 1 | critical |
| northern_pike | freshwater_river | upper | medium | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | upper | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | upper | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_river | upper | fast | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | slow | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | slow | stained | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | slow | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | medium | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | medium | stained | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | medium | dirty | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | fast | clear | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | fast | stained | 0 | 0 | critical |
| northern_pike | freshwater_river | surface | fast | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | slow | clear | 0 | 1 | critical |
| trout | freshwater_lake_pond | bottom | slow | stained | 0 | 2 | critical |
| trout | freshwater_lake_pond | bottom | slow | dirty | 0 | 1 | critical |
| trout | freshwater_lake_pond | bottom | medium | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | medium | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | medium | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | fast | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | fast | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | bottom | fast | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | mid | slow | clear | 0 | 2 | critical |
| trout | freshwater_lake_pond | mid | slow | stained | 0 | 4 | critical |
| trout | freshwater_lake_pond | mid | slow | dirty | 0 | 3 | critical |
| trout | freshwater_lake_pond | mid | medium | clear | 3 | 4 | thin |
| trout | freshwater_lake_pond | mid | medium | stained | 3 | 6 | thin |
| trout | freshwater_lake_pond | mid | medium | dirty | 0 | 4 | critical |
| trout | freshwater_lake_pond | mid | fast | clear | 1 | 1 | critical |
| trout | freshwater_lake_pond | mid | fast | stained | 1 | 1 | critical |
| trout | freshwater_lake_pond | mid | fast | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | slow | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | slow | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | slow | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | medium | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | medium | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | medium | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | fast | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | fast | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | upper | fast | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | slow | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | slow | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | slow | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | medium | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | medium | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | medium | dirty | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | fast | clear | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | fast | stained | 0 | 0 | critical |
| trout | freshwater_lake_pond | surface | fast | dirty | 0 | 0 | critical |
| trout | freshwater_river | bottom | slow | clear | 1 | 3 | critical |
| trout | freshwater_river | bottom | slow | stained | 1 | 5 | critical |
| trout | freshwater_river | bottom | slow | dirty | 0 | 4 | critical |
| trout | freshwater_river | bottom | medium | clear | 1 | 0 | critical |
| trout | freshwater_river | bottom | medium | stained | 1 | 1 | critical |
| trout | freshwater_river | bottom | medium | dirty | 0 | 1 | critical |
| trout | freshwater_river | bottom | fast | clear | 0 | 0 | critical |
| trout | freshwater_river | bottom | fast | stained | 0 | 0 | critical |
| trout | freshwater_river | bottom | fast | dirty | 0 | 0 | critical |
| trout | freshwater_river | mid | slow | clear | 0 | 3 | critical |
| trout | freshwater_river | mid | slow | stained | 0 | 5 | critical |
| trout | freshwater_river | mid | slow | dirty | 0 | 3 | critical |
| trout | freshwater_river | mid | medium | clear | 3 | 6 | thin |
| trout | freshwater_river | mid | medium | stained | 3 | 8 | thin |
| trout | freshwater_river | mid | medium | dirty | 0 | 4 | critical |
| trout | freshwater_river | mid | fast | clear | 1 | 1 | critical |
| trout | freshwater_river | mid | fast | stained | 1 | 1 | critical |
| trout | freshwater_river | mid | fast | dirty | 0 | 0 | critical |
| trout | freshwater_river | upper | slow | clear | 0 | 0 | critical |
| trout | freshwater_river | upper | slow | stained | 0 | 0 | critical |
| trout | freshwater_river | upper | slow | dirty | 0 | 0 | critical |
| trout | freshwater_river | upper | medium | clear | 0 | 1 | critical |
| trout | freshwater_river | upper | medium | stained | 0 | 0 | critical |
| trout | freshwater_river | upper | medium | dirty | 0 | 0 | critical |
| trout | freshwater_river | upper | fast | clear | 0 | 0 | critical |
| trout | freshwater_river | upper | fast | stained | 0 | 0 | critical |
| trout | freshwater_river | upper | fast | dirty | 0 | 0 | critical |
| trout | freshwater_river | surface | slow | clear | 0 | 1 | critical |
| trout | freshwater_river | surface | slow | stained | 0 | 1 | critical |
| trout | freshwater_river | surface | slow | dirty | 0 | 0 | critical |
| trout | freshwater_river | surface | medium | clear | 0 | 1 | critical |
| trout | freshwater_river | surface | medium | stained | 0 | 1 | critical |
| trout | freshwater_river | surface | medium | dirty | 0 | 0 | critical |
| trout | freshwater_river | surface | fast | clear | 0 | 0 | critical |
| trout | freshwater_river | surface | fast | stained | 0 | 0 | critical |
| trout | freshwater_river | surface | fast | dirty | 0 | 0 | critical |
