# Color Match — recommender visual alignment

The setup now follows the lure/fly recommender's 520px maximum content width, 24px page gutters, 10px paper-card corners, full-panel line decoration, Fraunces headings, mono progress labels and gold/green step states. Category and bait tiles use centered specimen artwork and ruled caption areas. Selected tiles retain blue coverage over the artwork. Water clarity stays in a three-column row.

The report uses a compact bait header with a two-column facts row, followed by ruled sun/cloud mastheads. Each section has a gold-ribbon top pick with specimen-style color samples and a compact blue-accented honorable mention. Large edge-to-edge color blocks and duplicate swatches were removed. Explanations have the recommender's left-rule treatment. The report's return action is at the end of the scroll, freeing screen space for the picks; setup retains its fixed navigation.

Generation and reopening now render a skeleton with the actual report hierarchy: header, facts, section rules, top card and compact honorable card for each light state. It uses the shared native-driver paper pulse, pauses for reduced motion, stops on unmount and exposes one accessible loading state. It does not delay a ready report artificially.

Validation: TypeScript, whitespace checks and actual-screen browser previews at 320px and 390px. Browser checks cover category/bait/clarity selection, skeleton visibility during generation, two top picks and two honorable mentions, scrolling and returning to category selection. No runtime errors. Screenshots use mocked services and reference color samples; these are browser visual checks, not native-device acceptance. The setup screenshots precede a final removal of duplicated decorative dashes around the setup eyebrow.

The daily cache, weather requests, color pools, routing and report persistence are unchanged by this UI revision.
