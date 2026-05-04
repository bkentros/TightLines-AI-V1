# Recommender rebuild — repeat cause analysis

Generated: **2026-04-29T19:34:31.790Z**

## Executive conclusion

Current production repeats are dominated by **row_menu_limit** in this classifier. Full geometry remains hard-useful as an audit contrast, but it does not erase structural lane repetition; the best next production pass is a hybrid preferred-pool plus group-aware rotation/third-slot rule, not a direct full-geometry switch.

## Repeat cause breakdown

| Cause | Current repeat slots | Current slot rate | Geometry repeat slots | Geometry slot rate |
| --- | ---: | ---: | ---: | ---: |
| single_group_lane | 0 | 0% | 0 | 0% |
| profile_geometry_repeat | 0 | 0% | 0 | 0% |
| catalog_distribution_limit | 4508 | 33.78% | 4510 | 100% |
| row_menu_limit | 8838 | 66.22% | 0 | 0% |
| selector_choice | 0 | 0% | 0 | 0% |
| unknown_needs_review | 0 | 0% | 0 | 0% |

- Current repeated cells: **10642**; repeat slots: **13346**.
- Geometry repeated cells: **3690**; repeat slots: **4510**.
- Cells repeated in both modes: **3675**.
- Cells repeated only in current mode: **6967** (23.37%).
- Cells repeated only in geometry mode: **15** (0.05%).

## Worst buckets

### Species

- northern_pike: 63.24% repeated cells (3688/5832); dominant catalog_distribution_limit
- largemouth_bass: 46.39% repeated cells (4810/10368); dominant row_menu_limit
- smallmouth_bass: 20.06% repeated cells (1820/9072); dominant row_menu_limit
- trout: 7.14% repeated cells (324/4536); dominant row_menu_limit

### Species / Water

- northern_pike|freshwater_river: 63.58% repeated cells (1854/2916); dominant catalog_distribution_limit
- northern_pike|freshwater_lake_pond: 62.89% repeated cells (1834/2916); dominant catalog_distribution_limit
- largemouth_bass|freshwater_river: 47.03% repeated cells (2438/5184); dominant row_menu_limit
- largemouth_bass|freshwater_lake_pond: 45.76% repeated cells (2372/5184); dominant row_menu_limit
- smallmouth_bass|freshwater_lake_pond: 40.12% repeated cells (1820/4536); dominant row_menu_limit
- trout|freshwater_river: 7.14% repeated cells (324/4536); dominant row_menu_limit
- smallmouth_bass|freshwater_river: 0% repeated cells (0/4536); dominant single_group_lane

### Species / Region / Water

- northern_pike|alaska|freshwater_lake_pond: 71.3% repeated cells (231/324); dominant catalog_distribution_limit
- northern_pike|alaska|freshwater_river: 70.68% repeated cells (229/324); dominant catalog_distribution_limit
- northern_pike|mountain_alpine|freshwater_lake_pond: 70.68% repeated cells (229/324); dominant catalog_distribution_limit
- northern_pike|mountain_alpine|freshwater_river: 69.75% repeated cells (226/324); dominant catalog_distribution_limit
- northern_pike|south_central|freshwater_river: 68.21% repeated cells (221/324); dominant catalog_distribution_limit
- northern_pike|appalachian|freshwater_river: 64.2% repeated cells (208/324); dominant catalog_distribution_limit
- northern_pike|midwest_interior|freshwater_lake_pond: 63.58% repeated cells (206/324); dominant catalog_distribution_limit
- northern_pike|appalachian|freshwater_lake_pond: 62.96% repeated cells (204/324); dominant catalog_distribution_limit
- northern_pike|midwest_interior|freshwater_river: 61.42% repeated cells (199/324); dominant catalog_distribution_limit
- northern_pike|mountain_west|freshwater_lake_pond: 60.8% repeated cells (197/324); dominant catalog_distribution_limit

### Species / Region / Water / Month

- northern_pike|alaska|freshwater_river|12: 100% repeated cells (27/27); dominant catalog_distribution_limit
- largemouth_bass|northern_california|freshwater_lake_pond|2: 100% repeated cells (27/27); dominant row_menu_limit
- largemouth_bass|northern_california|freshwater_river|11: 100% repeated cells (27/27); dominant row_menu_limit
- largemouth_bass|northern_california|freshwater_lake_pond|12: 100% repeated cells (27/27); dominant row_menu_limit
- smallmouth_bass|appalachian|freshwater_lake_pond|11: 100% repeated cells (27/27); dominant row_menu_limit
- northern_pike|great_lakes_upper_midwest|freshwater_lake_pond|11: 100% repeated cells (27/27); dominant catalog_distribution_limit
- largemouth_bass|inland_northwest|freshwater_river|3: 100% repeated cells (27/27); dominant row_menu_limit
- largemouth_bass|midwest_interior|freshwater_lake_pond|2: 100% repeated cells (27/27); dominant row_menu_limit
- largemouth_bass|midwest_interior|freshwater_river|2: 100% repeated cells (27/27); dominant row_menu_limit
- largemouth_bass|mountain_west|freshwater_river|2: 100% repeated cells (27/27); dominant row_menu_limit

