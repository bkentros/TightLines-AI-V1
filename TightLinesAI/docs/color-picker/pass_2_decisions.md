# Color picker — pass two research handoff

Status: pass two completed under the clarified known-color standard. Research version `2026-09-05.4`. The catalog and explicit eligibility matrix are a reviewed heuristic specification, not experimental validation or a production release.

## Known-color standard

Use established color names or descriptive combinations grounded in manufacturer palettes, angler use, or documented fly patterns. A realistic application of a known palette to compatible bait construction is allowed; an exact commercial SKU match is not required. Such transfers and component choices remain labeled editorial. Do not invent a fancy name, material effect, or arbitrary combination solely to inflate a pool.

Common names vary between makers. Each record defines the particular variant to illustrate: base hue, flake color, material, opacity, and component placement. A source establishing a color exists is separate from the guidance used to admit it for clarity and light. Source-reference inspection and generated-image acceptance remain required in the artwork pass.

Compatible worm-shape palette transfers are permitted under this standard. The narrow frog/toad chartreuse-stripe entries were removed during credibility cleanup. They are realistic applications of known palettes, not claims that a company offers the exact depicted product. The prior exact-product requirement is superseded by the user's clarification.

## Deliverables

- [All 336 condition pools](pass_2_pool_matrix.md): 56 types × three clarity choices × two light states.
- [59-source register](pass_2_sources.md): supporting guidance, limitations, and whether the page or search excerpt was consulted.
- [123 candidate pattern recipes](pass_2_patterns.md): material, opacity, finish, component description, and release inclusion; 120 occur in the current matrix.
- [Pattern decisions](pass_2_pattern_decisions.csv): 2,604 explicit inclusion/exclusion records within each type's candidate set.
- [Narrow-pool re-audit](pass_2_narrow_pool_review.md): all 108 formerly minimal cells reviewed across 20 profiles; 24 now have three options.
- [Pattern image manifest](pattern_image_manifest.json): 415 type-pattern previews awaiting generation and visual review, in addition to the 67 selector requirements from pass one.

The executable sources live in `supabase/functions/_shared/colorPickerEngine/`: `researchSchema.ts`, `researchSources.ts`, `colorPatterns.ts`, `researchProfiles.ts`, `researchBindings.ts`, `researchMatrix.ts`, and `narrowPoolReview.ts`.

## Re-audit corrections

The initial narrow worm pool mistook commonly cited examples for an exhaustive eligible set. Murky stick worms now have nine distinct finishes: black, black/blue flake, junebug, green pumpkin, black/red flake, black-blue flake with a blue tip, plum/emerald flake, red shad laminate, and PB&J. Documented recipes support the physical colors; their condition eligibility is an explicit application of broader guidance.

Junebug is specified as a deep purple base with separate emerald-green flakes, including purple edge transmission. It must not be rendered as a solid green worm or blue glitter. Named colors vary by manufacturer; these records define the particular recipe our artwork must portray.

The second review added PB&J to worm and bottom-jig pools, white/chartreuse to buzzbaits, black/white-dot spinner blades, perch tail spinners, and black/white sculpins. Firetiger is also eligible on compatible hard topwaters. Source records separate known palette evidence from condition and shape transfers.

The credibility cleanup deliberately reduces variety: 24 cells contain exactly three choices; the other 312 contain four or more. The generated matrix enumerates all small pools. Retired entries cannot be reintroduced to satisfy counts.

See [the credibility cleanup](pass_2_credibility_cleanup.md) for the review by bait family, retired recipes, hardware policy, and remaining limitations.

## Evidence interpretation

All complete condition cells are labeled `editorial_application_of_cited_guidance`. Individual sources support palettes, materials, or directional advice; they do not directly establish every bait/clarity/light intersection. The 26 shared research profiles organize similar physical constructions. Each of the 56 types still has an explicit physical pattern allowlist, so future patterns cannot become eligible through a category or trait fallback.

`reviewed_heuristic` means the catalog author reviewed the rule application. It does not mean an independent fishing expert approved it or a controlled catch study demonstrated equal effectiveness. Search-excerpt sources are marked as such. Manufacturer catalogs establish documented colors/constructions, not effectiveness; no profile relies only on a product catalog.

The most extrapolated areas are spoon and tail-spinner transfers from metal/blade guidance, multipart skirt/trailer recipes, and murky-water applications of some fly palettes. These limitations are preserved in the source register and profile extensions. No source establishes a biological 70% cloud boundary. That remains the agreed product grouping heuristic for pass four.

## Decisions for the engine and UI

1. Retain overlap between light groups. Where evidence does not justify a sky-only exclusion, use the same pool for both states. Never manufacture differences to simulate personalization.
2. There are 24 cells with exactly three options; their combination cannot rotate. The refresh control must explain that all options in this catalog pool are already shown, or remain unavailable for that group. Changing card order must not be advertised as new colors.
3. Within pools containing more than three options, sample equally without replacement and rotate using recent selections. Pattern order in source files and documents is not a rank.
4. Preserve construction: fly poppers and hard poppers never exchange patterns; flash streamers remain reflective; crawfish flies do not receive baitfish-wing colors; plastic blue flake differs from a black/blue skirt.
5. Do not infer tannin from the Stained label, prey presence from a shad/craw pattern name, actual depth from a deep-diver label, or nighttime visibility from a daytime rule.
6. Keep human-facing swatches separate from physical color claims. Artwork must depict the specified material, opacity, flakes, and components. Each manifest entry contains a full generation brief, component colors, reference links, and six visual acceptance checks. Reference review is required before generation and visual inspection before acceptance. The manifest contains requirements, not existing generated assets.
7. Excluded means outside this reviewed launch pool, not incapable of catching fish. Patterns outside a type's enumerated candidate set are also excluded by default; the engine must not broaden a pool to recover from errors.
8. `illustrationHardware` is drawing context only. Do not present it as a condition-based requirement or use it to create an additional color choice. Blade finishes remain part of the actual recommendation for inline/bucktail spinners, where they are the primary visible surface.
9. Source rationale is internal research copy. Pass three must provide concise pattern-specific explanations using the actual admitted pattern and condition, without claiming observed forage or scientific superiority.

## Validation completed

- Catalog reconciliation against all current V4 lure and fly archetypes.
- Exactly one cell per type/clarity/light combination, with 3–11 distinct eligible pattern IDs.
- Unique IDs, valid references, nonempty provenance, explicit construction compatibility, and matching gear/material.
- Domain checks for separate poppers, crawfish and flash streamers, ghost/glidebait restrictions, cloudy metallic finishes, and no bone/pearl padding of surface pools.
- All formerly narrow profiles have a sourced disposition; murky stick worms retain at least eight options. Image briefs preserve junebug components and fly-specific anatomy.
- Failure-injection checks confirm insufficient pools, duplicate patterns, unknown pattern IDs, and missing sources are rejected.
- Targeted TypeScript compilation of the color-picker shared modules.

These checks validate data integrity and the stated design constraints. They do not measure catch effectiveness. The existing lure/fly recommendations, production endpoints, and user interface have not been altered by this pass.

## Next pass

Build the pure selection engine over the reviewed matrix: strict input validation, explicit filtering, unbiased sampling, recency handling, deterministic replay of saved draws, and short explanations. Add behavior tests for full and exhausted pools, retries, invalid inputs, and no cross-bait fallback. Weather integration, screens, generated imagery, and removal of old color advice remain in their planned later passes.
