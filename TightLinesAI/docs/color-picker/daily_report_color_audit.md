# Daily reports and palette audit — September 8, 2026

This contract supersedes earlier ranked-card, weather, cross-section deduplication, and reroll behavior. Older verification notes below are retained as historical records and do not describe the corrected release.

## Daily report

- Sunny/direct and cloudy/diffuse light each receive two equal-status FinFindr picks, sampled uniformly without ranking. Distinct pools draw independently and may overlap. If both reviewed pools are identical, the same pair is sampled once and displayed under both explicit light headings. History does not bias a new draw; next-day repeats remain possible.
- One schema-2 report exists per authenticated user, broad lure/fly type, water clarity, and local date. Changing request ID or device cannot reroll the same setup. A different lure/fly type, clarity, or next local date can generate another report. New future/past generation is rejected; archived snapshots remain readable.
- Database uniqueness and insert-or-return-winner RPC enforce the rule under concurrent requests. Request-ID replay remains supported. Failed generation does not reserve a daily slot.
- The request and saved report contain no coordinates, forecast, or hourly weather. Device timezone determines the current local date. A migration redacts those fields from legacy envelopes.
- The recommender preserves Bluegill Streamer, Mouse Fly, Sculpin Streamer, Sculpzilla, Muddler Sculpin, Crawfish Streamer, Warmwater Crawfish Fly and Frog Fly. No Color Match link is shown for these identities. This does not remove generic streamers from the standalone picker.

## Palette review

Reviewed all 123 candidate recipes (120 released in the full research matrix) for name/component/swatch consistency. Corrected 44 palettes: primary color order, missing dark markings or green in Firetiger variants, and incidental blade/hook/eye colors mistakenly included in skirt/body palettes. Examples: green pumpkin and watermelon now lead with the body color, white poppers no longer imply a red body component, white toads no longer include olive, and chartreuse buzzbaits no longer lead with silver blade hardware. New reports persist swatches alongside copy so later catalog edits cannot repaint a saved report. Swatch panels show equal reference samples, not invented bait-color proportions.

Manufacturer checks establish named examples, not a universal industry color standard:

- [Rapala Firetiger description](https://www.rapala.ca/ca_en/blog/new-patterns-and-a-smaller-deep-diving-model-for-rapala-ripstop-lures): green back, yellow sides, black bars and orange belly/throat. Red is not required. Our chartreuse-yellow/orange reference is a classic variant. Spoon/spinner interpretations now include the same core hues, adapted to their construction.
- [Yamamoto Senko assortment](https://www.baits.com/senko-kit-160pc-assortment/): Junebug is purple with emerald flake; PB&J is a laminate. PB&J copy now acknowledges maker-dependent flakes/shades rather than pretending one exact recipe defines every product.
- [Zoom PB&J jig example](https://zoombait.com/2009/07/its-flippin-purple/): supports the brown/purple jig palette with purple trailers.
- [Zoom tail-color examples](https://zoombait.com/2009/08/baby-brush-hog-tail-colors/): distinguish body colors from chartreuse/blue tail accents.

The existing source register and compatibility matrix still determine release eligibility. This review does not claim every brand variant was photographed or each cell experimentally validated. Color panels are human-facing approximations, not measured fish-visible spectra or newly generated lure illustrations.

## Visibility explanations and overlap

Explanations now state a brief mechanism: dark silhouette against a lighter background, pale-body contrast against darker cover, reflective flash requiring incident light, or translucency softening an outline. Surface patterns explicitly discuss the underside. No claims that a pigment glows by itself, that red always disappears at one depth, or that a named color is scientifically best.

[Nieman et al., 2020](https://www.sciencedirect.com/science/article/pii/S0380133020300496) reports that lure-color outcomes varied with water conditions in a Walleye fishery; it does not establish a universal bass/trout/pike rule. [Radinger et al., 2026](https://www.ifishman.de/fileadmin/user_upload/Radinger_et_al_2026_CanadianJournalofFisheriesandAquaticSciences.pdf) discusses the light needed for fluorescence and cautions against assuming visible fluorescence translates to better catch outcomes. Our pools remain practical, evidence-informed heuristics. Background, depth, species and the cause of turbidity are not measured by this feature.

Firetiger is in both stained/murky light pools for inline spinners, crankbaits, lipless crankbaits, jerkbaits, hard swimbaits and spoons; topwater also retains it in clear-water pools. The overlap is deliberate. Bright/dark contrast can remain viable under both lighting states; the pools should not manufacture a difference merely to make reports look varied. It does not imply sun and cloud conditions are identical or that four unique colors are mandatory.

## Historical September 7 verification

- 29 engine/service/visibility tests: all reviewed cells, random combination fairness, overlap, replay, daily locking, concurrent requests, changed inputs, next local date, authorization, forecast validation and palette checks.
- Routing audit covers all 80 recommender archetypes, including the newly preserved identities.
- TypeScript and whitespace checks pass; 320px and 390px browser setup/report flows pass with mocked services.
- Live Open-Meteo smoke: approximately 13.46% clouds still produced two sunny and two cloudy choices. Concurrent daily winner, request replay, reopening, changed-setup lock and separate-bait report all passed. Temporary test account and reports deleted afterward.
- Only `20260907170000_color_picker_daily_reports.sql` was pending in the deployment dry run; it was applied and the color-picker function deployed.

Live verification can be repeated with `node --env-file=.env scripts/color-picker-production-smoke.cjs`; it creates and deletes a disposable confirmed Angler account.

## September 8: exhaustive live explanation review

Reviewed all 652 eligible color occurrences across the 23 live bait choices and 138 bait/clarity/light cells, grouped by the exact explanation and checked against each recipe's components, material, opacity and finish. This is an audit of the explanations, not experimental validation of every eligibility pool.

Corrections in `visibilityExplanation.ts`:

- Blue fly poppers no longer inherit an earth-tone explanation. Surface copy inspects the belly first, handles soft toads and legacy walking/hard-popper IDs, and treats translucent topwater separately.
- White hair jigs and streamers use pale-area contrast rather than being described as see-through bodies. Dark fibers use conditional contrast against lighter backgrounds; other sparse dressings describe gaps between fibers.
- Painted black spinner blades with white/chartreuse dots describe the actual blade markings. Reflective hardware no longer substitutes for explaining a selected skirt/body color. Metallic surfaces can flash under either light state; cloud cover does not guarantee a particular flash intensity.
- PB&J no longer receives an unsupported small-reflective-accents claim just because its metadata says subtle flash. Red Shad uses its dark body profile. Red craw copy acknowledges filtered light without inventing a disappearance depth.
- Firetiger uses bright/dark areas and markings rather than calling every spinner/spoon a striped-sided hardbait. Reduced clarity limits pattern visibility; it does not preserve black bars indefinitely.
- Conditional contrast replaces unconditional strong-contrast promises. Subdued/translucent presentations are described as subtle, not inherently more visible. Sun/cloud copy can match when the mechanism is shared.

Evidence: [Nieman et al., 2020, NOAA-hosted full text](https://repository.library.noaa.gov/view/noaa/37441/noaa_37441_DS1.pdf), especially introduction on scattering, absorption, spectral changes and resolution, and discussion of fishery-specific results. Water clarity categories do not measure background, depth or sediment/algae composition. These short explanations describe plausible optical mechanisms, not proven catch advantages or guaranteed fish-visible hues.

Verification: all 32 engine/service/explanation tests pass, including every live eligible explanation (652), regression examples above, all 336 legacy cells and all 138 live cells. The daily selection and saved snapshot contract is unchanged: new reports get revised copy; existing saved reports retain their original wording and colors.
