import {
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  getPierCastCoreSeasonalCurve,
  getPierCastCoreTemperatureCurve,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS,
  type PierCastCityId,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

type ObservationConfig = {
  cityId: PierCastCityId;
  datasetId: string;
  variable: string;
  aggregateQualityVariable: string;
  unit: "K";
  latitude: number;
  longitude: number;
  depthM: number | null;
  depthDescription: string;
  role: "configured" | "supplemental";
};

type Observation = {
  observedAt: string;
  temperatureC: number | null;
  rawValue: number;
  qualityFlag: number | null;
  status: "good" | "rejected";
  reason: "quality_not_good" | "missing" | "implausible" | null;
};

type NativeNode = {
  index: number;
  latitude: number;
  longitude: number;
  bathymetryM: number;
  distanceFromRegularGridCenterM: number;
};

type ModelComparison = {
  cityId: PierCastCityId;
  issuedAt: string;
  forecastLeadHours: number;
  validAt: string;
  observedAt: string;
  observationOffsetMinutes: number;
  modelTemperatureC: number;
  observedTemperatureC: number;
  errorC: number;
  absoluteErrorC: number;
  sourceUrl: string;
};

const ARCHIVE_START = new Date("2026-08-10T00:00:00Z");
const LEADS = [0, 24, 48, 72, 96, 120] as const;
const MATCH_TOLERANCE_MS = 30 * 60 * 1000;
const APPROXIMATION_CHECK_CYCLE = "2026-09-09T18:00:00.000Z";
const APPROXIMATION_CHECK_LEADS = [0, 24, 72, 120] as const;
const OUTPUT_PATH = new URL(
  "../docs/PierCast_Temperature_Representation_Audit.json",
  import.meta.url,
);
const write = Deno.args.includes("--write");

const OBSERVATIONS: Partial<Record<PierCastCityId, ObservationConfig>> = {
  ludington_mi: {
    cityId: "ludington_mi",
    datasetId: "obs_62",
    variable: "sea_surface_temperature",
    aggregateQualityVariable: "sea_surface_temperature_aggregate_test",
    unit: "K",
    latitude: 43.97999954223633,
    longitude: -86.55999755859375,
    depthM: null,
    depthDescription:
      "explicit sea_surface_temperature variable; numeric sensor depth absent from dataset metadata",
    role: "supplemental",
  },
  grand_haven_mi: {
    cityId: "grand_haven_mi",
    datasetId: "obs_671",
    variable: "sea_water_temperature_1",
    aggregateQualityVariable: "sea_water_temperature_1_aggregate_test",
    unit: "K",
    latitude: 43.002254486083984,
    longitude: -86.27080535888672,
    depthM: null,
    depthDescription:
      "water temperature 1; numeric sensor depth absent from dataset metadata",
    role: "configured",
  },
  sheboygan_wi: {
    cityId: "sheboygan_wi",
    datasetId: "obs_709",
    variable: "Temp0",
    aggregateQualityVariable: "Temp0_aggregate_test",
    unit: "K",
    latitude: 43.75586,
    longitude: -87.68872,
    depthM: null,
    depthDescription:
      "Temp0 variable name suggests surface, but numeric depth is absent from dataset metadata",
    role: "configured",
  },
};

const NATIVE_NODES: Record<PierCastCityId, NativeNode> = {
  ludington_mi: {
    index: 23004,
    latitude: 43.9483,
    longitude: -86.4701,
    bathymetryM: 7.368664,
    distanceFromRegularGridCenterM: 189,
  },
  grand_haven_mi: {
    index: 13641,
    latitude: 43.0612,
    longitude: -86.2598,
    bathymetryM: 9.1304455,
    distanceFromRegularGridCenterM: 134,
  },
  manistee_mi: {
    index: 25982,
    latitude: 44.2488,
    longitude: -86.3489,
    bathymetryM: 6.1943827,
    distanceFromRegularGridCenterM: 160,
  },
  frankfort_elberta_mi: {
    index: 31879,
    latitude: 44.6285,
    longitude: -86.2608,
    bathymetryM: 13.274942,
    distanceFromRegularGridCenterM: 178,
  },
  sheboygan_wi: {
    index: 20329,
    latitude: 43.7506,
    longitude: -87.6912,
    bathymetryM: 7.918692,
    distanceFromRegularGridCenterM: 117,
  },
};

const CITY_IDS = Object.keys(
  PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS,
) as PierCastCityId[];
const CITY_TIMEZONES: Record<PierCastCityId, string> = {
  ludington_mi: "America/Detroit",
  grand_haven_mi: "America/Detroit",
  manistee_mi: "America/Detroit",
  frankfort_elberta_mi: "America/Detroit",
  sheboygan_wi: "America/Chicago",
};

const observationResults = await mapConcurrent(
  CITY_IDS,
  3,
  async (cityId) => {
    const config = OBSERVATIONS[cityId];
    if (!config) {
      return {
        cityId,
        config: null,
        observations: [] as Observation[],
        sourceUrl: null,
        error: null,
      };
    }
    const sourceUrl = buildObservationUrl(config);
    try {
      const response = await fetchWithRetry(sourceUrl);
      return {
        cityId,
        config,
        observations: parseObservationCsv(await response.text(), config),
        sourceUrl,
        error: null,
      };
    } catch (error) {
      return {
        cityId,
        config,
        observations: [] as Observation[],
        sourceUrl,
        error: String(error),
      };
    }
  },
);

const auditCities = [];
for (const cityId of CITY_IDS) {
  const observationResult = observationResults.find((result) =>
    result.cityId === cityId
  )!;
  const config = observationResult.config;
  const observations = observationResult.observations;
  const good = observations.filter((observation) =>
    observation.status === "good"
  ) as Array<Observation & { temperatureC: number }>;
  const qualityFlagCounts = countBy(
    observations,
    (observation) =>
      observation.qualityFlag === null
        ? "null"
        : String(observation.qualityFlag),
  );
  const rejectionReasonCounts = countBy(
    observations.filter((observation) => observation.status === "rejected"),
    (observation) => observation.reason ?? "unknown",
  );
  const regular = PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS[cityId];
  const node = NATIVE_NODES[cityId];
  const observationDistanceM = config
    ? Math.round(
      haversineM(
        regular.latitude,
        regular.longitude,
        config.latitude,
        config.longitude,
      ),
    )
    : null;
  const pairCandidates = good.length > 0 ? createPairCandidates(good) : [];
  const fetchResults = await mapConcurrent(pairCandidates, 12, async (pair) => {
    const sourceUrl = buildNativePointUrl(pair.issuedAt, pair.lead, node.index);
    try {
      const response = await fetchWithRetry(sourceUrl);
      const parsed = parseNativePoint(await response.text());
      if (
        Math.abs(Date.parse(parsed.validAt) - Date.parse(pair.validAt)) > 1000
      ) {
        throw new Error(
          `valid-time mismatch: expected ${pair.validAt}, received ${parsed.validAt}`,
        );
      }
      const errorC = parsed.temperatureC - pair.observation.temperatureC;
      return {
        status: "matched" as const,
        comparison: {
          cityId,
          issuedAt: pair.issuedAt,
          forecastLeadHours: pair.lead,
          validAt: parsed.validAt,
          observedAt: pair.observation.observedAt,
          observationOffsetMinutes: round(
            Math.abs(
              Date.parse(pair.observation.observedAt) -
                Date.parse(parsed.validAt),
            ) / 60000,
          ),
          modelTemperatureC: parsed.temperatureC,
          observedTemperatureC: pair.observation.temperatureC,
          errorC: round(errorC),
          absoluteErrorC: round(Math.abs(errorC)),
          sourceUrl,
        } satisfies ModelComparison,
      };
    } catch (error) {
      return {
        status: "failed" as const,
        sourceUrl,
        error: String(error),
        lead: pair.lead,
        validAt: pair.validAt,
      };
    }
  });
  const comparisons = fetchResults.filter((
    result,
  ): result is Extract<typeof result, { status: "matched" }> =>
    result.status === "matched"
  ).map((result) => result.comparison);
  const failures = fetchResults.filter((
    result,
  ): result is Extract<typeof result, { status: "failed" }> =>
    result.status === "failed"
  );
  const byLead = Object.fromEntries(LEADS.map((lead) => {
    const selected = comparisons.filter((comparison) =>
      comparison.forecastLeadHours === lead
    );
    return [String(lead), summarizeComparisons(selected)];
  }));
  const scoreSensitivity = Object.fromEntries(
    PIER_CAST_CORE_SPECIES_IDS.map((speciesId) => {
      const curve = getPierCastCoreTemperatureCurve(speciesId)!;
      const impacts = comparisons.map((comparison) => {
        const model = evaluateTemperatureSuitability({
          ratingEnabled: true,
          mode: "review",
          monthEvidenceState: "sourced_biology",
          inputStatus: "valid",
          waterTemperatureC: comparison.modelTemperatureC,
          curve,
        });
        const observed = evaluateTemperatureSuitability({
          ratingEnabled: true,
          mode: "review",
          monthEvidenceState: "sourced_biology",
          inputStatus: "valid",
          waterTemperatureC: comparison.observedTemperatureC,
          curve,
        });
        if (model.status !== "available" || observed.status !== "available") {
          return null;
        }
        return Math.abs(9 * model.suitability - 9 * observed.suitability);
      }).filter((value): value is number => value !== null);
      const perLead = Object.fromEntries(LEADS.map((lead) => {
        const selected = comparisons.filter((comparison) =>
          comparison.forecastLeadHours === lead
        ).map((comparison) => {
          const model = evaluateTemperatureSuitability({
            ratingEnabled: true,
            mode: "review",
            monthEvidenceState: "sourced_biology",
            inputStatus: "valid",
            waterTemperatureC: comparison.modelTemperatureC,
            curve,
          });
          const observed = evaluateTemperatureSuitability({
            ratingEnabled: true,
            mode: "review",
            monthEvidenceState: "sourced_biology",
            inputStatus: "valid",
            waterTemperatureC: comparison.observedTemperatureC,
            curve,
          });
          return model.status === "available" && observed.status === "available"
            ? Math.abs(9 * model.suitability - 9 * observed.suitability)
            : null;
        }).filter((value): value is number => value !== null);
        return [String(lead), summarizeValues(selected)];
      }));
      return [speciesId, {
        overall: summarizeValues(impacts),
        byLead: perLead,
      }];
    }),
  );
  const configuredSeasonalScoreSensitivity = Object.fromEntries(
    PIER_CAST_CORE_SPECIES_IDS.map((speciesId) => {
      const temperatureCurve = getPierCastCoreTemperatureCurve(speciesId)!;
      const seasonalCurve = getPierCastCoreSeasonalCurve(cityId, speciesId)!;
      const impacts = comparisons.map((comparison) => {
        const model = evaluateTemperatureSuitability({
          ratingEnabled: true,
          mode: "review",
          monthEvidenceState: "sourced_biology",
          inputStatus: "valid",
          waterTemperatureC: comparison.modelTemperatureC,
          curve: temperatureCurve,
        });
        const observed = evaluateTemperatureSuitability({
          ratingEnabled: true,
          mode: "review",
          monthEvidenceState: "sourced_biology",
          inputStatus: "valid",
          waterTemperatureC: comparison.observedTemperatureC,
          curve: temperatureCurve,
        });
        const localDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: CITY_TIMEZONES[cityId],
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(comparison.validAt));
        const seasonal = evaluatePierCastSeasonalOpportunity({
          ratingEnabled: true,
          mode: "review",
          localDate,
          curve: seasonalCurve,
        });
        if (
          model.status !== "available" || observed.status !== "available" ||
          seasonal.status !== "available"
        ) return null;
        return Math.abs(
          (seasonal.rating - 1) * (model.suitability - observed.suitability),
        );
      }).filter((value): value is number => value !== null);
      return [speciesId, summarizeValues(impacts)];
    }),
  );
  const diagnosticAccuracyGates = {
    temperatureByLead: Object.fromEntries(LEADS.map((lead) => {
      const metrics = byLead[String(lead)];
      return [String(lead), {
        evaluable: metrics.count > 0,
        absoluteBiasPass: metrics.meanBiasC !== null
          ? Math.abs(metrics.meanBiasC) <= 1
          : null,
        rmsePass: metrics.rootMeanSquareErrorC !== null
          ? metrics.rootMeanSquareErrorC <= 3
          : null,
        p90AbsoluteErrorPass: metrics.p90AbsoluteErrorC !== null
          ? metrics.p90AbsoluteErrorC <= 3
          : null,
      }];
    })),
    scoreBySpeciesAndLead: Object.fromEntries(
      PIER_CAST_CORE_SPECIES_IDS.map((
        speciesId,
      ) => [
        speciesId,
        Object.fromEntries(LEADS.map((lead) => {
          const metrics = scoreSensitivity[speciesId].byLead[String(lead)];
          return [String(lead), {
            evaluable: metrics.count > 0,
            meanImpactPass: metrics.mean !== null ? metrics.mean <= 0.5 : null,
            p90ImpactPass: metrics.p90 !== null ? metrics.p90 <= 1 : null,
          }];
        })),
      ]),
    ),
    interpretation:
      "Diagnostic only until every coverage and geometry prerequisite passes; failures may identify risk but cannot support a final reject from sparse data.",
  };
  const observedDays = new Set(
    good.map((observation) => observation.observedAt.slice(0, 10)),
  );
  const observedMonths = new Set(
    good.map((observation) => observation.observedAt.slice(0, 7)),
  );
  const regimes = {
    cold: good.filter((observation) => observation.temperatureC <= 8).length,
    transition: good.filter((observation) =>
      observation.temperatureC > 8 && observation.temperatureC < 18
    ).length,
    warm: good.filter((observation) =>
      observation.temperatureC >= 18
    ).length,
  };
  const rapidChangeEvents = countRapidChangeEvents(good);
  const blockers: string[] = [];
  if (!config) blockers.push("no_qualified_observation_dataset");
  if (observationResult.error) blockers.push("observation_request_failed");
  if (config && good.length === 0) {
    blockers.push(
      "no_aggregate_qc_good_observations",
    );
  }
  if (config && config.depthM === null) {
    blockers.push(
      "numeric_observation_depth_not_documented",
    );
  }
  if (observationDistanceM !== null && observationDistanceM > 10000) {
    blockers
      .push("observation_more_than_10km_from_runtime_cell");
  }
  if (observedDays.size < 60) {
    blockers.push("fewer_than_60_distinct_observation_days");
  }
  if (observedMonths.size < 3) blockers.push("fewer_than_3_calendar_months");
  if (Object.values(regimes).some((count) => count === 0)) {
    blockers.push("all_3_thermal_regimes_not_observed");
  }
  if (rapidChangeEvents < 3) blockers.push("fewer_than_3_rapid_change_events");
  if (
    LEADS.some((lead) =>
      comparisons.filter((comparison) => comparison.forecastLeadHours === lead)
        .length < 30
    )
  ) blockers.push("fewer_than_30_matches_for_one_or_more_leads");
  blockers.push(
    "fewer_than_2_operational_seasons",
    "winter_representation_not_validated",
    "casting_water_and_plume_equivalence_not_validated",
  );
  auditCities.push({
    cityId,
    decision: blockers.length > 0
      ? "blocked_insufficient_evidence"
      : "requires_accuracy_gate_review",
    runtimeRegularGridCell: regular,
    archiveNativeNode: node,
    archiveApproximation:
      "Nearest native node to the frozen regular-grid center; the archived server does not retain regulargrid files.",
    observation: config
      ? {
        ...config,
        distanceFromRuntimeCellM: observationDistanceM,
        sourceUrl: observationResult.sourceUrl,
      }
      : null,
    observationRequestError: observationResult.error,
    observationInventory: {
      recordCount: observations.length,
      aggregateQcGoodCount: good.length,
      rejectedCount: observations.length - good.length,
      qualityFlagCounts,
      rejectionReasonCounts,
      firstRecordAt: observations.at(0)?.observedAt ?? null,
      lastRecordAt: observations.at(-1)?.observedAt ?? null,
      distinctGoodDays: observedDays.size,
      distinctGoodMonths: observedMonths.size,
      goodTemperatureRangeC: good.length
        ? [
          round(
            Math.min(...good.map((observation) => observation.temperatureC)),
          ),
          round(
            Math.max(...good.map((observation) => observation.temperatureC)),
          ),
        ]
        : null,
      thermalRegimeGoodCounts: regimes,
      rapidChangeEvents,
    },
    modelComparison: {
      requestedCount: pairCandidates.length,
      matchedCount: comparisons.length,
      failedCount: failures.length,
      failures: failures.slice(0, 20),
      overall: summarizeComparisons(comparisons),
      byLead,
      scoreSensitivityAtSeasonalRating10: scoreSensitivity,
      scoreSensitivityAtConfiguredSeasonalRating:
        configuredSeasonalScoreSensitivity,
      diagnosticAccuracyGates,
    },
    blockers: [...new Set(blockers)],
  });
}

