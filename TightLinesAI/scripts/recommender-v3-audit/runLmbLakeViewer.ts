#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * runLmbLakeViewer.ts
 *
 * Reads the cached archive env bundle, runs the V3 engine for each LMB lake/pond
 * scenario, and writes:
 *   1. lmb-lake-viewer-results.json   — structured viewer data
 *   2. lmb-lake-viewer.html           — self-contained audit viewer UI
 *
 * Requires: buildLmbLakeViewerArchiveEnv.ts to have been run first.
 *
 * Usage:
 *   deno run --allow-read --allow-write \
 *     scripts/recommender-v3-audit/runLmbLakeViewer.ts
 */

import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import {
  runRecommenderV3,
  runRecommenderV3Surface,
} from "../../supabase/functions/_shared/recommenderEngine/legacyV3.ts";
import type { ArchiveBatchBundle, ArchiveScenarioBundle } from "./archiveBundle.ts";
import { LMB_LAKE_VIEWER_SCENARIOS } from "./lmbLakeViewerScenarios.ts";

const ARCHIVE_PATH = "docs/recommender-v3-audit/generated/lmb-lake-viewer-archive-env.json";
const OUTPUT_JSON = "docs/recommender-v3-audit/generated/lmb-lake-viewer-results.json";
const OUTPUT_HTML = "docs/recommender-v3-audit/generated/lmb-lake-viewer.html";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewerRecommendation = {
  id: string;
  display_name: string;
  gear_mode: "lure" | "fly";
  color_theme: string;
  color_theme_label: string;
  color_shades: [string, string, string];
  how_to_fish: string;
  water_column: string;
  score: number;
  /** `water_column_fit` — resolved column vs archetype preference. */
  water_column_fit: number;
  /** Posture + presentation + daily_condition_fit + guardrail_penalty. */
  daily_stack: number;
  clarity_fit: number;
  forage_bonus: number;
  rank: number;
};

type ViewerScenarioResult = {
  id: string;
  region_label: string;
  state_code: string;
  local_date: string;
  month: number;
  month_label: string;
  water_clarity: string;
  weather_summary: string;
  daily_context: string;
  lures: ViewerRecommendation[];
  flies: ViewerRecommendation[];
};

type ViewerResults = {
  generated_at: string;
  archive_bundle_generated_at: string | null;
  scenario_count: number;
  scenarios: ViewerScenarioResult[];
};

// ─── Lookup tables ─────────────────────────────────────────────────────────

const MONTH_LABELS: Record<number, string> = {
  1: "January", 2: "February", 3: "March", 4: "April",
  5: "May", 6: "June", 7: "July", 8: "August",
  9: "September", 10: "October", 11: "November", 12: "December",
};

const COLOR_THEME_LABELS: Record<string, string> = {
  natural: "Natural",
  dark: "Dark",
  bright: "Bright",
};

// Maps tactical_lane → human water column label used in the details dropdown.
// Only speaks to what the engine resolves — no inferred specifics.
const WATER_COLUMN_FROM_LANE: Record<string, string> = {
  bottom_contact: "Bottom",
  finesse_subtle: "Bottom–Mid",
  horizontal_search: "Mid",
  reaction_mid_column: "Mid",
  surface: "Surface",
  cover_weedless: "Shallow",
  pike_big_profile: "Mid",
  fly_baitfish: "Mid",
  fly_bottom: "Bottom",
  fly_surface: "Surface",
};

