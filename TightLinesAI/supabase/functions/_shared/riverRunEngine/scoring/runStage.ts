import type {
  PrimitiveDisplay,
  RiverRunProfile,
  RunStage,
  RunStageCopyStrategy,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import { anglerSpeciesName } from "../copy/species.ts";
import {
  resolveRunOpportunityCopyContext,
  type RunOpportunityCopyContext,
} from "../copy/opportunity.ts";
import {
  addDays,
  compareLocalDates,
  type DateWindow,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";

export type RunStageResult = PrimitiveDisplay & {
  stage: RunStage;
  copyStrategy: RunStageCopyStrategy;
  stagingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  window: DateWindow;
};

export function resolveRunStage(
  run: Pick<
    RiverRunProfile,
    | "runWindow"
    | "riverId"
    | "historicalPresence"
    | "species"
    | "runType"
    | "handoff"
    | "runStageCopyStrategy"
  >,
  localDate: string,
): RunStageResult {
  const window = resolveActiveRunWindow(run, localDate);
  const copyStrategy = run.runStageCopyStrategy ?? "default";
  const stage = stageForDate(localDate, window);
  const stagingContext = stage === "pre_run" &&
    compareLocalDates(localDate, window.stagingStartDate) >= 0;
  const establishedBuildingContext = stage === "building" &&
    compareLocalDates(localDate, window.buildingEstablishedStartDate) >= 0;
  const broadBuildingContext = establishedBuildingContext &&
    !!window.buildingBroadStartDate &&
    compareLocalDates(localDate, window.buildingBroadStartDate) >= 0;
  const latePostRunContext = stage === "post_run" &&
    compareLocalDates(localDate, window.endDate) > 0 &&
    compareLocalDates(localDate, window.postRunLateCopyEndDate) <= 0;
  const winterHoldingContext = run.runType === "fall_entry" && !!run.handoff &&
    run.runStageCopyStrategy !== "pere_marquette" &&
    run.runStageCopyStrategy !== "big_manistee_tailwater" &&
    run.runStageCopyStrategy !== "muskegon_croton_tailwater" &&
    run.runStageCopyStrategy !== "st_joseph_corridor" &&
    stage === "post_run" && compareLocalDates(localDate, window.endDate) > 0;

  const opportunity = resolveRunOpportunityCopyContext(run.historicalPresence);
  if (run.runStageCopyStrategy === "onboarding_corridor") {
    const fallEntry = run.runType === "fall_entry";
    const repeatSpawner = run.runType === "fall_repeat_spawn";
    const baseCopy = fallEntry
      ? fallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext: false,
        species: anglerSpeciesName(run.species),
      })
      : stageCopy(
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        anglerSpeciesName(run.species),
        opportunity,
      );
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: fallEntry && stage === "post_run"
        ? "Fall entry complete"
        : repeatSpawner && stage === "post_run"
        ? "Fall migration complete"
        : fallEntry
        ? fallEntryStageLabel(stage, false)
        : stage === "post_run" && !latePostRunContext
        ? "Fall run complete"
        : stageLabel(stage, latePostRunContext),
      ...onboardingCorridorStageCopy({
        riverId: run.riverId,
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        fallEntry,
        repeatSpawner,
        species: run.species,
        baseCopy,
      }),
      reasonCodes: [
        stageReasonCode(stage),
        ...(stage === "post_run" &&
            (!latePostRunContext || fallEntry || repeatSpawner)
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (
    run.runType === "fall_entry" &&
    run.runStageCopyStrategy !== "betsie_homestead"
  ) {
    const regulatedTailwaterCopy =
      run.runStageCopyStrategy === "big_manistee_tailwater" ||
      run.runStageCopyStrategy === "muskegon_croton_tailwater";
    const stJosephCorridor = run.runStageCopyStrategy === "st_joseph_corridor";
    const baseCopy = stJosephCorridor
      ? stJosephFallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
        species: anglerSpeciesName(run.species),
      })
      : run.runStageCopyStrategy === "muskegon_croton_tailwater"
      ? muskegonFallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
        species: anglerSpeciesName(run.species),
      })
      : run.runStageCopyStrategy === "pere_marquette"
      ? pereMarquetteFallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        species: anglerSpeciesName(run.species),
        stagingStart: window.stagingStartDate.slice(5),
        opportunity,
      })
      : regulatedTailwaterCopy
      ? bigManisteeFallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
        species: anglerSpeciesName(run.species),
      })
      : fallEntryStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
        species: anglerSpeciesName(run.species),
      });
    const copy = baseCopy;
    const whereToStart = stJosephCorridor
      ? stJosephFallEntryWhereToStartCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
      })
      : run.runStageCopyStrategy === "pere_marquette"
      ? pereMarquetteFallEntryWhereToStartCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        winterHoldingContext,
      })
      : regulatedTailwaterCopy
      ? run.runStageCopyStrategy === "muskegon_croton_tailwater"
        ? muskegonFallEntryWhereToStartCopy({
          stage,
          stagingContext,
          establishedBuildingContext,
          broadBuildingContext,
          winterHoldingContext,
        })
        : bigManisteeFallEntryWhereToStartCopy({
          stage,
          stagingContext,
          establishedBuildingContext,
          broadBuildingContext,
          winterHoldingContext,
        })
      : copy.whereToStart;
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext,
      window,
      label: (run.runStageCopyStrategy === "pere_marquette" ||
          run.runStageCopyStrategy === "big_manistee_tailwater" ||
          run.runStageCopyStrategy === "muskegon_croton_tailwater" ||
          run.runStageCopyStrategy === "st_joseph_corridor") &&
          stage === "post_run"
        ? "Fall entry complete"
        : fallEntryStageLabel(stage, winterHoldingContext),
      ...copy,
      whereToStart,
      reasonCodes: [
        stageReasonCode(stage),
        ...(winterHoldingContext ? ["stage_winter_holding" as const] : []),
        ...(stage === "post_run" && !winterHoldingContext
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (run.runStageCopyStrategy === "st_joseph_corridor") {
    const species = anglerSpeciesName(run.species);
    const copy = stJosephFallSpawnStageCopy({
      stage,
      stagingContext,
      establishedBuildingContext,
      broadBuildingContext,
      latePostRunContext,
      species,
      opportunity,
    });
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: stage === "post_run" && !latePostRunContext
        ? "Fall run complete"
        : stageLabel(stage, latePostRunContext),
      ...copy,
      whereToStart: stJosephFallSpawnWhereToStartCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        species,
        opportunity,
      }),
      reasonCodes: [
        stageReasonCode(stage),
        ...(stage === "post_run" && !latePostRunContext
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (run.runStageCopyStrategy === "big_manistee_tailwater") {
    const repeatSpawner = run.runType === "fall_repeat_spawn";
    const copy = bigManisteeTailwaterStageCopy({
      stage,
      localDate,
      window,
      stagingContext,
      establishedBuildingContext,
      broadBuildingContext,
      latePostRunContext,
      repeatSpawner,
      species: anglerSpeciesName(run.species),
      opportunity,
    });
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: repeatSpawner && stage === "post_run"
        ? "Fall migration complete"
        : stage === "post_run" && !latePostRunContext
        ? "Fall run complete"
        : stageLabel(stage, latePostRunContext),
      ...copy,
      reasonCodes: [
        stageReasonCode(stage),
        ...(stage === "post_run" && !latePostRunContext
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (run.runStageCopyStrategy === "muskegon_croton_tailwater") {
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: stage === "post_run" && !latePostRunContext
        ? "Fall run complete"
        : stageLabel(stage, latePostRunContext),
      ...muskegonCrotonStageCopy({
        stage,
        localDate,
        window,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        species: anglerSpeciesName(run.species),
        opportunity,
      }),
      reasonCodes: [
        stageReasonCode(stage),
        ...(stage === "post_run" && !latePostRunContext
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (run.runStageCopyStrategy === "betsie_homestead") {
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext,
      window,
      label: stage === "post_run" && run.runType === "fall_entry"
        ? "Fall entry complete"
        : stage === "post_run" && !latePostRunContext
        ? "Fall run complete"
        : run.runType === "fall_entry"
        ? fallEntryStageLabel(stage, winterHoldingContext)
        : stageLabel(stage, latePostRunContext),
      ...betsieHomesteadStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        species: anglerSpeciesName(run.species),
        opportunity,
        fallEntry: run.runType === "fall_entry",
        winterHoldingContext,
        stagingStart: window.stagingStartDate.slice(5),
      }),
      reasonCodes: [
        stageReasonCode(stage),
        ...(stage === "post_run" && !latePostRunContext &&
            !winterHoldingContext
          ? ["stage_offseason" as const]
          : []),
        ...(winterHoldingContext ? ["stage_winter_holding" as const] : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    stage,
    copyStrategy,
    stagingContext,
    broadBuildingContext,
    winterHoldingContext: false,
    window,
    label: run.runStageCopyStrategy === "pere_marquette" &&
        stage === "post_run" && !latePostRunContext
      ? "Fall run complete"
      : stageLabel(stage, latePostRunContext),
    ...(run.runStageCopyStrategy === "pere_marquette"
      ? pereMarquetteStageCopy({
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        species: anglerSpeciesName(run.species),
        stagingStart: window.stagingStartDate.slice(5),
        opportunity,
      })
      : stageCopy(
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        anglerSpeciesName(run.species),
        opportunity,
      )),
    whereToStart: run.runStageCopyStrategy === "pere_marquette"
      ? pereMarquetteWhereToStartCopy(
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
      )
      : whereToStartCopy(
        stage,
        stagingContext,
        establishedBuildingContext,
        broadBuildingContext,
        latePostRunContext,
        opportunity,
      ),
    reasonCodes: [
      stageReasonCode(stage),
      ...(stage === "post_run" && !latePostRunContext
        ? ["stage_offseason" as const]
        : []),
      ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function onboardingCorridorStageCopy(input: {
  riverId: string;
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  fallEntry: boolean;
  repeatSpawner: boolean;
  species: RiverRunProfile["species"];
  baseCopy: Pick<
    PrimitiveDisplay,
    "headline" | "detail" | "tip" | "whereToStart"
  >;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip" | "whereToStart"> {
  const route = onboardingCorridorRoute(input);
  const complete = input.stage === "post_run" &&
    (input.fallEntry || input.repeatSpawner || !input.latePostRunContext);
  const brownNarrative = input.repeatSpawner
    ? repeatSpawnerStageNarrative(input)
    : null;
  return {
    headline: brownNarrative?.headline ??
      (complete
        ? input.fallEntry
          ? "The modeled fall-entry window is complete."
          : input.repeatSpawner
          ? "The tracked fall brown-trout migration is complete."
          : input.baseCopy.headline
        : input.baseCopy.headline),
    detail: `${
      input.riverId === "bois_brule" && input.repeatSpawner &&
        input.stage === "post_run"
        ? "Unlike Pacific salmon, lake-run Brown Trout are repeat spawners and can survive spawning; this seasonal model no longer estimates where surviving fish remain or when they return to Lake Superior."
        : input.repeatSpawner && input.stage === "post_run"
        ? "Unlike Pacific salmon, migratory Brown Trout are repeat spawners. Surviving fish may remain in river holding water or return lakeward after spawning; this seasonal model no longer estimates their current presence."
        : brownNarrative
        ? brownNarrative.detail
        : input.baseCopy.detail
    } ${route.limit}`,
    tip: route.tip,
    whereToStart: input.riverId === "milwaukee"
      ? `Restrictions first: stay outside the Kletzsch refuge and obey the seasonal night-fishing restriction. Start here: ${route.whereToStart}`
      : input.riverId === "sheboygan"
      ? `Restrictions first: from Sept. 15 through the first Saturday in May, the Lake Michigan tributary night-fishing restriction applies. Verify current signs and property access. ${route.whereToStart}`
      : input.riverId === "root"
      ? `Restrictions first: from Sept. 15 through the first Saturday in May, the Lake Michigan tributary night-fishing restriction applies. Steelhead Facility operations can block, process, or pass fish; verify current operations and posted signs. ${route.whereToStart}`
      : input.riverId === "bois_brule"
      ? `Restrictions first: the lower river below Highway 2 is open only from the last Saturday in March through Nov. 15 and fishing is prohibited from one-half hour after sunset to one-half hour before sunrise. Box Car Hole is closed July 15-Oct. 31, Mays Ledges is closed Sept. 1-May 31, and the signed 500-foot refuge on both sides of the sea-lamprey barrier is never open. ${route.whereToStart}`
      : route.whereToStart,
  };
}

function repeatSpawnerStageNarrative(input: {
  riverId: string;
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
}): { headline: string; detail: string } {
  const earlyBruleMigration = input.riverId === "bois_brule";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            "Lake-run Brown Trout may be staging near the river entrance.",
          detail: earlyBruleMigration
            ? "Early-summer staging near Lake Superior does not confirm dependable river entry. Fresh river response can bring migrants in pulses rather than one continuous wave."
            : "Late-summer or fall staging near the lake does not confirm dependable river entry. Cooling water and fresh river response can bring migrants in pulses rather than one continuous wave.",
        }
        : {
          headline:
            "Dependable lake-run Brown Trout entry is not expected yet.",
          detail:
            "An isolated Brown Trout does not establish that the fall spawning migration has begun, and resident fish must not be counted as proof of lake-run entry.",
        };
    case "beginning":
      return {
        headline:
          "The first dependable lake-run Brown Trout are entering the river.",
        detail:
          "Early migrants are usually uneven and lower-river weighted. Some may travel upstream quickly while others pause in deep holding water; the calendar cannot identify an individual fish as lake-run.",
      };
    case "building":
      return {
        headline: input.broadBuildingContext
          ? earlyBruleMigration
            ? "The lake-run Brown Trout migration is broadly established in its dependable sections."
            : "The Brown Trout spawning migration is broadly established in its dependable sections."
          : input.establishedBuildingContext
          ? "Lake-run Brown Trout are becoming established beyond the entry reach."
          : "More lake-run Brown Trout are entering and advancing through the river.",
        detail: earlyBruleMigration
          ? "The early Bois Brule run can contain new migrants, upstream travelers, and holding fish at the same time. Distribution remains uneven; this part of the migration is primarily about entry, travel, and holding, with spawning activity generally developing later in fall."
          : "The run can contain new migrants, upstream travelers, holding fish, and early spawners at the same time. Distribution remains uneven, and visible spawning fish and redds should be left undisturbed.",
      };
    case "peak":
      return {
        headline: earlyBruleMigration
          ? "This is the core Bois Brule lake-run Brown Trout migration window."
          : "This is the core lake-run Brown Trout migration-and-spawning window.",
        detail: earlyBruleMigration
          ? "Migrating and holding lake-run Browns can overlap during this long early run. Peak seasonal presence does not mean equal distribution or that every Brown Trout encountered is lake-run; spawning activity generally develops later in fall."
          : "Migrating, holding, and actively spawning Brown Trout can overlap. Peak seasonal presence does not mean equal distribution or that every Brown Trout encountered is lake-run; avoid visible spawners and redds.",
      };
    case "tapering":
      return {
        headline: earlyBruleMigration
          ? "Fresh Bois Brule Brown Trout entry is becoming less consistent after the main migration peak."
          : "Fresh Brown Trout entry is becoming less consistent after the main spawning build.",
        detail: earlyBruleMigration
          ? "The river can hold a changing mix of earlier migrants, late arrivals, holding fish, and developing spawning activity. The declining curve tracks fresh migration entry, not the fate or exact location of an individual Brown Trout."
          : "The river can hold a changing mix of late migrants, spawning fish, and post-spawn survivors. The declining curve tracks the fall migration, while surviving fish may remain or return lakeward on individual schedules.",
      };
    case "ending":
      return {
        headline: "The tracked fall Brown Trout migration is winding down.",
        detail:
          "Most dependable fresh entry is ending, but surviving repeat spawners may remain in river holding water or return lakeward on individual schedules. This model does not force either outcome.",
      };
    case "post_run":
      return {
        headline: "The tracked fall Brown Trout migration is complete.",
        detail:
          "Unlike Pacific salmon, Brown Trout are repeat spawners and can survive spawning. This seasonal model no longer estimates the location of surviving fish that remain in the river or return lakeward.",
      };
  }
}

function onboardingCorridorRoute(input: {
  riverId: string;
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  fallEntry: boolean;
  repeatSpawner: boolean;
  species: RiverRunProfile["species"];
}): { whereToStart: string; limit: string; tip: string } {
  const { stage } = input;
  if (input.riverId === "milwaukee") {
    const brown = input.species === "lake_run_brown_trout";
    const limit = brown
      ? "Lake-run Brown Trout opportunity is concentrated toward the lower river, while the physical corridor ends below Bridge Street Dam. The signed Kletzsch fish-passage refuge is closed year-round, and the seasonal Lake Michigan tributary night restriction must be checked before fishing."
      : "Milwaukee guidance ends below Bridge Street Dam. The signed Kletzsch fish-passage refuge is closed year-round, and the seasonal Lake Michigan tributary night restriction must be checked before fishing.";
    if (brown) {
      if (stage === "pre_run") {
        return {
          whereToStart: input.stagingContext
            ? "Milwaukee Harbor and the river entrance; treat Harbor & Downtown as an early check only."
            : "Milwaukee Harbor—not inland Milwaukee River sections yet.",
          limit,
          tip:
            "Keep the plan lakeward until October entry develops; do not infer inland distribution from the calendar alone.",
        };
      }
      if (stage === "beginning") {
        return {
          whereToStart:
            "Harbor & Downtown, from the river mouth through downtown below North Avenue. Cover this section before checking the Urban Greenway.",
          limit,
          tip:
            "Fish the river entrance and first deep downtown holding water first. Move inland only after that lower section has been covered.",
        };
      }
      if (stage === "building") {
        return {
          whereToStart:
            "Harbor & Downtown first; add the Urban Greenway selectively as the run builds.",
          limit,
          tip:
            "Keep the search lower-river weighted, compare sections, and leave visibly spawning fish undisturbed.",
        };
      }
      if (stage === "peak") {
        return {
          whereToStart:
            "Harbor & Downtown or established Urban Greenway holding water; add legal North Shore water selectively.",
          limit,
          tip:
            "Keep the plan lower-river weighted, stay outside the Kletzsch refuge, compare sections, and leave visible spawning fish and redds undisturbed.",
        };
      }
      if (stage === "tapering" || stage === "ending") {
        return {
          whereToStart:
            "Harbor & Downtown or established Urban Greenway holding water; add legal North Shore water selectively.",
          limit,
          tip:
            "Keep the plan lower-river weighted, stay outside the Kletzsch refuge, avoid active spawning fish, and treat the decline as seasonal progression rather than individual-fish outcome.",
        };
      }
      return {
        whereToStart:
          "No active Milwaukee starting section in this fall-migration model.",
        limit,
        tip:
          "The modeled migration is complete; surviving Brown Trout may hold in the river or return to Lake Michigan.",
      };
    }
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "Milwaukee Harbor and the river entrance; add Harbor & Downtown water below North Avenue only with direct fish evidence.",
          limit,
          tip:
            "Use the harbor as staging context and do not infer inland distribution from the calendar alone.",
        }
        : {
          whereToStart:
            "Lake Michigan and Milwaukee Harbor—not inland Milwaukee River sections.",
          limit,
          tip:
            "Wait for the staging window before using the river corridor as a migration plan.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart:
          "Harbor & Downtown, from the river mouth through downtown below North Avenue. Cover this section before checking the Urban Greenway.",
        limit,
        tip:
          "Fish the river entrance and first deep downtown holding water first. Move inland only after that lower section has been covered.",
      };
    }
    if (stage === "building" && !input.establishedBuildingContext) {
      return {
        whereToStart:
          "Harbor & Downtown first; add the Urban Greenway from North Avenue to Kletzsch Park as a secondary check.",
        limit,
        tip:
          "Compare the lower two sections without treating Kletzsch passage as equal distribution upstream.",
      };
    }
    if (stage === "building" && !input.broadBuildingContext) {
      return {
        whereToStart:
          "Urban Greenway — North Avenue to Kletzsch Park; compare Harbor & Downtown for newer arrivals.",
        limit,
        tip:
          "Use the Urban Greenway first and keep the North Shore conditional on direct fish activity.",
      };
    }
    if (stage === "building" || stage === "peak") {
      return {
        whereToStart:
          "Urban Greenway first; add legal North Shore water from Kletzsch Park toward Bridge Street Dam selectively.",
        limit,
        tip:
          "Stay outside the signed Kletzsch refuge and compare sections rather than assuming equal distribution.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "Established Urban Greenway or legal North Shore holding water below Bridge Street Dam.",
        limit,
        tip: input.fallEntry
          ? "Favor established holding water; fewer fresh arrivals do not mean Steelhead have left the river."
          : "Narrow the search to established holding water and leave visible spawning fish undisturbed.",
      };
    }
    return {
      whereToStart:
        "No active Milwaukee River starting section in this fall model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; Steelhead may remain through winter before spring spawning."
        : "Do not build a Milwaukee River trip around isolated fish outside the modeled run.",
    };
  }
  if (input.riverId === "sheboygan") {
    const limit =
      "Sheboygan guidance ends below Waelderhaus Dam. The I-43 gauge directly represents only the upper Urban River, Kohler shoreline is not universally public access, and the seasonal Lake Michigan tributary night restriction must be checked before fishing.";
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "Sheboygan Harbor and the river entrance; add Harbor & Lower City water only with direct fish evidence.",
          limit,
          tip:
            "Use the harbor as staging context and do not infer inland distribution from the calendar alone.",
        }
        : {
          whereToStart:
            "Lake Michigan and Sheboygan Harbor—not inland river sections.",
          limit,
          tip:
            "Wait for the staging window before using the Sheboygan corridor as a migration plan.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart: "Harbor & Lower City — Lake Michigan to Kiwanis Park.",
        limit,
        tip:
          "Start low and require direct fish evidence before adding the Urban River.",
      };
    }
    if (stage === "building" && !input.establishedBuildingContext) {
      return {
        whereToStart:
          "Harbor & Lower City first; add the Urban River from Kiwanis Park toward I-43 as a secondary check.",
        limit,
        tip:
          "Compare the lower two sections and do not treat a broad seasonal rating as equal distribution.",
      };
    }
    if (stage === "building" && !input.broadBuildingContext) {
      return {
        whereToStart:
          "Urban River — Kiwanis Park to I-43; compare Harbor & Lower City for newer arrivals.",
        limit,
        tip:
          "Use the Urban River first and keep the Kohler Reach conditional on direct fish activity and legal access.",
      };
    }
    if (stage === "building" || stage === "peak") {
      return {
        whereToStart:
          "Urban River first; add legal Kohler Reach water below Waelderhaus Dam for established fish.",
        limit,
        tip: input.repeatSpawner
          ? stage === "peak"
            ? "Compare sections and leave visible spawning Brown Trout and redds undisturbed."
            : "Compare sections and leave visible spawning Brown Trout undisturbed."
          : "Compare sections instead of assuming equal distribution, and leave actively spawning fish undisturbed.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "Established Urban River or legal Kohler Reach holding water below Waelderhaus Dam.",
        limit,
        tip: input.fallEntry
          ? "Favor established holding water; fewer fresh arrivals do not mean Steelhead have left the river."
          : input.repeatSpawner
          ? "Narrow the search to established holding water; surviving Brown Trout may later hold or return lakeward."
          : "Narrow the search to established holding water and leave visible spawning fish undisturbed.",
      };
    }
    return {
      whereToStart:
        "No active Sheboygan River starting section in this fall model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; Steelhead may remain through winter before spring spawning."
        : input.repeatSpawner
        ? "The modeled migration is complete; surviving Brown Trout may hold in the river or return to Lake Michigan."
        : "Do not build a Sheboygan trip around isolated fish outside the modeled run.",
    };
  }
  if (input.riverId === "root") {
    const limit =
      "Root River guidance ends at the downstream face of the operated Steelhead Facility weir in Lincoln Park. Facility operations can block, process, or pass fish; Horlick Dam is the biological outer barrier, and the seasonal Lake Michigan tributary night restriction must be checked before fishing.";
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "Racine Harbor and the river entrance; add Harbor & Downtown water only with direct fish evidence.",
          limit,
          tip:
            "Use the harbor as staging context and do not infer inland distribution from the calendar or facility operation date.",
        }
        : {
          whereToStart:
            "Lake Michigan and Racine Harbor—not inland Root River sections.",
          limit,
          tip:
            "Wait for the staging window before using the Root River corridor as a migration plan.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart: "Harbor & Downtown — Lake Michigan to 6th Street.",
        limit,
        tip:
          "Start low and require direct fish evidence before adding City Parks.",
      };
    }
    if (stage === "building" && !input.establishedBuildingContext) {
      return {
        whereToStart:
          "Harbor & Downtown first; add City Parks from 6th Street toward Island Park as a secondary check.",
        limit,
        tip:
          "Compare the lower two sections and do not treat weir operation as the start of river entry.",
      };
    }
    if (stage === "building" && !input.broadBuildingContext) {
      return {
        whereToStart:
          "City Parks — 6th Street to Island Park; compare Harbor & Downtown for newer arrivals.",
        limit,
        tip:
          "Use City Parks first and keep Lincoln Park conditional on direct fish activity and current facility operations.",
      };
    }
    if (stage === "building" || stage === "peak") {
      return {
        whereToStart:
          "City Parks first; add legal Lincoln Park water below the Steelhead Facility for established fish.",
        limit,
        tip: input.repeatSpawner
          ? stage === "peak"
            ? "Compare sections and leave visible spawning Brown Trout and redds undisturbed."
            : "Compare sections and leave visible spawning Brown Trout undisturbed."
          : "Compare sections instead of assuming equal distribution, and do not infer passage through the facility.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "Established City Parks or legal Lincoln Park holding water below the Steelhead Facility.",
        limit,
        tip: input.fallEntry
          ? "Favor established holding water; fewer fresh arrivals do not mean Steelhead have left the river."
          : input.repeatSpawner
          ? "Narrow the search to established holding water; surviving Brown Trout may later hold or return lakeward."
          : "Narrow the search to established holding water and leave visible spawning fish undisturbed.",
      };
    }
    return {
      whereToStart: "No active Root River starting section in this fall model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; Steelhead may remain through winter before spring spawning."
        : input.repeatSpawner
        ? "The modeled migration is complete; surviving Brown Trout may hold in the river or return to Lake Michigan."
        : "Do not build a Root River trip around isolated fish outside the modeled run.",
    };
  }
  if (input.riverId === "bois_brule") {
    const chinook = input.species === "chinook_salmon";
    const limit =
      "Bois Brule fall guidance ends on the downstream side of Highway 2 for regulatory scope, not at a biological barrier. The active gauge is upstream of that endpoint. All guidance excludes Box Car Hole and Mays Ledges when closed and the permanent 500-foot refuge on both sides of the sea-lamprey barrier.";
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "Lake Superior, the river mouth, and legal Mouth & Lower River water outside every signed refuge.",
          limit,
          tip:
            "Use the mouth as staging context and require direct fish evidence before moving into the Rapids Reach.",
        }
        : {
          whereToStart:
            "Lake Superior and the Bois Brule mouth—not inland lower-river sections yet.",
          limit,
          tip:
            "Wait for the staging window before using the lower river as a migration plan.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart:
          "Mouth & Lower River — Lake Superior to the downstream edge of the Fishway Refuge.",
        limit,
        tip:
          "Start low, remain outside the permanent refuge, and require direct fish evidence before adding legal Rapids water.",
      };
    }
    if (stage === "building" && !input.establishedBuildingContext) {
      return {
        whereToStart:
          "Mouth & Lower River first; add legal Rapids Reach water outside every active refuge as a secondary check.",
        limit,
        tip:
          "Compare the lower two sections without treating fishway passage as equal distribution.",
      };
    }
    if (stage === "building" && !input.broadBuildingContext) {
      return {
        whereToStart:
          "Legal Rapids Reach water first; compare Mouth & Lower River water for newer arrivals.",
        limit,
        tip:
          "Check all posted refuge boundaries before moving, and keep the Highway 2 section conditional on direct fish activity.",
      };
    }
    if (stage === "building" || stage === "peak") {
      return {
        whereToStart: chinook
          ? "Mouth & Lower River first; add legal Rapids Reach and Upper Lower River water selectively."
          : "Legal Rapids Reach and Upper Lower River water below Highway 2; compare Mouth & Lower River for newer arrivals.",
        limit,
        tip: input.repeatSpawner
          ? stage === "peak"
            ? "Avoid every active refuge. This peak describes migration presence; leave any visible spawning Brown Trout and redds undisturbed."
            : "Avoid every active refuge and compare legal sections without treating early migration presence as active spawning."
          : chinook
          ? "This remains a small sectional Chinook run; cover one legal section thoroughly before changing reaches."
          : "Compare legal sections instead of assuming uniform distribution, and leave actively spawning fish undisturbed.",
      };
    }
    if (stage === "ending" && input.fallEntry) {
      return {
        whereToStart:
          "No legal lower-river starting section—the Nov. 15 fishing-season endpoint has passed.",
        limit,
        tip:
          "Fall Steelhead entry can continue after fishing closes; surviving fish may overwinter before the separate spring run.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "Established legal holding water in the Rapids Reach or Upper Lower River below Highway 2, outside every active refuge.",
        limit,
        tip: input.repeatSpawner
          ? "Narrow the search to established legal holding water and avoid spawning fish; survival does not establish a universal winter location."
          : "Narrow the search to established legal holding water and verify the Nov. 15 season endpoint before fishing.",
      };
    }
    return {
      whereToStart:
        "No active legal Bois Brule starting section in this fall model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; Steelhead may overwinter before the separate spring run."
        : input.repeatSpawner
        ? "The modeled migration is complete; surviving repeat-spawning Browns may hold or return lakeward, but their winter location is not asserted."
        : "Do not build a lower-river trip outside the open season or around isolated fish after the modeled run.",
    };
  }
  if (input.riverId === "platte") {
    const limit =
      "Platte guidance covers only the short corridor from Platte River Point to the downstream edge of the signed Lower Weir closure; it never implies passage through the installed weir.";
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "Platte Bay and Platte River Point, with the lower entry reach checked only for direct fish evidence.",
          limit,
          tip:
            "Use Platte Bay and the river mouth as staging context. Do not treat the calendar as confirmation that fish have entered the short river corridor.",
        }
        : {
          whereToStart: "Platte Bay—not the inland river corridor yet.",
          limit,
          tip:
            "Wait for the staging window before using the lower river as a migration plan.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart:
          "Lower entry reach from Platte River Point toward El Dorado.",
        limit,
        tip:
          "Start at the lower entry reach and advance toward El Dorado only after finding direct evidence of fish.",
      };
    }
    if (stage === "building") {
      return {
        whereToStart:
          "Lower entry reach first; add the legal weir-approach water only with direct fish activity and current closure awareness.",
        limit,
        tip:
          "Compare the lower entry reach with the legal weir approach, stopping outside every posted closure.",
      };
    }
    if (stage === "peak") {
      return {
        whereToStart:
          "Legal water below the Lower Weir closure, then the lower entry reach toward Platte River Point.",
        limit,
        tip:
          "Work only the signed legal corridor below the weir, then fall back toward the lower entry reach.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "The deepest established holding water within the legal lower corridor.",
        limit,
        tip:
          "Keep the search selective below the closure and avoid actively spawning fish.",
      };
    }
    return {
      whereToStart: "No dependable Platte River starting reach for this model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; this does not mean every Steelhead has left the river."
        : "Do not build a Platte trip around isolated fish outside the modeled run.",
    };
  }

  if (input.riverId === "white") {
    const limit =
      "All White River guidance remains below Hesperia Dam; White Lake is entry context, not part of the scored river corridor.";
    if (stage === "pre_run") {
      return input.stagingContext
        ? {
          whereToStart:
            "White Lake connection and the Lower river as monitoring context only.",
          limit,
          tip:
            "Watch the lake connection and Lower river, and require direct fish activity before treating the river as established.",
        }
        : {
          whereToStart:
            "White Lake connection—not inland White River sections yet.",
          limit,
          tip:
            "Wait for the staging window before using inland White River reaches.",
        };
    }
    if (stage === "beginning") {
      return {
        whereToStart: "Lower river from the White Lake connection upstream.",
        limit,
        tip:
          "Keep the first search in the Lower river; this early Migration Stage does not yet support a broad inland search.",
      };
    }
    if (stage === "building" && !input.establishedBuildingContext) {
      return {
        whereToStart:
          "Lower river first; the Forest corridor is beginning to come into play as a secondary check.",
        limit,
        tip:
          "Start Lower, then make a measured Forest-corridor check instead of treating the whole accessible river equally.",
      };
    }
    if (stage === "building" && !input.broadBuildingContext) {
      return {
        whereToStart:
          "Lower river and Forest corridor, in that order; Upper accessible water remains conditional.",
        limit,
        tip:
          "Compare Lower and Forest water before committing to the Upper accessible corridor.",
      };
    }
    if (stage === "building") {
      return {
        whereToStart:
          "Forest corridor first; add the Upper accessible corridor below Hesperia as seasonal presence broadens.",
        limit,
        tip:
          "Use the Forest corridor as the bridge between fresh Lower-river arrivals and established Upper accessible fish.",
      };
    }
    if (stage === "peak") {
      return {
        whereToStart:
          "Forest and Upper accessible corridors below Hesperia; check Lower water for newer arrivals.",
        limit,
        tip:
          "Compare established inland holding water below Hesperia with the Lower river rather than assuming equal distribution.",
      };
    }
    if (stage === "tapering" || stage === "ending") {
      return {
        whereToStart:
          "Established Forest and Upper accessible holding water below Hesperia Dam.",
        limit,
        tip: input.fallEntry
          ? "Favor established holding water; fewer fresh arrivals do not mean Steelhead have left the river."
          : "Narrow the search to established holding water and avoid actively spawning fish.",
      };
    }
    return {
      whereToStart: "No dependable White River starting reach for this model.",
      limit,
      tip: input.fallEntry
        ? "Fall-entry tracking has ended; this is not a complete winter-presence model."
        : "Do not build a White River trip around isolated fish outside the modeled run.",
    };
  }

  const limit =
    "Grand River guidance starts in the Lower river. Middle-corridor use requires a current, species-supported passage route, and no guidance extends beyond the configured species endpoint.";
  if (stage === "pre_run") {
    return input.stagingContext
      ? {
        whereToStart:
          "Grand Haven harbor and pierheads; use the first Lower-river travel water only with direct fish evidence.",
        limit,
        tip:
          "Keep this as Grand Haven staging context until dependable river entry begins.",
      }
      : {
        whereToStart:
          "Lake Michigan and Grand Haven—not inland Grand River sections.",
        limit,
        tip:
          "Wait for the staging window before using the Grand River corridor.",
      };
  }
  if (stage === "beginning") {
    return {
      whereToStart:
        "Lower Grand River first, below the Sixth Street reach transition.",
      limit,
      tip:
        "Keep the plan Lower-river first and do not infer upstream distribution from an early calendar date.",
    };
  }
  if (stage === "building" && !input.establishedBuildingContext) {
    return {
      whereToStart:
        "Lower Grand River first; consider Middle-corridor water only after current passage evidence supports the route.",
      limit,
      tip:
        "Cover the Lower river before adding any currently verified Middle-corridor section.",
    };
  }
  if (stage === "building" || stage === "peak") {
    return {
      whereToStart:
        "Lower Grand River first, then only the currently verified species-supported Middle corridor.",
      limit,
      tip:
        "Compare Lower water with verified Middle sections; never turn historic ladder passage into a whole-river claim.",
    };
  }
  if (stage === "tapering" || stage === "ending") {
    return {
      whereToStart:
        "Established Lower-river holding water, with verified Middle sections used selectively.",
      limit,
      tip: input.fallEntry
        ? "Favor established holding water; fewer new arrivals do not mean Steelhead have left the Grand."
        : "Narrow the plan to established water and avoid actively spawning fish.",
    };
  }
  return {
    whereToStart: "No dependable Grand River starting reach for this model.",
    limit,
    tip: input.fallEntry
      ? "Fall-entry tracking has ended; this is not a complete winter-presence model."
      : "Do not build a Grand River trip around isolated fish outside the modeled run.",
  };
}

function stJosephFallSpawnWhereToStartCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  species: string;
  opportunity: RunOpportunityCopyContext;
}): string {
  const limited = input.opportunity.strength === "limited";
  const lower = "Lower river (St. Joseph harbor–Berrien Springs)";
  const middle = "Middle river (Berrien Springs–Niles)";
  const upper = "Upper river (Niles–Twin Branch Dam)";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? `Start at the St. Joseph harbor and river mouth. Add the ${lower} only for an early-fish check.`
        : "Stay with Lake Michigan, the St. Joseph harbor, and the river mouth.";
    case "beginning":
      return `Start in the ${lower}. Add the ${middle} only after direct fish activity supports the move.`;
    case "building":
      if (input.broadBuildingContext) {
        return limited
          ? `Start in the ${middle}. Check the ${upper} only as a selective comparison.`
          : `Start in the ${middle}. Compare the ${upper} for earlier arrivals.`;
      }
      return input.establishedBuildingContext
        ? `Start in the ${middle}. Compare the ${lower} for newer fish.`
        : `Start in the ${lower}. Check the ${middle} for earlier arrivals.`;
    case "peak":
      return limited
        ? `Start in the ${middle}. Treat the ${upper} as a selective second check.`
        : `Start in the ${middle}. Compare the ${upper} for established fish.`;
    case "tapering":
      return `Start in established ${middle} or ${upper} holding water.`;
    case "ending":
      return `Start in one proven ${middle} or ${upper} holding section.`;
    case "post_run":
      return input.latePostRunContext
        ? `Make only a selective check in established ${middle} or ${upper} holding water.`
        : "There is no active St. Joseph starting section for this fall run.";
  }
}

function stJosephFallSpawnStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  species: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const base = stageCopy(
    input.stage,
    input.stagingContext,
    input.establishedBuildingContext,
    input.broadBuildingContext,
    input.latePostRunContext,
    input.species,
    input.opportunity,
  );
  const limited = input.opportunity.strength === "limited";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          ...base,
          headline:
            `${input.species} may be staging near the St. Joseph River entrance.`,
          detail: limited
            ? `Staging does not confirm dependable river entry. This remains a limited, sectional ${input.species} run.`
            : "Staging does not confirm dependable river entry or inland distribution.",
          tip:
            "Keep the inland check brief. Do not move upriver from Migration Stage alone.",
        }
        : {
          ...base,
          headline:
            `${input.species} have not started their main St. Joseph River run.`,
          detail:
            "The river-entry window has not opened yet. An isolated river fish would be an early exception.",
          tip:
            "Keep the trip lakeward and return when staging monitoring begins.",
        };
    case "beginning":
      return {
        ...base,
        headline: limited
          ? `The first ${input.species} are entering the St. Joseph, but the run remains limited.`
          : `The first ${input.species} are entering the St. Joseph River.`,
        detail: limited
          ? "Early Chinook remain scattered and concentrated in select water."
          : "New fish remain weighted toward the Lower river; earlier arrivals may be farther upstream.",
        tip:
          "Cover travel water and the first substantial holding areas before moving upstream.",
      };
    case "building":
      return {
        ...base,
        headline: limited
          ? `${input.species} are established in select St. Joseph sections.`
          : input.broadBuildingContext
          ? `${input.species} are established through multiple St. Joseph sections.`
          : `${input.species} are becoming established through more of the St. Joseph.`,
        detail: limited
          ? "This smaller Chinook run remains selective, with empty water between fish."
          : "Earlier arrivals may be farther upstream while newer fish continue entering below.",
        tip: limited
          ? "Fish one proven section thoroughly before making a selective second check."
          : "Compare two sections, then stay where direct fish activity is strongest.",
      };
    case "peak":
      return {
        ...base,
        headline: limited
          ? `This is the best St. Joseph ${input.species} window, but opportunity remains selective.`
          : `This is typically the strongest St. Joseph ${input.species} window.`,
        detail: limited
          ? "This is a limited 3-of-10 run, not a claim of strong or uniform presence."
          : "Repeated entry periods support broad presence, not equal numbers in every section.",
        tip:
          "Choose one section and cover it completely before changing reaches. Leave shallow spawning fish undisturbed.",
      };
    case "tapering":
      return {
        ...base,
        detail:
          "Fresh entry is slowing, so established holding water matters more than Lower-river travel lanes.",
        tip:
          "Start in proven holding water. Check the Lower river only when current river conditions or direct fish activity suggest fresh arrivals.",
      };
    case "ending":
      return {
        ...base,
        detail:
          "Most remaining fish have been in the river for some time. A fresh fish is possible but not dependable.",
        tip:
          "Fish one proven holding section, avoid shallow spawning fish, and stop searching if direct signs are absent.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          ...base,
          detail:
            "A few late fish may remain, but the main migration no longer supports a dependable trip.",
          tip:
            "Make one selective established-water check or shift to an active species.",
        }
        : {
          ...base,
          headline: `The St. Joseph ${input.species} fall run is complete.`,
          detail:
            "This seasonal run estimate is inactive until staging begins again.",
          tip: "Return when St. Joseph fall-run staging begins.",
        };
  }
}

