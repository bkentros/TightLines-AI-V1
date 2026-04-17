/**
 * Markdown renderer for the Recommender V3 report audit.
 *
 * Renders one markdown file per scenario optimized for a human (or
 * subagent) auditor to read top-to-bottom. Exposes the FULL report
 * surface — every field that could be audited — alongside verbatim
 * why_chosen / how_to_fish copy for technique-correctness review.
 */

import type {
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import type { AutoFlag } from "./flags.ts";
import { formatFlag } from "./flags.ts";
import {
  classifyPressureTrend,
  formatInches,
  formatPct,
  formatPressureMb,
  formatTemp,
  monthName,
} from "./helpers.ts";
import type { ReportAuditScenario } from "./types.ts";

export function renderScenarioReport(
  scenario: ReportAuditScenario,
  response: RecommenderV3Response,
  flags: AutoFlag[],
): string {
  const parts: string[] = [];

  parts.push(renderHeader(scenario));
  parts.push(renderSetup(scenario));
  parts.push(renderEnvironmentSummary(scenario));
  parts.push(renderResolvedDaily(response));
  parts.push(renderSeasonal(response));
  parts.push(renderRecs("Lures", response.lure_recommendations, flags));
  parts.push(renderRecs("Flies", response.fly_recommendations, flags));
  parts.push(renderFlagsSummary(flags));
  parts.push(renderAuditorChecklist());

  return parts.join("\n\n") + "\n";
}

function renderHeader(scenario: ReportAuditScenario): string {
  return `# ${scenario.id} — ${scenario.title}

> **Intent:** ${scenario.intent}`;
}

function renderSetup(scenario: ReportAuditScenario): string {
  const loc = scenario.location;
  return [
    `## Setup`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| Species | ${scenario.species} |`,
    `| Context | ${scenario.context} |`,
    `| Water clarity | ${scenario.water_clarity} |`,
    `| Condition profile | ${scenario.condition_profile} |`,
    `| Region | ${loc.region_key} |`,
    `| State | ${loc.state_code} |`,
    `| Coordinates | ${loc.latitude}, ${loc.longitude} |`,
    `| Date | ${loc.local_date} (${monthName(loc.month)}) |`,
    `| Timezone | ${loc.timezone} |`,
  ].join("\n");
}

function renderEnvironmentSummary(scenario: ReportAuditScenario): string {
  const env = scenario.environment;
  const trend = classifyPressureTrend(env.pressure_history_mb);
  return [
    `## Environmental snapshot`,
    ``,
    `| Variable | Value |`,
    `| --- | --- |`,
    `| Current air | ${formatTemp(env.current_air_temp_f)} |`,
    `| Daily mean / low / high | ${formatTemp(env.daily_mean_air_temp_f)} / ${formatTemp(env.daily_low_air_temp_f)} / ${formatTemp(env.daily_high_air_temp_f)} |`,
    `| Prior day mean | ${formatTemp(env.prior_day_mean_air_temp_f)} |`,
    `| Day minus 2 mean | ${formatTemp(env.day_minus_2_mean_air_temp_f)} |`,
    `| Measured water (now/24h/72h) | ${formatTemp(env.measured_water_temp_f)} / ${formatTemp(env.measured_water_temp_24h_ago_f)} / ${formatTemp(env.measured_water_temp_72h_ago_f)} |`,
    `| Pressure (now) | ${formatPressureMb(env.pressure_mb)} |`,
    `| Pressure trend (48h) | ${trend} (${(env.pressure_history_mb ?? []).map((v) => v.toFixed(1)).join(" → ")}) |`,
    `| Wind | ${env.wind_speed_mph ?? "—"} mph |`,
    `| Cloud cover | ${formatPct(env.cloud_cover_pct)} |`,
    `| Precip 24h / 72h / 7d | ${formatInches(env.precip_24h_in)} / ${formatInches(env.precip_72h_in)} / ${formatInches(env.precip_7d_in)} |`,
    `| Active precip now | ${env.active_precip_now ? "yes" : "no"} |`,
    `| Sunrise / sunset | ${env.sunrise_local ?? "—"} / ${env.sunset_local ?? "—"} |`,
  ].join("\n");
}

function renderResolvedDaily(response: RecommenderV3Response): string {
  const dp = response.daily_payload;
  const pref = response.resolved_profile.daily_preference;
  return [
    `## Resolved daily read`,
    ``,
    `### Posture & windows`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| posture_band | ${dp.posture_band} |`,
    `| reaction_window | ${dp.reaction_window} |`,
    `| surface_window | ${dp.surface_window} |`,
    `| surface_allowed_today | ${dp.surface_allowed_today} |`,
    `| suppress_fast_presentations | ${dp.suppress_fast_presentations} |`,
    `| high_visibility_needed | ${dp.high_visibility_needed} |`,
    `| opportunity_mix | ${dp.opportunity_mix} |`,
    ``,
    `### Daily tactical preference`,
    ``,
    `| Dimension | Primary | Secondary | Order |`,
    `| --- | --- | --- | --- |`,
    `| column | ${pref.preferred_column} | ${pref.secondary_column ?? "—"} | ${[...pref.column_preference_order].join(" → ")} |`,
    `| pace | ${pref.preferred_pace} | ${pref.secondary_pace ?? "—"} | ${[...pref.pace_preference_order].join(" → ")} |`,
    `| presence | ${pref.preferred_presence} | ${pref.secondary_presence ?? "—"} | ${[...pref.presence_preference_order].join(" → ")} |`,
    ``,
    `### Shifts applied to monthly baseline`,
    ``,
    `| Shift | Value |`,
    `| --- | --- |`,
    `| column_shift | ${dp.column_shift} |`,
    `| pace_shift | ${dp.pace_shift} |`,
    `| presence_shift | ${dp.presence_shift} |`,
    ``,
    `### Normalized states`,
    ``,
    "```json",
    JSON.stringify(dp.normalized_states, null, 2),
    "```",
    ``,
    `### Variables triggered`,
    ``,
    `${dp.variables_triggered.length === 0 ? "_(none)_" : dp.variables_triggered.map((v) => `- \`${v}\``).join("\n")}`,
    ``,
    `### Daily preference notes`,
    ``,
    `${pref.notes.length === 0 ? "_(none)_" : pref.notes.map((n) => `- ${n}`).join("\n")}`,
  ].join("\n");
}