const approximationChecks = await mapConcurrent(CITY_IDS, 5, async (cityId) => {
  const location = PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS[cityId];
  const node = NATIVE_NODES[cityId];
  const pairs = await mapConcurrent(
    [...APPROXIMATION_CHECK_LEADS],
    4,
    async (lead) => {
      const regularUrl = buildRegularGridPointUrl(
        APPROXIMATION_CHECK_CYCLE,
        lead,
        location.gridRow,
        location.gridColumn,
      );
      const nativeUrl = buildNativePointUrl(
        APPROXIMATION_CHECK_CYCLE,
        lead,
        node.index,
      );
      try {
        const [regularResponse, nativeResponse] = await Promise.all([
          fetchWithRetry(regularUrl),
          fetchWithRetry(nativeUrl),
        ]);
        const regular = parseRegularGridPoint(await regularResponse.text());
        const native = parseNativePoint(await nativeResponse.text());
        if (regular.validAt !== native.validAt) {
          throw new Error("regular/native valid-time mismatch");
        }
        return {
          lead,
          status: "matched" as const,
          validAt: regular.validAt,
          regularGridTemperatureC: regular.temperatureC,
          nativeNodeTemperatureC: native.temperatureC,
          nativeMinusRegularC: round(
            native.temperatureC - regular.temperatureC,
          ),
        };
      } catch (error) {
        return {
          lead,
          status: "failed" as const,
          error: String(error),
          regularUrl,
          nativeUrl,
        };
      }
    },
  );
  const differences = pairs.filter((
    pair,
  ): pair is Extract<typeof pair, { status: "matched" }> =>
    pair.status === "matched"
  ).map((pair) => Math.abs(pair.nativeMinusRegularC));
  return {
    cityId,
    cycle: APPROXIMATION_CHECK_CYCLE,
    comparisons: pairs,
    summary: summarizeValues(differences),
  };
});

