import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { assertRecommenderV3Scope } from "../v3/scope.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { resolveSeasonalRowRebuild } from "./seasonalResolve.ts";
import {
  meanDaylightWindMph,
  type WindBand,
  windBandFromDaylightWindMph,
} from "./wind.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  type DailyRegime,
  regimeFromHowsScore,
  type TargetProfile,
} from "./shapeProfiles.ts";
import {
  buildDailyTacticalProfile,
  clarityLightModeFromLabels,
  type DailyTacticalProfile,
  runoffModeFromLabel,
  thermalModeFromLabels,
} from "./dailyTacticalProfile.ts";
import { type RebuildSlotPick, selectArchetypesForSide } from "./selectSide.ts";
import type { RecentRecommendationHistoryEntry } from "./recentHistory.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "./conditionWindows.ts";

export type RebuildEngineResult = {
  row: SeasonalRowV4;
  regime: DailyRegime;
  surfaceBlocked: boolean;
  daylightWindMph: number;
  windBand: WindBand;
  lureConditionState: LureDailyConditionState;
  flyConditionState: FlyDailyConditionState;
  dailyTacticalProfile: DailyTacticalProfile;
  howsScore: number;
  profiles: TargetProfile[];
  lureSlotPicks: RebuildSlotPick[];
  flySlotPicks: RebuildSlotPick[];
};

export type RebuildSelectionOptions = {
  userSeed?: string;
  recentHistory?: readonly RecentRecommendationHistoryEntry[];
};

export function computeRecommenderRebuild(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
  options: RebuildSelectionOptions = {},
): RebuildEngineResult {
  const { species, context } = assertRecommenderV3Scope(req);

  const row = resolveSeasonalRowRebuild(
    species,
    req.location.region_key,
    req.location.month,
    context,
  );

  const howsScore = analysis.scored.score;
  const regime = regimeFromHowsScore(howsScore);

  const daylightWindMph = meanDaylightWindMph({
    env_data: req.env_data as Record<string, unknown>,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
  });

  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });
  const windBand = windBandFromDaylightWindMph(daylightWindMph);

  const profiles = buildTargetProfiles({ row, regime, surfaceBlocked });
  const surfaceAllowedToday = row.column_range.includes("surface") &&
    row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((profile) =>
    profile.column === "surface"
  );
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ??
    null;
  const temperatureBand = analysis.norm.normalized.temperature?.band_label ??
    null;
  const temperatureTrend = analysis.norm.normalized.temperature?.trend_label ??
    null;
  const temperatureShock = analysis.norm.normalized.temperature?.shock_label ??
    null;
  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ??
    null;
  const clarityLightMode = clarityLightModeFromLabels({
    water_clarity: req.water_clarity,
    lightLabel,
  });
  const thermalMode = thermalModeFromLabels({
    temperatureBand,
    temperatureTrend,
    temperatureShock,
  });
  const runoffMode = runoffModeFromLabel(runoffLabel);
  const lureConditionState: LureDailyConditionState = {
    regime,
    water_clarity: req.water_clarity,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band: windBand,
    species,
    context,
    clarity_light_mode: clarityLightMode,
    thermal_mode: thermalMode,
    runoff_mode: runoffMode,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band: windBand,
    species,
    context,
    month: req.location.month,
    clarity_light_mode: clarityLightMode,
    thermal_mode: thermalMode,
    runoff_mode: runoffMode,
  };
  const dailyTacticalProfile = buildDailyTacticalProfile({
    regime,
    howsScore,
    daylightWindMph,
    windBand,
    lightLabel,
    temperatureBand,
    temperatureTrend,
    temperatureShock,
    runoffLabel,
    clarityLightMode,
    thermalMode,
    runoffMode,
    surfaceBlocked,
    surfaceAllowedToday,
    surfaceSlotPresent,
    lureConditionState,
    flyConditionState,
  });

  const seedScope = options.userSeed ?? "shared";
  const seedBase =
    `${seedScope}|${req.location.local_date}|${req.location.region_key}|${species}|${context}|${req.water_clarity}`;

  const lureSlotPicks = selectArchetypesForSide({
    side: "lure",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: req.location.local_date,
    recentHistory: options.recentHistory,
    lureConditionState,
  });

  const flySlotPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: req.location.local_date,
    recentHistory: options.recentHistory,
    flyConditionState,
  });

  return {
    row,
    regime,
    surfaceBlocked,
    daylightWindMph,
    windBand,
    lureConditionState,
    flyConditionState,
    dailyTacticalProfile,
    howsScore,
    profiles,
    lureSlotPicks,
    flySlotPicks,
  };
}
