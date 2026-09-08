# Recommender illustrated artwork

## Subsequent anatomy rebuild

The user's follow-up review rejected several images previously accepted below. `credibility_rebuild.json` records the replacement prompts and references for eight rebuilt assets: three tubes, the large pike swimbait, pike flash fly, balanced leech, warmwater crayfish fly, and drop-shot worm. The tubes now have closed plain rubber noses and cut skirts without fish anatomy; the flash fly has one hook; the swimbait has internal weighting without dangling hardware; the leech has a compact dubbed body and forward bead; the crayfish uses rabbit-strip claws and a hook at the body; the worm is hooked only at the extreme nose tip. Intermediate leech, crayfish and worm outputs were rejected and edited again before installation. Bounds and hashes were refreshed and all 680 fit cases passed. These updates supersede the earlier acceptance of those assets.

Completed September 7, 2026. All 48 lure and 32 fly image mappings use the illustrated style: 17 matching Color Match tackle illustrations are shared, and 63 specific tackle illustrations were generated. Two new waterbody illustrations complete the 65 new assets in `assets/images/recommender/illustrated/`.

The clarity selector shares Color Match's three water scenes. Catch Fish uses its crankbait; Catch a PB uses its glidebait. The shared glidebait was also corrected to have a nose line tie.

The visual review covered tackle identity, hook placement, connected rigging, full silhouettes and style. Corrections include nose-hooked drop-shot baits with continuous hook-eye-to-sinker tags, Carolina leader routing, internal tube heads, glidebait line ties, jig hooks and fly construction. See `generation_manifest.json` and `final_fly_correction_prompts.json` for generation and correction records.

`RecommenderArtwork` measures its container and fits each asset's visible bounds uniformly with breathing room. It centers complete hooks, tails and rigs in hero, honorable-mention and selector boxes. Original image pixels are preserved. Tall rigs necessarily show a smaller bait when the whole rig is visible in a small thumbnail.

Validation passed:

- 85 distinct assets present, with current hashes and mappings.
- 680 fit checks across eight card dimensions: contained, centered and undistorted.
- App TypeScript check and Expo iOS bundle export.
- Browser previews of the actual artwork component at 320px and 390px viewport widths, without runtime errors. Representative screenshots are in `ui-review/`.

The browser previews isolate the artwork component and representative card dimensions. They are not a full native-device or live-report acceptance test.

After replacing any image, run `python3 scripts/recommender-artwork-bounds.py`, then `node scripts/recommender-artwork-qa.cjs` from the project root to refresh and validate bounds and hashes.
