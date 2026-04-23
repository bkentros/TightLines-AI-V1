/**
 * Species biological sensibility audit for the v4 deterministic recommender.
 *
 * This script does not exercise selector policy. It compares catalog-level
 * species eligibility against generated seasonal-row authoring, then saves a
 * curated review of pairings that deserve keep/watch/narrow/expand decisions.
 *
 * Usage (from TightLinesAI/):
 *   deno run -A scripts/audit-recommender-v4-species-sanity.ts
 */
import type {
  ArchetypeProfileV4,
  RecommenderV4Species,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";

type Side = "lure" | "fly";
type Status =
  | "keep"
  | "watch"
  | "narrow"
  | "expand"
  | "seasonal-fix"
  | "uncertain";

type SpeciesReview = {
  species: SpeciesV4;
  side: Side;
  archetype_id: string;
  status: Status;
  issueLayer: "catalog" | "seasonal" | "both" | "none";
  reason: string;
  recommendedAction: string;
};

const OUT_DIR = "docs/audits/recommender-v4/species-sanity";
const GENERATED_AT = "2026-04-23";

type SpeciesV4 = RecommenderV4Species;

const SPECIES: SpeciesV4[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
  "trout",
];

const ROWS_BY_SPECIES: Record<SpeciesV4, readonly SeasonalRowV4[]> = {
  largemouth_bass: LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  smallmouth_bass: SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  northern_pike: NORTHERN_PIKE_SEASONAL_ROWS_V4,
  trout: TROUT_SEASONAL_ROWS_V4,
};

const CATALOG: readonly (ArchetypeProfileV4 & { side: Side })[] = [
  ...LURE_ARCHETYPES_V4.map((a) => ({ ...a, side: "lure" as const })),
  ...FLY_ARCHETYPES_V4.map((a) => ({ ...a, side: "fly" as const })),
];

const REVIEW: SpeciesReview[] = [
  {
    species: "trout",
    side: "lure",
    archetype_id: "spinnerbait",
    status: "narrow",
    issueLayer: "both",
    reason:
      "Bass/pike safety-pin spinner, not the same biological lane as trout inline spinners; rows had it everywhere before catalog narrowing.",
    recommendedAction:
      "Applied catalog narrowing; remove from trout seasonal rows on the next source-matrix cleanup.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "buzzbait",
    status: "narrow",
    issueLayer: "both",
    reason:
      "Fast surface buzzbait is a bass/pike tool; trout surface lanes are better represented by mouse, popper/slider, and small hard topwater edge cases.",
    recommendedAction:
      "Applied catalog narrowing; remove from trout seasonal rows on the next source-matrix cleanup.",
  },
  {
    species: "largemouth_bass",
    side: "lure",
    archetype_id: "casting_spoon",
    status: "seasonal-fix",
    issueLayer: "seasonal",
    reason:
      "Biologically plausible for schooling/vertical baitfish windows, but not credible as a 100% largemouth row resident.",
    recommendedAction:
      "Keep catalog eligibility; reduce seasonal authoring to baitfish/open-water/cold or suspended windows.",
  },
  {
    species: "smallmouth_bass",
    side: "lure",
    archetype_id: "casting_spoon",
    status: "watch",
    issueLayer: "seasonal",
    reason:
      "More defensible than largemouth in clear baitfish and current/open-water settings, but still too broadly authored at 100%.",
    recommendedAction:
      "Keep eligibility; monitor and narrow row usage if spoons over-surface in warm shallow contexts.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "casting_spoon",
    status: "keep",
    issueLayer: "none",
    reason:
      "Classic trout search/flash bait and biologically sensible around baitfish, current, and cold-water windows.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "northern_pike",
    side: "lure",
    archetype_id: "casting_spoon",
    status: "keep",
    issueLayer: "none",
    reason:
      "Strong pike fit: flash, profile, and open-water coverage are biologically aligned.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "blade_bait",
    status: "watch",
    issueLayer: "seasonal",
    reason:
      "Plausible cold-water baitfish tool, but 100% row usage is broader than the biology suggests.",
    recommendedAction:
      "Keep eligibility; later reduce warm/surface-adjacent row authoring if it becomes overexposed.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "lipless_crankbait",
    status: "watch",
    issueLayer: "seasonal",
    reason:
      "Can make sense for aggressive baitfish-oriented trout, but the current all-row authoring is broad.",
    recommendedAction:
      "Keep for now; consider seasonal row narrowing before any exposure boost.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "walking_topwater",
    status: "watch",
    issueLayer: "none",
    reason:
      "Uncommon but plausible for large trout in summer surface-prey windows; current usage is confined to surface rows.",
    recommendedAction: "Keep as an edge case; do not broaden.",
  },
  {
    species: "trout",
    side: "lure",
    archetype_id: "popping_topwater",
    status: "watch",
    issueLayer: "none",
    reason:
      "Plausible but niche trout surface bait; acceptable only because row usage is surface-seasonal rather than universal.",
    recommendedAction: "Keep as an edge case; monitor exposure.",
  },
  {
    species: "trout",
    side: "fly",
    archetype_id: "mouse_fly",
    status: "keep",
    issueLayer: "none",
    reason:
      "Biologically sensible as a summer/night/low-light river surface-prey pattern; row usage is seasonal, not universal.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "trout",
    side: "fly",
    archetype_id: "balanced_leech",
    status: "watch",
    issueLayer: "catalog",
    reason:
      "Trout-only stillwater leech is biologically valid, but current trout recommender rows are river-only so it has no authored runtime path.",
    recommendedAction:
      "No species correction; decide later whether trout lakes enter scope or remove this dormant archetype.",
  },
  {
    species: "largemouth_bass",
    side: "fly",
    archetype_id: "woolly_bugger",
    status: "keep",
    issueLayer: "none",
    reason:
      "Broadly viable bass fly as a small streamer/leech/bugger profile; recent geometry fixes address opportunity rather than species fit.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "smallmouth_bass",
    side: "fly",
    archetype_id: "woolly_bugger",
    status: "keep",
    issueLayer: "none",
    reason:
      "Excellent smallmouth river/lake fly fit across crawfish, leech, and baitfish-adjacent presentations.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "largemouth_bass",
    side: "fly",
    archetype_id: "frog_fly",
    status: "keep",
    issueLayer: "none",
    reason:
      "Strong summer surface/vegetation largemouth fly lane; row scarcity is intentional and tactical.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "northern_pike",
    side: "fly",
    archetype_id: "frog_fly",
    status: "keep",
    issueLayer: "none",
    reason:
      "Pike regularly key on surface prey near weeds; frog fly is a sensible niche topwater option.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "largemouth_bass",
    side: "lure",
    archetype_id: "hollow_body_frog",
    status: "keep",
    issueLayer: "none",
    reason:
      "Canonical vegetation/surface largemouth bait and now has honest surface-slot opportunity.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "northern_pike",
    side: "lure",
    archetype_id: "hollow_body_frog",
    status: "watch",
    issueLayer: "seasonal",
    reason:
      "Biologically plausible for pike, but catalog eligibility is dormant because rows currently never author it.",
    recommendedAction:
      "Keep eligibility; consider adding only to summer weed/topwater pike rows if product wants pike frog visibility.",
  },
  {
    species: "trout",
    side: "fly",
    archetype_id: "popper_fly",
    status: "watch",
    issueLayer: "none",
    reason:
      "Less canonical than mouse for trout, but plausible as a summer surface attractor and not broadly authored outside surface windows.",
    recommendedAction: "Keep for now; monitor exposure after daily-condition logic.",
  },
  {
    species: "trout",
    side: "fly",
    archetype_id: "deer_hair_slider",
    status: "watch",
    issueLayer: "none",
    reason:
      "Waking/skating deer-hair surface fly is an edge trout lane; acceptable as long as it stays seasonal.",
    recommendedAction: "Keep as a niche edge case.",
  },
  {
    species: "northern_pike",
    side: "lure",
    archetype_id: "tube_jig",
    status: "watch",
    issueLayer: "seasonal",
    reason:
      "Pike will eat tubes, but pike-specific swimbaits, spoons, bucktails, jerkbaits, and jig/plastic are stronger defaults.",
    recommendedAction:
      "Keep eligibility; consider reducing row ubiquity only if it crowds pike-specific archetypes.",
  },
  {
    species: "largemouth_bass",
    side: "lure",
    archetype_id: "bladed_jig",
    status: "keep",
    issueLayer: "none",
    reason:
      "Strong largemouth stained-water baitfish/crawfish tool; low exposure is tactical/slot-related, not species mismatch.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "smallmouth_bass",
    side: "lure",
    archetype_id: "bladed_jig",
    status: "keep",
    issueLayer: "none",
    reason:
      "Less universal than largemouth but still valid around grass, rock, baitfish, and stained-water reaction windows.",
    recommendedAction: "No catalog change.",
  },
  {
    species: "trout",
    side: "fly",
    archetype_id: "game_changer",
    status: "keep",
    issueLayer: "none",
    reason:
      "Large articulated baitfish streamer is biologically sensible for predatory trout, though not every trout day.",
    recommendedAction: "No catalog change.",
  },
];

function rowsForSpecies(species: SpeciesV4): readonly SeasonalRowV4[] {
  return ROWS_BY_SPECIES[species].filter((row) =>
    row.state_code == null || row.state_code === ""
  );
}

function rowIds(row: SeasonalRowV4, side: Side): readonly string[] {
  return side === "lure" ? row.primary_lure_ids : row.primary_fly_ids;
}

function archetypeById(id: string, side: Side) {
  const catalog = side === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4;
  return catalog.find((a) => a.id === id);
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const speciesSummaries = SPECIES.map((species) => {
  const rows = rowsForSpecies(species);
  const eligibleLures = LURE_ARCHETYPES_V4.filter((a) =>
    a.species_allowed.includes(species)
  ).length;
  const eligibleFlies = FLY_ARCHETYPES_V4.filter((a) =>
    a.species_allowed.includes(species)
  ).length;
  return {
    species,
    rows: rows.length,
    eligibleLures,
    eligibleFlies,
    reviewedPairings: REVIEW.filter((r) => r.species === species).length,
  };
});

const rowUsage = SPECIES.flatMap((species) => {
  const rows = rowsForSpecies(species);
  return (["lure", "fly"] as const).flatMap((side) => {
    const ids = new Set<string>();
    for (const row of rows) {
      for (const id of rowIds(row, side)) ids.add(id);
    }
    for (const arch of CATALOG.filter((a) => a.side === side)) {
      if (arch.species_allowed.includes(species)) ids.add(arch.id);
    }
    return [...ids].sort().map((id) => {
      const arch = archetypeById(id, side);
      const usedRows = rows.filter((row) => rowIds(row, side).includes(id));
      const months = [...new Set(usedRows.map((row) => row.month))].sort((
        a,
        b,
      ) => a - b);
      const waterTypes = [...new Set(usedRows.map((row) => row.water_type))]
        .sort();
      const surfaceRows = usedRows.filter((row) =>
        row.surface_seasonally_possible
      ).length;
      return {
        species,
        side,
        archetype_id: id,
        family_group: arch?.family_group ?? "unknown",
        catalogAllowed: arch?.species_allowed.includes(species) ?? false,
        authoredRows: usedRows.length,
        rowShare: rows.length === 0 ? 0 : usedRows.length / rows.length,
        surfaceAuthoredRows: surfaceRows,
        months,
        waterTypes,
        authoredWhileNotAllowed:
          usedRows.length > 0 && !(arch?.species_allowed.includes(species) ??
            false),
      };
    });
  });
});

const reviewWithEvidence = REVIEW.map((review) => {
  const usage = rowUsage.find((row) =>
    row.species === review.species &&
    row.side === review.side &&
    row.archetype_id === review.archetype_id
  );
  return {
    ...review,
    catalogAllowed: usage?.catalogAllowed ?? false,
    authoredRows: usage?.authoredRows ?? 0,
    rowShare: usage?.rowShare ?? 0,
    months: usage?.months ?? [],
    waterTypes: usage?.waterTypes ?? [],
  };
});

const authoredWhileNotAllowed = rowUsage.filter((row) =>
  row.authoredWhileNotAllowed
);

const data = {
  meta: {
    generatedAt: GENERATED_AT,
    purpose:
      "Species-level biological sensibility audit before Phase 4 daily-condition logic.",
    notes: [
      "Generated seasonal files are evidence only; they remain source-generated and were not edited by this audit.",
      "Catalog correction applied separately in lures.ts for trout spinnerbait and trout buzzbait.",
    ],
  },
  speciesSummaries,
  review: reviewWithEvidence,
  authoredWhileNotAllowed,
  rowUsage,
};

function reviewRows(rows: SpeciesReview[]): string {
  return rows.map((review) => {
    const evidence = reviewWithEvidence.find((r) =>
      r.species === review.species &&
      r.side === review.side &&
      r.archetype_id === review.archetype_id
    );
    return `| ${review.species} | ${review.archetype_id} | ${review.side} | ${review.status} | ${
      evidence?.authoredRows ?? 0
    } | ${pct(evidence?.rowShare ?? 0)} | ${review.issueLayer} | ${review.reason} | ${review.recommendedAction} |`;
  }).join("\n");
}

const report = `# Species Biological Sensibility Audit

Generated: ${GENERATED_AT}

## Scope

This audit compares catalog-level species eligibility against generated seasonal row usage for largemouth bass, smallmouth bass, northern pike, and trout. It is intentionally biological and tactical, not a selector-policy audit.

## Method

- Loaded all v4 lure and fly archetypes and all generated seasonal rows.
- Counted eligible lure/fly archetypes by species from \`species_allowed\`.
- Counted seasonal row authoring frequency for each species/archetype pair.
- Flagged pairings that are biologically weak, too broadly authored, dormant, or acceptable edge cases.
- Made only two catalog-level corrections where the mismatch was strong: trout was removed from \`spinnerbait\` and \`buzzbait\`.
- Did not hand-edit generated seasonal rows.

## Species Inventory

| species | seasonal rows | eligible lures | eligible flies | reviewed pairings |
| --- | ---: | ---: | ---: | ---: |
${speciesSummaries.map((s) =>
  `| ${s.species} | ${s.rows} | ${s.eligibleLures} | ${s.eligibleFlies} | ${s.reviewedPairings} |`
).join("\n")}

## High-Signal Findings

- Bass and pike catalogs are broadly sensible; most suspicious cases are not catalog failures but row ubiquity.
- Trout had two clear catalog mismatches: \`spinnerbait\` and \`buzzbait\`; both are now no longer trout-eligible.
- \`casting_spoon\` is biologically strong for trout and northern pike, plausible for bass, but over-authored for largemouth at 100% of rows.
- \`blade_bait\` and \`lipless_crankbait\` are acceptable trout edge/search tools, but their 100% trout row usage should be watched before Phase 4 amplifies them.
- \`mouse_fly\` is a strong trout keep: row usage is seasonal and biologically coherent.
- \`frog_fly\` and \`hollow_body_frog\` are biologically correct for largemouth/pike surface windows; prior absence was geometry, not species mismatch.
- \`balanced_leech\` is a dormant trout stillwater artifact: biologically plausible, but currently has no row path because trout rows are river-only.
- Pike-specific lures and flies look clean; the main pike watch item is whether all-row \`tube_jig\` usage crowds stronger pike-specific choices.

## Reviewed Pairings

| species | archetype | side | status | authored rows | row share | layer | reason | recommended action |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
${reviewRows(REVIEW)}

## Generated Row Follow-Up

These pairings are still present in generated rows even though catalog eligibility now blocks them. Clean the source matrix rather than editing generated files by hand.

| species | archetype | side | authored rows | row share |
| --- | --- | --- | ---: | ---: |
${authoredWhileNotAllowed.map((row) =>
  `| ${row.species} | ${row.archetype_id} | ${row.side} | ${row.authoredRows} | ${pct(row.rowShare)} |`
).join("\n")}

## Recommended Corrections Before Phase 4

### Applied Catalog Corrections

- Removed \`trout\` from \`spinnerbait.species_allowed\`.
- Removed \`trout\` from \`buzzbait.species_allowed\`.

### Recommended Seasonal Source-Matrix Cleanup

- Remove \`spinnerbait\` from trout seasonal source rows.
- Remove \`buzzbait\` from trout seasonal source rows.
- Reduce \`casting_spoon\` in largemouth rows from universal to baitfish/open-water/cold/suspended contexts.
- Watch, but do not yet remove, trout \`blade_bait\`, \`lipless_crankbait\`, \`walking_topwater\`, and \`popping_topwater\`.

## Bottom Line

The recommender is not broadly biologically unsound by species. The strongest pre-Phase-4 correction is trout catalog narrowing for bass-style wire baits. Most other concerns are seasonal-source breadth issues or acceptable edge cases that should be monitored after daily-condition logic is added.
`;

await Deno.mkdir(OUT_DIR, { recursive: true });
await Deno.writeTextFile(
  `${OUT_DIR}/species-sanity-data.json`,
  `${JSON.stringify(data, null, 2)}\n`,
);
await Deno.writeTextFile(
  `${OUT_DIR}/species-sanity-report.md`,
  report,
);

console.log(`Wrote ${OUT_DIR}/species-sanity-data.json`);
console.log(`Wrote ${OUT_DIR}/species-sanity-report.md`);