const report = {
  schemaVersion: "pier-cast-temperature-representation-audit-v1",
  generatedAt: new Date().toISOString(),
  protocolPath: "docs/PierCast_Temperature_Representation_Acceptance.json",
  sourcePolicy: "Only aggregate QC flag 1 (GOOD) enters comparison metrics.",
  archiveWindow: {
    start: ARCHIVE_START.toISOString(),
    retention:
      "rolling NOAA CO-OPS THREDDS archive; verified from 2026-08-10 at audit time",
  },
  forecastLeadsHours: LEADS,
  archiveNativeNodeApproximationCheck: approximationChecks,
  cities: auditCities,
  sources: [
    "https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/LMHOFS/MODELS/catalog.html",
    "https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techrpt_091_LMHOFS_2019.pdf",
    "https://seagull-erddap.glos.org/erddap/info/obs_62/index.html",
    "https://seagull-erddap.glos.org/erddap/info/obs_671/index.html",
    "https://seagull-erddap.glos.org/erddap/info/obs_709/index.html",
  ],
};

const serialized = JSON.stringify(report, null, 2) + "\n";
if (write) await Deno.writeTextFile(OUTPUT_PATH, serialized);
console.log(serialized);

function buildObservationUrl(config: ObservationConfig): string {
  const projection = ["time", config.variable, config.aggregateQualityVariable]
    .join(",");
  return `https://seagull-erddap.glos.org/erddap/tabledap/${config.datasetId}.csv?${
    encodeURIComponent(projection)
  }&${encodeURIComponent('orderBy("time")')}`;
}

