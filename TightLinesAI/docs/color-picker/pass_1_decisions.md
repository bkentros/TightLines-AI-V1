# Color picker — pass one decisions

Completed September 5, 2026. Historical pass-one snapshot; current research status is documented in [pass two](pass_2_decisions.md). This pass implements the shared taxonomy and audits current coverage; it does not implement color recommendations or UI screens.

## Source of truth

- `supabase/functions/_shared/colorPickerEngine/catalogSchema.ts`: typed catalog contracts.
- `supabase/functions/_shared/colorPickerEngine/taxonomy.ts`: categories, types, component policies, existing archetype mappings, image requirements, and deferred types.
- `scripts/color-picker-catalog-qa.ts`: validates the catalog against the actual V4 lure/fly exports and local image references; fails on missing/stale mappings or cross-gear targets.
- [Generated audit](pass_1_catalog_audit.md): full type checklist, all 80 existing archetype dispositions, and selector image manifest.

The catalog version remains a draft while pass two reviews patterns. No type is eligible to return colors yet. The `ruleFamily` field organizes research, not runtime inheritance or scoring. The source is independent of React Native and of the existing recommendation engine's selection/ranking logic.

## Locked release coverage

Eight categories, 56 types:

| Category | Types |
| --- | ---: |
| Soft plastics | 12 |
| Jigs | 5 |
| Bladed & wire baits | 6 |
| Hard baits | 12 |
| Spoons & metal baits | 5 |
| Topwater lures | 6 |
| Streamers | 9 |
| Surface flies | 1 |

This covers the current freshwater conventional recommender and adds common shape distinctions needed by a standalone picker. It is not a promise to enumerate every commercial product. Trolling/jigging describes the selectable spoon shape/application; actual depth is not inferred. The picker does not recommend a bait type's suitability for a species: the user has already chosen their bait.

Fly popper and hard-bait popper have separate IDs, labels, category, image requirement, material description, and research family. Neither inherits the other's pool. Surface flies initially contains fly poppers only. Sliders/divers, gurglers, frog/mouse flies, and worm flies are explicitly deferred rather than misclassified; these types were not added to release scope simply because their artwork exists.

### Distinctions added during reconciliation

- Separate prop baits and rotating-tail plopper baits: their selector silhouettes differ.
- Separate flash streamers from ordinary baitfish streamers: predominantly reflective material must remain explicit when researching light-dependent patterns.
- Preserve hard swimbaits versus soft paddle tails, and hollow frogs versus solid soft toads.
- Treat existing large/heavy paddle-tail recommendations as paddle-tail types, including the misleadingly generic ID `pike_jig_and_plastic`, whose current display name is Heavy Paddle-Tail Swimbait.
- Existing Large Walking Bait maps to Walking bait; size does not create a color pool.
- Existing Conehead Streamer maps to baitfish streamer based on its actual `baitfish_streamer` presentation and `baitfish` forage metadata. Coneheads are not universally baitfish: only this existing archetype is mapped.
- Do not infer a tail shape from Magnum Worm. Opening the picker from that recommendation offers straight-tail or ribbon-tail worm.
- Existing Large Jerkbait permits sinking/suspending pull presentations without specifying construction. Offer hard jerkbait or pull/jerk bait on entry rather than automatically committing to one.

### Search and navigation

Canonical types are the selection IDs. Search aliases such as “Senko,” “ChatterBait,” or “Clouser minnow” help users find a generic type; they do not imply a brand-specific product or brand color inventory. Broad terms such as “popper,” “worm,” “frog,” and “swimbait” should return the matching explicit choices. Search must not silently pick one result. Exact archetype links use the audited mapping disposition; unknown IDs return to type selection instead of defaulting to a bait.

## Multipart color rules

Each result card represents one pattern or coordinated recipe, never a cross-product of independently chosen colors.

| Bait construction | What the color record covers |
| --- | --- |
| Soft plastic | Body, accents, and flakes; generic jighead/hook stays neutral unless explicitly included |
| Skirted jig | Coordinated skirt and trailer, with head color recorded |
| Spinnerbait / bladed jig / buzzbait | Explicit skirt, trailer, and blade finish recipe |
| Hair jig | Head, dressed body, and tail; no invented silicone skirt |
| Inline/bucktail spinner | Metal blade and body/dressing color |
| Underspin / tail spinner | Body and blade finish, with head or tail components as appropriate |
| Hard bait / spoon | Body finish and pattern, back/belly/accent where present |
| Hollow frog | Back, belly, and leg accents |
| Streamer | Body/wing, tail, head, and material-specific flash definition in pass two |
| Fly popper | Body/belly with tail and leg accents; fly silhouette and dressed single hook |

A recipe can prescribe a compatible trailer color without changing trailer shape or recommending new equipment. Component lists define supported color surfaces, not a requirement to force every component to have a different hue. Pattern aliases must not merge opaque pearl with translucent ghost, blue flake with a solid blue section, or reflective silver with gray paint.

## Artwork and visual direction

67 selector image requirements: eight category images, 56 type images, and three clarity images. Twenty require generation without an existing approved target; 47 have source artwork awaiting visual review. These counts do not claim any new image has been generated or approved.

Each requirement has a stable image ID, target path, brief, and candidate source paths. Keep the paper/field-guide visual language already established in the app: expressive bait illustrations, restrained ink/blue accents, generous spacing, and strong type labels. Use a common neutral image treatment so lighting does not imply differing color suitability. The selection marker must remain readable independently of the artwork's colors.

Pass-two patterns will expand the manifest with a result preview for every supported type-pattern pair (or explicitly approved compatible-shape reuse). Category/type art cannot substitute for an accurate pattern preview. Generate images using the imagegen skill during the artwork work; inspect references before edits. Final assets must show the specified color, flakes, transparency, underside, and components at mobile card size. No guessed result-image count or empty placeholder asset is treated as completion.

## Research provenance for taxonomy

Existing V4 archetype definitions are the authoritative source for reconciling the current app. The following manufacturer/education references corroborate broad product categories only; they do not validate color pools:

- [Berkley bait catalog](https://www.berkley-fishing.com/collections/bait): conventional bait categories and soft-bait forms.
- [Orvis flies](https://www.orvis.com/fly-fishing/flies): fly families and streamer prey profiles.
- [Orvis introduction to streamers](https://howtoflyfish.orvis.com/video-lessons/the-basics-of-fly-fishing/chapter-seven-streamer-fishing/350-introduction_to_streamers): streamer-specific educational context.
- [Orvis Banger fly popper](https://www.orvis.com/product/banger/1X100840.html): fly poppers are a distinct physical product, not conventional hard plugs. This reference establishes construction/category, not freshwater color eligibility.

## Pass-two handoff and completion gate

Research all 56 types × three clarity choices × two light groups: 336 cells. Define canonical patterns, compatible constructions, exact finish/material, meaningful aliases, evidence, and explicit inclusions/exclusions. Every cell needs at least three reviewed patterns; seek broader pools only when evidence supports them. Do not multiply cosmetic aliases to reach the minimum.

If a cell cannot defensibly support three choices, record the gap and resolve it before release; do not silently broaden rules or fabricate suitability. Engine implementation follows the completed research matrix. Generic UI work may proceed independently, but the taxonomy's `research_pending` status cannot be interpreted as eligibility.

Pass one is complete when the catalog QA passes against the current V4 catalogs, all references exist, both popper types remain separate, and the generated checklist reflects the source. The original lure/fly color recommendation remains in place until pass seven, after the new picker is complete.