// Fallback technique text derived directly from tactical_lane — only used
// when no surface family match is found (edge case).
const TECHNIQUE_FROM_LANE: Record<string, string> = {
  bottom_contact: "Drag or hop along the bottom",
  finesse_subtle: "Slow drag with minimal action",
  horizontal_search: "Steady retrieve through the water column",
  reaction_mid_column: "Rip-and-pause reaction retrieve",
  surface: "Walk, pop, or chug along the surface",
  cover_weedless: "Flip or pitch into heavy cover",
  pike_big_profile: "Slow roll through mid column",
  fly_baitfish: "Strip retrieve through mid column",
  fly_bottom: "Dead drift or slow strip along the bottom",
  fly_surface: "Pop or skate on the surface",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function weatherSummary(bundle: ArchiveScenarioBundle): string {
  const s = bundle.archive_summary;
  const parts: string[] = [];
  if (s.daily_high_air_temp_f !== null) parts.push(`${Math.round(s.daily_high_air_temp_f)}°F high`);
  if (s.daily_low_air_temp_f !== null) parts.push(`${Math.round(s.daily_low_air_temp_f)}°F low`);
  if (s.daily_wind_max_mph !== null) parts.push(`${Math.round(s.daily_wind_max_mph)} mph wind`);
  if (s.daily_precip_in !== null && s.daily_precip_in > 0.01) {
    parts.push(`${s.daily_precip_in.toFixed(2)}" precip`);
  }
  if (s.moon_phase) parts.push(s.moon_phase);
  return parts.length > 0 ? parts.join(" · ") : "Archive weather available";
}

function dailyContext(raw: ReturnType<typeof runRecommenderV3>): string {
  const p = raw.daily_payload;
  const triggered = p.variables_triggered.length > 0
    ? ` · fired: ${p.variables_triggered.join("/")}`
    : "";
  return `posture ${p.posture_band} · presence ${raw.resolved_profile.daily_preference.preferred_presence} · surface ${p.surface_window}${triggered}`;
}

function toViewerRec(
  rawRec: ReturnType<typeof runRecommenderV3>["lure_recommendations"][number],
  surfaceRankings: ReturnType<typeof runRecommenderV3Surface>["lure_recommendations"],
  gearMode: "lure" | "fly",
  rank: number,
): ViewerRecommendation {
  const surfaceFamily = surfaceRankings.find((f) => f.id === rawRec.id);
  const howToFish = surfaceFamily?.how_to_fish ?? TECHNIQUE_FROM_LANE[rawRec.tactical_lane] ?? rawRec.tactical_lane;
  const waterColumn = WATER_COLUMN_FROM_LANE[rawRec.tactical_lane] ?? "Mid";
  const shades = rawRec.color_recommendations as [string, string, string];

  return {
    id: rawRec.id,
    display_name: rawRec.display_name,
    gear_mode: gearMode,
    color_theme: rawRec.color_theme,
    color_theme_label: COLOR_THEME_LABELS[rawRec.color_theme] ?? rawRec.color_theme,
    color_shades: shades,
    how_to_fish: howToFish,
    water_column: waterColumn,
    score: rawRec.score,
    water_column_fit: rawRec.tactical_fit,
    daily_stack: rawRec.tactical_fit + rawRec.practicality_fit + rawRec.diversity_bonus,
    clarity_fit: rawRec.clarity_fit,
    forage_bonus: rawRec.forage_fit,
    rank,
  };
}

function buildScenarioResult(
  scenario: (typeof LMB_LAKE_VIEWER_SCENARIOS)[number],
  bundle: ArchiveScenarioBundle,
): ViewerScenarioResult | null {
  if (bundle.status !== "ready" || !bundle.shared_environment) return null;

  const req: RecommenderRequest = {
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      region_key: bundle.location.region_key,
      local_date: scenario.local_date,
      local_timezone: scenario.timezone,
      month: bundle.location.month,
    },
    species: "largemouth_bass",
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    env_data: (bundle.shared_environment ?? {}) as Record<string, unknown>,
  };

  const raw = runRecommenderV3(req);
  const surface = runRecommenderV3Surface(req);
  const month = bundle.location.month;

  const lures = raw.lure_recommendations.slice(0, 3).map((rec, i) =>
    toViewerRec(rec, surface.lure_recommendations, "lure", i + 1)
  );
  const flies = raw.fly_recommendations.slice(0, 3).map((rec, i) =>
    toViewerRec(rec, surface.fly_recommendations, "fly", i + 1)
  );

  return {
    id: scenario.id,
    region_label: scenario.region_label,
    state_code: scenario.state_code,
    local_date: scenario.local_date,
    month,
    month_label: MONTH_LABELS[month] ?? `Month ${month}`,
    water_clarity: scenario.water_clarity,
    weather_summary: weatherSummary(bundle),
    daily_context: dailyContext(raw),
    lures,
    flies,
  };
}

// ─── HTML generation ─────────────────────────────────────────────────────────