function parseObservationCsv(
  payload: string,
  config: ObservationConfig,
): Observation[] {
  const lines = payload.trim().split(/\r?\n/);
  const expected = ["time", config.variable, config.aggregateQualityVariable]
    .join(",");
  if (lines[0] !== expected || lines[1]?.split(",")[1] !== config.unit) {
    throw new Error(`Unexpected GLOS CSV contract for ${config.datasetId}`);
  }
  return lines.slice(2).filter(Boolean).map((line) => {
    const [observedAt, raw, quality] = line.split(",");
    const rawValue = Number(raw);
    const qualityFlag = Number.isFinite(Number(quality))
      ? Number(quality)
      : null;
    if (!Number.isFinite(rawValue) || rawValue <= -900) {
      return {
        observedAt,
        temperatureC: null,
        rawValue,
        qualityFlag,
        status: "rejected",
        reason: "missing",
      };
    }
    if (qualityFlag !== 1) {
      return {
        observedAt,
        temperatureC: null,
        rawValue,
        qualityFlag,
        status: "rejected",
        reason: "quality_not_good",
      };
    }
    const temperatureC = rawValue - 273.15;
    if (temperatureC < -2 || temperatureC > 40) {
      return {
        observedAt,
        temperatureC: null,
        rawValue,
        qualityFlag,
        status: "rejected",
        reason: "implausible",
      };
    }
    return {
      observedAt: new Date(observedAt).toISOString(),
      temperatureC,
      rawValue,
      qualityFlag,
      status: "good",
      reason: null,
    };
  });
}

