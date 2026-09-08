# Color Match: open tackle catalog

Replaces the horizontal category carousel and category-dependent bait grid with an open, vertically browsable catalog. Every current choice appears in a labeled section. Illustrations lead each tile; a compact label and arrow communicate that tapping continues the flow. Three columns at normal phone widths and two below 360px keep labels readable. No new artwork was needed.

Search spans every category and known alias, trims surrounding spaces, displays a match count and retains its text when returning from clarity. Tapping a bait dismisses the keyboard and advances directly to clarity. The extra Continue button and bait-step bottom dock are removed. Back/change-bait restores the browsing position. The Home weather and report-generation contracts are unchanged.

Water clarity starts unselected for a new setup. The user explicitly chooses a scene before Find My Colors becomes available. Saved reports restore their actual clarity when edited.

Validation: TypeScript passed. Browser rendering of the actual Color Match screen at 320px and 390px passed the following flows: all choices available without category switching; alias search; no Continue button; direct bait-to-clarity transition; no default clarity; search preservation; returning to Fly popper restores its visible scroll position; explicit Clear selection generates a report with the Home coordinates and today's local date. The weather service is mocked in this browser harness; no production report was created. Screenshots show the rendered bait and clarity screens. Native-device acceptance remains a separate check.
