# Recommender rebuild — geometry pool comparison

Generated: **2026-04-25T15:52:53.229Z**

## Matrix

- Seasonal rows (unscoped): 1104
- Total evaluated cells per mode: **29808**
- Dimensions: 3 clarities × 3 regimes × 3 wind/surface bands
- `current_row_pool`: authored `primary_lure_ids` / `primary_fly_ids`.
- `geometry_catalog_pool`: catalog-wide species/water IDs, preserving row geometry, forage, surface, and exclusions.

## Side-by-side metrics

| Metric | current_row_pool | geometry_catalog_pool | Delta |
| --- | ---: | ---: | ---: |
| Total cells | 29808 | 29808 | 0 |
| % exactly 3 lure picks | 100% | 100% | 0% |
| % exactly 3 fly picks | 100% | 100% | 0% |
| Zero-output lure cells | 0 | 0 | 0 |
| Zero-output fly cells | 0 | 0 | 0 |
| Fewer-than-3 lure cells | 0 | 0 | 0 |
| Fewer-than-3 fly cells | 0 | 0 | 0 |
| Repeated presentation-group rate | 27.2% | 12.38% | -14.82% |
| Avoidable repeated presentation-group rate | 0% | 0% | 0% |
| Unavoidable repeated presentation-group rate | 27.2% | 12.38% | -14.82% |
| Repeated family-group rate | 24.75% | 11.44% | -13.31% |
| Adjacent-date same top lure rate | 21.33% | 18.16% | -3.17% |
| Adjacent-date same top fly rate | 24.21% | 21.68% | -2.53% |
| Adjacent-date same lure triple rate | 2.47% | 1.34% | -1.13% |
| Adjacent-date same fly triple rate | 3.71% | 3.3% | -0.41% |
| Southern LMB frog candidate rate when surface slot exists | 100% | 100% | 0% |
| Southern LMB frog finalist rate when surface slot exists | 100% | 100% | 0% |
| Southern LMB frog pick rate when surface slot exists | 59.44% | 43.33% | -16.11% |
| Invalid-pick cells | 0 | 0 | 0 |

## Topwater split by species

| Mode | Species | Surface-slot cells | Open-water surface picks | Frog picks |
| --- | --- | ---: | ---: | ---: |
| current_row_pool | largemouth_bass | 1338 | 2519 | 157 |
| current_row_pool | smallmouth_bass | 780 | 1560 | 0 |
| current_row_pool | northern_pike | 216 | 389 | 43 |
| current_row_pool | trout | 354 | 585 | 0 |
| geometry_catalog_pool | largemouth_bass | 1338 | 2288 | 388 |
| geometry_catalog_pool | smallmouth_bass | 780 | 1560 | 0 |
| geometry_catalog_pool | northern_pike | 216 | 351 | 81 |
| geometry_catalog_pool | trout | 354 | 585 | 0 |

## Worst buckets

### Repeated Presentation-Group Rate

**current_row_pool**
- northern_pike|alaska|freshwater_lake_pond: 72.53% (324 cells)
- northern_pike|alaska|freshwater_river: 70.37% (324 cells)
- northern_pike|mountain_alpine|freshwater_lake_pond: 70.37% (324 cells)
- northern_pike|mountain_alpine|freshwater_river: 69.75% (324 cells)
- northern_pike|south_central|freshwater_river: 67.9% (324 cells)
- northern_pike|appalachian|freshwater_river: 64.51% (324 cells)
- northern_pike|appalachian|freshwater_lake_pond: 63.58% (324 cells)
- northern_pike|midwest_interior|freshwater_lake_pond: 63.27% (324 cells)
- northern_pike|midwest_interior|freshwater_river: 61.73% (324 cells)
- northern_pike|mountain_west|freshwater_lake_pond: 61.73% (324 cells)
- northern_pike|northeast|freshwater_river: 61.11% (324 cells)
- northern_pike|northeast|freshwater_lake_pond: 60.49% (324 cells)

**geometry_catalog_pool**
- northern_pike|alaska|freshwater_lake_pond: 71.3% (324 cells)
- northern_pike|alaska|freshwater_river: 70.68% (324 cells)
- northern_pike|mountain_alpine|freshwater_lake_pond: 70.68% (324 cells)
- northern_pike|mountain_alpine|freshwater_river: 69.75% (324 cells)
- northern_pike|south_central|freshwater_river: 68.52% (324 cells)
- northern_pike|appalachian|freshwater_river: 64.51% (324 cells)
- northern_pike|midwest_interior|freshwater_lake_pond: 63.27% (324 cells)
- northern_pike|appalachian|freshwater_lake_pond: 62.96% (324 cells)
- northern_pike|midwest_interior|freshwater_river: 61.73% (324 cells)
- northern_pike|mountain_west|freshwater_lake_pond: 60.8% (324 cells)
- northern_pike|northeast|freshwater_lake_pond: 60.49% (324 cells)
- northern_pike|great_lakes_upper_midwest|freshwater_river: 60.19% (324 cells)

### Adjacent Same-Top Lure Rate

