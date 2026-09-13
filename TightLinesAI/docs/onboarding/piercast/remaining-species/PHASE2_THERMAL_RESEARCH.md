# PierCast additional-species thermal calibration and eligibility

## Status

The subsequent [final onboarding decisions](PHASE2_ONBOARDING_DECISIONS.md) supersede the activation status described below: seven pairings now enter the private provisional scored lineup; nine annual candidates remain deferred. This report preserves the thermal research and original sensitivity analysis. Public ratings and scientific representation approval remain blocked.

Phase 2 private research integration is implemented with explicit live-activation deferrals. Eight species have provisional thermal sensitivity profiles connected to the owner-only outlook for 14 city/species pairings. The two round-whitefish pairings return their full-year seasonal baselines but no live thermal-combined hypothesis: adult response remains deferred. All nine draft curves remain in offline sensitivity artifacts. None is an empirically fitted adult pier-bite response or an approved live rating. The [machine-readable drafts](../../../PierCast_Remaining_Species_Temperature_Curves.json) preserve every ordinate's calibration basis, rationale and source identifiers.

The eligibility register covers all 16 Phase 1 annual pairings. Three have named covered-structure corroboration, five retain contextual attribution, and eight retain unresolved side attribution. These categories describe the preserved evidence. The Manistee drum newspaper reprint names North Pier, while its linked original DNR report does not name a side; this discrepancy is retained rather than upgrading the primary attribution. All retain temperature-representation and calibration gates. The [eligibility register](phase2-eligibility.json) records each blocking reason.

The four completed species and their seasonal/thermal configuration remain unchanged. The five-city footprint, covered structures, formula, LMHOFS pipeline, caching, daily lock and disabled public catalog remain unchanged. The 29 Phase 1 deferred pairings have no hypothetical combined scores.

## Calibration contract

The variable is normalized **nearshore thermal compatibility**, not the probability of a bite and not the temperature experienced by a fish at depth. This is the same product-calibration interpretation used by the completed core species. Biological evidence constrains plausible direction and breadth. Every numerical ordinate remains a transparent provisional judgment awaiting independent outcome validation.

The formula remains:

`score = clamp(1, 10, 1 + (seasonal - 1) × (0.30 + 0.75 × thermalFit))`

The annual seasonal curve owns local fishery strength and timing. No spawning, nighttime, wind, depth, trend or habitat coefficient is added. Temperature cannot make an excluded pairing available, make a seasonal rating of 1 exceed 1, or add more than five percent of seasonal headroom above the seasonal rating.

Cold shoulders remain nonzero because winter activity and reachable cold-season fish are not equivalent to summer growth. A low seasonal rating already represents weak calendar opportunity; the thermal modifier must not silently recreate seasonal exclusions. Conversely, a broad high-fit region does not imply that every fish occupies or feeds optimally at every temperature in it.

Cold-water drafts accept inputs through 26 C; the other drafts through 32 C. Those endpoints are **review-domain choices**, not lethal limits or validated observations. An out-of-domain input returns unavailable. The wider warm-species domain prevents accidental reuse of the core salmonid cutoff, but its warm tail remains an explicit sensitivity hypothesis. Existing core domains are untouched.

## Evidence interpretation

The source hierarchy separates direct angling outcomes, adult habitat observations, agency biological guidance and experimental physiology. No endpoint is silently converted into another. The preserved [Phase 2 source register](phase2-sources.json), [retrieval ledger](phase2-retrieval-ledger.json), earlier thermal inventory and annual source register retain dates, geographic scope, methods and transfer limitations.

The Wisconsin guide study provides a direct smallmouth angling-temperature association, but its river fly-fishing methods and sampled seasons do not establish a pier optimum or winter response. The Escanaba walleye study models air temperature after excluding correlated predictors; its coefficient cannot be substituted for a water-temperature effect. Its successful-trip catch-rate model is also distinct from the probability of any catch.[^P2_WI_GUIDE2017][^P2_WALLEYE_CATCH2021]

Lake-whitefish loggers recorded a broad range of occupied temperatures, including cold winter water; observed summer means are not selection or feeding experiments. Lake-trout habitat use can be colder than laboratory preference. These observations support broad cold shoulders and caution about treating the lake surface as bottom-water temperature.[^P2_WHITEFISH_REED2023][^P2_LAKE_TROUT_HURON2003]

The historical GLFC tables distinguish life stages, acclimation, field occurrence and heated-discharge context. The round-whitefish entries are sparse and cannot establish an adult pier-catch optimum. Juvenile drum acute-cold laboratory work describes metabolic responses, not overwintering adult fishing. Catfish post-release movement concerns handling effects; it does not supply a pre-capture bite function.[^P2_GLFC1987][^P2_DRUM_COLD2023][^P2_CATFISH_RELEASE2025]

