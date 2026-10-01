import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PIER_CAST_COMMON_TARGET_MINIMUM_SEASONAL_BAND,
  PIER_CAST_CONDITIONS_FORMULA_VERSION,
  PIER_CAST_CONDITIONS_SCHEMA_VERSION,
  PIER_CAST_RANKING_VERSION,
  PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION,
  PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION,
  PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
  type PierCastLeaderboardCityReadV4,
  pierCastSeasonalBandV4,
  type PierCastSeasonStageV4,
  pierCastThermalBandV4,
  sortPierCastLeaderboardV4,
} from "../lib/pierCastConditionsV4";
import type { PierCastSpeciesId } from "../lib/pierCastContracts";

type GoldenCandidate = {
  cityId: string;
  displayName: string;
  seasonalValue: number;
  stage: PierCastSeasonStageV4;
  thermalValue: number | null;
  rankingDisposition: PierCastLeaderboardCityReadV4["rankingDisposition"];
  targetingEligibility: PierCastLeaderboardCityReadV4["targetingEligibility"];
};

type GoldenRankingScenario = {
  id: string;
  speciesId: PierCastSpeciesId;
  candidates: GoldenCandidate[];
  expectedOrder: string[];
  expectedBands: Record<string, [string, string | null]>;
};

type GoldenFile = {
  schemaVersion: string;
  notice: string;
  rankingScenarios: GoldenRankingScenario[];
  engineScenarios: Array<{ id: string; expectation: string }>;
};

type VisualBaseline = {
  schemaVersion: string;
  basis: string;
  renderedReferenceStatus: string;
  sources: Array<{ path: string; sha256: string }>;
  designTokens: Record<string, string | number>;
  requiredMotifs: string[];
};

const golden = JSON.parse(readFileSync(
  new URL(
    "../docs/PierCast_Renovation_Pass1_Golden_Scenarios.json",
    import.meta.url,
  ),
  "utf8",
)) as GoldenFile;

const visualBaseline = JSON.parse(readFileSync(
  new URL(
    "../docs/PierCast_Renovation_Pass1_Visual_Baseline.json",
    import.meta.url,
  ),
  "utf8",
)) as VisualBaseline;

const contract = readFileSync(
  new URL(
    "../docs/PierCast_Renovation_Pass1_Product_Contract.md",
    import.meta.url,
  ),
  "utf8",
);
const reportScreen = readFileSync(
  new URL("../app/pier-cast-review.tsx", import.meta.url),
  "utf8",
);
const conditionsUi = readFileSync(
  new URL("../components/pier-cast/PierCastConditionsUI.tsx", import.meta.url),
  "utf8",
);
const conditionsSupport = readFileSync(
  new URL("../components/pier-cast/PierCastConditionsSupport.tsx", import.meta.url),
  "utf8",
);
const mapScreen = readFileSync(
  new URL("../legacy/pier-cast-map-v1.tsx", import.meta.url) /* retired first map; the live screen is app/pier-cast-map.tsx */,
  "utf8",
);
const visuals = readFileSync(
  new URL("../components/pier-cast/PierCastVisuals.tsx", import.meta.url),
  "utf8",
);
const theme = readFileSync(
  new URL("../lib/theme.ts", import.meta.url),
  "utf8",
);

test("Pass 1 freezes distinct versioned conditions contracts", () => {
  assert.equal(PIER_CAST_CONDITIONS_SCHEMA_VERSION, "piercast-conditions-v4");
  assert.equal(
    PIER_CAST_CONDITIONS_FORMULA_VERSION,
    "seasonal-outlook-plus-thermal-match-v1",
  );
  assert.equal(
    PIER_CAST_RANKING_VERSION,
    "species-seasonal-band-then-thermal-v1",
  );
  assert.equal(
    PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION,
    "piercast-saved-report-v4",
  );
  assert.equal(PIER_CAST_COMMON_TARGET_MINIMUM_SEASONAL_BAND, "fair");
  assert.equal(
    PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION,
    "piercast-regional-seasonal-profile-v1",
  );
  assert.equal(
    PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
    "piercast-thermal-profile-v2",
  );
});

