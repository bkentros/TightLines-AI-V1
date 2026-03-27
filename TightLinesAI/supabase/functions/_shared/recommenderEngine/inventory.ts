import type {
  InventoryCompatibilityResult,
  RankedFamily,
  TackleBoxItem,
} from "./contracts.ts";

function fitScoreForItem(
  item: TackleBoxItem,
  rankedFamilies: RankedFamily[],
): { familyId: string | null; score: number; compromise: string[] } {
  const rankedMap = new Map(rankedFamilies.map((family) => [family.family_id, family.score]));
  const compatible = [
    item.primary_family_id,
    ...(item.compatible_family_ids ?? []),
  ];
  const matches = compatible
    .map((familyId) => ({
      familyId,
      score: rankedMap.get(familyId) ?? 0,
      primary: familyId === item.primary_family_id,
    }))
    .sort((a, b) => b.score - a.score);

  const best = matches[0];
  if (!best || best.score <= 0) {
    return {
      familyId: null,
      score: 0,
      compromise: ["No strong family match in the current recommendation set."],
    };
  }

  const compromise: string[] = [];
  if (!best.primary) compromise.push("Works as a compatible family, not the primary family.");
  if (best.score < 35) compromise.push("Closer to a workable fallback than an ideal match.");

  return {
    familyId: best.familyId,
    score: best.score,
    compromise,
  };
}

export function scoreInventoryCompatibility(
  inventoryItems: TackleBoxItem[],
  lureRankings: RankedFamily[],
  flyRankings: RankedFamily[],
): InventoryCompatibilityResult | undefined {
  const activeItems = inventoryItems.filter((item) => item.active);
  if (activeItems.length === 0) return undefined;

  const scored = activeItems
    .map((item) => {
      const familyPool = item.gear_mode === "lure" ? lureRankings : flyRankings;
      const fit = fitScoreForItem(item, familyPool);
      return {
        item,
        fit,
      };
    })
    .sort((a, b) => b.fit.score - a.fit.score || a.item.label.localeCompare(b.item.label));

  const strong = scored.filter((entry) => entry.fit.score >= 35).slice(0, 3);
  const near = scored.filter((entry) => entry.fit.score > 0 && entry.fit.score < 35).slice(0, 3);
  const bestOverallFamilyIds = [
    ...lureRankings.slice(0, 3).map((family) => family.family_id),
    ...flyRankings.slice(0, 3).map((family) => family.family_id),
  ];

  return {
    best_overall_family_ids: [...new Set(bestOverallFamilyIds)],
    ...(strong.length > 0
      ? {
          best_from_inventory: strong.map((entry) => ({
            item_id: entry.item.id,
            label: entry.item.label,
            family_id: entry.fit.familyId ?? entry.item.primary_family_id,
            fit_score: Number(entry.fit.score.toFixed(2)),
            ...(entry.fit.compromise.length > 0
              ? { compromise_notes: entry.fit.compromise }
              : {}),
          })),
        }
      : {}),
    ...(near.length > 0
      ? {
          near_match_from_inventory: near.map((entry) => ({
            item_id: entry.item.id,
            label: entry.item.label,
            family_id: entry.fit.familyId ?? entry.item.primary_family_id,
            fit_score: Number(entry.fit.score.toFixed(2)),
          })),
        }
      : {}),
    ...(strong.length === 0
      ? {
          inventory_gap_notes: [
            "Your saved tackle box does not contain a strong match for the top recommendation families yet.",
          ],
        }
      : {}),
  };
}