function renderSeasonal(response: RecommenderV3Response): string {
  const row = response.seasonal_row;
  return [
    `## Seasonal baseline (month ${response.month})`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| source region | ${response.seasonal_source_region_key} |`,
    `| region fallback used | ${response.used_region_fallback} |`,
    `| state-scoped row | ${response.used_state_scoped_row} |`,
    `| primary forage | ${row.monthly_baseline.primary_forage} |`,
    `| secondary forage | ${row.monthly_baseline.secondary_forage ?? "—"} |`,
    `| surface seasonally possible | ${row.monthly_baseline.surface_seasonally_possible} |`,
    `| monthly allowed columns | ${[...row.monthly_baseline.allowed_columns].join(", ")} |`,
    `| monthly column order | ${[...row.monthly_baseline.column_preference_order].join(" → ")} |`,
    `| monthly allowed paces | ${[...row.monthly_baseline.allowed_paces].join(", ")} |`,
    `| monthly pace order | ${[...row.monthly_baseline.pace_preference_order].join(" → ")} |`,
    `| monthly allowed presence | ${[...row.monthly_baseline.allowed_presence].join(", ")} |`,
    `| monthly presence order | ${[...row.monthly_baseline.presence_preference_order].join(" → ")} |`,
    `| typical seasonal water column | ${row.monthly_baseline.typical_seasonal_water_column} |`,
    `| typical seasonal location | ${row.monthly_baseline.typical_seasonal_location} |`,
  ].join("\n");
}

function renderRecs(
  title: string,
  recs: RecommenderV3RankedArchetype[],
  allFlags: AutoFlag[],
): string {
  const parts = [`## ${title}`, ``];
  recs.slice(0, 3).forEach((rec, idx) => {
    parts.push(renderRec(rec, idx + 1, allFlags));
  });
  return parts.join("\n\n");
}

function renderRec(
  rec: RecommenderV3RankedArchetype,
  position: number,
  allFlags: AutoFlag[],
): string {
  const recFlags = allFlags.filter((f) => f.scope === "rec" && f.subject === rec.id);
  return [
    `### ${position}. ${rec.display_name} — \`${rec.id}\`  _(${rec.selection_role})_`,
    ``,
    `**Authored profile**`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| gear_mode | ${rec.gear_mode} |`,
    `| tactical_lane | \`${rec.tactical_lane}\` |`,
    `| family_group | \`${rec.family_group}\` |`,
    `| primary_column | ${rec.primary_column} |`,
    `| pace | ${rec.pace} |`,
    `| presence | ${rec.presence} |`,
    `| is_surface | ${rec.is_surface} |`,
    ``,
    `**Scoring**`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| score | ${rec.score.toFixed(3)} |`,
    `| tactical_fit | ${rec.tactical_fit.toFixed(3)} |`,
    `| practicality_fit | ${rec.practicality_fit.toFixed(3)} |`,
    `| forage_fit | ${rec.forage_fit.toFixed(3)} |`,
    `| clarity_fit | ${rec.clarity_fit.toFixed(3)} |`,
    `| diversity_bonus | ${rec.diversity_bonus.toFixed(3)} |`,
    ``,
    `**Score breakdown**`,
    ``,
    "```json",
    JSON.stringify(rec.breakdown, null, 2),
    "```",
    ``,
    `**Color**`,
    ``,
    `- theme: \`${rec.color_theme}\``,
    `- recommendations: \`${rec.color_recommendations.join(", ")}\``,
    `- reason: ${rec.color_decision.short_reason} _(code: \`${rec.color_decision.reason_code}\`)_`,
    ``,
    `**Why chosen** _(verbatim — audit for accuracy)_`,
    ``,
    `> ${rec.why_chosen.split("\n").join("\n> ")}`,
    ``,
    `**How to fish** _(verbatim — audit for technique correctness)_`,
    ``,
    `> ${rec.how_to_fish.split("\n").join("\n> ")}`,
    ``,
    `**Automated flags**`,
    ``,
    recFlags.length === 0
      ? `_(none)_`
      : recFlags.map((f) => `- ${formatFlag(f)}`).join("\n"),
  ].join("\n");
}

function renderFlagsSummary(flags: AutoFlag[]): string {
  if (flags.length === 0) {
    return `## Automated flags summary\n\n_(none)_`;
  }

  const bySeverity: Record<string, AutoFlag[]> = {};
  for (const f of flags) {
    (bySeverity[f.severity] ??= []).push(f);
  }

  const order = ["BLOCKER", "BUG", "POLISH", "FYI"];
  const lines = [`## Automated flags summary`, ``];
  for (const sev of order) {
    const group = bySeverity[sev];
    if (!group || group.length === 0) continue;
    lines.push(`### ${sev} (${group.length})`);
    for (const f of group) {
      const scope = f.subject ? `[${f.scope}:${f.subject}]` : `[${f.scope}]`;
      lines.push(`- ${scope} ${f.message}`);
    }
    lines.push(``);
  }

  return lines.join("\n");
}

function renderAuditorChecklist(): string {
  return [
    `## Auditor checklist`,
    ``,
    `Work top-to-bottom. Record findings in the "Auditor notes" section below,`,
    `citing specific recommendation ids and quoted copy. Tag each finding with`,
    `\`[BLOCKER]\`, \`[BUG]\`, \`[POLISH]\`, or \`[FYI]\`.`,
    ``,
    `- [ ] 1. **Day read** — do posture_band / opportunity_mix / surface_window / daily preference (column/pace/presence) match what a guide would deduce from the environment above?`,
    `- [ ] 2. **Primary forage** — does \`seasonal_row.primary_forage\` make biological sense for species + region + month?`,
    `- [ ] 3. **Lure selections** — are the 3 lures reasonable for this species/water/season/region? Any obvious misses or oddities?`,
    `- [ ] 4. **Fly selections** — are the 3 flies reasonable for this species/water/season/region? Any obvious misses or oddities?`,
    `- [ ] 5. **Per-rec authored dimensions** — do \`primary_column\`, \`pace\`, \`presence\`, \`is_surface\` match what this lure/fly is known for? Flag any authored ranges that look wrong.`,
    `- [ ] 6. **Why-chosen accuracy** — does each \`why_chosen\` cite drivers that actually match this lure + this day? Flag generic fluff, hallucinated reasons, or claims that contradict the day read.`,
    `- [ ] 7. **How-to-fish accuracy** — does each \`how_to_fish\` describe the CORRECT technique for this archetype, consistent with its column/pace/presence? Flag anything technically wrong.`,
    `- [ ] 8. **Trio coherence** — do the 3 lures (and 3 flies) form a sensible diverse-but-compatible set? Any pair that should not coexist given today's gates?`,
    `- [ ] 9. **Cross-check auto-flags** — for each auto-flag above, confirm or dismiss with reasoning.`,
    ``,
    `## Auditor notes`,
    ``,
    `_(fill in findings here — be specific, cite ids + quotes, tag severity, recommend fix with file path / function name when possible)_`,
  ].join("\n");
}