**current_row_pool**
- trout|great_lakes_upper_midwest|freshwater_river: 34.26% (324 cells)
- trout|northeast|freshwater_river: 32.41% (324 cells)
- trout|southern_california|freshwater_river: 32.41% (324 cells)
- trout|pacific_northwest|freshwater_river: 31.48% (324 cells)
- trout|southwest_high_desert|freshwater_river: 31.48% (324 cells)
- trout|midwest_interior|freshwater_river: 30.86% (324 cells)
- trout|south_central|freshwater_river: 29.94% (324 cells)
- trout|mountain_alpine|freshwater_river: 29.63% (324 cells)
- trout|appalachian|freshwater_river: 29.32% (324 cells)
- northern_pike|inland_northwest|freshwater_river: 29.01% (324 cells)
- trout|southeast_atlantic|freshwater_river: 29.01% (324 cells)
- trout|alaska|freshwater_river: 28.7% (324 cells)

**geometry_catalog_pool**
- northern_pike|mountain_west|freshwater_river: 29.63% (324 cells)
- northern_pike|inland_northwest|freshwater_river: 28.4% (324 cells)
- trout|northeast|freshwater_river: 27.78% (324 cells)
- trout|northern_california|freshwater_river: 27.47% (324 cells)
- trout|southern_california|freshwater_river: 27.16% (324 cells)
- trout|southeast_atlantic|freshwater_river: 26.54% (324 cells)
- northern_pike|mountain_alpine|freshwater_river: 25.93% (324 cells)
- trout|pacific_northwest|freshwater_river: 25.93% (324 cells)
- northern_pike|mountain_west|freshwater_lake_pond: 25.31% (324 cells)
- northern_pike|great_lakes_upper_midwest|freshwater_river: 25% (324 cells)
- northern_pike|midwest_interior|freshwater_river: 25% (324 cells)
- northern_pike|south_central|freshwater_river: 25% (324 cells)

### Adjacent Same-Top Fly Rate

**current_row_pool**
- largemouth_bass|florida|freshwater_lake_pond: 34.57% (324 cells)
- largemouth_bass|southwest_desert|freshwater_lake_pond: 34.57% (324 cells)
- largemouth_bass|hawaii|freshwater_lake_pond: 33.95% (324 cells)
- largemouth_bass|northern_california|freshwater_river: 33.33% (324 cells)
- largemouth_bass|southeast_atlantic|freshwater_river: 33.33% (324 cells)
- largemouth_bass|inland_northwest|freshwater_lake_pond: 33.02% (324 cells)
- largemouth_bass|gulf_coast|freshwater_river: 32.72% (324 cells)
- largemouth_bass|northern_california|freshwater_lake_pond: 31.79% (324 cells)
- largemouth_bass|southern_california|freshwater_river: 31.79% (324 cells)
- largemouth_bass|great_lakes_upper_midwest|freshwater_lake_pond: 31.17% (324 cells)
- largemouth_bass|southwest_high_desert|freshwater_lake_pond: 30.86% (324 cells)
- largemouth_bass|midwest_interior|freshwater_river: 30.56% (324 cells)

**geometry_catalog_pool**
- largemouth_bass|florida|freshwater_lake_pond: 32.72% (324 cells)
- largemouth_bass|southwest_desert|freshwater_lake_pond: 31.48% (324 cells)
- largemouth_bass|southeast_atlantic|freshwater_river: 29.32% (324 cells)
- largemouth_bass|inland_northwest|freshwater_lake_pond: 29.01% (324 cells)
- largemouth_bass|southwest_desert|freshwater_river: 28.7% (324 cells)
- largemouth_bass|southwest_high_desert|freshwater_lake_pond: 28.09% (324 cells)
- largemouth_bass|florida|freshwater_river: 27.78% (324 cells)
- largemouth_bass|gulf_coast|freshwater_river: 27.78% (324 cells)
- largemouth_bass|southern_california|freshwater_river: 27.78% (324 cells)
- largemouth_bass|south_central|freshwater_lake_pond: 27.47% (324 cells)
- largemouth_bass|southwest_high_desert|freshwater_river: 27.47% (324 cells)
- largemouth_bass|mountain_west|freshwater_lake_pond: 27.16% (324 cells)

## Safety

- Geometry mode invalid-pick cells: **0**
- Geometry mode considered safe by hard validation: **Yes**

## Direct analysis

- Does geometry_catalog_pool materially reduce repeated presentation_group rate? **Yes**. Current 27.2%, geometry 12.38%.
- Does it materially reduce repeated family_group rate? **Yes**. Current 24.75%, geometry 11.44%.
- Does it improve adjacent-date variety? **Yes**. Same-top lure 21.33% -> 18.16%; same-top fly 24.21% -> 21.68%.
- Does it increase frog/topwater variety for southern LMB without making frogs absurdly dominant? **No**. Frog pick rate 59.44% -> 43.33%.
- Does it create any obviously bad recommendations? **No** by automated hard validation.
- Are there species/regions/water types where geometry mode is clearly better? Review worst-bucket deltas above; lower geometry rates indicate likely improvement.
- Are there species/regions/water types where current row pools are safer? Current row pools are safer where geometry expands into valid-but-regionally-questionable catalog items; this script flags hard invalidity only, not biological taste.
- Should production move toward this architecture, or manually repair row menus? **Recommendation:** use a staged geometry-pool implementation only after a human review layer for regional exclusions/boosts. The prototype preserves hard validity, but exact row menus still encode regional taste that catalog-wide filtering cannot see.

Full machine-readable report: `docs/audits/recommender-rebuild/geometry-pool-comparison.json`.
