# Color Match UI redesign

## Current flow

Category → lure/fly → water clarity → results. Generation uses today in the device timezone. Color Match neither receives nor stores a Home location, coordinates, forecast, or hourly weather. Reopening a saved report preserves its original selection snapshot.

Setup follows the lure/fly recommender’s paper design: navy navigation, Fraunces headlines, green accents, shared section eyebrows, contour details, corner marks, illustrated white cards, and persistent wizard actions. Compact progress steps and shorter headers keep choices within reach. Five category choices lead to a focused two-column lure/fly grid. Clear, Stained, and Murky are three side-by-side illustrated cards, including at 320px width. The selected lure or fly remains visible and can be changed.

Step transitions fade and move gently, honor Reduce Motion, and reset scroll position. Selection provides press feedback plus a blue wash, border, and checkmark so color is not the only state cue. Loading uses a report-shaped skeleton and honest progress text. Results show lure/fly, clarity, and date followed by two equal-status cards under Sunny / Direct Light and two under Cloudy / Diffuse Light. Identical pools honestly repeat the same sampled pair under both explicit headings.

## Artwork

All 23 lure/fly and three clarity selectors use matte field-guide illustrations in `assets/images/color-picker/illustrated/`. The prior selector prompts emphasized product photography, creating excessive realism and gloss. The replacement prompts use the existing recommender as a style reference: delicate outlines, simplified shading, and white card backgrounds. They are new images, not reused recommender assets. Unrigged soft plastics remain unrigged; hard lures retain appropriate hardware. The murky illustration was regenerated separately after rejecting an overly clear version. See `illustrated_selector_artwork.json` for provenance and hashes. Historical selector source files were removed after reference checks; their prompts remain in `selector_artwork_prompts.json` as provenance.

Result swatches remain equal-width, approximate color references from canonical recipes, guarded against mismatched historical snapshots. Their widths do not imply a body/accent ratio. Full lure-pattern artwork is still a separate deliverable.

## Verification

- App TypeScript check passed.
- Expo iOS production bundle export passed with the illustrated assets.
- Browser previews of the actual React Native components at 320px and 390px completed bait selection → clarity → results without runtime errors. Historical screenshots are in `ui-review/`; corrected-contract visual verification is tracked in the release correction.
- Preview services, auth, and navigation were mocked; this is not native-device or live backend signoff. No production deployment occurred.