function muskegonCrotonStageCopy(input: {
  stage: RunStage;
  localDate: string;
  window: DateWindow;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  species: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const limited = input.opportunity.strength === "limited";
  const lower = "Lower river (Muskegon Lake–M-120)";
  const middle = "Middle river (M-120–Newaygo)";
  const upper = "Upper river (Newaygo–Croton Dam)";
  const accumulatedBeginning = compareLocalDates(
    input.localDate,
    addDays(input.window.startDate, 7),
  ) >= 0;
  const lateTaper = compareLocalDates(
    input.localDate,
    addDays(input.window.peakEndDate, 6),
  ) >= 0;
  const residualEnding = compareLocalDates(
    input.localDate,
    addDays(input.window.taperingEndDate, 6),
  ) >= 0;
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be staging near the Muskegon River entrance.`,
          whereToStart:
            `Start at Muskegon Lake, the Lake Michigan channel, and the river entrance. Add the ${lower} only for an early-fish check.`,
          detail: `Staging does not confirm dependable river entry.${
            limited ? " Coho opportunity remains limited and sectional." : ""
          }`,
          tip:
            `Keep the river check brief. Do not move into the ${middle} or ${upper} from Migration Stage alone.`,
        }
        : {
          headline:
            `${input.species} have not started their main Muskegon River run.`,
          whereToStart:
            "Stay with Muskegon Lake, the Lake Michigan channel, and the river entrance.",
          detail:
            "The river-entry window has not opened yet. An isolated river fish would be an early exception.",
          tip: `Do not build an inland trip around ${input.species} yet.`,
        };
    case "beginning":
      return {
        headline: accumulatedBeginning
          ? `${input.species} are accumulating through more of the Muskegon River.`
          : `The first ${input.species} are entering the Muskegon River.`,
        whereToStart:
          `Start in the ${lower}. Add the ${middle} after direct fish activity supports the move.`,
        detail: limited
          ? "Early Coho remain scattered and concentrated in select water."
          : "Early fish remain scattered; earlier arrivals may already be farther upstream.",
        tip:
          "Cover travel water and the first substantial holding areas before moving upstream.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline: limited
            ? `${input.species} are established in select Muskegon River sections.`
            : `${input.species} are broadly established through the Muskegon River.`,
          whereToStart:
            `Start in the ${upper}, emphasizing the Croton Dam area. Compare the ${middle} for fresher fish.`,
          detail: limited
            ? "More than one section may hold Coho, but concentrations remain selective."
            : "Repeated entry periods support broad presence, not equal numbers in every section.",
          tip:
            "Croton measurements apply only near the dam. Verify downstream water directly.",
        };
      }
      return input.establishedBuildingContext
        ? {
          headline: limited
            ? `${input.species} are becoming established in select Muskegon River reaches.`
            : `${input.species} are becoming dependably established through more of the Muskegon River.`,
          whereToStart:
            `Start in the ${middle}. Check the Croton Dam area in the ${upper} for early arrivals.`,
          detail: limited
            ? "Coho may occupy more than one section, but the opportunity remains selective."
            : "Earlier arrivals can hold near Croton while newer fish remain farther downstream.",
          tip:
            "Compare the two sections directly; the Croton gauge does not describe the Middle river.",
        }
        : {
          headline:
            `More ${input.species} are entering and spreading through the Muskegon River.`,
          whereToStart:
            `Start in the ${middle}. Check the Croton Dam area in the ${upper} for early arrivals.`,
          detail:
            "Presence is growing beyond isolated fish, but distribution remains uneven.",
          tip: `Keep the ${lower} as the fresh-entry comparison.`,
        };
    case "peak":
      return {
        headline:
          `This is typically the strongest Muskegon River ${input.species} opportunity.`,
        whereToStart:
          `Start in the ${upper}, emphasizing the Croton Dam area. Compare the ${middle} for fresher fish.`,
        detail: limited
          ? "This remains a limited, sectional Coho opportunity."
          : "Fish can be broadly present, but concentrations still vary by section.",
        tip:
          "Croton measurements apply only near the dam. Verify downstream water directly.",
      };
    case "tapering":
      return {
        headline: lateTaper
          ? `The Muskegon ${input.species} run is entering its late taper.`
          : `${input.species} remain present, but fresh arrivals are less consistent.`,
        whereToStart:
          `Start in the ${upper}, especially the Croton Dam area. Add the ${middle} only when direct activity supports it.`,
        detail: lateTaper
          ? "Fresh arrivals are becoming exceptions and dependable distribution is narrowing."
          : "The run is declining and concentrating in established holding water.",
        tip:
          "Look for genuinely fresh fish and leave visible spawning or deteriorated fish alone.",
      };
    case "ending":
      return {
        headline: residualEnding
          ? `Only a residual late ${input.species} opportunity remains.`
          : `The main Muskegon ${input.species} run is winding down.`,
        whereToStart:
          `Start in the ${upper}, emphasizing established water near Croton Dam.`,
        detail:
          "Residual fish can remain, but fresh movement is no longer dependable.",
        tip:
          "Keep expectations narrow and stop searching when direct evidence is absent.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline:
            `A few late ${input.species} may remain in established Muskegon River holding water.`,
          whereToStart:
            `There is no dependable starting section. If you go, make one careful ${upper} check near Croton Dam.`,
          detail: "The seasonal tail does not indicate a fresh movement event.",
          tip:
            "Do not build a broad corridor search around isolated late fish.",
        }
        : {
          headline: `The Muskegon ${input.species} fall run is complete.`,
          whereToStart:
            "There is no active Muskegon starting section in this fall-run model.",
          detail: `${input.species} staging typically begins ${
            seasonalReturnPhrase(input.window.stagingStartDate.slice(5))
          }. This seasonal estimate is inactive until then.`,
          tip: `Check back ${
            seasonalReturnPhrase(input.window.stagingStartDate.slice(5))
          } when Muskegon fall-run tracking resumes.`,
        };
  }
}

function bigManisteeTailwaterStageCopy(input: {
  stage: RunStage;
  localDate: string;
  window: DateWindow;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  repeatSpawner: boolean;
  species: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const species = input.repeatSpawner ? "migratory Brown Trout" : input.species;
  const sentenceSpecies = input.repeatSpawner
    ? "Migratory Brown Trout"
    : input.species;
  const lower = "Lower river (M-55–Bear Creek)";
  const middle = "Middle river (Bear Creek–High Bridge)";
  const upper = "Upper river (High Bridge–Tippy Dam)";
  const sectional = input.opportunity.distributionScope === "sectional";
  const accumulatedBeginning = compareLocalDates(
    input.localDate,
    addDays(input.window.startDate, 7),
  ) >= 0;
  const peakShoulder = compareLocalDates(
    input.localDate,
    addDays(input.window.peakDate, 6),
  ) >= 0;
  const lateTaper = compareLocalDates(
    input.localDate,
    addDays(input.window.peakEndDate, 6),
  ) >= 0;
  const residualEnding = compareLocalDates(
    input.localDate,
    addDays(input.window.taperingEndDate, 6),
  ) >= 0;
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${sentenceSpecies} may be staging near the river entrance.`,
          whereToStart:
            `Start at Manistee Lake, the harbor, and the river entrance. Add the ${lower} only for an early-fish check.`,
          detail: `Staging context does not confirm dependable river entry.${
            sectional ? ` ${species} opportunity remains sectional.` : ""
          }`,
          tip:
            `Keep the river check brief. Do not move into the ${middle} or ${upper} from Migration Stage alone.`,
        }
        : {
          headline:
            `${sentenceSpecies} have not begun dependable Big Manistee river entry.`,
          whereToStart:
            "Stay with Manistee Lake, the harbor, and the river entrance.",
          detail:
            "The river-entry window has not opened yet. An isolated river fish would be an early exception.",
          tip: `Do not build an inland trip around ${species} yet.`,
        };
    case "beginning":
      return {
        headline: input.repeatSpawner
          ? accumulatedBeginning
            ? "Migratory Brown Trout entry is becoming more dependable in the lower Big Manistee."
            : "The first dependable migratory Brown Trout are entering the Big Manistee."
          : accumulatedBeginning
          ? `${sentenceSpecies} are accumulating through more of the Big Manistee.`
          : `The first ${species} are entering the Big Manistee.`,
        whereToStart:
          `Start in the ${lower}. Add the ${middle} after direct fish activity supports the move.`,
        detail: input.repeatSpawner
          ? "Early migrants remain uneven and lower-river weighted. Some may advance quickly while others pause in deep holding water, and resident Browns cannot be counted as proof of lake-run entry."
          : accumulatedBeginning
          ? sectional
            ? `More ${species} are present, but concentrations remain selective.`
            : "More than isolated fish can be present, but distribution remains uneven."
          : `Early fish remain scattered.${
            sectional
              ? ` ${species} opportunity is limited to select water.`
              : ""
          }`,
        tip: accumulatedBeginning
          ? "Follow travel water into substantial holding areas before moving upstream."
          : "Cover travel water and the first substantial holding areas before moving upstream.",
      };
    case "building":
      if (compareLocalDates(input.localDate, input.window.peakStartDate) >= 0) {
        return {
          headline: input.repeatSpawner
            ? "The Big Manistee Brown Trout spawning migration is approaching its core window."
            : `${species} are approaching their strongest Big Manistee window.`,
          whereToStart:
            `Start in the ${upper}, emphasizing the Tippy Dam area. Compare the ${middle} for fresher fish.`,
          detail: input.repeatSpawner
            ? "New migrants, upstream travelers, holding fish, and early spawners can overlap. Opportunity remains sectional, and visible spawning fish and redds should be left undisturbed."
            : sectional
            ? `Seasonal opportunity is broadening, but ${species} remain concentrated in select water.`
            : "Multiple entry periods now support broad corridor presence.",
          tip:
            "Use Wellston only for Upper-river conditions and verify downstream water directly.",
        };
      }
      if (input.broadBuildingContext) {
        return {
          headline: sectional
            ? `${sentenceSpecies} are established in select Big Manistee sections.`
            : `${sentenceSpecies} are broadly established through the Big Manistee.`,
          whereToStart:
            `Start in the ${upper}, emphasizing the Tippy Dam area. Compare the ${middle} when direct activity favors it.`,
          detail: sectional
            ? `More than one section may hold ${species}, but concentrations remain selective.`
            : "Repeated entry periods support broad corridor presence, not equal numbers in every section.",
          tip:
            "Use Wellston conditions only for the Upper river. Verify downstream water directly.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline:
            `${sentenceSpecies} are becoming established through more of the river.`,
          whereToStart:
            `Start in the ${middle}. Add the ${upper}, especially the Tippy Dam area, when direct activity supports it.`,
          detail: sectional
            ? `${species} may occupy more than one section, but the opportunity remains selective.`
            : "Earlier arrivals can be farther upstream while newer fish remain below Bear Creek.",
          tip:
            "Compare one section at a time; Wellston does not describe the Middle or Lower river.",
        };
      }
      return {
        headline:
          `More ${species} are entering and spreading through the Big Manistee.`,
        whereToStart:
          `Start in the ${middle}. Keep the ${lower} as the fresh-entry comparison.`,
        detail:
          "Presence is growing beyond isolated early fish, but distribution remains uneven.",
        tip:
          "Stay mobile until direct fish activity gives you a reason to slow down.",
      };
    case "peak":
      return {
        headline: input.repeatSpawner
          ? peakShoulder
            ? "Big Manistee migratory Brown Trout remain in the core migration-and-spawning window."
            : "This is the core Big Manistee migratory Brown Trout migration-and-spawning window."
          : peakShoulder
          ? `Big Manistee ${species} presence remains near its seasonal peak.`
          : sectional
          ? `This is the strongest seasonal Big Manistee ${species} window.`
          : `This is typically the strongest Big Manistee ${species} opportunity.`,
        whereToStart:
          `Start in the ${upper}, emphasizing the Tippy Dam area. Compare the ${middle} for fresher fish.`,
        detail: input.repeatSpawner
          ? "Migrating, holding, resident, and actively spawning Brown Trout can overlap. Peak seasonal presence does not identify an individual fish as lake-run or imply equal distribution."
          : peakShoulder
          ? sectional
            ? `${species} remain sectional as the run begins shifting toward a later mix.`
            : "Fish remain broadly present as the run begins shifting toward a later mix."
          : sectional
          ? `This is still sectional opportunity; ${species} will not be evenly distributed.`
          : "Fish can be broadly present, but concentrations still vary by section.",
        tip: peakShoulder
          ? "Look for genuinely fresh fish and leave visible spawning fish undisturbed."
          : "Use Wellston only for Upper-river conditions and leave visible spawning fish undisturbed.",
      };
    case "tapering":
      return {
        headline: input.repeatSpawner
          ? lateTaper
            ? "The Big Manistee Brown Trout migration is entering its late taper."
            : "Fresh migratory Brown Trout entry is becoming less consistent after the main spawning build."
          : lateTaper
          ? `The Big Manistee ${species} run is entering its late taper.`
          : `${sentenceSpecies} remain present, but fresh arrivals are less consistent.`,
        whereToStart:
          `Start in the ${upper}, especially the Tippy Dam area. Add the ${middle} only when direct activity supports it.`,
        detail: input.repeatSpawner
          ? "The river can hold late migrants, spawning fish, and post-spawn survivors. The declining curve tracks seasonal progression, while surviving fish may remain or return lakeward individually."
          : lateTaper
          ? "Fresh arrivals are becoming exceptions and dependable distribution is narrowing."
          : "The run is declining and increasingly concentrated in established holding water.",
        tip: lateTaper
          ? "Fish selected holding water carefully and leave visible spawning fish undisturbed."
          : input.repeatSpawner
          ? "Compare established holding water, leave visible spawning Brown Trout undisturbed, and treat decline as seasonal progression rather than individual-fish outcome."
          : "Look for genuinely fresh fish and leave visible spawning or deteriorated fish alone.",
      };
    case "ending":
      return {
        headline: residualEnding
          ? `Only a residual late ${species} opportunity remains.`
          : `The main Big Manistee ${species} run is winding down.`,
        whereToStart:
          `Start in the ${upper}, emphasizing established water near Tippy Dam.`,
        detail: input.repeatSpawner
          ? "The tracked fall migration is winding down. Surviving Brown Trout may hold in the river or return lakeward after spawning."
          : residualEnding
          ? "A fresh fish is possible, but no longer represents a dependable movement wave."
          : "Residual fish can remain, but fresh movement is no longer dependable.",
        tip: input.repeatSpawner
          ? "Leave visible spawning fish and redds undisturbed; surviving Browns may hold or return lakeward on individual schedules."
          : "Keep expectations narrow and stop searching when direct evidence is absent.",
      };
    case "post_run":
      return input.repeatSpawner
        ? {
          headline:
            "The tracked Big Manistee migratory Brown Trout fall migration is complete.",
          whereToStart:
            "There is no active Big Manistee starting section in this fall-migration model.",
          detail:
            "Unlike Pacific salmon, Brown Trout are repeat spawners and can survive spawning. Surviving fish may remain in river holding water or return toward Lake Michigan; this model does not assert an individual fish's location.",
          tip: `Check back ${
            seasonalReturnPhrase(input.window.stagingStartDate.slice(5))
          } when fall migration tracking resumes.`,
        }
        : input.latePostRunContext
        ? {
          headline: `Only a residual late ${species} opportunity remains.`,
          whereToStart:
            `There is no dependable starting section. If you go, make one careful ${upper} check near Tippy Dam.`,
          detail: "The seasonal tail does not indicate a fresh movement event.",
          tip:
            "Do not build a broad corridor search around isolated late fish.",
        }
        : {
          headline: `The Big Manistee ${species} fall run is complete.`,
          whereToStart:
            "There is no active Big Manistee starting section in this fall-run model.",
          detail: `${species} staging typically begins ${
            seasonalReturnPhrase(input.window.stagingStartDate.slice(5))
          }. This seasonal estimate is inactive until then.`,
          tip: `Check back ${
            seasonalReturnPhrase(input.window.stagingStartDate.slice(5))
          } when Big Manistee fall-run tracking resumes.`,
        };
  }
}

function pereMarquetteStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  species: string;
  stagingStart: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const moderateRun = input.opportunity.strength === "moderate";
  const limitedRun = input.opportunity.strength === "limited";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be staging near the PM mouth, but dependable river entry has not begun.`,
          detail:
            `The seasonal calendar supports nearby-lake staging. Any ${input.species} already in the Lower river would be an early exception.`,
          tip:
            "Keep the river check brief. Do not move into the Middle or Upper river from Migration Stage alone.",
        }
        : {
          headline: `The PM ${input.species} fall run has not started.`,
          detail:
            `The seasonal calendar does not support dependable ${input.species} presence in the PM river yet.`,
          tip:
            "Keep effort in the lake, harbor, and Pere Marquette Lake until staging begins.",
        };
    case "beginning":
      return {
        headline:
          `Migration Stage supports the first ${input.species} entering the Lower river.`,
        detail:
          `This is the opening river phase. Presence is expected to be scattered and uneven.`,
        tip:
          "Cover the Lower river first. Move upstream only after direct fish activity supports it.",
      };
    case "building":
      if (!input.establishedBuildingContext) {
        return {
          headline:
            `The PM ${input.species} run is building beyond its earliest entry phase.`,
          detail:
            `Migration Stage keeps the Lower river primary. Earlier arrivals may begin reaching the Middle river.`,
          tip:
            "Start low, then make one Middle river check if direct fish activity supports the move.",
        };
      }
      if (input.broadBuildingContext) {
        return {
          headline:
            `Migration Stage supports a broader PM ${input.species} distribution.`,
          detail:
            `The Middle river is the dependable calendar choice. Earlier arrivals may also occupy the Upper river.`,
          tip:
            "Cover one Middle river section completely before comparing the Upper river.",
        };
      }
      return {
        headline:
          `The PM ${input.species} run is becoming established in the Middle river.`,
        detail:
          `Migration Stage now favors the Middle river. The Upper river remains a conditional secondary choice.`,
        tip:
          "Begin in the Middle river. Add the Upper river only after direct fish activity supports it.",
      };
    case "peak":
      return {
        headline: limitedRun
          ? `This is typically the PM’s strongest ${input.species} window, within a Limited river-specific run.`
          : moderateRun
          ? "This is typically the PM’s strongest Coho window, within a moderate river-specific run."
          : `This is typically the PM’s strongest ${input.species} migration window.`,
        detail: input.opportunity.distributionScope === "concentrated"
          ? `Migration Stage favors the most dependable ${input.species} holding water. Expected distribution is concentrated and uneven.`
          : input.opportunity.distributionScope === "sectional"
          ? `Migration Stage supports the PM’s core ${input.species} sections. Concentrations may remain uneven between them.`
          : moderateRun
          ? "Migration Stage supports the widest dependable Coho distribution. It does not make Coho abundance equal to the PM Chinook run."
          : `Migration Stage supports the widest dependable ${input.species} distribution. It does not confirm fish in every section.`,
        tip:
          "Start in the Middle river. Compare the Upper river only after a complete first pass.",
      };
    case "tapering":
      return {
        headline: `The main PM ${input.species} migration is tapering.`,
        detail:
          `Seasonal presence is declining. Established Middle river holding water is more dependable than broad travel-water searches.`,
        tip:
          "Start in established Middle river water. Shift lower only when current river conditions or direct fish activity suggest fresh arrivals.",
      };
    case "ending":
      return {
        headline:
          `The PM ${input.species} migration is nearing its seasonal end.`,
        detail:
          `Remaining fish are expected to be less evenly distributed. Fresh entry is no longer dependable.`,
        tip:
          "Start in proven Middle river holding water. Add one Upper river check only after direct fish activity supports it.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline:
            `The main PM ${input.species} migration is over, though isolated late fish may remain.`,
          detail:
            `Migration Stage no longer supports a broad river search. Any remaining ${input.species} are exceptions.`,
          tip:
            "Do not chase isolated reports across sections. Leave actively spawning fish undisturbed.",
        }
        : {
          headline: `The PM ${input.species} fall run is complete.`,
          detail: `${input.species} staging typically begins ${
            seasonalReturnPhrase(input.stagingStart)
          }.`,
          tip: `Check back ${
            seasonalReturnPhrase(input.stagingStart)
          } when this fall-run model resumes.`,
        };
  }
}

function pereMarquetteFallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  species: string;
  stagingStart: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.stage === "post_run") {
    return {
      headline: "PM Steelhead fall entry is complete.",
      detail:
        "Steelhead may remain in the river. This fall-entry model no longer scores their current presence or activity.",
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when PM fall movement tracking resumes.`,
    };
  }
  const base = pereMarquetteStageCopy({
    ...input,
    latePostRunContext: false,
  });
  if (input.stage === "tapering") {
    return {
      headline: "PM Steelhead fall entry remains strong but is slowing.",
      detail:
        "Migration Stage still supports broad fall presence. Colder water makes established holding water more important than new entry.",
      tip:
        "Start in the Middle river. Shift lower only when current river conditions or direct fish activity suggest fresh arrivals.",
    };
  }
  if (input.stage === "ending") {
    return {
      headline: "PM Steelhead fall entry is in its final seasonal phase.",
      detail:
        "Steelhead may remain after fall entry ends. This state marks the model boundary, not fish leaving the river.",
      tip:
        "Prioritize established Middle river holding water and use Activity only through the final fall-entry day.",
    };
  }
  return base;
}

function seasonalReturnPhrase(monthDay: string): string {
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3, 5));
  const period = day <= 10 ? "early" : day <= 20 ? "mid" : "late";
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month - 1];
  return `in ${period} ${monthName}`;
}

function pereMarquetteWhereToStartCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  broadBuildingContext: boolean,
  latePostRunContext: boolean,
): string {
  switch (stage) {
    case "pre_run":
      return stagingContext
        ? "Start at Pere Marquette Lake and the river mouth. Add the Lower river (Pere Marquette Lake–Scottville) only for an early-fish check."
        : "Stay in Lake Michigan, Ludington harbor, and Pere Marquette Lake. The PM river is not a dependable starting section yet.";
    case "beginning":
      return "Start in the Lower river (Pere Marquette Lake–Scottville).";
    case "building":
      if (!establishedBuildingContext) {
        return "Start in the Lower river (Pere Marquette Lake–Scottville). Add the Middle river (Scottville–Maple Leaf) after direct fish activity supports the move.";
      }
      if (broadBuildingContext) {
        return "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) when direct fish activity supports it.";
      }
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) only after direct fish activity supports it.";
    case "peak":
      return "Start in the Middle river (Scottville–Maple Leaf). Compare the Upper river (Maple Leaf–M-37) when direct fish activity favors it.";
    case "tapering":
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Lower river (Pere Marquette Lake–Scottville) only when current river conditions or direct fish activity suggest fresh arrivals.";
    case "ending":
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) only for established late holding water.";
    case "post_run":
      return latePostRunContext
        ? "There is no dependable PM starting section. If direct evidence supports a late check, use proven Middle river (Scottville–Maple Leaf) holding water."
        : "There is no dependable PM river starting section right now.";
  }
}

function pereMarquetteFallEntryWhereToStartCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Start at Pere Marquette Lake and the river mouth. Add the Lower river (Pere Marquette Lake–Scottville) only for an early-fish check."
        : "Stay in Lake Michigan, Ludington harbor, and Pere Marquette Lake. The PM river is not a dependable fall-entry section yet.";
    case "beginning":
      return "Start in the Lower river (Pere Marquette Lake–Scottville).";
    case "building":
      if (input.broadBuildingContext) {
        return "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) when direct fish activity supports it.";
      }
      return input.establishedBuildingContext
        ? "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) only after direct fish activity supports it."
        : "Start in the Lower river (Pere Marquette Lake–Scottville). Add the Middle river (Scottville–Maple Leaf) after direct fish activity supports the move.";
    case "peak":
      return "Start in the Middle river (Scottville–Maple Leaf). Compare the Upper river (Maple Leaf–M-37) when direct fish activity favors it.";
    case "tapering":
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Lower river (Pere Marquette Lake–Scottville) only when current river conditions or direct fish activity suggest fresh arrivals.";
    case "ending":
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Upper river (Maple Leaf–M-37) only for established late-fall holding water.";
    case "post_run":
      return "There is no active PM starting section in this fall-entry model.";
  }
}

function bigManisteeFallEntryWhereToStartCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Start at Manistee Lake, the harbor, and the river entrance. Add the Lower river (M-55–Bear Creek) only for an early-Steelhead check."
        : "Stay with Manistee Lake, the harbor, and the river entrance for fall-entry context.";
    case "beginning":
      return "Start in the Lower river (M-55–Bear Creek). Add the Middle river (Bear Creek–High Bridge) after direct fish activity supports the move.";
    case "building":
      return input.broadBuildingContext
        ? "Start in the Upper river (High Bridge–Tippy Dam), emphasizing the Tippy Dam area. Compare the Middle river (Bear Creek–High Bridge) for fresher fish."
        : input.establishedBuildingContext
        ? "Start in the Middle river (Bear Creek–High Bridge). Add the Upper river (High Bridge–Tippy Dam) when direct activity supports it."
        : "Start in the Middle river (Bear Creek–High Bridge). Keep the Lower river (M-55–Bear Creek) as the fresh-entry comparison.";
    case "peak":
      return "Start in the Upper river (High Bridge–Tippy Dam), emphasizing the Tippy Dam area. Compare the Middle river (Bear Creek–High Bridge) for fresher fish.";
    case "tapering":
      return "Start in the Upper river (High Bridge–Tippy Dam), especially the Tippy Dam area. Add the Middle river (Bear Creek–High Bridge) for established holding water.";
    case "ending":
      return "Start in the Upper river (High Bridge–Tippy Dam), emphasizing deep, speed-controlled water near Tippy Dam.";
    case "post_run":
      return "There is no active Big Manistee starting section in this fall-entry model.";
  }
}

function bigManisteeFallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const whereToStart = bigManisteeFallEntryWhereToStartCopy(input);
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline: "Early Steelhead may begin entering the Big Manistee.",
          whereToStart,
          detail:
            "An early Steelhead is possible, but it does not confirm a broad fall-entry build.",
          tip:
            "Keep the river check brief and move inland only after direct activity supports it.",
        }
        : {
          headline:
            "Dependable Big Manistee Steelhead fall entry has not started.",
          whereToStart,
          detail:
            "Early Steelhead are possible, but the fall-entry window has not opened yet.",
          tip: "Check back in early September as staging monitoring begins.",
        };
    case "beginning":
      return {
        headline:
          "The first fall Steelhead are entering and moving through the Big Manistee.",
        whereToStart,
        detail:
          "Early fish remain scattered, with the freshest entry evidence most useful below Bear Creek.",
        tip:
          "Cover travel water and the first substantial holding areas before moving upstream.",
      };
    case "building":
      return input.broadBuildingContext
        ? {
          headline:
            "Steelhead are broadly established through the Big Manistee.",
          whereToStart,
          detail:
            "Repeated entry periods support broad corridor presence, not equal numbers in every section.",
          tip:
            "Use Wellston only for Upper-river conditions and verify downstream water directly.",
        }
        : input.establishedBuildingContext
        ? {
          headline:
            "Steelhead are becoming established through more of the Big Manistee.",
          whereToStart,
          detail:
            "Earlier arrivals can be farther upstream while newer fish remain below Bear Creek.",
          tip:
            "Compare one section at a time; Wellston does not describe the Middle or Lower river.",
        }
        : {
          headline:
            "More Steelhead are entering and spreading through the Big Manistee.",
          whereToStart,
          detail:
            "Presence is building beyond isolated early fish, but distribution remains uneven.",
          tip:
            "Stay mobile until direct fish activity gives you a reason to slow down.",
        };
    case "peak":
      return {
        headline:
          "This is typically the strongest Big Manistee fall Steelhead opportunity.",
        whereToStart,
        detail:
          "Steelhead can be broadly present, but concentrations still vary by section.",
        tip:
          "Use Wellston only for Upper-river conditions; verify the Middle and Lower river directly.",
      };
    case "tapering":
      return {
        headline:
          "Steelhead remain strongly present, but fresh fall entry is slowing.",
        whereToStart,
        detail:
          "Colder water increasingly favors established holding positions over continuous upstream travel.",
        tip:
          "Keep fresh-entry travel water secondary unless current river conditions or direct fish activity point to a new movement period.",
      };
    case "ending":
      return {
        headline: "Big Manistee Steelhead fall entry is nearing its endpoint.",
        whereToStart,
        detail:
          "Steelhead may remain in the river, but this model's fresh-entry phase is ending.",
        tip:
          "Prioritize controlled presentations; use lower travel lanes only when current river conditions or direct fish activity suggest fresh arrivals.",
      };
    case "post_run":
      return {
        headline: "Big Manistee Steelhead fall entry is complete.",
        whereToStart,
        detail:
          "Steelhead may remain in the river. This model no longer estimates current presence or activity.",
        tip:
          "Check back in early September when Big Manistee fall-entry tracking resumes.",
      };
  }
}

function muskegonFallEntryWhereToStartCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  const lower = "Lower river (Muskegon Lake–M-120)";
  const middle = "Middle river (M-120–Newaygo)";
  const upper = "Upper river (Newaygo–Croton Dam)";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? `Start at Muskegon Lake and the river entrance. Add the ${lower} only for an early-Steelhead check.`
        : "Stay with Muskegon Lake, the Lake Michigan channel, and the river entrance.";
    case "beginning":
      return `Start in the ${lower}. Add the ${middle} after direct fish activity supports the move.`;
    case "building":
      if (input.broadBuildingContext) {
        return `Start in the ${upper}, emphasizing the Croton Dam area. Compare the ${middle} for fresher fish.`;
      }
      return input.establishedBuildingContext
        ? `Start in the ${middle}. Check the Croton Dam area in the ${upper} for earlier arrivals.`
        : `Start in the ${middle}. Check the Croton Dam area in the ${upper} for early arrivals.`;
    case "peak":
      return `Start in the ${upper}, emphasizing the Croton Dam area. Compare the ${middle} for fresher fish.`;
    case "tapering":
      return `Start in the ${upper}, especially the Croton Dam area. Add the ${middle} only when direct activity supports it.`;
    case "ending":
      return `Start in established ${upper} water near Croton Dam.`;
    case "post_run":
      return "There is no active Muskegon starting section in this fall-entry model.";
  }
}

function muskegonFallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const whereToStart = muskegonFallEntryWhereToStartCopy(input);
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline: "Early Steelhead may begin entering the Muskegon River.",
          whereToStart,
          detail:
            "An early Steelhead is possible, but one fish does not establish the broader fall-entry build.",
          tip:
            "Keep the river check brief and do not infer a separate strain from the seasonal calendar alone.",
        }
        : {
          headline: "Dependable Muskegon Steelhead fall entry has not started.",
          whereToStart,
          detail:
            "The fall-entry window has not opened yet. An isolated river fish would be an early exception.",
          tip:
            "Check again when early Steelhead begin appearing near the river entrance.",
        };
    case "beginning":
      return {
        headline:
          "The first fall Steelhead are entering and moving through the Muskegon River.",
        whereToStart,
        detail:
          "New fish remain scattered while earlier arrivals may already be farther upstream.",
        tip:
          "Cover travel water and the first substantial holding areas before moving upstream.",
      };
    case "building":
      return {
        headline: input.broadBuildingContext
          ? "Steelhead are broadly established through the Muskegon River."
          : "Steelhead are becoming established through more of the Muskegon River.",
        whereToStart,
        detail: input.broadBuildingContext
          ? "Multiple entry periods support broad presence, not equal numbers in every section."
          : "Earlier arrivals can hold near Croton while newer fish remain farther downstream.",
        tip:
          "Croton measurements apply only near the dam. Verify downstream water directly.",
      };
    case "peak":
      return {
        headline:
          "This is typically the strongest Muskegon fall Steelhead opportunity.",
        whereToStart,
        detail:
          "Steelhead can be broadly present, but freshness and concentrations still vary by section.",
        tip:
          "Croton measurements apply only near the dam. Verify downstream water directly.",
      };
    case "tapering":
      return {
        headline: "Steelhead remain established as fall entry slows.",
        whereToStart,
        detail:
          "Many fish may remain, but this card only describes the slowing fall-entry phase.",
        tip:
          "Use current river conditions and direct fish activity to judge movement support; Migration Stage does not confirm a fresh wave.",
      };
    case "ending":
      return {
        headline: "Muskegon Steelhead fall entry is nearing its endpoint.",
        whereToStart,
        detail:
          "This seasonal entry phase is ending. Steelhead may remain after this model stops.",
        tip:
          "Do not use a late Stage to infer current activity or a new movement wave.",
      };
    case "post_run":
      return {
        headline: "Muskegon Steelhead fall entry is complete.",
        whereToStart,
        detail:
          "Steelhead may remain in the river. This model no longer estimates current presence or activity.",
        tip:
          "Check back in early September when Muskegon fall-entry tracking resumes.",
      };
  }
}

function betsieHomesteadStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  latePostRunContext: boolean;
  species: string;
  opportunity: RunOpportunityCopyContext;
  fallEntry: boolean;
  winterHoldingContext: boolean;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.fallEntry) return betsieHomesteadFallEntryStageCopy(input);
  const limited = input.opportunity.strength === "limited";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline: `${input.species} may be staging near the Betsie entrance.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            `A few early ${input.species} may enter the Betsie Lake–US-31 reach, but dependable river presence has not begun.`,
          tip:
            "Keep the trip near the lake-to-river transition. Treat a river fish as an early exception.",
        }
        : {
          headline:
            `${input.species} have not started entering the Betsie yet.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            `Dependable ${input.species} presence is not expected in either Betsie reach this early.`,
          tip: "Keep the trip in lake and harbor water until staging begins.",
        };
    case "beginning":
      return {
        headline: `The first ${input.species} are entering the Betsie.`,
        whereToStart: "Betsie Lake–US-31 reach.",
        detail:
          `Fresh fish are most dependable near the river entrance. A few may already be in the US-31–Homestead reach.`,
        tip:
          "Start in Betsie Lake–US-31. Add US-31–Homestead only when direct fish activity supports it.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are established across both Betsie reaches.`,
          whereToStart: "US-31–Homestead reach.",
          detail:
            "Multiple entry periods have spread fish through this short migration corridor.",
          tip:
            "Cover US-31–Homestead first. Compare Betsie Lake–US-31 if needed.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline: limited
            ? `${input.species} are becoming established in select Betsie water.`
            : `${input.species} are becoming established in both Betsie reaches.`,
          whereToStart: limited
            ? "Betsie Lake–US-31 reach."
            : "Betsie Lake–US-31 reach.",
          detail: limited
            ? "This is a limited run. Fish can use either reach, but dependable concentrations remain selective."
            : "New arrivals favor the downstream reach while earlier fish can be in the US-31–Homestead reach.",
          tip: limited
            ? "Check Betsie Lake–US-31 first. Add US-31–Homestead only when direct fish activity supports it."
            : "Start in Betsie Lake–US-31, then compare US-31–Homestead after one complete pass.",
        };
      }
      return {
        headline: `More ${input.species} are entering the Betsie.`,
        whereToStart: "Betsie Lake–US-31 reach.",
        detail:
          "Presence is building, but fish can still be uneven between the two reaches.",
        tip: "Cover Betsie Lake–US-31 before moving into US-31–Homestead.",
      };
    case "peak":
      return {
        headline: limited
          ? `This is typically the strongest part of the Betsie's limited ${input.species} run.`
          : `This is typically the strongest Betsie ${input.species} window.`,
        whereToStart: "US-31–Homestead reach.",
        detail: limited
          ? "Coho can use both reaches, but dependable concentrations remain selective."
          : "Multiple entry periods have given fish time to use both reaches.",
        tip: limited
          ? "Test proven water in US-31–Homestead, then compare select Betsie Lake–US-31 water."
          : "Cover US-31–Homestead first. Compare Betsie Lake–US-31 if needed.",
      };
    case "tapering":
      return {
        headline: limited
          ? `The Betsie's limited ${input.species} opportunity is tapering.`
          : `The Betsie ${input.species} run is tapering.`,
        whereToStart: "US-31–Homestead reach.",
        detail: limited
          ? "Fresh Coho are less consistent, and remaining fish are concentrated in select established water."
          : "Fresh arrivals are less consistent, and more fish are already holding or spawning.",
        tip:
          "Prioritize US-31–Homestead. Leave actively spawning fish undisturbed.",
      };
    case "ending":
      return {
        headline: limited
          ? `A few ${input.species} may remain in select Betsie water.`
          : `The Betsie ${input.species} run is ending.`,
        whereToStart: "US-31–Homestead reach.",
        detail:
          "Fresh arrivals are no longer dependable. Remaining fish are most likely in established holding water.",
        tip:
          "Keep the search narrow and leave actively spawning or visibly deteriorated fish alone.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline: `The main Betsie ${input.species} migration is over.`,
          whereToStart: "No dependable starting reach.",
          detail:
            `A few ${input.species} may remain, but neither Betsie reach supports a dependable migration opportunity.`,
          tip:
            "Do not build a two-reach search around isolated late fish. Leave spawning fish undisturbed.",
        }
        : {
          headline: `The Betsie ${input.species} fall run is complete.`,
          detail: `${input.species} staging typically begins ${
            seasonalReturnPhrase(input.stagingStart)
          }. This seasonal model is inactive until then.`,
          tip: `Check back ${
            seasonalReturnPhrase(input.stagingStart)
          } when Betsie fall-run tracking resumes.`,
        };
  }
}

function betsieHomesteadFallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline: `${input.species} may be staging near the Betsie entrance.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            "A few early fish may enter the Betsie Lake–US-31 reach, but dependable fall presence has not begun.",
          tip:
            "Keep the trip near the lake-to-river transition. Treat a river fish as an early exception.",
        }
        : {
          headline: `${input.species} fall entry has not started yet.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            "Dependable fall Steelhead presence is not expected in either Betsie reach this early.",
          tip: "Keep the trip in lake and harbor water until staging begins.",
        };
    case "beginning":
      return {
        headline: `The first ${input.species} are entering the Betsie.`,
        whereToStart: "Betsie Lake–US-31 reach.",
        detail:
          "Fresh fish are most dependable near the river entrance. A few may already be in the US-31–Homestead reach.",
        tip:
          "Start in Betsie Lake–US-31. Add US-31–Homestead only when direct fish activity supports it.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are established across both Betsie reaches.`,
          whereToStart: "US-31–Homestead reach.",
          detail:
            "Multiple entry periods have spread Steelhead through the short migration corridor.",
          tip:
            "Cover US-31–Homestead first. Compare Betsie Lake–US-31 if needed.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline:
            `${input.species} are becoming established in both Betsie reaches.`,
          whereToStart: "Betsie Lake–US-31 reach.",
          detail:
            "New arrivals favor the downstream reach while earlier fish can be in the US-31–Homestead reach.",
          tip:
            "Start in Betsie Lake–US-31, then compare US-31–Homestead after one complete pass.",
        };
      }
      return {
        headline: `More ${input.species} are entering the Betsie.`,
        whereToStart: "Betsie Lake–US-31 reach.",
        detail:
          "Presence is building, but fish can still be uneven between the two reaches.",
        tip: "Cover Betsie Lake–US-31 before moving into US-31–Homestead.",
      };
    case "peak":
      return {
        headline:
          `This is typically the strongest Betsie fall ${input.species} window.`,
        whereToStart: "US-31–Homestead reach.",
        detail:
          "Multiple entry periods have given Steelhead time to use both reaches.",
        tip:
          "Cover US-31–Homestead first. Compare Betsie Lake–US-31 if needed.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} remain well established as fall entry slows.`,
        whereToStart: "US-31–Homestead reach.",
        detail:
          "Fewer fresh fish are entering, while Steelhead already in the river remain available.",
        tip:
          "Prioritize US-31–Homestead, then check Betsie Lake–US-31 for fresh arrivals.",
      };
    case "ending":
      return {
        headline: `${input.species} remain in the Betsie as fall entry ends.`,
        whereToStart: "US-31–Homestead reach.",
        detail:
          "The entry phase is ending. Steelhead already in the river may remain after this fall model stops.",
        tip:
          "Use direct observations to confirm current fish and water conditions.",
      };
    case "post_run":
      return {
        headline: `Betsie ${input.species} fall entry is complete.`,
        detail:
          "Steelhead may remain in the river. This model no longer estimates current presence or activity.",
        tip: `Check back ${
          seasonalReturnPhrase(input.stagingStart)
        } when Betsie fall-entry tracking resumes.`,
      };
  }
}

