import type { RecommenderResponse } from "../../../supabase/functions/_shared/recommenderEngine/contracts.ts";
import type { RecommenderE2eScenario } from "./e2eAuditChecks.ts";

function contextTitle(context: string): string {
  if (context === "freshwater_lake_pond") return "Freshwater Lake/Pond";
  if (context === "freshwater_river") return "Freshwater River";
  if (context === "coastal") return "Coastal Inshore";
  if (context === "coastal_flats_estuary") return "Flats & Estuary";
  return context;
}

function primaryTrack(response: RecommenderResponse) {
  const topLure = response.lure_rankings[0] ?? null;
  const topFly = response.fly_rankings[0] ?? null;
  if (response.polished?.track_kind === "lure") {
    return { kind: "lure" as const, family: topLure, alternate: topFly };
  }
  if (response.polished?.track_kind === "fly") {
    return { kind: "fly" as const, family: topFly, alternate: topLure };
  }
  if (!topFly) return { kind: "lure" as const, family: topLure, alternate: null };
  if (!topLure) return { kind: "fly" as const, family: topFly, alternate: null };
  return topLure.score >= topFly.score
    ? { kind: "lure" as const, family: topLure, alternate: topFly }
    : { kind: "fly" as const, family: topFly, alternate: topLure };
}

function gearTrackLabel(kind: "lure" | "fly"): string {
  return kind === "lure" ? "Lure Track" : "Fly Track";
}

function cleanAuditCopy(text: string): string {
  return text
    .replace(/\b(upper|mid|lower|bottom)(?:-|\s)lane\s+lane\b/gi, "$1 lane")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function renderInAppStyleRecommenderReport(input: {
  scenario: RecommenderE2eScenario;
  response: RecommenderResponse;
  audit: {
    pass: boolean;
    worst_severity: string;
    failure_mode_summary?: string;
    n_flags?: number;
  };
}): string {
  const { scenario, response, audit } = input;
  const loc =
    (scenario.location_name && String(scenario.location_name).trim()) ||
    `${scenario.latitude.toFixed(2)}, ${scenario.longitude.toFixed(2)}`;
  const topLure = response.lure_rankings[0];
  const topFly = response.fly_rankings[0];
  const polished = response.polished;
  const primary = primaryTrack(response);
  const topDepth = response.fish_behavior.position.depth_lanes[0]?.id ?? "mid_depth";
  const topRelation = response.fish_behavior.position.relation_tags[0]?.id ?? "edge_oriented";
  const topArchetype = response.presentation_archetypes[0]?.archetype_id ?? "balanced";

  const lines: string[] = [];
  lines.push("## Lure/Fly Recommender");
  lines.push("");
  lines.push(`**Location:** ${loc}`);
  lines.push(`**Date:** ${scenario.local_date} (${scenario.local_timezone})`);
  lines.push(`**Context:** ${contextTitle(scenario.context)}`);
  lines.push(`**Manual clarity:** ${scenario.refinements?.water_clarity ?? "not entered"}`);
  if (scenario.region_key) lines.push(`**Region:** ${scenario.region_key}`);
  lines.push(`_Audit scenario: \`${scenario.id}\`_`);
  lines.push("");

  lines.push("### Headline");
  lines.push("");
  lines.push(cleanAuditCopy((polished?.headline ?? response.narration_payload.summary_seed).trim()));
  lines.push("");

  lines.push("### Where Fish Are");
  lines.push("");
  lines.push(cleanAuditCopy((polished?.where_insight ?? response.narration_payload.position_points.join(" ")).trim()));
  lines.push("");

  lines.push("### Behavior Read");
  lines.push("");
  lines.push(cleanAuditCopy((polished?.behavior_read ?? response.narration_payload.behavior_points.join(" ")).trim()));
  lines.push("");

  lines.push("### Presentation Tip");
  lines.push("");
  lines.push(cleanAuditCopy((polished?.presentation_tip ?? response.narration_payload.presentation_points.join(" ")).trim()));
  lines.push("");

  lines.push("### Primary Track");
  lines.push("");
  if (primary.family) {
    lines.push(`- **Gear mode:** ${gearTrackLabel(primary.kind)}`);
    lines.push(`- **Top family:** ${primary.family.display_name}`);
    lines.push(`- **Best setup:** ${primary.family.best_method.setup_label}`);
    lines.push(
      `- **Presentation:** ${primary.family.best_method.presentation_guide.pace} pace · ` +
        `${primary.family.best_method.presentation_guide.lane} lane · ` +
        `${primary.family.best_method.presentation_guide.action}`,
    );
    lines.push(`- **How to fish it:** ${primary.family.best_method.presentation_guide.summary}`);
    if (primary.family.color_profile_guidance?.length) {
      lines.push(`- **Color/profile:** ${primary.family.color_profile_guidance.join(", ")}`);
    }
  } else {
    lines.push("_No primary track recommendation generated._");
  }
  lines.push("");

  lines.push("### Alternate Track");
  lines.push("");
  if (primary.alternate) {
    lines.push(`- **Gear mode:** ${gearTrackLabel(primary.kind === "lure" ? "fly" : "lure")}`);
    lines.push(`- **Top family:** ${primary.alternate.display_name}`);
    lines.push(`- **Best setup:** ${primary.alternate.best_method.setup_label}`);
    lines.push(
      `- **Presentation:** ${primary.alternate.best_method.presentation_guide.pace} pace · ` +
        `${primary.alternate.best_method.presentation_guide.lane} lane · ` +
        `${primary.alternate.best_method.presentation_guide.action}`,
    );
    lines.push(`- **How to fish it:** ${primary.alternate.best_method.presentation_guide.summary}`);
  } else {
    lines.push("_No alternate track recommendation generated._");
  }
  lines.push("");

  lines.push("### Engine Read");
  lines.push("");
  lines.push(`- **Primary depth lane:** ${topDepth}`);
  lines.push(`- **Primary relation:** ${topRelation}`);
  lines.push(`- **Lead archetype:** ${topArchetype}`);
  lines.push(`- **Activity:** ${response.fish_behavior.behavior.activity}`);
  lines.push(`- **Strike zone:** ${response.fish_behavior.behavior.strike_zone}`);
  lines.push(`- **Chase radius:** ${response.fish_behavior.behavior.chase_radius}`);
  lines.push("");

  lines.push("### Confidence");
  lines.push("");
  lines.push(
    `Behavior ${response.confidence.behavior_confidence} · Presentation ${response.confidence.presentation_confidence} · Family ${response.confidence.family_confidence}`,
  );
  if (response.confidence.reasons.length > 0) {
    lines.push("");
    response.confidence.reasons.forEach((reason) => lines.push(`- ${reason}`));
  }
  lines.push("");

  lines.push("---");
  lines.push(
    `_Automated checks: **${audit.pass ? "PASS" : "FAIL"}** · worst: ${audit.worst_severity}` +
      (audit.n_flags != null ? ` · flags: ${audit.n_flags}` : "") + "_",
  );
  if (audit.failure_mode_summary?.trim()) {
    lines.push(`_${audit.failure_mode_summary.trim()}_`);
  }

  return lines.join("\n");
}