The largemouth tournament study concerns weigh-in probability in an Iowa lake, including selection by tournament rules and angler behavior. It does not yield an unconditional Great Lakes pier response. General agency activity guidance and independent winter behavior studies constrain the candidate's direction without claiming a measured plateau.[^P2_BASS_TOURNAMENT2022][^P2_LARGEMOUTH_DNR][^A_BASS_WINTER2008][^A_BASS_WINTER2024]

## Species-specific candidates

### lake trout

**Confidence:** low. **Disposition:** sensitivity candidate only.

Cold shoulders remain substantial because lake trout use cold reachable water. The high-fit region is broad around the agency cold-water band; increasingly warm surface water is a poorer nearshore proxy. No laboratory optimum is labeled a bite optimum.[^T005][^T016][^P2_LAKE_TROUT_HURON2003]

Lakeward or channel-bottom fishing can encounter water colder than the surface. Summer offshore occupancy cannot validate pier success.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.65 |
| 2 | 0.80 |
| 4 | 0.90 |
| 8 | 1.00 |
| 11 | 1.00 |
| 14 | 0.85 |
| 16 | 0.65 |
| 18 | 0.40 |
| 20 | 0.20 |
| 23 | 0.10 |
| 26 | 0.05 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### walleye

**Confidence:** low. **Disposition:** sensitivity candidate only.

Broad cold-to-moderate suitability avoids a growth-optimum-only summer curve. The spring nighttime seasonal peak remains meaningful in cool water. Warm decline is a provisional compatibility judgment, not the air-temperature coefficient from Escanaba.[^P2_WALLEYE_CATCH2021][^P2_WALLEYE_TELEMETRY2025][^A_DNR_WALLEYE]

Light and fishing technique influence catches but remain outside the unchanged two-input formula. Surface/channel temperature separation remains unresolved.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.60 |
| 4 | 0.75 |
| 8 | 0.90 |
| 12 | 1.00 |
| 20 | 1.00 |
| 23 | 0.90 |
| 26 | 0.70 |
| 29 | 0.40 |
| 32 | 0.20 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### smallmouth bass

**Confidence:** low. **Disposition:** sensitivity candidate only.

Directional warming support comes from actual river angling. A broad high-fit interval and restrained warm decline avoid claiming a fitted peak or assuming winter dormancy. The high-temperature limb is explicitly unvalidated.[^P2_WI_GUIDE2017][^A_BASS_CARTER2012][^A_SMALLMOUTH_RR1971][^T023]

Guided fly-fishing and a noon river measurement differ from Great Lakes pier methods and modeled surface water. Harbor departure at a particular temperature is not a bite threshold.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.35 |
| 4 | 0.45 |
| 8 | 0.60 |
| 12 | 0.75 |
| 16 | 0.90 |
| 20 | 1.00 |
| 26 | 1.00 |
| 29 | 0.85 |
| 32 | 0.60 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### freshwater drum

**Confidence:** low. **Disposition:** sensitivity candidate only.

Adult habitat/preference evidence supports a broad warmer-water compatibility region. Cold values stay nonzero; acute juvenile cold-stress and heated-discharge records cannot define adult winter bite suppression.[^P2_GLFC1987][^P2_DRUM_COLD2023][^A_DRUM_BUR1984]

Bottom/channel fishing may not share the frozen lakeward surface temperature; no adult pier temperature-catch experiment identifies ordinates.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.30 |
| 4 | 0.40 |
| 8 | 0.55 |
| 12 | 0.70 |
| 16 | 0.85 |
| 20 | 0.95 |
| 22 | 1.00 |
| 27 | 1.00 |
| 30 | 0.85 |
| 32 | 0.65 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### yellow perch

**Confidence:** low. **Disposition:** sensitivity candidate only.

Retain broad cold-water suitability so spring and winter feeding are not erased by a summer preference band. Broad moderate-water compatibility and warm decline are product calibration choices.[^P2_PERCH_USGS][^T028][^A_PERCH_ATLAS1981][^A_PERCH_GENETICS2019]

Schools, depth and prey can dominate catch rate. The 19–21 C general preference is not a narrow pier-catch optimum; surface-to-bottom transfer needs validation.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.65 |
| 4 | 0.80 |
| 8 | 0.90 |
| 12 | 0.95 |
| 16 | 1.00 |
| 21 | 1.00 |
| 24 | 0.85 |
| 27 | 0.65 |
| 30 | 0.35 |
| 32 | 0.20 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### lake whitefish

**Confidence:** low. **Disposition:** sensitivity candidate only.

Broad cold shoulder and moderate-water high-fit interval acknowledge winter activity and diverse occupied temperatures. The curve qualifies lawful feeding opportunity; spawning occupancy does not create a bite bonus.[^P2_WHITEFISH_REED2023][^A_DNR_WHITEFISH][^P2_WHITEFISH_GEAR2025]

