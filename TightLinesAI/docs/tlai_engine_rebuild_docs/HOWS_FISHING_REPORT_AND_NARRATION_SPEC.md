# HOWS_FISHING_REPORT_AND_NARRATION_SPEC

> Superseded by the deterministic Today's Bite report architecture. Keep this
> document as historical product context only. The active production handoff is
> `docs/todays-bite-production-tuning-handoff.md`, and the active engine README
> is `supabase/functions/_shared/howFishingEngine/README.md`.

## Current Production Rule

The engine is the source of truth and the report surface is deterministic. There
is no generative polish step in the active Today's Bite path.

Active report generation now happens in `runHowFishingReport.ts`:

- score + band from `scoreDay`
- timing windows from `resolveTimingResult`
- summary copy from `summary/summaryLine.ts`
- paid factor labels from `summary/factorSurfaceLabels.ts`
- Field Strategy from `tips/buildTips.ts`
- reliability and solunar copy from deterministic helpers
- condition context snapshots from `narration/buildConditionContextExtensions.ts`

## Active Report Output Contract

```ts
type HowsFishingReport = {
  context:
    | "freshwater_lake_pond"
    | "freshwater_river"
    | "coastal"
    | "coastal_flats_estuary";
  display_context_label:
    | "Freshwater Lake/Pond"
    | "Freshwater River"
    | "Coastal Inshore"
    | "Flats & Estuary";
  location: {
    latitude: number;
    longitude: number;
    state_code: string | null;
    region_key: string;
    timezone: string;
    local_date: string;
    location_label?: string | null;
  };
  score: number;
  band: "Tough" | "Poor" | "Fair" | "Good" | "Prime";
  summary_line: string;
  drivers: Array<{ variable: string; label: string; effect: "positive" }>;
  suppressors: Array<{ variable: string; label: string; effect: "negative" }>;
  actionable_tip: string; // Field Strategy text, kept for wire compatibility
  actionable_tip_tag: FieldStrategyTag | LegacyActionableTipTag;
  daypart_note?: string | null;
  daypart_preset: DaypartNotePreset | null;
  timing_strength?: TimingStrength;
  highlighted_periods?: [boolean, boolean, boolean, boolean];
  reliability: "high" | "medium" | "low";
  reliability_note?: string | null;
  timing_insight?: string | null;
  solunar_note?: string | null;
  data_coverage_notes?: string[];
  normalized_debug?: {
    available_variables: string[];
    missing_variables: string[];
    data_gaps?: Array<{ variable_key: string; reason: string }>;
  };
  condition_context?: {
    normalized_variable_scores: ConditionNormalizedVariableScore[];
    composite_contributions: ConditionCompositeContribution[];
    environment_snapshot: ConditionEnvironmentSnapshot;
  };
};
```

## User-Visible Sections

The rebuilt report shows:

1. score + band
2. concise summary
3. paid driver/suppressor factor rows
4. timing insight / daypart note
5. moon/tide context where available
6. Field Strategy
7. reliability note when useful

Free users receive score + summary only.

## Copy Rules

- Keep summaries 2-3 sentences and condition-grounded.
- Paid factor labels should explain the condition, not just the category.
- Field Strategy should explain how to use the read: timing strictness, mistake
  to avoid, patience vs mobility, and data-quality caveats.
- Tackle Box owns tackle-specific advice.
- Never invent variables that are missing or gapped.
- Do not imply freshwater measured water temperature.
- Do not invent tide timing without real same-day tide events.

## Reliability Wording

High reliability normally needs no visible reliability note. Medium and low
reliability should soften certainty without making the report feel useless. Low
reliability free summaries should include a short data-limited caveat.