## Lane-Level Catalog Thinness

| Lane | Current lure PG avg | Current fly PG avg | Geometry lure PG avg | Geometry fly PG avg | Geometry expansion rate |
| --- | ---: | ---: | ---: | ---: | ---: |
| northern_pike|freshwater_river|surface|slow | 0.15 | 0.44 | 0.15 | 0.44 | 0% |
| northern_pike|freshwater_river|surface|medium | 0.15 | 0.44 | 0.15 | 0.44 | 0% |
| northern_pike|freshwater_river|surface|fast | 0.15 | 0.44 | 0.15 | 0.44 | 0% |
| northern_pike|freshwater_lake_pond|surface|slow | 0.19 | 0.56 | 0.37 | 0.74 | 18.52% |
| northern_pike|freshwater_lake_pond|surface|medium | 0.19 | 0.56 | 0.37 | 0.74 | 18.52% |
| northern_pike|freshwater_lake_pond|surface|fast | 0.19 | 0.56 | 0.37 | 0.74 | 18.52% |
| smallmouth_bass|freshwater_river|surface|slow | 0.3 | 0.91 | 0.3 | 0.91 | 0% |
| smallmouth_bass|freshwater_river|surface|medium | 0.3 | 0.91 | 0.3 | 0.91 | 0% |
| smallmouth_bass|freshwater_river|surface|fast | 0.3 | 0.91 | 0.3 | 0.91 | 0% |
| smallmouth_bass|freshwater_lake_pond|surface|slow | 0.33 | 1 | 0.33 | 1 | 0% |
| smallmouth_bass|freshwater_lake_pond|surface|medium | 0.33 | 1 | 0.33 | 1 | 0% |
| smallmouth_bass|freshwater_lake_pond|surface|fast | 0.33 | 1 | 0.33 | 1 | 0% |
| largemouth_bass|freshwater_river|surface|slow | 0.35 | 1.01 | 0.35 | 1.06 | 0% |
| largemouth_bass|freshwater_river|surface|medium | 0.35 | 1.01 | 0.35 | 1.06 | 0% |
| largemouth_bass|freshwater_river|surface|fast | 0.35 | 1.01 | 0.35 | 1.06 | 0% |
| trout|freshwater_river|surface|slow | 0.35 | 1.05 | 0.35 | 1.05 | 0% |
| trout|freshwater_river|surface|medium | 0.35 | 1.05 | 0.35 | 1.05 | 0% |
| trout|freshwater_river|surface|fast | 0.35 | 1.05 | 0.35 | 1.05 | 0% |
| trout|freshwater_river|upper|slow | 0.62 | 1.24 | 1.24 | 1.24 | 0% |
| trout|freshwater_river|upper|medium | 0.62 | 1.24 | 1.24 | 1.24 | 0% |

## Target Profile Geometry

- Duplicate lane profile rate: **56.48%**.
- Duplicate column profile rate: **59.52%**.
- Current repeated cells with duplicate lanes: **89.94%**.
- Current repeated cells with duplicate columns: **90.32%**.
- Current rows capable of 3 lure macro groups: **99.97%**.
- Current rows capable of 3 fly macro groups: **92.12%**.
- Geometry capable of 3 lure macro groups: **100%**.
- Geometry capable of 3 fly macro groups: **97.58%**.

## Dominant Issue

The dominant automated cause is **row_menu_limit**. Row menus matter where geometry expands a lane, but profile geometry and catalog lane distribution still cap macro diversity in many repeated cells. A pure catalog-wide pool therefore improves some lane availability without solving repeated profile asks.

## Strategy Evaluation

- **A_manual_row_menu_repair**: Targets 8838 row-menu-limited repeat slots in this run; safe, but not the main lever unless humans identify biologically wrong row menus outside this classifier.
- **B_full_geometry_catalog_pool**: Hard-valid in Pass 8, but this audit still sees 3690 geometry repeated cells; too broad for a direct production switch.
- **C_hybrid_geometry_pool**: Useful as a safety valve for thin authored menus, but unlikely to solve most repeats by itself because geometry still repeats heavily.
- **D_group_aware_profile_diversification**: Best small production lever: preserve hard gates, then make the final slot/profile prefer a different macro group when a legal adjacent-lane alternative exists; duplicate-lane profile rate is 56.48%.
- **E_daily_variety_slot**: Good companion to D: one controlled rotation slot can search same-column/same-pace first, then adjacent pace/column, without changing row/catalog truth.
- **dominant_constraint_estimate**: {"row_menu_limit_slots":8838,"selector_choice_slots":0,"profile_geometry_repeat_slots":0,"catalog_distribution_limit_slots":4508}

## Recommendation

Next production pass should prototype strategy C plus a small piece of D: keep authored row IDs as preferred boosts, allow catalog-valid fallback/rotation candidates under row exclusions, and add a group-aware final-slot preference only when legal alternatives exist. Avoid a raw full-geometry switch and avoid broad manual row rewrites until the hybrid path is tested.

Full machine-readable report: `docs/audits/recommender-rebuild/repeat-cause-analysis.json`.