Tag recovery is sparse and northwestern Lake Michigan differs from Grand Haven. Lawful bait success and surface-to-bottom representation are unvalidated.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.75 |
| 3 | 0.90 |
| 6 | 1.00 |
| 12 | 1.00 |
| 15 | 0.90 |
| 18 | 0.65 |
| 21 | 0.40 |
| 24 | 0.20 |
| 26 | 0.10 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### round whitefish

**Confidence:** very_low. **Disposition:** sensitivity candidate only.

Very-low-confidence cold-water compatibility hypothesis for sensitivity review only. No single historical occurrence or spawning temperature defines the peak; the moderate-width high-fit region and all ordinates remain unresolved empirical hypotheses.[^P2_GLFC1987][^T019][^ROUND_DECLINE][^P2_ROUND_JUVENILE2023]

The weakest thermal draft: no retrieved adult pier angling response, sparse historical context, and pre-spawn feeding cessation. Must not share lake-whitefish approval or be activated on the strength of this draft. The 2023 shuttle-box experiment tested 55-62 mm juveniles reared at 15 C; it cannot calibrate adult pier feeding. Adult high-fit plateau remains unresolved.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.75 |
| 3 | 0.90 |
| 6 | 1.00 |
| 10 | 1.00 |
| 14 | 0.85 |
| 18 | 0.55 |
| 22 | 0.25 |
| 26 | 0.10 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### channel catfish

**Confidence:** low. **Disposition:** sensitivity candidate only.

Broad warm compatibility with meaningful cold shoulders reflects adult habitat breadth. Cultured juvenile feeding, post-release acceleration and power-plant conditions do not set a bite plateau or winter zero.[^P2_GLFC1987][^A_CATFISH_KRUCKMAN2016][^A_CATFISH_DISCHARGE1999][^P2_CATFISH_RELEASE2025]

Grand River channel-bottom temperature and the lakeward model cell may diverge. The mild warm decline is a sensitivity hypothesis, not survival or post-capture physiology.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.40 |
| 4 | 0.50 |
| 8 | 0.65 |
| 12 | 0.80 |
| 16 | 0.90 |
| 20 | 0.95 |
| 24 | 1.00 |
| 28 | 1.00 |
| 30 | 0.90 |
| 32 | 0.75 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
### largemouth bass

**Confidence:** low. **Disposition:** sensitivity candidate only.

Warm compatibility is broad and cold-water activity remains possible. Agency activity guidance and tournament association support direction, not a quantified pier optimum; the winter shoulder avoids dormancy assumptions.[^P2_LARGEMOUTH_DNR][^P2_BASS_TOURNAMENT2022][^A_BASS_CARTER2012][^A_BASS_WINTER2008][^A_BASS_WINTER2024]

Cover-associated harbor habitat is not equivalent to the outer lakeward cell. Tournament weigh-in and release survival are not unconditional pier catch probabilities.

| Water temperature C | Thermal fit |
| ---: | ---: |
| 0 | 0.35 |
| 4 | 0.45 |
| 8 | 0.60 |
| 12 | 0.75 |
| 16 | 0.90 |
| 21 | 1.00 |
| 28 | 1.00 |
| 30 | 0.90 |
| 32 | 0.70 |

All listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.
## Covered structure and fishing mode

A source saying “piers” does not prove which side produced the catch. A closure can strengthen attribution but does not itself prove that a report excludes an unmapped stub or other structure. Those inferences remain visible. Bottom-oriented or sheltered-harbor fishing also requires assessment of whether the frozen lakeward surface cell represents the relevant water; changing curve shape cannot repair an unvalidated water proxy.

The 2026 Michigan guide is preserved and its relevant printed pages 12, 13, 21 and 31 were visually reviewed. Bass catch-and-immediate-release is allowed year-round where fishing is otherwise open; harvest has a separate season. Manistee lake trout (MM 6-8) has year-round possession. Grand Haven's November 1-30 restriction requires one single-pointed unweighted hook no greater than half an inch from point to shank in the pier-head-to-US-31 waters, across species. The rule is not a whitefish-only seasonal exclusion. Great Lakes walleye permissions are not extended to upstream river waters. The review expires March 31, 2027 and is not a live access-closure certification.[^P2_REGS2026]

