# Verified pool expansion — September 8, 2026

> Historical catalog-expansion record. The September 8 release correction supersedes the minimum-overlap sampler, weather behavior, and daily-cache wording below. Pool membership and cited availability research remain current.

User authorized the proposed additions and further verified options for sparse/common bait pools. Catalog 2026-09-08.3. Existing familiarity exclusions remain enforced. No earlier rejected plain colors were reinstated.

## Additions and eligibility

| Bait | Added recipes | Clarity scope, both light states |
|---|---|---|
| Soft plastic worm | Green pumpkin / red flake; green pumpkin / watermelon laminate | Clear and stained |
| Soft plastic worm | Blue / black laminate | Clear, stained and murky |
| Soft plastic worm | Green pumpkin / chartreuse tail | Stained and murky |
| Soft jerkbait | Junebug | Stained and murky |
| Paddletail | Black / blue flake | Clear, stained and murky |
| Paddletail | Junebug; chartreuse / white | Stained and murky |
| Underspin | Black / blue flake; Junebug paddletail bodies | Stained and murky |
| Spoon | Red / white; Five of Diamonds | Stained and murky |
| Hard topwater | Clown: red head, metallic gold upper sides, silver underside | Stained only |

These are explicit per-bait profile additions, not an automatic fill-to-size routine. Their physical recipes and availability are supported by the sources below; the clarity/light placements remain editorial applications of the existing contrast and presentation guidance. Dark or pale colors need a contrasting background; murk limits range, and flakes are not claimed to improve murky visibility. Broad worm/rig aliases inherit the category’s reviewed palette, not a claim that every brand sells every shape in that recipe.

## Sources

- [Yamamoto 5-inch Senko](https://www.yamamotobaits.com/products/5-senko/): 318 Green Pumpkin with Large Red, 912 Green Pumpkin/Watermelon, 913 Green Pumpkin with Chartreuse Tail, 904 Blue and Black Laminate. This adds recognizable variants without restoring the removed specialty blue-tip, plum or red-shad entries.
- [Keitech Swing Impact](https://www.keitechusa.com/catalog/swing-impact.html): 428 Black Blue Flake, 487 Chartreuse White, and specific underspin rigging guidance. The chartreuse-white body differs from the removed solid-chartreuse recipe. Junebug underspin use is an explicit rigging inference from the documented paddletail palette, not a factory-painted head claim.
- [Zoom Junebug Super Fluke / Swimmin Super Fluke](https://zoombait.com/2011/06/swimmin-super-fluke-junebug/): documents both soft jerkbait and paddletail availability. Reuses the existing dark-purple/emerald-flake recipe for the bait types rather than inventing another Junebug variant.
- [Eppinger Dardevle](https://dardevle.com/product/dardevle-1oz/): classic red/white and Five of Diamonds patterns. Faces have painted contrast with a reflective metal reverse; they are not plain white/yellow spoon substitutes. Five of Diamonds reference is yellow with red diamonds.
- [Heddon manufacturer catalog](https://images.ebsco.com/pob/lurenet/catalog/heddon_catalog.pdf), PDF page 3, printed pages 98–99: visually inspected Super Spook / Super Spook Jr. color 07 Clown. Recipe corrected to red head, gold upper sides and silver lower sides/underside. Other manufacturers' Clown finishes vary. It is not automatically added to murky surface pools just because the upper body is bright.

Hard swimbait Bone was investigated but not added: it is commercially documented but too similar to the existing pale option to justify padding a thin pool. Murky hard swimbaits and murky hard topwater remain the only live two-color cases. Frogs/toads remain conservative underside choices.

## Result

- Worms: 8–11 colors per clarity/light pool (13 distinct recipes across conditions).
- Paddletails: 5–7 per pool (8 distinct recipes).
- Murky underspins: four choices per light.
- Murky spoons: four choices per light.
- Soft jerkbaits: 3–4 per pool.
- 614 eligible color occurrences across 138 live cells, up from 560.
- 56 of 69 bait/clarity reports can have four unique colors; 11 can have three; two can have only two.
- Four individual light cells have exactly two choices, down from twelve.

Random selection still jointly minimizes overlap across sun/cloud, then randomizes display order; there are no effectiveness scores. Saved daily reports remain immutable. New reports use the expanded catalog on both platforms through the shared backend.

## Validation

38 engine/service/recipe tests pass, including all 336 research cells, all 138 live cells, preserved exclusions, added recipe/clarity boundaries, common-bait pool depths, daily caching and minimum-overlap randomization. Structural/domain QA passes. TypeScript passes. Actual React Native Web report flow tested at 320px and 390px with mocked services, including new spoon swatches, skeleton, sun/cloud cards and return to setup. Rounded proportional swatches render from saved recipe colors; no new raster images are needed for these report colors.

Live verification passed after final deployment: catalog 2026-09-08.3, real Open-Meteo weather, four distinct approved murky spoon colors, daily replay/reopen, concurrent winner and separate-bait isolation. Temporary test user and all three reports were cleaned up.