function fallEntryStageLabel(
  stage: RunStage,
  winterHoldingContext: boolean,
): string {
  if (winterHoldingContext) return "Winter holding";
  switch (stage) {
    case "pre_run":
      return "Before migration";
    case "beginning":
      return "Beginning";
    case "building":
      return "Building";
    case "peak":
      return "Peak";
    case "tapering":
      return "Late fall";
    case "ending":
      return "Holding transition";
    case "post_run":
      return "Offseason";
  }
}

function fallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.winterHoldingContext) {
    return {
      headline:
        `${input.species} have transitioned from fall entry into winter holding.`,
      whereToStart:
        "Deep, slow winter holding water with nearby current and an easy feeding lane.",
      detail:
        "Fish can remain distributed through the river, but colder water shifts the question from upstream movement to daily activity and feeding position.",
      tip:
        "Open the Winter Holding read for current activity, likely holding water, and presentation guidance. A completed fall-entry read does not mean steelhead have left the river.",
    };
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be gathering near the river mouth, and an occasional early fish could enter the lower river.`,
          whereToStart:
            "Harbor, river mouth, and one deliberate check of the first deep lower-river travel lane.",
          detail:
            "An early fish is possible, especially as late September approaches, but dependable fall presence has not developed yet. Treat an isolated catch as an exception, not proof that the river has filled in.",
          tip:
            "Keep most effort near the lake-to-river transition and wait for Fish In River to confirm a dependable seasonal build before committing inland.",
        }
        : {
          headline: `${input.species} fall entry has not started yet.`,
          whereToStart:
            "Lake, harbor, and river mouth—not inland river sections.",
          detail:
            "A dependable fall steelhead presence is not expected in the river this early.",
          tip:
            "Do not build an inland river trip around this species yet. Return when early monitoring begins.",
        };
    case "beginning":
      return {
        headline:
          `The first ${input.species} are beginning to enter the river.`,
        whereToStart:
          "Lower river: travel lanes that feed the first deep bends, resting pockets, and current breaks.",
        detail:
          "Fresh fish may be present, but numbers are still scattered and can arrive in uneven waves before the broader fall fishery develops.",
        tip:
          "Cover lower travel water and its first dependable resting holes, then move upstream only after those entry sections have been checked.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are now broadly established through the accessible river.`,
          whereToStart:
            "Middle and upper river holding water, with lower travel lanes added when current river conditions or direct fish activity suggest fresh arrivals.",
          detail:
            "By November, multiple entry periods have given steelhead time to spread through lower, middle, and upper sections wherever passage is open. The upper river is now a primary option, even though dependable concentrations can remain in lower and middle holding water.",
          tip:
            "Choose a middle- or upper-river section and cover its substantial holes, deep bends, and current breaks. Shift extra attention lower only when current river conditions or direct fish activity suggest a fresh wave entering the river.",
        };
      }
      return input.establishedBuildingContext
        ? {
          headline:
            `${input.species} are becoming established across much more of the river.`,
          whereToStart:
            "Lower and middle holding water first, while recognizing that fish can already be present into the upper river wherever passage is open.",
          detail:
            "By this stage, earlier arrivals have had time to reach lower, middle, and upper sections while newer fish continue entering. Fish may be distributed broadly, but the most dependable concentrations are often still in lower- and middle-river holding water.",
          tip:
            "Begin in dependable lower- or middle-river holding water and work deep holes, outside bends, and current breaks. Move into upper sections when direct fish activity or local knowledge supports it, and give lower travel lanes extra attention only when current river conditions suggest fresh arrivals.",
        }
        : {
          headline:
            `More ${input.species} are entering and spreading through the river.`,
          whereToStart:
            "Lower to middle river, where travel water feeds dependable holding holes.",
          detail:
            "Presence is building beyond isolated early fish, although arrivals and concentrations can still be uneven from section to section.",
          tip:
            "Start where lower-river travel water meets the first substantial holding holes, then work into the middle river instead of waiting in one spot.",
        };
    case "peak":
      return {
        headline:
          `This is typically the strongest and most dependable fall ${input.species} opportunity.`,
        whereToStart:
          "Throughout the accessible river, focusing on substantial holding water connected to productive current.",
        detail:
          "Multiple waves have had time to spread from lower travel lanes into established middle- and upper-river holding water. Fish can be broadly distributed wherever passage is open.",
        tip:
          "Choose an accessible section and cover each substantial hole from the head through its seams and tail. Give lower travel lanes extra time only when current river conditions or direct fish activity suggest fresh arrivals.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} presence remains high as the fall fishery begins shifting toward winter holding.`,
        whereToStart:
          "Established middle- and upper-river holes, deeper bends, and slower edges beside productive current.",
        detail:
          "Fish remain broadly available, but colder water gradually shifts the balance from active upstream movement toward established holding. Fresh arrivals can still occur without defining the whole fishery.",
        tip:
          "Start with dependable holding water. Check lower travel lanes only when current river conditions or direct fish activity provide a credible fresh-arrival signal.",
      };
    case "ending":
      return {
        headline:
          `${input.species} remain strongly present while fall entry transitions toward winter holding.`,
        whereToStart:
          "Deep established holes and slower current edges with nearby feeding water.",
        detail:
          "The fish have not simply left the river. Colder water reduces the importance of fresh upstream movement and increases the importance of where steelhead can hold efficiently through winter.",
        tip:
          "Prioritize deep, speed-controlled holding water. Treat lower travel lanes as a secondary check only when current river conditions or direct fish activity suggest fresh arrivals; the winter fishery read takes over after this stage.",
      };
    case "post_run":
      return {
        headline: `${input.species} are outside their fall-entry season.`,
        whereToStart:
          "No dependable fall-entry location is expected right now.",
        detail:
          "This fall model is inactive. It should not be used to infer winter or spring steelhead behavior.",
        tip:
          "Use the active seasonal steelhead experience rather than applying fall-entry guidance outside its window.",
      };
  }
}

function stJosephFallEntryWhereToStartCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  const lower = "Lower river (St. Joseph harbor–Berrien Springs)";
  const middle = "Middle river (Berrien Springs–Niles)";
  const upper = "Upper river (Niles–Twin Branch Dam)";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? `Start at the St. Joseph harbor and river mouth. Add the ${lower} only for an early fall-entry check.`
        : "Stay with Lake Michigan, the St. Joseph harbor, and the river mouth for new fall-entry context.";
    case "beginning":
      return `Start in the ${lower}. Add the ${middle} after direct fish activity supports the move.`;
    case "building":
      return input.broadBuildingContext
        ? `Start in the ${middle}. Compare the ${upper} for established fish.`
        : input.establishedBuildingContext
        ? `Start in the ${middle}. Compare the ${lower} for fresher fish.`
        : `Start in the ${lower}. Check the ${middle} for earlier arrivals.`;
    case "peak":
      return `Start in the ${middle}. Compare the ${upper} for established fish.`;
    case "tapering":
      return `Start in established ${middle} or ${upper} holding water.`;
    case "ending":
      return `Start in one proven ${middle} or ${upper} holding section.`;
    case "post_run":
      return "There is no active St. Joseph starting section in this fall-entry model.";
  }
}

function stJosephFallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const base = fallEntryStageCopy(input);
  const whereToStart = stJosephFallEntryWhereToStartCopy(input);
  const tip = stJosephFallEntryTip(input);
  if (input.stage === "pre_run") {
    return {
      ...base,
      headline: input.stagingContext
        ? "Early fall Steelhead may begin entering the St. Joseph River."
        : "Dependable St. Joseph Steelhead fall entry has not started.",
      whereToStart,
      detail: input.stagingContext
        ? "A new fall entrant is possible, while summer-run Skamania may already be inland. Neither establishes a broad fall-entry build."
        : "The fall-entry window has not opened yet. Summer-run Skamania may already be inland, but they are separate from this fall-entry estimate.",
      tip,
    };
  }
  if (input.stage === "post_run") {
    return {
      ...base,
      headline: "St. Joseph Steelhead fall entry is complete.",
      whereToStart,
      detail:
        "Steelhead may remain in the river. This fall-entry model no longer estimates current presence or activity.",
      tip: "Check back around September 10 when fall-entry monitoring resumes.",
    };
  }
  const detail = input.stage === "beginning"
    ? "New fall entrants remain scattered while summer-run Skamania may already be farther inland."
    : input.stage === "building"
    ? input.broadBuildingContext
      ? "Repeated entry periods support broad corridor presence, not equal numbers in every section."
      : "Earlier arrivals may be farther upstream while newer fish continue entering below."
    : input.stage === "peak"
    ? "This is typically the strongest fall-entry period, but concentrations still vary by section."
    : input.stage === "tapering"
    ? "Fresh fall entry is slowing while established Steelhead may remain throughout the corridor."
    : "This fall-entry phase is ending. Steelhead may remain after the model stops.";
  const headline = input.stage === "beginning"
    ? "The first fall Steelhead are entering the St. Joseph River."
    : input.stage === "building"
    ? input.broadBuildingContext
      ? "Steelhead are broadly established through the St. Joseph corridor."
      : "Steelhead are becoming established through more of the St. Joseph."
    : input.stage === "peak"
    ? "This is typically the strongest St. Joseph fall Steelhead opportunity."
    : input.stage === "tapering"
    ? "Steelhead remain strongly present as fresh fall entry slows."
    : "St. Joseph Steelhead fall entry is nearing its endpoint.";
  return { ...base, headline, whereToStart, detail, tip };
}

function stJosephFallEntryTip(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Keep the fall-entry check brief. Do not treat one Steelhead or an existing Skamania as proof of a new fall wave."
        : "Keep new fall-entry effort near the harbor and mouth. Use direct local information if targeting Skamania already inland.";
    case "beginning":
      return "Cover travel water and the first substantial holding areas before moving upstream.";
    case "building":
      return input.broadBuildingContext
        ? "Compare two sections, then stay where direct fish activity is strongest."
        : "Keep one Lower-river fresh-entry comparison and verify every section directly.";
    case "peak":
      return "Choose one substantial holding section and cover it completely before changing reaches.";
    case "tapering":
      return "Start in established holding water. Add Lower-river travel lanes only when Niles river conditions or direct fish activity suggest fresh arrivals.";
    case "ending":
      return "Prioritize controlled presentations. Stable river conditions or quiet fish activity do not mean Steelhead have left; use Fish In River for seasonal presence.";
    case "post_run":
      return "Check back around September 10 when St. Joseph fall-entry tracking resumes.";
  }
}

export function stageForDate(localDate: string, window: DateWindow): RunStage {
  if (compareLocalDates(localDate, window.preRunStartDate) < 0) {
    // `resolveActiveRunWindow` selects the nearest annual cycle. Once the
    // upcoming cycle is nearer than the previous one, dates before its watch
    // window describe a run that has not started—not a run that is complete.
    return "pre_run";
  }
  if (compareLocalDates(localDate, window.startDate) < 0) return "pre_run";
  if (compareLocalDates(localDate, window.beginningEndDate) <= 0) {
    return "beginning";
  }
  const peakStageStartDate = window.buildingBroadStartDate
    ? window.peakDate
    : window.peakStartDate;
  if (compareLocalDates(localDate, peakStageStartDate) < 0) {
    return "building";
  }
  if (compareLocalDates(localDate, window.peakEndDate) <= 0) return "peak";
  if (compareLocalDates(localDate, window.taperingEndDate) <= 0) {
    return "tapering";
  }
  if (compareLocalDates(localDate, window.endDate) <= 0) return "ending";
  return "post_run";
}

function stageLabel(stage: RunStage, latePostRunContext: boolean): string {
  switch (stage) {
    case "pre_run":
      return "Before migration";
    case "beginning":
      return "Beginning";
    case "building":
      return "Building";
    case "peak":
      return "Peak";
    case "tapering":
      return "Tapering";
    case "ending":
      return "Ending";
    case "post_run":
      return latePostRunContext ? "After migration" : "Offseason";
  }
}

function whereToStartCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  broadBuildingContext: boolean,
  latePostRunContext: boolean,
  opportunity: RunOpportunityCopyContext,
): string {
  switch (stage) {
    case "pre_run":
      return stagingContext
        ? "Harbor, river mouth, and the first deep lower-river travel lane."
        : "Lake, harbor, and river mouth—not inland river sections.";
    case "beginning":
      return "Lower river: the first deep bends and resting pockets beside the main travel lane.";
    case "building":
      if (!establishedBuildingContext) {
        return opportunity.distributionScope === "concentrated"
          ? "The first dependable lower-river holding water."
          : "Lower to middle river, where travel water feeds dependable holding holes.";
      }
      if (broadBuildingContext) {
        return opportunity.distributionScope === "broad"
          ? "Lower and middle river remain the first choices; upper holding water is also firmly in play wherever passage is open."
          : opportunity.distributionScope === "sectional"
          ? "Lower and middle holding sections first, with established upstream sections also in play."
          : "The river's most dependable established holding holes.";
      }
      return opportunity.distributionScope === "broad"
        ? "Lower and middle river first; some earlier fish may already have reached upper holding water."
        : opportunity.distributionScope === "sectional"
        ? "Established middle-river holding sections, with lower lanes for newer arrivals."
        : "The river's most dependable established holding holes.";
    case "peak":
      if (opportunity.distributionScope === "concentrated") {
        return "The river's most dependable holding and spawning areas.";
      }
      if (opportunity.distributionScope === "sectional") {
        return "Several dependable river sections, wherever passage remains open.";
      }
      return opportunity.strength === "strong"
        ? "Throughout the accessible river, from lower travel water into upstream holding areas."
        : opportunity.strength === "moderate"
        ? "Across a broad part of the accessible river, though concentrations may be uneven."
        : "Scattered through accessible holding water; do not expect equal numbers everywhere.";
    case "tapering":
      return opportunity.distributionScope === "broad"
        ? "Established middle- and upper-river holding water; check lower lanes only for a fresh movement signal."
        : opportunity.distributionScope === "sectional"
        ? "The river's established holding sections and deepest slower edges."
        : "The most dependable deep holding holes and slower edges.";
    case "ending":
      return "Deep established holding water and slow current edges—not fast travel lanes.";
    case "post_run":
      return latePostRunContext
        ? "No dependable starting section; any remaining fish are likely isolated in deep established holding water."
        : "No dependable river location for this species right now.";
  }
}

function stageCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  broadBuildingContext: boolean,
  latePostRunContext: boolean,
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (stage) {
    case "pre_run":
      if (stagingContext) {
        return {
          headline:
            `${species} may be gathering near the river mouth, and a few early fish could be in the river.`,
          detail: stagingDetail(species, opportunity),
          tip:
            "Fish the harbor and river mouth first, then make one deliberate check of the first deep lower-river travel lane. Skip a middle- or upper-river trip until fish become dependable in the river.",
        };
      }
      return {
        headline: `${species} have not started entering the river yet.`,
        detail: beforeStagingDetail(species, opportunity),
        tip:
          "Keep the trip in the lake, harbor, and river-mouth zone. Do not spend the day searching inland river water before the seasonal migration begins.",
      };
    case "beginning":
      return {
        headline: `The first ${species} are beginning to enter the river.`,
        detail: beginningDetail(species, opportunity),
        tip:
          "Begin in the lower river. Fish the first deep bends and short resting pockets off the main travel lane, then move upstream only after the lower section has been covered.",
      };
    case "building":
      if (establishedBuildingContext) {
        return establishedBuildingCopy(
          species,
          opportunity,
          broadBuildingContext,
        );
      }
      return {
        headline: `More ${species} are beginning to move into the river.`,
        detail: earlyBuildingDetail(species, opportunity),
        tip:
          "Start where lower-river travel water enters the first dependable holding holes. Cover those holes from head to tail, then continue into the middle river instead of waiting in one lower-river spot.",
      };
    case "peak":
      return peakCopy(species, opportunity);
    case "tapering":
      return taperingCopy(species, opportunity);
    case "ending":
      return endingCopy(species, opportunity);
    case "post_run":
      if (!latePostRunContext) {
        return {
          headline: `${species} are outside their river migration season.`,
          detail:
            `A dependable seasonal presence of ${species} is not expected in the river right now.`,
          tip:
            "Do not build a river trip around this species right now. Target a species with an active seasonal window and return to this read as the next migration approaches.",
        };
      }
      return latePostRunCopy(species, opportunity);
  }
}

function stagingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const ending = opportunity.strength === "strong"
    ? "dependable river numbers have not developed yet."
    : opportunity.strength === "moderate"
    ? "a dependable opportunity in the river has not developed yet."
    : "a dependable river opportunity—even a limited one—has not developed yet.";
  return `Most ${species} are still expected near the lake, harbor, or river mouth. The earliest arrivals can occasionally slip into the lower river, but ${ending}`;
}

function beforeStagingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const expectation = opportunity.strength === "strong"
    ? "meaningful numbers in the river"
    : opportunity.strength === "moderate"
    ? "a dependable river presence"
    : "even a limited dependable river presence";
  return `Most ${species} are still expected to be in the lake, so ${expectation} is unlikely right now.`;
}

function beginningDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  if (opportunity.strength === "strong") {
    return `Fresh ${species} may be entering the river, but numbers can still be scattered and inconsistent this early.`;
  }
  if (opportunity.strength === "moderate") {
    return `Fresh ${species} may be entering the river, but the developing opportunity can still be scattered and inconsistent this early.`;
  }
  return `A small number of fresh ${species} may be entering the river, but this limited opportunity can still be scattered and inconsistent this early.`;
}

function earlyBuildingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const subject = opportunity.strength === "strong"
    ? `More ${species}`
    : opportunity.strength === "moderate"
    ? `Additional ${species}`
    : `A few additional ${species}`;
  const spread = opportunity.distributionScope === "broad"
    ? "spread upstream"
    : opportunity.distributionScope === "sectional"
    ? "spread into dependable river sections"
    : "settle into the river's most dependable holding water";
  return `${subject} are typically entering and beginning to ${spread}, although arrivals can still come in uneven waves.`;
}

function establishedBuildingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
  broadBuildingContext: boolean,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (
    opportunity.strength === "strong" &&
    opportunity.distributionScope === "broad"
  ) {
    if (broadBuildingContext) {
      return {
        headline:
          `${species} can now be found throughout the accessible river.`,
        detail:
          `Earlier waves have had time to reach upper holding water while later ${species} may still be entering below. Lower, middle, and upper sections are all in play wherever passage is open; the most dependable concentrations may still be in the lower and middle river, while upper water can now hold meaningful numbers too.`,
        tip:
          "Start with dependable lower- or middle-river holding water, then cover established upper holes, outside bends, and current breaks. Give fresh lower-river travel lanes extra time only when current river conditions or direct fish activity support it.",
      };
    }
    return {
      headline:
        `${species} are becoming established through more of the river.`,
      detail:
        `More ${species} are settling into lower- and middle-river holding water, which should still contain the most dependable concentrations. Some earlier fish may already have reached upper holding water wherever passage is open, but the upper river should remain a secondary starting choice at this stage.`,
      tip:
        "Begin in dependable lower- or middle-river holding water and cover its deep holes, outside bends, and current breaks. Move into upper sections after those primary areas have been checked or direct fish activity supports the move.",
    };
  }
  const headline = opportunity.strength === "limited"
    ? `${species} are becoming established within the river's most dependable sections.`
    : `${species} are becoming established through more dependable river sections.`;
  const distribution = opportunity.distributionScope === "broad"
    ? "through a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "through several dependable river sections"
    : "within a smaller set of dependable holding areas";
  const amount = opportunity.strength === "strong"
    ? "Good numbers of fish"
    : opportunity.strength === "limited"
    ? "A smaller number of fish"
    : "Fish";
  return {
    headline,
    detail:
      `Earlier arrivals have had time to move upstream while later ${species} may continue to enter. ${amount} may now be distributed ${distribution}, wherever passage is open.`,
    tip: opportunity.distributionScope === "concentrated"
      ? "Begin in the river's most dependable established holding water and cover each deep hole, outside bend, and current break carefully. Finish with one deliberate lower-river travel-lane check only when current river conditions or direct fish activity suggest fresh arrivals."
      : "Begin in a dependable middle-river section, then work through its deep holes, outside bends, and current breaks. Finish with a deliberate lower-river travel-lane check only when current river conditions or direct fish activity suggest fresh arrivals.",
  };
}

function peakCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (
    opportunity.strength === "strong" &&
    opportunity.distributionScope === "broad"
  ) {
    return {
      headline:
        `This is typically the strongest and most dependable river opportunity of the ${species} season.`,
      detail:
        `Multiple waves have had time to spread, so ${species} are likely distributed throughout the accessible river—from lower travel water through upstream holding and spawning reaches, except above dams or other barriers.`,
      tip:
        "Choose an accessible river section and fish every substantial hole from its head through the inside seam and tail. Move section by section through deep bends and resting pockets, and leave fish on shallow spawning gravel alone.",
    };
  }
  const headline = opportunity.strength === "limited"
    ? `This is typically the best river opportunity of the ${species} season, although the overall seasonal presence remains limited.`
    : `This is typically the strongest and most dependable river opportunity of the ${species} season.`;
  const amount = opportunity.strength === "strong"
    ? `good numbers of ${species}`
    : opportunity.strength === "limited"
    ? `a smaller number of ${species}`
    : `${species}`;
  const distribution = opportunity.distributionScope === "broad"
    ? "through a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "through several dependable river sections"
    : "within the river's most dependable holding and spawning areas";
  return {
    headline,
    detail:
      `Earlier waves have had time to move, so ${amount} may now be distributed ${distribution}, except above dams or other barriers.`,
    tip: opportunity.distributionScope === "concentrated"
      ? "Choose one of the river's most dependable holding sections and fish every substantial hole from its head through the inside seam and tail. Move carefully between deep bends and resting pockets, and leave fish on shallow spawning gravel alone."
      : "Choose a dependable river section and fish every substantial hole from its head through the inside seam and tail. Move section by section through deep bends and resting pockets, and leave fish on shallow spawning gravel alone.",
  };
}

function taperingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const amount = opportunity.strength === "strong"
    ? `Good numbers of ${species}`
    : opportunity.strength === "moderate"
    ? species
    : `A smaller number of ${species}`;
  const detail = opportunity.distributionScope === "broad"
    ? opportunity.strength === "strong"
      ? `${amount} may still be spread through the river.`
      : `${amount} may still be present across a broad part of the accessible river.`
    : opportunity.distributionScope === "sectional"
    ? `${amount} may still be present through the river's dependable sections.`
    : `${amount} may still be concentrated in the river's most dependable holding water.`;
  const tip = opportunity.distributionScope === "broad"
    ? "Begin with established middle- and upper-river holding water, especially deep holes and slower edges. Finish with lower travel lanes only when current river conditions or direct fish activity suggest a fresh late wave."
    : opportunity.distributionScope === "sectional"
    ? "Begin in the river's established holding sections, especially deep holes and slower edges. Finish with lower travel lanes only when current river conditions or direct fish activity suggest a fresh late wave."
    : "Begin in the river's most dependable deep holes and slower holding edges. Finish with one lower travel-lane check only when current river conditions or direct fish activity suggest a fresh late arrival.";
  return {
    headline: opportunity.strength === "limited"
      ? `This can still offer a limited ${species} opportunity, even as fresh arrivals typically become less consistent.`
      : `This can remain a productive part of the ${species} season, even as fresh arrivals typically become less consistent.`,
    detail:
      `${detail} At this point in the seasonal pattern, the balance often shifts from new arrivals toward fish already holding or spawning.`,
    tip,
  };
}

function endingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const location = opportunity.distributionScope === "broad"
    ? "across a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "in dependable river sections"
    : "in the most dependable holding water";
  const headline = opportunity.strength === "strong" &&
      opportunity.distributionScope === "broad"
    ? `${species} can still provide a worthwhile late-season river opportunity.`
    : opportunity.strength === "limited"
    ? `A limited late-season ${species} opportunity may remain ${location}.`
    : `${species} can still provide a worthwhile late-season opportunity ${location}.`;
  const amount = opportunity.strength === "strong"
    ? "Fish"
    : opportunity.strength === "moderate"
    ? "Some fish"
    : "A smaller number of fish";
  return {
    headline,
    detail: opportunity.strength === "strong"
      ? `${amount} can still be present, but many have been in the system for a while and fresh arrivals tend to be less dependable.`
      : `${amount} can still be present, but those fish may have been in the system for a while and fresh arrivals tend to be less dependable.`,
    tip:
      "Skip fast travel lanes. Work the deepest established holes and slow current edges, and leave actively spawning fish and shallow gravel alone.",
  };
}

function latePostRunCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const location = opportunity.distributionScope === "broad"
    ? "across a broad part of the river"
    : opportunity.distributionScope === "sectional"
    ? "through its core river sections"
    : "in its most dependable holding water";
  const opportunityText = opportunity.strength === "strong" &&
      opportunity.distributionScope === "broad"
    ? "a dependable river-wide opportunity"
    : opportunity.strength === "limited"
    ? `even a limited dependable opportunity ${location}`
    : `a dependable opportunity ${location}`;
  return {
    headline: `The main ${species} migration is over.`,
    detail:
      `A few fish may remain, but the season no longer supports ${opportunityText}.`,
    tip:
      "Do not chase scattered holdovers from access to access. Shift to another seasonal species and leave any actively spawning fish undisturbed.",
  };
}

function stageReasonCode(
  stage: RunStage,
): RunStageResult["reasonCodes"][number] {
  switch (stage) {
    case "pre_run":
      return "stage_pre_run";
    case "beginning":
      return "stage_beginning";
    case "building":
      return "stage_building";
    case "peak":
      return "stage_peak";
    case "tapering":
      return "stage_tapering";
    case "ending":
      return "stage_ending";
    case "post_run":
      return "stage_post_run";
  }
}