| City | Species | Evaluated covered structure | Attribution status | Private research / live activation |
| --- | --- | --- | --- | --- |
| ludington mi | smallmouth bass | ludington_north_breakwater | named_covered_structure_corroboration | provisional_sensitivity_only; live deferred |
| ludington mi | freshwater drum | ludington_north_breakwater | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| ludington mi | yellow perch | ludington_north_breakwater | named_covered_structure_corroboration | provisional_sensitivity_only; live deferred |
| grand haven mi | smallmouth bass | grand_haven_south_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| grand haven mi | freshwater drum | grand_haven_south_pier | contextual_inference_not_exact_confirmation | provisional_sensitivity_only; live deferred |
| grand haven mi | lake whitefish | grand_haven_south_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| grand haven mi | round whitefish | grand_haven_south_pier | unresolved_covered_side | annual_only_thermal_deferred; live deferred |
| grand haven mi | channel catfish | grand_haven_south_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| grand haven mi | largemouth bass | grand_haven_south_pier | contextual_inference_not_exact_confirmation | provisional_sensitivity_only; live deferred |
| manistee mi | lake trout | manistee_north_pier | contextual_inference_not_exact_confirmation | provisional_sensitivity_only; live deferred |
| manistee mi | walleye | manistee_north_pier | contextual_inference_not_exact_confirmation | provisional_sensitivity_only; live deferred |
| manistee mi | smallmouth bass | manistee_north_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| manistee mi | freshwater drum | manistee_north_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |
| manistee mi | yellow perch | manistee_north_pier | named_covered_structure_corroboration | provisional_sensitivity_only; live deferred |
| manistee mi | round whitefish | manistee_north_pier | contextual_inference_not_exact_confirmation | annual_only_thermal_deferred; live deferred |
| manistee mi | largemouth bass | manistee_north_pier | unresolved_covered_side | provisional_sensitivity_only; live deferred |

### ludington mi — smallmouth bass

North Breakwater corroborated in July; remaining port and unspecified-pier observations qualified.

Pier casting or bait fishing around reachable structure/cover; catch-and-release opportunity distinguished from harvest season. Year-round catch-and-immediate-release where otherwise open; harvest is Saturday before Memorial Day through December 31 (2026 guide pp. 12-13).

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### ludington mi — freshwater drum

Unspecified Ludington piers; exact North Breakwater attribution remains a Phase 2 gate.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### ludington mi — yellow perch

North Breakwater has exact June/July evidence; August magnitude uses port-mode shoulder inference.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — smallmouth bass

Grand Haven piers; South-Pier-specific contribution unresolved.

Pier casting or bait fishing around reachable structure/cover; catch-and-release opportunity distinguished from harvest season. Year-round catch-and-immediate-release where otherwise open; harvest is Saturday before Memorial Day through December 31 (2026 guide pp. 12-13). November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — freshwater drum

Channel-facing South Pier supported by pier-context 2026 reports during North-Pier closure; older port totals pool structures.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply. November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — lake whitefish

Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply. November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review; current_lawful_method_magnitude_unvalidated. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — round whitefish

Grand Haven piers, exact South-Pier contribution unresolved.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply. November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review; adult_thermal_response_evidence_very_weak. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — channel catfish

Grand Haven piers; side and current directed effort unresolved.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply. November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### grand haven mi — largemouth bass

Grand Haven piers; South-Pier attribution strengthened by August 2026 pier-context report during North closure.

Pier casting or bait fishing around reachable structure/cover; catch-and-release opportunity distinguished from harvest season. Year-round catch-and-immediate-release where otherwise open; harvest is Saturday before Memorial Day through December 31 (2026 guide pp. 12-13). November 1-30: one single-pointed unweighted hook, at most 0.5 inch from point to shank, throughout the regulated pier-head-to-US-31 waters (pp. 17, 31); do not transfer jig or treble-hook methods.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — lake trout

April 2023 pier catches while South Pier closed support North attribution; 2024 side unspecified.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — walleye

Unspecified piers with North-Pier context in May 2022; excluded closure-era South observations not assigned to North.

Pier casting/bait fishing, strongest evidence at night; no added numerical night modifier. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply. Great Lakes lake-side season is not an upstream river-season determination.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — smallmouth bass

Manistee piers, exact North-side species attribution incomplete; unidentified North-Pier bass not split.

Pier casting or bait fishing around reachable structure/cover; catch-and-release opportunity distinguished from harvest season. Year-round catch-and-immediate-release where otherwise open; harvest is Saturday before Memorial Day through December 31 (2026 guide pp. 12-13).

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — freshwater drum

Harbor/channel-facing piers; North-only attribution still needs method/side confirmation. June 28, 2024 newspaper reprint names North Pier, but the linked original June 26 DNR bulletin says only the pier. Secondary corroboration strengthens the lead without removing the primary side-attribution limitation.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — yellow perch

North Pier explicitly corroborated in April 2017, May 2018 and June 2023.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — round whitefish

Manistee piers; North attribution in April 2023 inferred from South closure, 2025 side unspecified.