test("seasonal and thermal bands have inclusive frozen boundaries", () => {
  assert.equal(pierCastSeasonalBandV4(1), "excellent");
  assert.equal(pierCastSeasonalBandV4(0.75), "excellent");
  assert.equal(pierCastSeasonalBandV4(0.749), "good");
  assert.equal(pierCastSeasonalBandV4(0.5), "good");
  assert.equal(pierCastSeasonalBandV4(0.25), "fair");
  assert.equal(pierCastSeasonalBandV4(0.05), "poor");
  assert.equal(pierCastSeasonalBandV4(0.049), "usually_off");
  assert.equal(pierCastSeasonalBandV4(0), "usually_off");

  assert.equal(pierCastThermalBandV4(1), "excellent");
  assert.equal(pierCastThermalBandV4(0.85), "excellent");
  assert.equal(pierCastThermalBandV4(0.849), "good");
  assert.equal(pierCastThermalBandV4(0.65), "good");
  assert.equal(pierCastThermalBandV4(0.35), "fair");
  assert.equal(pierCastThermalBandV4(0.349), "poor");
  assert.equal(pierCastThermalBandV4(0), "poor");

  for (const invalid of [Number.NaN, -0.01, 1.01]) {
    assert.equal(pierCastSeasonalBandV4(invalid), null);
    assert.equal(pierCastThermalBandV4(invalid), null);
  }
});

test("golden rankings put seasonal band before exact thermal fit", () => {
  assert.equal(
    golden.schemaVersion,
    "piercast-renovation-pass1-golden-v1",
  );
  assert.match(golden.notice, /not biological calibration/i);
  assert.ok(golden.rankingScenarios.length >= 7);

  for (const scenario of golden.rankingScenarios) {
    const candidates = scenario.candidates.map((candidate) =>
      toLeaderboardCandidate(scenario.speciesId, candidate)
    );
    for (const candidate of candidates) {
      const expected = scenario.expectedBands[candidate.cityId];
      assert.ok(expected, `${scenario.id} lacks bands for ${candidate.cityId}`);
      assert.equal(
        candidate.seasonalOutlook.status === "available"
          ? candidate.seasonalOutlook.band
          : null,
        expected[0],
        `${scenario.id}/${candidate.cityId} seasonal band`,
      );
      assert.equal(
        candidate.thermalMatch.status === "available"
          ? candidate.thermalMatch.band
          : null,
        expected[1],
        `${scenario.id}/${candidate.cityId} thermal band`,
      );
    }
    assert.deepEqual(
      sortPierCastLeaderboardV4(scenario.speciesId, candidates).map((row) =>
        row.cityId
      ),
      scenario.expectedOrder,
      scenario.id,
    );
  }
});

test("ranked candidates must be complete, eligible, and one species", () => {
  const base = toLeaderboardCandidate("coho_salmon", {
    cityId: "one",
    displayName: "One",
    seasonalValue: 0.8,
    stage: "active",
    thermalValue: 0.9,
    rankingDisposition: "ranked",
    targetingEligibility: "eligible",
  });
  const anotherSpecies = { ...base, speciesId: "steelhead" as const };
  assert.throws(
    () => sortPierCastLeaderboardV4("coho_salmon", [base, anotherSpecies]),
    /cannot mix species/,
  );

  const incomplete = toLeaderboardCandidate("coho_salmon", {
    cityId: "missing",
    displayName: "Missing",
    seasonalValue: 0.8,
    stage: "active",
    thermalValue: null,
    rankingDisposition: "unranked",
    targetingEligibility: "eligible",
  });
  assert.throws(
    () =>
      sortPierCastLeaderboardV4("coho_salmon", [{
        ...incomplete,
        rankingDisposition: "ranked",
      }]),
    /lacks complete eligible conditions/,
  );
});

test("golden inventory covers future engine and observation invariants", () => {
  const ids = new Set(golden.engineScenarios.map((scenario) => scenario.id));
  for (
    const required of [
      "mixed_species_leaderboard_rejected",
      "year_boundary_is_continuous",
      "city_local_date_controls_season",
      "month_boundary_is_continuous",
      "observations_never_create_ranking_advantage",
    ]
  ) {
    assert.ok(ids.has(required), `missing golden engine scenario ${required}`);
  }
  assert.ok(
    golden.engineScenarios.every((scenario) =>
      scenario.expectation.trim().length > 30
    ),
  );
});

test("migration contract protects claims, legacy envelopes, and old clients", () => {
  assert.match(contract, /same-city\/same-local-date legacy claim/i);
  assert.match(contract, /without consuming another free claim/i);
  assert.match(contract, /Do not rewrite historical score snapshots/i);
  assert.match(contract, /Keep supported older mobile clients functional/i);
  assert.match(contract, /never fabricate v4 values/i);
});