function createPairCandidates(
  observations: Array<Observation & { temperatureC: number }>,
) {
  const first = Date.parse(observations[0].observedAt);
  const last = Date.parse(observations.at(-1)!.observedAt);
  return LEADS.flatMap((lead) => {
    const used = new Set<number>();
    const pairs = [];
    const firstSlot = Math.ceil(first / (6 * 3600_000)) * 6 * 3600_000;
    for (let validMs = firstSlot; validMs <= last; validMs += 6 * 3600_000) {
      const issuedMs = validMs - lead * 3600_000;
      if (issuedMs < ARCHIVE_START.getTime()) continue;
      let bestIndex = -1;
      let bestOffset = Number.POSITIVE_INFINITY;
      for (let index = 0; index < observations.length; index++) {
        if (used.has(index)) continue;
        const offset = Math.abs(
          Date.parse(observations[index].observedAt) - validMs,
        );
        if (offset < bestOffset) {
          bestIndex = index;
          bestOffset = offset;
        }
      }
      if (bestIndex < 0 || bestOffset > MATCH_TOLERANCE_MS) continue;
      used.add(bestIndex);
      pairs.push({
        lead,
        issuedAt: new Date(issuedMs).toISOString(),
        validAt: new Date(validMs).toISOString(),
        observation: observations[bestIndex],
      });
    }
    return pairs;
  });
}