Bottom-oriented bait or lure fishing; no offshore/boat or upstream transfer. 2026 guide permits year-round hook-and-line season for this species in the applicable Great Lakes waters; fishing access and lawful gear still apply.

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review; adult_thermal_response_evidence_very_weak. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.

### manistee mi — largemouth bass

Manistee harbor-facing piers; covered North-Pier attribution unresolved.

Pier casting or bait fishing around reachable structure/cover; catch-and-release opportunity distinguished from harvest season. Year-round catch-and-immediate-release where otherwise open; harvest is Saturday before Memorial Day through December 31 (2026 guide pp. 12-13).

**Representation:** The existing lakeward LMHOFS surface cell is not certified as channel-bottom, sheltered harbor-face or fish-experienced temperature.

**Open gates:** thermal_candidate_not_validated; surface_to_fishing_zone_transfer_not_approved; covered_side_attribution_requires_review. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.
## Sensitivity review

The [2,889 temperature samples](phase2-temperature-samples.csv) cover each species at 0.1 C intervals through 32 C, retaining unavailable samples outside a curve's domain. The [6,656 weekly scenarios](phase2-weekly-temperature-scenarios.csv) combine the 16 annual curves, 52 weekly midpoints and eight fixed test temperatures (2, 6, 10, 14, 18, 22, 26 and 30 C).

These are **hypothetical test inputs**, not historical water temperatures, forecasts or evidence of winter catches. Both interpolators and the scoring formula are the actual runtime functions. No second implementation of the formula is used. The numerical output provides a review surface for Phase 3, not an independently validated forecast.

The following reports the largest score change caused by a two-degree difference in input at the species' annual seasonal peak. It tests local slope over the accepted domain. It is not a confidence interval, a measured model error or an accepted public-validation threshold.

| City | Species | Seasonal peak | Maximum score change for 2 C |
| --- | --- | ---: | ---: |
| ludington mi | smallmouth bass | 4.5 | 0.438 |
| ludington mi | freshwater drum | 4.5 | 0.512 |
| ludington mi | yellow perch | 6 | 0.750 |
| grand haven mi | smallmouth bass | 5 | 0.500 |
| grand haven mi | freshwater drum | 7 | 0.877 |
| grand haven mi | lake whitefish | 3.5 | 0.313 |
| grand haven mi | round whitefish | 4 | 0.338 |
| grand haven mi | channel catfish | 5.5 | 0.498 |
| grand haven mi | largemouth bass | 6.5 | 0.804 |
| manistee mi | lake trout | 3 | 0.375 |
| manistee mi | walleye | 4.5 | 0.525 |
| manistee mi | smallmouth bass | 4.5 | 0.438 |
| manistee mi | freshwater drum | 4.5 | 0.512 |
| manistee mi | yellow perch | 7 | 0.900 |
| manistee mi | round whitefish | 3.5 | 0.281 |
| manistee mi | largemouth bass | 3 | 0.292 |
## Private runtime integration and Phase 3 handoff

The owner-only outlook includes a separate `additionalSpeciesResearch` collection for each city. Ludington has three annual candidates, Grand Haven six, and Manistee seven; Frankfort–Elberta and Sheboygan receive no additions. Each entry preserves structure attribution, method constraints, source identifiers, regulation-review dates and blocking reasons. Fourteen entries carry a provisional surface-temperature sensitivity calculation; the two round-whitefish entries carry seasonal baselines only. Their annual curves remain continuous through December–January.

These results are research hypotheses using the actual hourly interpolation, date windows and unchanged scoring formula. They are not added to `dates.species`, headline selection, immutable daily snapshots, the shadow forecast ledger or public catalogs. Scientific gates remain blocked, and targeting eligibility remains unknown. No additional depth, spawning, night or seasonal coefficient has been introduced. Missing coverage and out-of-domain water inputs remain unavailable. Old daily snapshots retain their four-species contract.

Phase 3 should compare the completed four-species lineup and the 16 annual candidates across all 52 weeks, retaining independent species peaks and genuine overlap. Compare the 14 combined hypotheses under matched temperature scenarios; review round whitefish as a seasonal-only deferred case. Do not equate a missing thermal hypothesis with biological absence.

Live activation remains deferred until the retained scientific and structure gates are satisfied. Exact structure uncertainty, adult round-whitefish thermal response, lawful-method whitefish magnitude and the surface-to-fishing-zone transfer cannot be approved by passing software tests or by an annual-lineup discussion. These are explicit limitations, not claims that all species have been onboarded as validated forecasts.

## Reproducibility

Run `npm run generate:pier-cast:phase2` to regenerate thermal TypeScript, sampled fits, hypothetical weekly scores and sensitivity data; run `node scripts/generate-pier-cast-phase2-report.mjs` for this report. Use `npm run check:pier-cast:phase2`, the complete PierCast suite, Phase 1 checks and TypeScript checks for implementation consistency. Passing tests do not establish scientific calibration accuracy.