test("visual contract locks the established PierCast design foundations", () => {
  assert.match(theme, /dashboardBlue:\s*'#2A6E96'/);
  assert.match(theme, /display:\s*'Fraunces_700Bold'/);
  assert.match(theme, /metaMono:\s*'JetBrainsMono_500Medium'/);
  assert.match(theme, /export const paperSpacing/);
  assert.match(theme, /export const paperRadius/);
  assert.match(theme, /export const paperShadows/);

  assert.match(conditionsUi + conditionsSupport, /CornerMarkSet/);
  assert.match(conditionsUi + conditionsSupport, /TopographicLines/);
  assert.match(
    readFileSync(new URL("../components/pier-cast/PierCastStandings.tsx", import.meta.url), "utf8"),
    /paper\.medalGold[\s\S]*paper\.medalBronze/,
  );
  assert.match(conditionsUi, /PierCastCityTemperatureChart/);
  assert.match(mapScreen, /PierCastTemperatureGradient/);
  assert.match(mapScreen, /PierCastDepthGradient/);
  assert.match(mapScreen, /PierCastWindGradient/);
  assert.match(mapScreen, /rasterOpacityTransition/);
  assert.match(visuals, /paperFonts/);

  assert.match(
    contract,
    /alter information hierarchy, not the design language/i,
  );
  assert.match(contract, /rendered-device visual approval/i);
});

test("visual baseline preserves the exact pre-renovation source fingerprints", () => {
  assert.equal(
    visualBaseline.schemaVersion,
    "piercast-renovation-visual-baseline-v1",
  );
  assert.equal(
    visualBaseline.basis,
    "source-structure-and-design-token-freeze",
  );
  assert.equal(
    visualBaseline.renderedReferenceStatus,
    "deferred_to_pass6_device_matrix",
  );
  assert.ok(visualBaseline.requiredMotifs.length >= 10);
  assert.equal(visualBaseline.designTokens.dashboardBlue, "#2A6E96");
  assert.equal(visualBaseline.designTokens.displayFont, "Fraunces_700Bold");

  for (const source of visualBaseline.sources) {
    assert.match(source.sha256, /^[a-f0-9]{64}$/, source.path);
    assert.doesNotThrow(() =>
      readFileSync(new URL(`../${source.path}`, import.meta.url))
    );
  }
});

test("the frozen Pass 1 baseline remains archived after the production cutover", () => {
  assert.match(contract, /Pass 1/i);
  assert.ok(visualBaseline.sources.some((source) =>
    source.path === "app/pier-cast-review.tsx"
  ));
  assert.ok(visualBaseline.sources.some((source) =>
    source.path === "app/pier-cast-map.tsx"
  ));
});

function toLeaderboardCandidate(
  speciesId: PierCastSpeciesId,
  candidate: GoldenCandidate,
): PierCastLeaderboardCityReadV4 {
  const seasonalBand = pierCastSeasonalBandV4(candidate.seasonalValue);
  assert.ok(seasonalBand);
  const thermalBand = candidate.thermalValue === null
    ? null
    : pierCastThermalBandV4(candidate.thermalValue);
  if (candidate.thermalValue !== null) assert.ok(thermalBand);

  return {
    cityId: candidate.cityId,
    displayName: candidate.displayName,
    lakeId: "michigan",
    stateCode: "MI",
    timezone: "America/Detroit",
    speciesId,
    seasonalOutlook: {
      status: "available",
      value: candidate.seasonalValue,
      band: seasonalBand,
      stage: candidate.stage,
      trend: candidate.stage === "building"
        ? "building"
        : candidate.stage === "fading" || candidate.stage === "late"
        ? "fading"
        : "steady",
      profileId: "golden-regional-profile-v1",
      basis: "regional",
      localDate: "2026-09-27",
      reasonCodes: [],
    },
    thermalMatch: candidate.thermalValue === null
      ? {
        status: "unavailable",
        value: null,
        band: null,
        temperatureC: null,
        optimumRangeC: null,
        distanceFromOptimumC: null,
        curveId: "golden-thermal-profile-v1",
        validAt: null,
        sourceKind: "model",
        reasonCodes: ["temperature_missing"],
      }
      : {
        status: "available",
        value: candidate.thermalValue,
        band: thermalBand!,
        temperatureC: 14,
        optimumRangeC: [13, 15],
        distanceFromOptimumC: 0,
        curveId: "golden-thermal-profile-v1",
        validAt: "2026-09-27T12:00:00.000Z",
        sourceKind: "model",
        reasonCodes: [],
      },
    targetingEligibility: candidate.targetingEligibility,
    rankingDisposition: candidate.rankingDisposition,
    localFisheryContext: null,
    reasonCodes: [],
    rank: null,
  };
}