function buildNativePointUrl(
  issuedAtIso: string,
  lead: number,
  node: number,
): string {
  const issued = new Date(issuedAtIso);
  const year = issued.getUTCFullYear();
  const month = String(issued.getUTCMonth() + 1).padStart(2, "0");
  const day = String(issued.getUTCDate()).padStart(2, "0");
  const cycle = String(issued.getUTCHours()).padStart(2, "0");
  const stamp = `${year}${month}${day}`;
  const hour = String(lead).padStart(3, "0");
  const projection = `Times[0:1:0],temp[0:1:0][0:1:0][${node}:1:${node}]`;
  return `https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/${year}/${month}/${day}/lmhofs.t${cycle}z.${stamp}.fields.f${hour}.nc.ascii?${
    encodeURIComponent(projection)
  }`;
}

function buildRegularGridPointUrl(
  issuedAtIso: string,
  lead: number,
  row: number,
  column: number,
): string {
  const issued = new Date(issuedAtIso);
  const year = issued.getUTCFullYear();
  const month = String(issued.getUTCMonth() + 1).padStart(2, "0");
  const day = String(issued.getUTCDate()).padStart(2, "0");
  const cycle = String(issued.getUTCHours()).padStart(2, "0");
  const stamp = `${year}${month}${day}`;
  const hour = String(lead).padStart(3, "0");
  const projection =
    `Times[0:1:0],temp[0:1:0][0:1:0][${row}:1:${row}][${column}:1:${column}]`;
  return `https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/${year}/${month}/${day}/lmhofs.t${cycle}z.${stamp}.regulargrid.f${hour}.nc.ascii?${
    encodeURIComponent(projection)
  }`;
}