// Approximate hex values for the named shade strings the engine produces.
// Only used for visual dot indicators in the viewer — not production color data.
const SHADE_HEX_MAP: Record<string, string> = {
  // Natural baitfish
  "olive/white": "#B0B87A",
  "shad": "#9BB0C4",
  "smoke shad": "#B8C8D4",
  // White / Shad
  "white": "#F4F4F4",
  "pearl": "#EDE9E0",
  "white/silver": "#DDEAF0",
  // Bright contrast
  "white/chartreuse": "#D2F000",
  "chartreuse/black": "#8ABF00",
  "firetiger": "#FF7500",
  "chartreuse/white": "#CAED00",
  // Dark contrast
  "black/blue": "#151D3A",
  "black/purple": "#220A35",
  "black/red": "#360D14",
  "black": "#1A1A1A",
  "junebug": "#2E0030",
  // Craw natural
  "brown/orange": "#B85520",
  "rust brown": "#7A2E10",
  "amber brown": "#BF7D28",
  // Green pumpkin
  "green pumpkin": "#486220",
  "green pumpkin blue": "#385332",
  "pb&j": "#883562",
  // Watermelon
  "watermelon": "#BF2040",
  "watermelon red": "#B01030",
  "watermelon candy": "#E42860",
  // Perch / Bluegill
  "perch": "#BE8528",
  "bluegill": "#386685",
  "olive/orange": "#876628",
  // Frog
  "leopard frog": "#587A28",
  "bullfrog": "#3A5618",
  "black frog": "#1B281A",
  // Mouse
  "gray mouse": "#888888",
  "brown mouse": "#6A4828",
  "black mouse": "#1A1A1A",
  // Metal / Flash
  "chrome/blue": "#98C8EE",
  "gold/black": "#C0A020",
  "silver": "#BEBEC8",
};

function shadeHex(shade: string): string {
  return SHADE_HEX_MAP[shade.toLowerCase()] ?? "#D4E8D8";
}

function clarityBadgeClass(clarity: string): string {
  if (clarity === "clear") return "badge-clear";
  if (clarity === "dirty") return "badge-dirty";
  return "badge-stained";
}

