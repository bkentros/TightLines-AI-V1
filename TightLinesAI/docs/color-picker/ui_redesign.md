# Color Match UI redesign

## Current flow

Bait → water clarity → results. Generation and fresh draws use **today in the Home location’s timezone** and the coordinates passed by Home. There are no location, date, GPS, or weather controls in this feature. A missing Home location leads back to Home. Reopening a saved report preserves its original snapshot.

Setup follows the lure/fly recommender’s paper design: navy navigation, Fraunces headlines, green accents, shared section eyebrows, contour details, corner marks, illustrated white cards, and persistent wizard actions. Compact progress steps and shorter headers keep choices within reach. Bait selection retains five category tabs, search, and a two-column grid. Clear, Stained, and Murky are three side-by-side illustrated cards, including at 320px width. The selected bait remains visible and can be changed.

Step transitions fade and move gently, honor Reduce Motion, and reset scroll position. Selection provides press feedback and haptics. Loading uses a dedicated illustration and honest progress text. Results show a compact bait/clarity/date/cloud summary followed by equal-status color cards. Sunny/cloudy grouping remains automatic: below 30% sunny only; 30–70% inclusive both; above 70% cloudy only.

## Artwork

All 23 bait and three clarity selectors now use newly generated matte field-guide illustrations in `assets/images/color-picker/illustrated/`. The prior selector prompts emphasized product photography, creating excessive realism and gloss. The replacement prompts use the existing recommender as a style reference: delicate outlines, simplified shading, and white card backgrounds. They are new images, not reused recommender assets. Unrigged soft plastics remain unrigged; hard lures retain appropriate hardware. The murky illustration was regenerated separately after rejecting an overly clear version. See `illustrated_selector_artwork.json` for provenance and hashes. Historical selector files remain on disk but are not referenced by the live image map.

Result palette dots remain approximate color references from canonical recipes, guarded against mismatched historical snapshots. Full bait-pattern artwork is still a separate deliverable.

## Verification

- App TypeScript check passed.
- Expo iOS production bundle export passed with the illustrated assets.
- Browser previews of the actual React Native components at 320px and 390px completed bait selection → clarity → results without runtime errors. Assertions verified Home coordinates, today’s local date, and selected clarity in the generation request. Screenshots are in `ui-review/`.
- Preview services, auth, and navigation were mocked; this is not native-device or live backend signoff. No production deployment occurred.