function parseNativePoint(
  payload: string,
): { validAt: string; temperatureC: number } {
  const time = payload.match(
    /Times\[1\]\s*\n\s*"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)"/,
  );
  const value = payload.match(/^\[0\]\[0\],\s*([^\s]+)\s*$/m);
  if (!time || !value) {
    throw new Error(`Invalid LMHOFS point response: ${payload.slice(0, 160)}`);
  }
  const temperatureC = Number(value[1]);
  if (
    !Number.isFinite(temperatureC) || temperatureC < -2 || temperatureC > 40
  ) throw new Error("LMHOFS temperature outside sanity range");
  return { validAt: new Date(`${time[1]}Z`).toISOString(), temperatureC };
}

function parseRegularGridPoint(
  payload: string,
): { validAt: string; temperatureC: number } {
  const time = payload.match(
    /Times\[1\]\s*\n\s*"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)"/,
  );
  const value = payload.match(/^\[0\]\[0\]\[0\],\s*([^\s]+)\s*$/m);
  if (!time || !value) {
    throw new Error(
      `Invalid LMHOFS regular-grid response: ${payload.slice(0, 160)}`,
    );
  }
  const temperatureC = Number(value[1]);
  if (
    !Number.isFinite(temperatureC) || temperatureC < -2 || temperatureC > 40
  ) throw new Error("LMHOFS regular-grid temperature outside sanity range");
  return { validAt: new Date(`${time[1]}Z`).toISOString(), temperatureC };
}

async function fetchWithRetry(url: string): Promise<Response> {
  let last: unknown = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "text/plain,text/csv" },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      last = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }
  throw last;
}

function summarizeComparisons(comparisons: ModelComparison[]) {
  if (!comparisons.length) {
    return {
      count: 0,
      meanBiasC: null,
      meanAbsoluteErrorC: null,
      rootMeanSquareErrorC: null,
      p90AbsoluteErrorC: null,
      maximumAbsoluteErrorC: null,
      meanObservationOffsetMinutes: null,
    };
  }
  return {
    count: comparisons.length,
    meanBiasC: round(mean(comparisons.map((comparison) => comparison.errorC))),
    meanAbsoluteErrorC: round(
      mean(comparisons.map((comparison) => comparison.absoluteErrorC)),
    ),
    rootMeanSquareErrorC: round(
      Math.sqrt(mean(comparisons.map((comparison) => comparison.errorC ** 2))),
    ),
    p90AbsoluteErrorC: round(
      percentile(
        comparisons.map((comparison) => comparison.absoluteErrorC),
        0.9,
      ),
    ),
    maximumAbsoluteErrorC: round(
      Math.max(...comparisons.map((comparison) => comparison.absoluteErrorC)),
    ),
    meanObservationOffsetMinutes: round(
      mean(
        comparisons.map((comparison) => comparison.observationOffsetMinutes),
      ),
    ),
  };
}

function summarizeValues(values: number[]) {
  return values.length
    ? {
      count: values.length,
      mean: round(mean(values)),
      p90: round(percentile(values, 0.9)),
      maximum: round(Math.max(...values)),
    }
    : { count: 0, mean: null, p90: null, maximum: null };
}

function countRapidChangeEvents(
  observations: Array<Observation & { temperatureC: number }>,
): number {
  let count = 0;
  let lastEventAt = Number.NEGATIVE_INFINITY;
  for (let end = 0; end < observations.length; end++) {
    const endAt = Date.parse(observations[end].observedAt);
    const candidates = observations.slice(0, end).filter((observation) =>
      endAt - Date.parse(observation.observedAt) <= 24 * 3600_000
    );
    if (
      !candidates.some((observation) =>
        Math.abs(observation.temperatureC - observations[end].temperatureC) >= 3
      )
    ) continue;
    if (endAt - lastEventAt >= 24 * 3600_000) {
      count++;
      lastEventAt = endAt;
    }
  }
  return count;
}

function countBy<T>(
  values: T[],
  key: (value: T) => string,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of values) {
    result[key(value)] = (result[key(value)] ?? 0) + 1;
  }
  return result;
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  task: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (true) {
        const index = cursor++;
        if (index >= values.length) return;
        results[index] = await task(values[index]);
      }
    }),
  );
  return results;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function percentile(values: number[], fraction: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[
    Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1)
  ];
}
function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}
function haversineM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const rad = (value: number) => value * Math.PI / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