## Sources

[^T005]: [Lake trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_laketrout.pdf). Published 2008-04; reviewed 2026-09-09. Scope: Wisconsin Lake Michigan context. Agency fact-sheet summary; paired units rounded independently; method, sample and depth unspecified. No monthly optimum, catchability curve, slope, accepted domain or local pier calibration established. Historical management figures not adopted.
[^T016]: [Lake trout species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout). Published date not stated; reviewed 2026-09-09. Scope: Michigan Great Lakes. Agency life-history summary. Broad summary; no city-specific occurrence, strain response, score slope or catch calibration.
[^P2_LAKE_TROUT_HURON2003]: [Bergstedt et al., In situ determination of annual thermal habitat use by lake trout in Lake Huron](https://pubs.usgs.gov/publication/1000840). Published 2003; reviewed 2026-09-12. Scope: Lake Huron; October 1998–June 2001. Temperature loggers, 33 fish. Agency abstract reviewed; fish temperature at depth differs from modeled surface temperature; no directed pier catch curve.
[^P2_WALLEYE_CATCH2021]: [Shaw, Renik and Sass, Angler and environmental influences on walleye and muskellunge angler catch in Escanaba Lake](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257882). Published 2021-09-30; reviewed 2026-09-12. Scope: Escanaba Lake, Wisconsin; 2003–2015. Angler trip success and successful-trip catch rate. Air-temperature coefficients cannot be used as water-temperature response; successful-trip CPUE differs from unconditional trip success; inland lake, not pier.
[^P2_WALLEYE_TELEMETRY2025]: [Foraging activity and habitat use throughout an annual migration of adult walleye from the Trent River in eastern Lake Ontario](https://link.springer.com/article/10.1186/s40317-025-00410-8). Published 2025; reviewed 2026-09-12. Scope: Trent River and eastern Lake Ontario. Adult telemetry, vertical movement and inferred foraging. Movement and modeled growth do not identify an angling optimum; migration and pier reachability differ.
[^A_DNR_WALLEYE]: [Michigan DNR walleye species account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/walleye). Published date not stated; reviewed 2026-09-12. Scope: Michigan. Species biology and fishing guidance. Year-round species feeding does not establish a winter pier fishery; no transferred numeric catch rates.
[^P2_WI_GUIDE2017]: [Wisconsin DNR, Guide to the Future project summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_2017GuidetotheFutureSummary.pdf). Published 2017; reviewed 2026-09-12. Scope: Chippewa, Flambeau and Namekagon rivers; 2012–2016. Guided fly-angling, skill-corrected catch rate and shaded noon water temperature. River/method transfer only; no identified optimum or declining warm limb, no winter sample sufficient for a fitted annual response.
[^A_BASS_CARTER2012]: [Carter et al.: Movement patterns of smallmouth and largemouth bass in and around a Lake Michigan harbor](https://experts.illinois.edu/en/publications/movement-patterns-of-smallmouth-and-largemouth-bass-in-and-around/). Published 2012-06; reviewed 2026-09-12. Scope: North Point Marina, Illinois; 2005–2006. Telemetry: 26 smallmouth and eight largemouth. Supports species-specific habitat use, not transfer of Illinois pier scores. Observed occupancy temperature is not an angling optimum.
[^A_SMALLMOUTH_RR1971]: [Beam: Daily and seasonal movement, as related to habitat use, of smallmouth bass in the Huron River, Michigan](https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/ResearchReports/RR1901-RR2000/RR1971.pdf). Published 1990-07-06; reviewed 2026-09-12. Scope: Huron River, Washtenaw County; 1987–1989. Radiotelemetry, 18 fish. Inland river, not any covered pier. No direct support for winter pier scores.
[^T023]: [Smallmouth bass species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/smallmouth). Published date not stated; reviewed 2026-09-09. Scope: Michigan. Agency life-history summary. No Lake Michigan port-specific adult opportunity function.
[^P2_GLFC1987]: [Wismer and Christie, Temperature Relationships of Great Lakes Fishes](https://www.sealamprey.org/pubs/SpecialPubs/Sp87_3.pdf). Published 1987-07; reviewed 2026-09-12. Scope: Great Lakes and historical source-study locations. Preference/tolerance/growth/spawning compilation. Historical compilation, not independent adult pier angling data. Underlying studies not all retrieved; no numeric bite probabilities.
[^P2_DRUM_COLD2023]: [Wu et al., PPAR Signaling Maintains Metabolic Homeostasis under Hypothermia in Freshwater Drum](https://pmc.ncbi.nlm.nih.gov/articles/PMC9865675/). Published 2023-01-08; reviewed 2026-09-12. Scope: Laboratory, Wuxi, China. Metabolism and gene expression in approximately 21-g cultured fish. Juvenile/culture and acute-change context; neither winter adult inactivity nor angling response can be inferred.
[^A_DRUM_BUR1984]: [Bur: Growth, reproduction, mortality, distribution, and biomass of freshwater drum in Lake Erie](https://pubs.usgs.gov/publication/1000094). Published 1984; reviewed 2026-09-12. Scope: Lake Erie, 1977–1979. Research gill/trap nets and trawls, not angling. Different lake and old food web; no transferable city magnitudes, exact dates or bite probabilities.
[^P2_PERCH_USGS]: [USGS Fish Health Program, Yellow perch](https://www.usgs.gov/labs/fish-health-program/science/yellow-perch-perca-flavescens-fhp). Published date not stated; reviewed 2026-09-12. Scope: General species account. Agency preference and seasonal activity summary. Does not justify suppressing locally supported cold spring pier catches or identify a catch-rate optimum.
[^T028]: [Yellow perch species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/yellow-perch). Published date not stated; reviewed 2026-09-09. Scope: Michigan. Agency life-history summary. No candidate-city occurrence, temperature-score slope or depth-specific provider mapping.
[^A_PERCH_ATLAS1981]: [Michigan Sea Grant: Fish in Lake Michigan—Distribution of selected species](https://repository.library.noaa.gov/view/noaa/38961/noaa_38961_DS1.pdf). Published 1981-06; reviewed 2026-09-12. Scope: Lake Michigan basin. Distribution synthesis reviewed by fishery biologists. Historical distribution map, not contemporary pier catches. Do not erase drowned-river-mouth migration or transfer Green Bay opportunity.
[^A_PERCH_GENETICS2019]: [Chorak et al.: Yellow perch genetic structure and habitat use among connected habitats in eastern Lake Michigan](https://repository.library.noaa.gov/view/noaa/62227/noaa_62227_DS1.pdf). Published 2019; reviewed 2026-09-12. Scope: Eastern Lake Michigan and connected drowned river mouths including Manistee and Pere Marquette. Genetic/habitat sampling; no pier catch-effort model. Autumn/winter movement inference does not locate fish at the covered pier. Connected-lake harvest is not pier evidence.
[^P2_WHITEFISH_REED2023]: [Reed et al., Initial insights on the thermal ecology of lake whitefish in northwestern Lake Michigan](https://www.usgs.gov/publications/initial-insights-thermal-ecology-lake-whitefish-northwestern-lake-michigan). Published 2023-05-18; reviewed 2026-09-12. Scope: Northwestern Lake Michigan and Green Bay; 2017–2018. Archival occupied temperatures, 13 recovered tags from 400 deployments. Small recovered sample; occupancy, not selection or lawful pier feeding. Broad shoulders are product judgments.
[^A_DNR_WHITEFISH]: [Michigan DNR lake whitefish species account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/whitefish). Published date not stated; reviewed 2026-09-12. Scope: Great Lakes. Species biology and fishing guidance. Spawning does not imply biting. General historical recovery wording is superseded by the 2025 agency decline notice for current magnitude.
[^P2_WHITEFISH_GEAR2025]: [Michigan DNR, Grand Haven, Muskegon and Whitehall/Montague single-pointed hook regulations](https://www.michigan.gov/dnr/about/newsroom/releases/2025/11/12/single-pointed-hook-regulations-nov-1-30). Published 2025-11-12; reviewed 2026-09-12. Scope: Named ports; Grand Haven westernmost pierhead to US 31 bridge. Lawful fishing gear, November. Applies to gear in the area, not just targeting whitefish. Regulatory scope does not prove species-specific South-Pier catch magnitude; 2026 guide must be reconciled before activation.
[^T019]: [Round whitefish (menominee) species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/menominee). Published date not stated; reviewed 2026-09-09. Scope: Michigan. Agency life-history summary. No adult thermal opportunity curve; historical local occurrence must be reviewed separately. Lake-whitefish values are not transferable.
[^ROUND_DECLINE]: [Alan Campbell, Grayling and Menominee, Leelanau Enterprise](https://www.leelanaunews.com/article/7195,grayling-and-menominee). Published 2026-02-25; reviewed 2026-09-12. Scope: Northwest Michigan; biologist recalls Frankfort pier trip. Historical pier angling; attributed interview. 2026 publication is not a 2026 catch observation. Journalist species/season generalizations do not override species-specific DNR biology.
[^P2_ROUND_JUVENILE2023]: [Harman et al., Effect of elevated embryonic incubation temperature on the temperature preference of juvenile lake and round whitefish](https://pmc.ncbi.nlm.nih.gov/articles/PMC10469578/). Published 2023; reviewed 2026-09-12. Scope: Laboratory shuttle-box; twelve-month juvenile round whitefish. Thermal selection after developmental incubation treatments, DOI 10.1093/conphys/coad067. Juvenile acclimated preference is not adult pier feeding or bite response; does not validate an adult 6-10 C plateau. No numerical profile is fitted to these values.
[^A_CATFISH_KRUCKMAN2016]: [Kruckman: Diel and seasonal patterns of channel catfish movement and habitat use in the lower Wabash River](https://thekeep.eiu.edu/theses/2504/). Published 2016; reviewed 2026-09-12. Scope: Lower Wabash River; 2014–2016. Telemetry of 27 channel catfish; thesis. Different river; cannot establish Grand Haven winter fish locations or convert activity to bite probability.
[^A_CATFISH_DISCHARGE1999]: [Cooke and McKinley: Winter residency and activity patterns of channel catfish and common carp in a thermal discharge canal](https://www.fecpl.ca/wp-content/uploads/1999/05/Cat_Carp_MS.pdf). Published 1999; reviewed 2026-09-12. Scope: Nanticoke generating station, Lake Erie; winter 1997–1998. Telemetry; some fish collected by winter angling. Artificial heated canal; not a Grand Haven winter analogue. Retained as counterevidence to total inactivity, not as evidence of a covered winter fishery.
[^P2_CATFISH_RELEASE2025]: [Qualich and Louison, Effects of Temperature, Air Exposure Time, and Bleeding on Post-Release Movement of Angled Channel Catfish](https://onlinelibrary.wiley.com/doi/full/10.1111/fme.12805). Published 2025; reviewed 2026-09-12. Scope: Baldwin Lake, Illinois; May–November 2023. Post-angling depth and acceleration, not pre-capture success. Power-plant lake and injured/released fish. No warm-water optimum or catch-response plateau established.
[^P2_LARGEMOUTH_DNR]: [Michigan DNR, Largemouth bass](https://www.michigan.gov/dnr/education/michigan-species/fish-species/largemouth). Published date not stated; reviewed 2026-09-12. Scope: Michigan. Agency habitat/activity guidance. General activity band, not a measured bite plateau. Harbor cover and winter movement differ from lake-facing piers.
[^P2_BASS_TOURNAMENT2022]: [Maahs, Sylvia and Weber, Effects of Length and Bag Limits on Largemouth Bass Tournament Capture and Mortality](https://oup.silverchair-cdn.com/article-minimal/7811583). Published 2022-09-19; reviewed 2026-09-12. Scope: Brushy Creek Lake, Iowa; 2015–2019. Tournament weigh-in probability and mortality. Weigh-in is conditional on tournament rules/angler behavior and excludes culled fish. No open-pier probability, winter curve or surface-only response.
[^A_BASS_WINTER2008]: [Hanson et al.: Intersexual variation in seasonal behaviour and depth distribution of largemouth bass](https://www.fecpl.ca/wp-content/uploads/2008/08/CJZ-Hanson-etal-2008.pdf). Published 2008; reviewed 2026-09-12. Scope: Warner Lake, Ontario; 2004–2005. Whole-lake telemetry of 20 bass. Small inland lake; transfers a qualitative habitat mechanism only. Movement is not bite probability.
[^A_BASS_WINTER2024]: [Reeve et al.: Winter behaviour and energetics of free-swimming largemouth bass](https://www.fecpl.ca/wp-content/uploads/2024/11/Winter-behaviour-and-energetics-of-free-swimming-largemouth-bass.pdf). Published 2025; reviewed 2026-09-12. Scope: Small temperate lake. Wild-fish biologging and bioenergetic inference. Consumption inferred from models, not measured pier catchability; no automatic winter zero or numerical thermal response. File path contains 2024; journal publication is 2025.
[^P2_REGS2026]: [Michigan DNR, 2026 Michigan Fishing Regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf?hash=74FFE796837AA641CBE132C1583F68A5&rev=e64a3c8c16d4439e96323529bd8fc0f2). Published 2026; reviewed 2026-09-12. Scope: Michigan; guide effective through March 31, 2027. Hook-and-line seasons and gear restrictions; printed pages 12, 13, 17, 21, 31. Legal permission is not catch evidence; current access closures remain separate. Lake-side walleye rules must not be extended upstream. Pages 12, 13, 21, 31 visually inspected after local PDF extraction.
[^P2_MANISTEE_REPRINT2024]: [Arielle Breen, Fishing report shows local conditions, best methods](https://www.ourmidland.com/news/article/michigan-fishing-report-shows-ludington-manistee-19544910.php). Published 2024-06-28; reviewed 2026-09-12. Scope: Manistee North Pier; secondary reprint of June 26, 2024 DNR report. Pier catch and method corroboration. The original DNR report says only the pier. North attribution is the newspaper wording, not an agency-confirmed side; the reprint is not an independent catch event.