function renderRecCard(rec: ViewerRecommendation, scenarioId: string): string {
  const recId = `${scenarioId}_${rec.gear_mode}_${rec.rank}`;
  const rankLabel = rec.rank === 1 ? "Top pick" : rec.rank === 2 ? "2nd" : "3rd";
  const scoreSign = (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
  const scoreBreakdown = [
    `Column ${rec.water_column_fit.toFixed(2)}`,
    rec.daily_stack !== 0 ? `Daily ${scoreSign(rec.daily_stack)}` : null,
    rec.clarity_fit !== 0 ? `Clarity ${scoreSign(rec.clarity_fit)}` : null,
    rec.forage_bonus !== 0 ? `Forage ${scoreSign(rec.forage_bonus)}` : null,
  ].filter(Boolean).join(" · ");

  return `
  <div class="rec-card" id="${recId}">
    <div class="rec-main" onclick="toggleRec('${recId}')">
      <div class="rec-img-placeholder">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" stroke="#253D2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
          <circle cx="15.5" cy="11" r="1" fill="#253D2C" opacity="0.3"/>
        </svg>
      </div>
      <div class="rec-info">
        <div class="rec-rank">${rankLabel}</div>
        <div class="rec-name">${rec.display_name}</div>
        <div class="rec-theme">${rec.color_theme_label}</div>
        <div class="rec-shades">
          ${rec.color_shades.map((s) => `
          <div class="shade-pill">
            <div class="shade-dot" style="background:${shadeHex(s)}"></div>
            <span>${s}</span>
          </div>`).join("")}
        </div>
      </div>
      <div class="rec-expand" id="${recId}_arrow">›</div>
    </div>
    <div class="rec-detail" id="${recId}_detail">
      <div class="detail-row">
        <span class="detail-label">Technique</span>
        <span class="detail-value">${rec.how_to_fish}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Water</span>
        <span class="detail-value">${rec.water_column}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Score</span>
        <span class="detail-value score-breakdown">${rec.score.toFixed(2)} &nbsp;<span class="score-parts">${scoreBreakdown}</span></span>
      </div>
    </div>
  </div>`;
}

function renderScenarioCard(s: ViewerScenarioResult): string {
  const lureCards = s.lures.map((r) => renderRecCard(r, s.id)).join("");
  const flyCards = s.flies.map((r) => renderRecCard(r, s.id)).join("");

  return `
<div class="scenario-card">
  <div class="scenario-header">
    <div class="scenario-title">${s.region_label.toUpperCase()} · ${s.month_label.toUpperCase()}</div>
    <div class="scenario-subdate">${s.local_date}</div>
    <div class="scenario-meta">
      <span class="badge ${clarityBadgeClass(s.water_clarity)}">${s.water_clarity}</span>
      <span class="badge badge-state">${s.state_code}</span>
    </div>
    <div class="weather-line">${s.weather_summary}</div>
    <div class="context-line">${s.daily_context}</div>
  </div>
  <div class="section-tabs">
    <div class="section-tab active" id="${s.id}_tab_lures" onclick="switchTab('${s.id}', 'lures')">Lures</div>
    <div class="section-tab" id="${s.id}_tab_flies" onclick="switchTab('${s.id}', 'flies')">Flies</div>
  </div>
  <div class="recs-section" id="${s.id}_lures">
    ${lureCards}
  </div>
  <div class="recs-section" id="${s.id}_flies" style="display:none">
    ${flyCards}
  </div>
</div>`;
}

function generateHtml(results: ViewerResults): string {
  const scenarioCards = results.scenarios.map(renderScenarioCard).join("\n");

  // Group labels for page-level context
  const regions = [...new Set(results.scenarios.map((s) => s.region_label))];
  const regionList = regions.join(", ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LMB Lake / Pond — Regional Audit</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: #F2FAF4;
      color: #253D2C;
      padding: 28px 24px 48px;
      min-height: 100vh;
    }

    /* ── Page header ── */
    .page-header {
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid #D4E8D8;
    }
    .page-title {
      font-size: 20px;
      font-weight: 700;
      color: #253D2C;
      letter-spacing: -0.3px;
    }
    .page-meta {
      font-size: 12px;
      color: #7BAF8B;
      margin-top: 5px;
      line-height: 1.5;
    }

    /* ── Grid ── */
    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 14px;
    }

    /* ── Scenario card ── */
    .scenario-card {
      background: #FFFFFF;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(37, 61, 44, 0.07);
    }

    .scenario-header {
      padding: 14px 15px 11px;
      border-bottom: 1px solid #EAF4EC;
    }
    .scenario-title {
      font-size: 11px;
      font-weight: 700;
      color: #253D2C;
      letter-spacing: 0.7px;
    }
    .scenario-subdate {
      font-size: 10px;
      color: #6B8A78;
      margin-top: 3px;
      font-variant-numeric: tabular-nums;
    }
    .scenario-meta {
      display: flex;
      gap: 5px;
      margin-top: 5px;
    }
    .badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 99px;
    }
    .badge-stained { background: #FFF3DF; color: #8B5E1A; }
    .badge-clear   { background: #E0F0FF; color: #1A5E8B; }
    .badge-dirty   { background: #F3E5E3; color: #8B281A; }
    .badge-state   { background: #E6F5EB; color: #2E6F40; }
    .weather-line {
      font-size: 11px;
      color: #7BAF8B;
      margin-top: 5px;
    }
    .context-line {
      font-size: 10px;
      color: #A5C8B0;
      margin-top: 3px;
      font-style: italic;
    }

    /* ── Tabs ── */
    .section-tabs {
      display: flex;
      border-bottom: 1px solid #EAF4EC;
    }
    .section-tab {
      flex: 1;
      padding: 7px 0;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      color: #A5C8B0;
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: color 0.15s;
      border-bottom: 2px solid transparent;
    }
    .section-tab.active {
      color: #2E6F40;
      border-bottom: 2px solid #2E6F40;
    }

    /* ── Rec card ── */
    .rec-card {
      border-bottom: 1px solid #EAF4EC;
    }
    .rec-card:last-child { border-bottom: none; }

    .rec-main {
      display: flex;
      align-items: flex-start;
      padding: 11px 13px;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .rec-main:active { background: #F6FCF7; }

    .rec-img-placeholder {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      background: #F2FAF4;
      border: 1px dashed #C8E0CC;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rec-info { flex: 1; min-width: 0; }

    .rec-rank {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #A5C8B0;
    }
    .rec-name {
      font-size: 14px;
      font-weight: 700;
      color: #253D2C;
      line-height: 1.2;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rec-theme {
      font-size: 10px;
      color: #7BAF8B;
      margin-top: 2px;
    }
    .rec-shades {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }
    .shade-pill {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 9px;
      color: #3B6147;
      background: #F2FAF4;
      padding: 2px 6px 2px 4px;
      border-radius: 99px;
      white-space: nowrap;
    }
    .shade-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.1);
      flex-shrink: 0;
    }

    .rec-expand {
      font-size: 17px;
      color: #C8E0CC;
      flex-shrink: 0;
      transition: transform 0.18s ease, color 0.15s;
      line-height: 1;
      padding-top: 3px;
    }
    .rec-expand.open {
      transform: rotate(90deg);
      color: #68BA7F;
    }

    /* ── Detail dropdown ── */
    .rec-detail {
      display: none;
      padding: 0 13px 12px 69px;
      border-top: 1px solid #EAF4EC;
    }
    .rec-detail.open { display: block; }

    .detail-row {
      display: flex;
      gap: 10px;
      margin-top: 7px;
      align-items: flex-start;
    }
    .detail-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #A5C8B0;
      width: 60px;
      flex-shrink: 0;
      padding-top: 1px;
    }
    .detail-value {
      font-size: 11px;
      color: #3B6147;
      line-height: 1.45;
    }
    .score-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }
    .score-parts {
      font-size: 10px;
      color: #7BAF8B;
    }
  </style>
</head>
<body>

<div class="page-header">
  <div class="page-title">LMB Lake / Pond — Regional Audit</div>
  <div class="page-meta">
    Largemouth bass · freshwater lake/pond · ${results.scenario_count} scenarios · ${regionList}<br>
    Generated ${results.generated_at} · Archive: ${results.archive_bundle_generated_at ?? "—"}
  </div>
</div>

<div class="scenarios-grid">
${scenarioCards}
</div>

<script>
  function switchTab(scenarioId, target) {
    const lureSection = document.getElementById(scenarioId + '_lures');
    const flySection  = document.getElementById(scenarioId + '_flies');
    const lureTab     = document.getElementById(scenarioId + '_tab_lures');
    const flyTab      = document.getElementById(scenarioId + '_tab_flies');
    if (!lureSection || !flySection) return;

    if (target === 'lures') {
      lureSection.style.display = '';
      flySection.style.display  = 'none';
      lureTab.classList.add('active');
      flyTab.classList.remove('active');
    } else {
      lureSection.style.display = 'none';
      flySection.style.display  = '';
      flyTab.classList.add('active');
      lureTab.classList.remove('active');
    }
  }

  function toggleRec(recId) {
    const detail = document.getElementById(recId + '_detail');
    const arrow  = document.getElementById(recId + '_arrow');
    if (!detail || !arrow) return;
    const isOpen = detail.classList.contains('open');
    detail.classList.toggle('open', !isOpen);
    arrow.classList.toggle('open', !isOpen);
  }
</script>

</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (import.meta.main) {
  // 1. Load archive env bundle
  let archiveBundle: ArchiveBatchBundle | null = null;
  try {
    const raw = await Deno.readTextFile(ARCHIVE_PATH);
    archiveBundle = JSON.parse(raw) as ArchiveBatchBundle;
  } catch {
    console.error(`Archive env not found at ${ARCHIVE_PATH}`);
    console.error("Run buildLmbLakeViewerArchiveEnv.ts first.");
    Deno.exit(1);
  }

  const bundleMap = new Map(
    archiveBundle.scenarios.map((s) => [s.scenario_id, s]),
  );

  // 2. Run engine for each scenario
  const scenarioResults: ViewerScenarioResult[] = [];
  let skipped = 0;

  for (const scenario of LMB_LAKE_VIEWER_SCENARIOS) {
    const bundle = bundleMap.get(scenario.id);
    if (!bundle) {
      console.warn(`No archive bundle found for ${scenario.id} — skipping`);
      skipped++;
      continue;
    }
    if (bundle.status !== "ready" || !bundle.shared_environment) {
      console.warn(`Archive bundle not ready for ${scenario.id} (${bundle.error ?? "unknown"}) — skipping`);
      skipped++;
      continue;
    }

    const result = buildScenarioResult(scenario, bundle);
    if (!result) {
      console.warn(`Engine failed for ${scenario.id} — skipping`);
      skipped++;
      continue;
    }

    scenarioResults.push(result);
    console.log(`✓ ${scenario.id} — ${result.lures[0]?.display_name ?? "?"} / ${result.flies[0]?.display_name ?? "?"}`);
  }

  // 3. Build viewer results object
  const viewerResults: ViewerResults = {
    generated_at: new Date().toISOString(),
    archive_bundle_generated_at: archiveBundle.generated_at,
    scenario_count: scenarioResults.length,
    scenarios: scenarioResults,
  };

  // 4. Write JSON
  await Deno.writeTextFile(OUTPUT_JSON, `${JSON.stringify(viewerResults, null, 2)}\n`);
  console.log(`\nWrote ${OUTPUT_JSON}`);

  // 5. Generate and write HTML
  const html = generateHtml(viewerResults);
  await Deno.writeTextFile(OUTPUT_HTML, html);
  console.log(`Wrote ${OUTPUT_HTML}`);

  if (skipped > 0) console.warn(`Skipped ${skipped} scenarios (archive or engine failures)`);
  console.log(`\nOpen in browser: open ${OUTPUT_HTML}`);
}
