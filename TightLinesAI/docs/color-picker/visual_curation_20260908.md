# Color Match visual curation — September 8, 2026

## Product boundary

Color Match remains a visual starting-point tool. Its recommendation inputs are:

- the lure or fly's physical construction;
- underwater visibility selected as Clear, Stained, or Murky; and
- bright/direct versus low/diffuse ambient light when those conditions justify different pools.

The engine does not infer species, forage, season, location, water temperature, depth, feeding behavior, or catch probability. Every color in a condition pool has equal status and equal selection probability. Array order has no recommendation meaning.

Water tint was reviewed but not added as an input. The current clarity choice measures visibility, not whether water is amber, green, or brown. A tint input would only be justified after separate recipes, user-facing reference scenes, and validation show enough benefit to offset the added step.

## Release changes

| Public bait | Previous issue | Curated result |
| --- | --- | --- |
| Soft plastic worm | Pools reached 11 choices and gave minor flakes/laminates extra probability. | Four or five distinct translucent, midtone, dark, and marked treatments per cell. |
| Craw / creature bait | Inherited the generic bottom-plastic table and lacked a strong two-tone boundary. | Four treatments per cell, including a documented brown body/orange appendage recipe. |
| Grub | Inherited a worm palette despite a different, widely sold color inventory. | Three to five grub-realistic pearl, smoke/flash, earth-tone, dark, and chartreuse treatments. |
| Paddletail | Junebug and several dark variants duplicated the same broad visual job; olive/pearl remained in murk. | Four or five pale, translucent-flash, olive/pearl, midtone, dark, and bright-boundary options, with subtle olive/pearl removed from Murky. |
| Skirted jig | The broad public choice silently used a bottom-jig-only palette even though it includes swim jigs. | Four or five coordinated recipes spanning white, earth-tone, marked, and dark constructions. |
| Bladed jig | Plain chartreuse overlapped white/chartreuse and the pool lacked a recognizable red/orange/black construction. | Three to five distinct treatments, including documented Fire Craw in Stained and Murky pools. |
| Underspin | Junebug and plain chartreuse duplicated existing dark and bright strategies. | Three to five body/head treatments; incidental blade hardware remains outside the recommendation. |
| Crankbait and lipless crankbait | Clear and stained pools reached eight choices with duplicate silver sides and several similar muted paint schemes. | Four to six distinct translucent, metallic, muted-painted, pale, red/dark, and high-contrast finishes. |

Names now favor literal visual descriptions where the recipe is editorial (for example, `Olive / brown / orange`). Recognizable retail pattern names such as Fire Craw remain when they identify a real construction. `Translucent smoke / silver flash` replaces the less beginner-readable `Smoke with silver flake` display name.

Spinnerbait and bladed-jig records now state the truth consistently: current picks prescribe skirt/trailer color, while the rendered metal blade is neutral illustration hardware. The engine no longer claims each recipe contains an explicit blade-finish recommendation.

## Evidence and limits

- [Bassmaster soft-plastic color guidance](https://www.bassmaster.com/bass-basics/news/the-texas-rig-part-5-soft-plastic-colors/) supports broad natural/translucent and dark visual families. Its angling claims are not treated as controlled optical proof.
- [Bassmaster color simplification](https://www.bassmaster.com/news/do-bass-anglers-need-every-color-of-the-rainbow/) supports using a small core palette instead of elevating every commercial variation. Species and forage examples are excluded from engine reasoning.
- [Mister Twister's current catalog](https://www.mistertwister.com/catalog/) confirms pearl, white, chartreuse, smoke/flake, black, and pumpkin-family recipes are real curly-tail grub offerings.
- [Mister Twister's 2026 BUZZ Bug catalog page](https://www.mistertwister.com/catalog/2026/MisterTwister2026Catalog_8.pdf) confirms a brown/orange two-tone soft creature construction.
- [Keitech's Swing Impact catalog](https://www.keitechusa.com/catalog/swing-impact.html) confirms the physical paddletail palette and underspin compatibility used by the curated records.
- [Z-Man's bladed-jig color-coordination guidance](https://zmanfishing.com/blogs/news/top-9-chatterbait%C2%AE-commandments) documents Fire Craw as a coordinated bladed-jig/trailer construction. Seasonal, prey, and catch-rate claims are not imported.

These sources establish recognizable recipes and broad starting principles. They do not experimentally validate a six-cell color matrix. Exact condition membership remains a reviewed visual heuristic and is labeled that way in the data.

## Regression gates

`visualCuration.ts` is the explicit release-facing authoring layer. Automated QA now requires every curated pool to:

- contain three to six eligible patterns;
- assign every pattern a declared visual family;
- contain no duplicate visual family;
- preserve equal-status, unweighted two-pick selection; and
- resolve across all public choices and all clarity/light cells.

Additional regression assertions lock the high-risk corrections: specialist worm variants stay out of the primary pool, grubs retain pearl, Murky paddletails exclude olive/pearl and Junebug, craw/creature pools retain brown/orange, the broad skirted-jig pool includes both pale and dark constructions, non-clear bladed-jig pools retain Fire Craw, and Murky underspins exclude Junebug.
