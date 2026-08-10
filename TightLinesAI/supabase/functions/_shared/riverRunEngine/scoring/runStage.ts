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
    stage === "post_run" && compareLocalDates(localDate, window.endDate) > 0;

  const opportunity = resolveRunOpportunityCopyContext(run.historicalPresence);
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
      label: run.runStageCopyStrategy === "pere_marquette" &&
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
      label: stageLabel(stage, latePostRunContext),
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
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: stageLabel(stage, latePostRunContext),
      ...bigManisteeTailwaterStageCopy({
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
  if (run.runStageCopyStrategy === "muskegon_croton_tailwater") {
    return {
      stage,
      copyStrategy,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext: false,
      window,
      label: stageLabel(stage, latePostRunContext),
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
      label: run.runType === "fall_entry"
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
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Start with the St. Joseph harbor, river mouth, and deep lower Michigan travel water; do not assume fish have passed Niles or reached South Bend."
        : "Keep the search in Lake Michigan, the harbor, and river-mouth water until river staging begins.";
    case "beginning":
      return limited
        ? "Start in deep lower-Michigan travel and holding water below Berrien Springs; make Niles a selective second check and do not chase this smaller Chinook return across the full corridor."
        : "Start in deep lower-Michigan travel water below Berrien Springs, then compare legal holding water around Buchanan and Niles before making a selective Indiana check.";
    case "building":
      if (input.broadBuildingContext) {
        return limited
          ? "Prioritize proven lower-Michigan and Niles holding water; use South Bend or Mishawaka only as selective passage checks, always away from posted ladder and dam boundaries."
          : "Compare lower-Michigan holding water, Buchanan and Niles, then legal South Bend-Mishawaka water below Twin Branch; never infer every section from the Niles gauge.";
      }
      return input.establishedBuildingContext
        ? limited
          ? "Work proven Berrien Springs-to-Niles holding water first, then make one legal South Bend passage check rather than assuming broad corridor occupation."
          : "Compare Berrien Springs-to-Niles holding water with legal South Bend travel and resting reaches; expect uneven passage between sections."
        : "Follow lower-river travel lanes toward Berrien Springs and Buchanan, then sample Niles before considering Indiana water.";
    case "peak":
      return limited
        ? "Start with proven lower-Michigan and Niles holding water, then make one selective South Bend or Mishawaka check below Twin Branch; this smaller Chinook run is not a reason to cover all 63 miles."
        : "Compare Berrien Springs, Buchanan, and Niles holding water with legal South Bend-Mishawaka water below Twin Branch; stay outside every posted dam and ladder boundary.";
    case "tapering":
      return "Prioritize established holding and spawning water near Niles, South Bend, and Mishawaka while checking the lower river only for a late fresh wave.";
    case "ending":
      return "Focus on proven deep holding water near Niles, South Bend, or Mishawaka; treat fresh lower-river entry as secondary and leave shallow spawning fish alone.";
    case "post_run":
      return input.latePostRunContext
        ? "Make only a selective check of established late holding water below Twin Branch; the main migration window has ended."
        : `Shift to an in-season species and do not plan a St. Joseph ${input.species} migration trip from this inactive calendar.`;
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
            `${input.species} may be staging around the St. Joseph harbor and mouth, but dependable inland passage has not begun.`,
          detail: limited
            ? `A few early ${input.species} can enter lower Michigan water, but this smaller run should not be projected through Niles, South Bend, or Mishawaka from one fish near the mouth.`
            : `An early ${input.species} can enter lower Michigan water, but harbor activity does not prove passage through Berrien Springs, Niles, or the Indiana ladders.`,
          tip:
            "Fish the harbor-to-river transition and one deep lower-river travel lane. Skip an inland corridor run until Migration Stage and Fish In River show dependable entry.",
        }
        : {
          ...base,
          headline:
            `${input.species} have not begun their dependable St. Joseph River migration.`,
          detail:
            "The seasonal calendar still points to Lake Michigan, the harbor, and the river mouth—not an established inland opportunity.",
          tip:
            "Keep the trip lakeward and return when staging monitoring begins. Do not let rain or one isolated river fish turn into a corridor-wide claim.",
        };
    case "beginning":
      return {
        ...base,
        headline: limited
          ? `The first ${input.species} are entering the St. Joseph, but the opportunity remains small and sectional.`
          : `The first ${input.species} are entering the St. Joseph and beginning to move beyond the lower river.`,
        detail: limited
          ? "Lower Michigan travel and holding water is the most defensible first look. Passage through the five ladders can occur, but Niles or Indiana fish should be treated as selective opportunities—not broad distribution."
          : "New fish should still be weighted toward lower Michigan travel water, while earlier arrivals may already be using Buchanan, Niles, and selective Indiana resting water.",
        tip:
          "Cover a lower-Michigan travel-and-holding sequence first. Move upriver only after direct fish activity, local observations, or established passage supports the change.",
      };
    case "building":
      return {
        ...base,
        headline: limited
          ? `${input.species} are established in select St. Joseph sections, but this remains a limited run.`
          : input.broadBuildingContext
          ? `${input.species} are now established through multiple sections of the interstate St. Joseph corridor.`
          : `${input.species} are becoming established from lower Michigan water toward Niles and Indiana.`,
        detail: limited
          ? "Earlier fish can be holding from lower Michigan through Niles, with some passage into South Bend and Mishawaka. Empty water between fish remains normal for this smaller Chinook return."
          : "Earlier arrivals have had time to pass Berrien Springs, Buchanan, and Niles while newer fish continue entering below. Distribution can be broad without being even between Michigan and Indiana sections.",
        tip: limited
          ? "Pick one proven Michigan or Niles holding section and fish it thoroughly before making one legal Indiana check. Do not run every ladder looking for scattered Chinook."
          : "Compare one Michigan section with one Indiana section, working deep travel lanes, current breaks, and resting water away from every ladder safety zone.",
      };
    case "peak":
      return {
        ...base,
        headline: limited
          ? `This is the best St. Joseph ${input.species} window, but it remains a selective 3-of-10 opportunity.`
          : `This is typically the strongest St. Joseph ${input.species} window across the five-ladder corridor.`,
        detail: limited
          ? "The calendar supports the best chance of finding Chinook in proven lower-Michigan, Niles, or selective Indiana holding water. It does not imply strong or uniform occupation of the full corridor."
          : "Multiple waves have had time to spread from the lower river through Berrien Springs, Buchanan, Niles, South Bend, and Mishawaka, but each section still needs to be checked independently.",
        tip:
          "Choose a proven section and cover deep holding water from head to tail. Change sections only after a clean search, and leave shallow spawning fish undisturbed.",
      };
    case "tapering":
      return {
        ...base,
        detail:
          "Fresh passage is becoming less dependable, so established Niles, South Bend, and Mishawaka holding or spawning water matters more than racing the lower river for a new wave.",
        tip:
          "Start in proven deep holding water, check lower travel lanes only when Push supports new movement, and leave fish on shallow gravel alone.",
      };
    case "ending":
      return {
        ...base,
        detail:
          "Most remaining fish have been in the system for some time. A fresh fish is possible, but the guide-level plan is a short, selective holding-water search—not a corridor-wide run.",
        tip:
          "Fish one or two proven deep holding areas, avoid shallow spawning fish, and stop searching if direct signs are absent.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          ...base,
          detail:
            "A few late fish may remain below Twin Branch, but the main migration no longer supports a dependable St. Joseph trip.",
          tip:
            "Make only a selective established-water check, or shift to an active species. Do not chase isolated holdovers from ladder to ladder.",
        }
        : {
          ...base,
          headline:
            `${input.species} are outside their St. Joseph River migration season.`,
          detail:
            "This fall migration read is inactive and should not be used to recommend a harbor, Michigan, Niles, or Indiana starting reach.",
          tip:
            "Choose a species with an active St. Joseph seasonal window and return to this read when early monitoring begins.",
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
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be staging in Muskegon Lake, the channel, and near the river mouth.`,
          whereToStart:
            "Muskegon Lake, the Lake Michigan channel, the river mouth, and one quick check of deep lower-river water below M-120.",
          detail:
            `An early ${input.species} can enter the lower Muskegon, but that does not mean fish are spread through Newaygo or up to Croton Dam.`,
          tip:
            "Stay closer to the lake. One early river fish does not mean the whole river has fish yet.",
        }
        : {
          headline:
            `${input.species} have not started their main Muskegon River run.`,
          whereToStart:
            "Lake Michigan, the Muskegon channel, Muskegon Lake, and the river mouth—not the inland river yet.",
          detail:
            `It is still too early to expect ${input.species} between Muskegon Lake and Croton Dam.`,
          tip:
            "Keep the trip in lake, channel, and mouth water until staging begins.",
        };
    case "beginning":
      return {
        headline:
          `The first ${input.species} are starting to enter the Muskegon River.`,
        whereToStart:
          "Start in the deep lower river from Muskegon Lake toward M-120, then sample Newaygo-to-M-120 travel lanes before making a selective Croton-tailwater check.",
        detail:
          "New fish can be scattered across more than forty river miles. A few may already be near Croton, but the lower and middle river are the better places to start.",
        tip:
          "Check deep bends, wood edges, and resting spots in two parts of the river before heading straight to the dam.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline: limited
            ? `${input.species} are established in several Muskegon River sections.`
            : `${input.species} are broadly established below Croton Dam.`,
          whereToStart:
            "Compare Croton-tailwater pools, the Croton-to-Newaygo corridor, Newaygo-to-M-120 holding water, and major lower-river bends toward Muskegon Lake.",
          detail: limited
            ? "Fish may be using several sections, but this is still a smaller run and many good-looking spots may be empty. The Croton gauge only measures water near the dam."
            : "Fish from several waves can be spread through the river, but the Croton gauge only measures water near the dam. Fish numbers can be very different downstream.",
          tip:
            "Check the upper, middle, and lower river. Let what you see on the water—not just the Croton gauge—tell you where to stay.",
        };
      }
      return input.establishedBuildingContext
        ? {
          headline: limited
            ? `${input.species} are becoming established in select Muskegon River reaches.`
            : `${input.species} are becoming dependably established through more of the Muskegon River.`,
          whereToStart:
            "Begin with Croton-to-Newaygo pools and runs, then compare deeper Newaygo-to-M-120 bends with lower-river travel water below M-120.",
          detail:
            "Earlier fish can hold below Croton while newer fish move through the lower river. What you find in one section may not match the rest of the river.",
          tip:
            "Check upper-river holding water and at least one middle or lower section before settling in for the day.",
        }
        : {
          headline:
            `More ${input.species} are entering and spreading through the Muskegon River.`,
          whereToStart:
            "Follow lower-river travel water below M-120 into the bigger resting holes between M-120 and Newaygo, then check the Croton-to-Newaygo section.",
          detail:
            "More than a few early fish are in the river now, but they may still be spread unevenly through the lower and middle sections.",
          tip:
            "Keep moving between sections until you find signs that fish are using the water.",
        };
    case "peak":
      return {
        headline:
          `This is typically the strongest Muskegon River ${input.species} opportunity.`,
        whereToStart:
          "Compare the Croton tailwater, Croton-to-Newaygo pools, Newaygo-to-M-120 bends and wood, and major lower-river holes toward Muskegon Lake.",
        detail:
          "Fish can be spread through the river now, but water clarity, access, and how the fish act can still be very different from one section to another.",
        tip:
          "The Croton gauge tells you what is happening near the dam. Check the middle and lower river yourself because conditions can be different downstream.",
      };
    case "tapering":
      return {
        headline:
          `The Muskegon ${input.species} run is tapering, with established fish still present below Croton.`,
        whereToStart:
          "Start with deep Croton-to-Newaygo pools, slower bends near Newaygo, and known holding water around M-120. Check the lower river when there are signs of later fish coming in.",
        detail:
          "October can still hold fish, but more of them have been in the river for a while, are spawning, or are starting to wear down. Do not expect a fresh wave everywhere.",
        tip:
          "Fish the deeper holding water, leave fish on shallow spawning gravel alone, and remember that one bright fish does not mean a fresh wave came in.",
      };
    case "ending":
      return {
        headline:
          `Only a small late Muskegon ${input.species} opportunity remains.`,
        whereToStart:
          "Limit the search to proven deep pools below Croton, slower inside bends near Newaygo, and one or two substantial M-120-area holes.",
        detail:
          "Most fish left in the river have been there for a while. A late bright fish is still possible, but a steady new wave is no longer expected.",
        tip:
          "Keep expectations low, leave spawning or worn-out fish alone, and move on if you are not seeing signs of fish.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline:
            `A few late ${input.species} may remain in established Muskegon River holding water.`,
          whereToStart:
            "There is no dependable starting reach; if you still go, make one careful check of a proven deep pool below Croton, near Newaygo, or around M-120.",
          detail:
            "A few late fish may remain, but that does not mean a fresh wave or good numbers are in the river.",
          tip:
            "A few leftover fish do not mean a new wave has entered the river.",
        }
        : {
          headline:
            `The Muskegon ${input.species} run is outside its researched window.`,
          whereToStart:
            "No dependable Muskegon River location for this fall migration model right now.",
          detail:
            "The fall run is over for this read. Use the read for the current season instead.",
          tip:
            "This fall read is finished. Use the read for the current season instead.",
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
  species: string;
  opportunity: RunOpportunityCopyContext;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  const strong = input.opportunity.strength === "strong";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be staging in Lake Michigan, Manistee Lake, and near the river mouth.`,
          whereToStart:
            "Manistee Lake, the harbor, the river mouth, and the first deep travel water in the lower migratory river toward M-55.",
          detail:
            `Early ${input.species} can begin checking the Big Manistee, but the Wellston gauge and Tippy tailwater should not be treated as proof that the entire lower corridor is occupied.`,
          tip:
            "Use the lake-to-river transition for staging context. Treat an early river fish as real evidence, not as a reason to claim broad river presence.",
        }
        : {
          headline:
            `${input.species} have not begun their dependable Big Manistee river run.`,
          whereToStart:
            "Lake Michigan, Manistee Lake, the harbor, and the river mouth.",
          detail:
            `The fixed seasonal calendar has not reached dependable ${input.species} river presence yet.`,
          tip:
            "Keep staging context separate from river presence until the river window opens.",
        };
    case "beginning":
      if (
        compareLocalDates(
          input.localDate,
          addDays(input.window.startDate, 7),
        ) >= 0
      ) {
        return {
          headline:
            `${input.species} are accumulating through more of the Big Manistee below Tippy Dam.`,
          whereToStart:
            "Check the Tippy tailwater and Tippy-to-High Bridge reach first; if fish are scattered there, compare the High Bridge-Bear Creek middle corridor and lower migratory river for newer arrivals.",
          detail:
            "Earlier fish can already be established in tailwater holding areas while newer fish continue moving through the lower and middle migratory corridor. Numbers can still be uneven between sections.",
          tip:
            "Treat Tippy, High Bridge, and Bear Creek as different checks—not one uniform gauge reach—and let direct fish activity decide where to slow down.",
        };
      }
      return {
        headline:
          `The first ${input.species} are beginning to enter the Big Manistee below Tippy Dam.`,
        whereToStart:
          "Make a quick Tippy-tailwater check. If it is empty or sparse, compare the High Bridge-Bear Creek middle corridor with the lower migratory river toward M-55, where newer fish are more likely still traveling.",
        detail:
          "The dam concentrates migrants, but early fish are not necessarily distributed through the full 25-mile corridor. Wellston describes the tailwater and upper corridor only.",
        tip:
          "Start near the tailwater, then cover deep travel and holding water downstream rather than assuming every reach is equally populated.",
      };
    case "building":
      if (compareLocalDates(input.localDate, input.window.peakStartDate) >= 0) {
        return {
          headline:
            `${input.species} are moving into the Big Manistee's strongest seasonal window.`,
          whereToStart:
            "Start in the Tippy-to-High Bridge reach for accumulated fish, then compare the High Bridge-Bear Creek middle corridor and lower-river bends toward M-55 for fresher arrivals.",
          detail:
            "Multiple waves have had time to spread through the corridor, and the tailwater reach is building toward its heaviest-use period. Reach-to-reach clarity and fish freshness can still differ sharply.",
          tip:
            "Use Wellston to judge the tailwater response, but compare several sections before assuming the most crowded water holds the freshest fish.",
        };
      }
      if (input.broadBuildingContext) {
        const sectional = input.opportunity.distributionScope === "sectional";
        return {
          headline: strong
            ? `${input.species} are becoming established through the Big Manistee migratory corridor.`
            : `The Big Manistee ${input.species} opportunity is broadening through the migratory corridor.`,
          whereToStart: sectional
            ? "Sample select Tippy-to-High Bridge pools, the High Bridge-Bear Creek middle corridor, and one or two substantial lower-river bends toward M-55."
            : "Fish the Tippy-to-High Bridge pools and runs first, then sample the High Bridge-Bear Creek middle corridor and major lower-river bends toward M-55.",
          detail: sectional
            ? "More than one migratory reach is now plausible, but this remains sectional opportunity—not evidence that fish occupy every reach or good-looking hole. Wellston directly measures only the regulated tailwater."
            : "Multiple arrival waves can now occupy the tailwater, middle reaches, and lower corridor, but Wellston still measures only the regulated tailwater and cannot certify downstream conditions.",
          tip:
            "Use the gauge for the Tippy tailwater. Treat lower-river clarity, access, and holding water as separate reach questions.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline:
            `More ${input.species} are becoming established below Tippy Dam.`,
          whereToStart:
            "Begin in the Tippy tailwater, then compare the Tippy-to-High Bridge reach with deeper bends in the High Bridge-Bear Creek middle corridor before committing to one section.",
          detail:
            "Earlier fish can be established near the dam while newer arrivals remain distributed farther downstream. The river is not a single uniform gauge reach.",
          tip:
            "Work substantial holding water and current breaks section by section. Do not turn a Wellston reading into a claim about the lower river.",
        };
      }
      return {
        headline:
          `More ${input.species} are entering the Big Manistee below Tippy Dam.`,
        whereToStart:
          "The first tailwater pools and current breaks below Tippy, followed by deeper bends in the Tippy-to-High Bridge reach.",
        detail:
          "Presence is growing beyond isolated early fish, but concentrations can still vary sharply between the tailwater, middle river, and lower corridor.",
        tip:
          "Cover water until direct fish activity gives you a reason to slow down.",
      };
    case "peak":
      if (
        compareLocalDates(input.localDate, addDays(input.window.peakDate, 6)) >=
          0
      ) {
        return {
          headline:
            `The Big Manistee remains near peak ${input.species} presence as the run begins shifting toward a late-season mix.`,
          whereToStart:
            "Work the deeper pools below Tippy, High Bridge bends, and the Bear Creek junction; visit lower-river travel holes only when fresh movement is evident.",
          detail:
            "Strong numbers can remain through the system, but the mix increasingly includes fish that have held for days or begun spawning alongside later arrivals.",
          tip:
            "Prioritize deep holding water connected to current, look for genuinely fresh fish, and leave visible fish on shallow spawning gravel undisturbed.",
        };
      }
      return {
        headline: strong
          ? `This is typically the strongest Big Manistee ${input.species} opportunity.`
          : `This is typically the strongest part of the Big Manistee ${input.species} window.`,
        whereToStart:
          "Compare the Tippy tailwater, Tippy-to-High Bridge reach, High Bridge-Bear Creek middle corridor, and major lower-river holes toward M-55.",
        detail: strong
          ? "The fall run can be broad and powerful here, but fish concentrations, clarity, access, and presentation conditions still change by reach."
          : "This is the best seasonal chance to find fish in more than one migratory reach, but the opportunity remains sectional and concentrations can change sharply from one access or hole to the next.",
        tip:
          "Use Wellston for the regulated tailwater response, then make lower-river decisions from local water conditions rather than extrapolation.",
      };
    case "tapering":
      if (
        compareLocalDates(
          input.localDate,
          addDays(input.window.peakEndDate, 6),
        ) >= 0
      ) {
        return {
          headline:
            `The Big Manistee ${input.species} run is entering its late taper.`,
          whereToStart:
            "Target the deepest pools below Tippy, slower inside bends near High Bridge, and current seams around Bear Creek; go lower only on a fresh response.",
          detail:
            "Fish can remain numerous in selected holding and spawning reaches, but fresh silver arrivals are becoming the exception and river-wide distribution is less dependable.",
          tip:
            "Fish selected deep water carefully, avoid shallow spawning fish, and do not let one late arrival stand in for a broad new wave.",
        };
      }
      return {
        headline:
          `The Big Manistee can remain productive for ${input.species}, although fresh arrivals are becoming less consistent.`,
        whereToStart:
          "Begin with shaded pools below Tippy and the slower edges of High Bridge bends, then check Bear Creek for late moving fish.",
        detail:
          "Older fish may remain while new movement becomes more dependent on cooling water and a measured hydraulic response.",
        tip:
          "Prioritize established holding water and do not treat rain alone as a confirmed push.",
      };
    case "ending":
      if (
        compareLocalDates(
          input.localDate,
          addDays(input.window.taperingEndDate, 6),
        ) >= 0
      ) {
        return {
          headline:
            `Only a residual late ${input.species} opportunity remains in the Big Manistee.`,
          whereToStart:
            "Limit the search to the deepest Tippy-area pools, High Bridge inside bends, and one or two proven Bear Creek-area holes.",
          detail:
            "Most remaining fish have been in the system for some time. A genuinely fresh fish is possible, but no longer represents a dependable new migration wave.",
          tip:
            "Keep expectations narrow, leave spawning or visibly deteriorated fish alone, and shift effort when direct evidence is absent.",
        };
      }
      return {
        headline: `The main Big Manistee ${input.species} run is winding down.`,
        whereToStart:
          "The deepest pools below Tippy and High Bridge, especially soft edges beside the main current; skip broad exploratory water.",
        detail:
          "Residual fish can remain, but active movement and fresh distribution are becoming less dependable.",
        tip:
          "Require a measured rise and suitable water before giving late movement strong weight.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline:
            `A few late ${input.species} may remain in established Big Manistee holding water.`,
          whereToStart:
            "There is no dependable starting reach; if you still go, make one careful check of a proven deep pool below Tippy or near High Bridge.",
          detail:
            "The seasonal presence tail is not a live abundance estimate and does not imply a fresh river push.",
          tip: "Do not convert residual presence into a new-run signal.",
        }
        : {
          headline:
            `The Big Manistee ${input.species} run is outside its researched window.`,
          whereToStart:
            "No dependable Big Manistee location for this fall migration model right now.",
          detail:
            "This fall-spawn profile has ended; another seasonal experience must supply any later species guidance.",
          tip: "Do not use this profile to score a different season.",
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
            `Seasonal timing supports nearby-lake staging. Any ${input.species} already in the Lower river would be an early exception.`,
          tip:
            "Keep the river check brief. Do not move into the Middle or Upper river from calendar timing alone.",
        }
        : {
          headline: `The PM ${input.species} fall run has not started.`,
          detail:
            `Seasonal timing does not support dependable ${input.species} presence in the PM river yet.`,
          tip:
            "Keep effort in the lake, harbor, and Pere Marquette Lake until staging begins.",
        };
    case "beginning":
      return {
        headline:
          `Seasonal timing supports the first ${input.species} entering the Lower river.`,
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
            `Seasonal timing keeps the Lower river primary. Earlier arrivals may begin reaching the Middle river.`,
          tip:
            "Start low, then make one Middle river check if direct fish activity supports the move.",
        };
      }
      if (input.broadBuildingContext) {
        return {
          headline:
            `Seasonal timing supports a broader PM ${input.species} distribution.`,
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
          `Seasonal timing now favors the Middle river. The Upper river remains a conditional secondary choice.`,
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
          ? `Seasonal timing favors the most dependable ${input.species} holding water. Expected distribution is concentrated and uneven.`
          : input.opportunity.distributionScope === "sectional"
          ? `Seasonal timing supports the PM’s core ${input.species} sections. Concentrations may remain uneven between them.`
          : moderateRun
          ? "Seasonal timing supports the widest dependable Coho distribution. It does not make Coho abundance equal to the PM Chinook run."
          : `Seasonal timing supports the widest dependable ${input.species} distribution. It does not confirm fish in every section.`,
        tip:
          "Start in the Middle river. Compare the Upper river only after a complete first pass.",
      };
    case "tapering":
      return {
        headline: `The main PM ${input.species} migration is tapering.`,
        detail:
          `Seasonal presence is declining. Established Middle river holding water is more dependable than broad travel-water searches.`,
        tip:
          "Start in established Middle river water. Shift lower only when Push supports fresh movement.",
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
            `Seasonal timing no longer supports a broad river search. Any remaining ${input.species} are exceptions.`,
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
        "Seasonal timing still supports broad fall presence. Colder water makes established holding water more important than new entry.",
      tip:
        "Start in the Middle river. Shift lower only when Push supports fresh movement.",
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
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Lower river (Pere Marquette Lake–Scottville) only when Push supports fresh movement.";
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
      return "Start in the Middle river (Scottville–Maple Leaf). Add the Lower river (Pere Marquette Lake–Scottville) only when Push supports fresh movement.";
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
  if (input.winterHoldingContext) {
    return "Deep, speed-controlled holding water in the Tippy-to-High Bridge reach and High Bridge-Bear Creek middle corridor, with nearby feeding current; compare lower-river wintering holes when access and local conditions support them.";
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Manistee Lake, the river mouth, and lower migratory river toward M-55 for new fall entrants; treat a Tippy-tailwater Skamania check as separate summer-run context."
        : "Manistee Lake, the harbor, and the river mouth for fall-entry context; summer-run Steelhead may already hold near Tippy, but they do not confirm the winter-run fall build.";
    case "beginning":
      return "Lower migratory river toward M-55 first, then substantial travel-and-resting water through the High Bridge-Bear Creek middle corridor; check Tippy only after those fresh-entry sections.";
    case "building":
      if (input.broadBuildingContext) {
        return "Compare substantial holding water in the Tippy-to-High Bridge reach and High Bridge-Bear Creek middle corridor, then add lower-river travel lanes when Push supports fresh arrivals.";
      }
      return input.establishedBuildingContext
        ? "High Bridge-Bear Creek middle-corridor holding water first, then compare the Tippy-to-High Bridge reach and lower migratory river for accumulated versus fresher fish."
        : "Lower-river travel water toward M-55 into the first substantial High Bridge-Bear Creek resting holes.";
    case "peak":
      return "Compare the Tippy tailwater, Tippy-to-High Bridge reach, High Bridge-Bear Creek middle corridor, and substantial lower-river holes toward M-55; use Push to separate fresh travel water from established holding fish.";
    case "tapering":
      return "Established Tippy-to-High Bridge and High Bridge-Bear Creek holding water, especially deeper bends and slower edges; add lower travel lanes only on a credible fresh Push.";
    case "ending":
      return "Deep, speed-controlled holding water from the Tippy tailwater through High Bridge and Bear Creek, with nearby current and an efficient feeding lane.";
    case "post_run":
      return "No active fall-entry starting reach; use the winter Steelhead read for deep holding water and current activity instead.";
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
  if (input.winterHoldingContext) {
    return {
      headline:
        `${input.species} have transitioned from fall entry into winter holding throughout the Big Manistee corridor.`,
      whereToStart,
      detail:
        "The fish have not left the river. Colder water shifts the useful question from upstream entry toward daily activity, feeding position, and efficient winter holding water.",
      tip:
        "Use the winter Steelhead read for current activity and presentation guidance; 70/100 is retained seasonal presence, not a live movement score.",
    };
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} fall entry is approaching, while separate summer-run fish may already be holding below Tippy.`,
          whereToStart,
          detail:
            "A Skamania already near the tailwater is not evidence that the winter-run fall migration is ahead. New fall entrants are more appropriately evaluated from Manistee Lake into the lower migratory corridor.",
          tip:
            "Keep summer-run and fall-entry evidence separate. Treat an isolated fish as context until the seasonal curve and measured conditions support a broader build.",
        }
        : {
          headline:
            `${input.species} winter-run fall entry has not started yet.`,
          whereToStart,
          detail:
            "Summer-run Steelhead can make the Big Manistee a real fishery before this model begins, but dependable winter-run fall entry is not expected yet.",
          tip:
            "Do not turn a tailwater Skamania encounter into an early winter-run signal. Return as the September monitoring window develops.",
        };
    case "beginning":
      return {
        headline:
          `The first winter-run ${input.species} are beginning to enter and move through the Big Manistee.`,
        whereToStart,
        detail:
          "Fresh fish can be scattered from the lower migratory river into middle-corridor resting water, while some earlier arrivals or summer-run fish may already be nearer Tippy.",
        tip:
          "Cover lakeward travel lanes and substantial resting holes before assuming the tailwater holds the freshest fish.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are broadly established through the Big Manistee migratory corridor.`,
          whereToStart,
          detail:
            "Multiple entry periods have given fish time to occupy the tailwater, middle corridor, and substantial lower-river water, although Wellston directly measures only the Tippy reach.",
          tip:
            "Compare at least two named reaches and use direct fish activity to choose where to slow down; use Wellston only for the regulated tailwater response.",
        };
      }
      return input.establishedBuildingContext
        ? {
          headline:
            `${input.species} are becoming dependably established across more of the Big Manistee.`,
          whereToStart,
          detail:
            "Earlier arrivals can be established from High Bridge toward Tippy while newer fish continue entering below Bear Creek and toward M-55. Concentrations and freshness can differ sharply by reach.",
          tip:
            "Compare middle-corridor holding water with one tailwater and one lower-river check instead of treating the entire system as one gauge reach.",
        }
        : {
          headline:
            `More ${input.species} are entering and spreading through the Big Manistee.`,
          whereToStart,
          detail:
            "Presence is building beyond isolated early fish, but the lakeward and middle migratory reaches remain the better places to evaluate fresh entry before committing to Tippy.",
          tip:
            "Follow travel water into the first substantial resting holes and remain mobile until direct activity provides a reason to settle into one reach.",
        };
    case "peak":
      return {
        headline:
          `This is typically the strongest and most dependable Big Manistee fall ${input.species} opportunity.`,
        whereToStart,
        detail:
          "Repeated entry periods have produced broad corridor presence, but fresh fish, established holders, water clarity, and access can still differ materially between Tippy, High Bridge, Bear Creek, and M-55 water.",
        tip:
          "Use Push to decide whether to emphasize lower travel lanes or established tailwater and middle-corridor holes, then verify the choice with direct fish activity.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} presence remains high as the Big Manistee shifts toward winter holding.`,
        whereToStart,
        detail:
          "Many fish remain in the corridor, but colder water increasingly favors established holding positions over continuous upstream travel. Fresh arrivals can still occur without defining the whole fishery.",
        tip:
          "Begin with efficient holding water and add lower-river travel lanes only when measured flow and temperature support a credible new movement period.",
      };
    case "ending":
      return {
        headline:
          `${input.species} remain strongly present as fall entry hands off to winter holding.`,
        whereToStart,
        detail:
          "The migration phase is ending, not the fishery. Retained fish increasingly favor deep water where they can hold near feeding current without spending excessive energy.",
        tip:
          "Prioritize depth, controlled speed, and nearby feeding lanes. Use Push only as a secondary fresh-arrival check as the winter read approaches.",
      };
    case "post_run":
      return {
        headline:
          `${input.species} are outside the Big Manistee fall-entry model.`,
        whereToStart,
        detail:
          "This profile no longer evaluates fall migration. Steelhead can remain throughout winter, but their activity requires a holding-focused seasonal read.",
        tip:
          "Use the active winter Steelhead experience instead of extending fall-entry guidance beyond its researched endpoint.",
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
  if (input.winterHoldingContext) {
    return "Deep, speed-controlled holding water below Croton, through the Croton-to-Newaygo corridor, and in substantial Newaygo-to-M-120 bends; compare lower-river wintering holes only when local conditions support them.";
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Muskegon Lake, the channel, and deep lower-river travel water below M-120 for new fall entrants; do not treat a fish already near Croton as proof of a broad new entry."
        : "Muskegon Lake, the Lake Michigan channel, and the river mouth for fall-entry context—not the inland corridor yet.";
    case "beginning":
      return "Deep lower-river travel water from Muskegon Lake toward M-120 first, then substantial Newaygo-to-M-120 resting water; check Croton only after those fresh-entry reaches.";
    case "building":
      if (input.broadBuildingContext) {
        return "Compare Croton-to-Newaygo holding water, Newaygo-to-M-120 bends, and lower-river travel lanes below M-120; use Push to decide whether lakeward water deserves extra time.";
      }
      return input.establishedBuildingContext
        ? "Newaygo-to-M-120 holding water first, then compare Croton-to-Newaygo pools with the deep lower river for accumulated versus newer fish."
        : "Lower-river travel water below M-120 into the first substantial Newaygo-area resting holes.";
    case "peak":
      return "Compare the Croton tailwater, Croton-to-Newaygo pools, Newaygo-to-M-120 bends, and substantial lower-river holes toward Muskegon Lake.";
    case "tapering":
      return "Established Croton-to-Newaygo and Newaygo-to-M-120 holding water, especially deep bends and controlled-speed edges; add lower travel lanes only on credible fresh-entry evidence.";
    case "ending":
      return "Deep, speed-controlled holding water below Croton, around Newaygo, and in substantial M-120-area bends with nearby feeding current.";
    case "post_run":
      return "No active fall-entry starting reach; use the winter Steelhead read for current holding-water guidance instead.";
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
  if (input.winterHoldingContext) {
    return {
      headline:
        `${input.species} have transitioned from fall entry into winter holding below Croton Dam.`,
      whereToStart,
      detail:
        "The fish have not left the river. Colder water shifts the useful question from entry toward daily activity, feeding position, and efficient holding water across the long corridor.",
      tip:
        "Use the winter Steelhead read to see how active the fish may be. Fish staying in the river does not mean new fish are moving in.",
    };
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} fall entry is approaching the Muskegon River.`,
          whereToStart,
          detail:
            "New entrants are most honestly evaluated from Muskegon Lake through the lower river. An isolated fish farther upstream does not establish a corridor-wide fall build.",
          tip:
            "One fish is just one fish. Wait for the season and river conditions to point to a wider run.",
        }
        : {
          headline: `${input.species} fall entry has not started yet.`,
          whereToStart,
          detail:
            "Dependable fall entry is not expected through the Muskegon Lake-to-Croton corridor yet.",
          tip:
            "Check again when fish begin staging near the lake and river mouth.",
        };
    case "beginning":
      return {
        headline:
          `The first fall ${input.species} are entering the Muskegon's long migratory corridor.`,
        whereToStart,
        detail:
          "New fish can be scattered from the lower river into middle-corridor resting water while earlier arrivals may already be nearer Croton.",
        tip:
          "Check lower-river travel lanes and good resting holes before assuming the newest fish are up by Croton.",
      };
    case "building":
      return {
        headline: input.broadBuildingContext
          ? `${input.species} are broadly established below Croton Dam.`
          : `${input.species} are becoming established through more of the Muskegon River.`,
        whereToStart,
        detail: input.broadBuildingContext
          ? "Multiple entry periods can place fish in upper, middle, and lower reaches, although Croton directly measures only the tailwater."
          : "Earlier arrivals can hold nearer Croton while newer fish continue entering below M-120; freshness and concentrations can differ sharply by reach.",
        tip:
          "Check at least two sections of river, then stay where you find the best signs of fish.",
      };
    case "peak":
      return {
        headline:
          `This is typically the strongest Muskegon fall ${input.species} entry opportunity.`,
        whereToStart,
        detail:
          "Repeated entry periods support broad corridor presence, but fresh fish, established holders, clarity, and access still differ from Croton to Muskegon Lake.",
        tip:
          "Use Push to choose between lower travel water and upper holding water, then make sure the water you find matches the read.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} remain well established as fall entry slows.`,
        whereToStart,
        detail:
          "Many fish remain, but colder water increasingly favors efficient holding positions over continuous upstream travel.",
        tip:
          "Start in slower holding water. Check lower travel lanes when the river shows signs that new fish may be moving.",
      };
    case "ending":
      return {
        headline:
          `${input.species} remain in the Muskegon as fall entry hands off to winter holding.`,
        whereToStart,
        detail:
          "The migration phase is ending, not the fishery. Retained fish increasingly use deep water beside efficient feeding current.",
        tip:
          "Look for deep water, softer current, and an easy feeding lane nearby.",
      };
    case "post_run":
      return {
        headline: `${input.species} are outside the Muskegon fall-entry model.`,
        whereToStart,
        detail:
          "This profile no longer evaluates fall migration; winter activity requires a holding-focused seasonal read.",
        tip:
          "The fall-entry read is finished. Use the winter Steelhead read instead.",
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
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.fallEntry) return betsieHomesteadFallEntryStageCopy(input);
  const legalHomesteadApproach =
    "legal Homestead-approach holding water, always outside the signed dam closure";
  const limited = input.opportunity.strength === "limited";
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be staging in Betsie Lake and near the river mouth.`,
          whereToStart:
            "Betsie Lake, the river mouth, and one deliberate check of the first deep travel-and-resting water after the lake-to-river transition.",
          detail:
            `An occasional early ${input.species} can enter the short river corridor and may even reach Homestead, but that is still an exception—not evidence of dependable river numbers.`,
          tip:
            "Keep most effort near the lake-to-river transition. Do not build the trip around Homestead or assume the downstream holes have filled in yet.",
        }
        : {
          headline:
            `${input.species} have not started entering the Betsie yet.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            `Dependable ${input.species} presence is not expected in the short river corridor below Homestead this early.`,
          tip:
            "Keep the trip in lake and harbor water until the seasonal staging window begins.",
        };
    case "beginning":
      return {
        headline:
          `The first ${input.species} are beginning to enter the Betsie's below-Homestead corridor.`,
        whereToStart:
          "Begin at the lake-to-river transition, then cover the first substantial travel-and-resting holes toward Homestead—not the structure itself.",
        detail:
          `Fresh fish may be scattered anywhere in this short corridor. A rare early fish can already reach Homestead, but dependable concentrations near the dam are unlikely this early.`,
        tip:
          "Cover deep holes from downstream toward Homestead. Treat one early fish as an exception and remain outside the signed 300-foot closure.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are becoming established throughout the below-Homestead corridor.`,
          whereToStart:
            `Substantial corridor holes from the lakeward end through ${legalHomesteadApproach}.`,
          detail:
            `The Betsie's migratory ${input.species} water is short, so fish can occupy the full corridor quickly. Homestead is the upstream limit; the deepest legal water below it remains the dependable plan.`,
          tip:
            "Work the substantial holes below Homestead section by section. Do not translate PM-scale section distances onto this short corridor.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline: limited
            ? `${input.species} are becoming more established in select below-Homestead water.`
            : `${input.species} are becoming dependably established below Homestead.`,
          whereToStart: limited
            ? `Select substantial corridor holes, including ${legalHomesteadApproach}.`
            : `Substantial corridor holes from the lakeward end through ${legalHomesteadApproach}.`,
          detail: input.species === "Chinook salmon"
            ? "By late August, fish reaching the Homestead end of the short corridor is realistic. Newer arrivals can remain closer to Betsie Lake while earlier fish collect in legal holding water downstream of the structure."
            : "By late September, Coho reaching the Homestead end of the short corridor is realistic. Newer arrivals can remain closer to Betsie Lake while earlier fish occupy select legal holding water downstream of the structure.",
          tip: limited
            ? "Begin with select deep downstream holes, stay mobile until direct fish activity gives you a reason to slow down, and remain outside the signed 300-foot closure."
            : "Begin with the deepest downstream holes, then work toward Homestead without entering the signed 300-foot closure.",
        };
      }
      return {
        headline:
          `More ${input.species} are entering the short corridor below Homestead.`,
        whereToStart:
          "Start with substantial holes nearest the lake-to-river transition, then work hole by hole toward the legal Homestead approach.",
        detail:
          "Presence is growing beyond isolated early fish, but concentrations can still be uneven from hole to hole.",
        tip:
          "Cover the deeper holes instead of waiting at one access. Homestead can hold early fish, but it should not yet be treated as the only dependable destination.",
      };
    case "peak":
      return {
        headline: limited
          ? `This is typically the strongest part of the Betsie's limited ${input.species} opportunity.`
          : `This is typically the strongest and most dependable Betsie River ${input.species} opportunity.`,
        whereToStart: limited
          ? `Select substantial corridor holes from the lakeward end through ${legalHomesteadApproach}.`
          : `Substantial corridor holes from the lakeward end through ${legalHomesteadApproach}.`,
        detail: limited
          ? "Seasonal timing supports Coho using several parts of the short below-Homestead corridor, but the overall run remains small and fish should not be expected in every good-looking hole."
          : "Multiple waves have had time to occupy the entire short corridor below Homestead, but concentrations are not equal in every piece of water.",
        tip: limited
          ? "Cover select substantial holes, require direct fish activity before committing time, stay outside the signed closure, and leave fish on shallow spawning gravel alone."
          : "Fish substantial holes from head to tail, stay outside the signed closure, and leave fish on shallow spawning gravel alone.",
      };
    case "tapering":
      return {
        headline: limited
          ? `The Betsie's limited ${input.species} opportunity can persist, although fresh arrivals are becoming less consistent.`
          : `The Betsie can remain productive for ${input.species}, although fresh arrivals are becoming less consistent.`,
        whereToStart: limited
          ? "Select proven corridor holes, especially slower edges near productive current and legal holding water short of Homestead."
          : "Proven corridor holes, especially slower edges near productive current and legal holding water short of Homestead.",
        detail: limited
          ? "A few fish may remain in select below-Homestead corridor water, but the limited opportunity is shifting from new arrivals toward fish already holding or spawning."
          : "Fish may remain distributed through the below-Homestead corridor, but the balance is shifting from new arrivals toward fish already holding or spawning.",
        tip:
          "Prioritize deep established water, remain outside the dam closure, and leave shallow spawning fish undisturbed.",
      };
    case "ending":
      return {
        headline: limited
          ? `A few ${input.species} may still provide a late opportunity below Homestead.`
          : `${input.species} can still provide a worthwhile late opportunity below Homestead.`,
        whereToStart:
          "The deepest proven corridor holes and slow current edges, including legal water short of Homestead.",
        detail:
          "Remaining fish have often been in the system for a while, and fresh silver arrivals are no longer dependable.",
        tip:
          "Skip fast travel water. Fish deep holes carefully and leave actively spawning or visibly deteriorated fish alone.",
      };
    case "post_run":
      return input.latePostRunContext
        ? {
          headline: `The main Betsie ${input.species} migration is over.`,
          whereToStart:
            "No dependable starting location; any remaining fish are likely isolated in deep established water.",
          detail:
            `A few fish may remain below Homestead, but the seasonal pattern no longer supports a dependable ${input.species} opportunity.`,
          tip:
            "Do not chase scattered holdovers between accesses. Shift to another seasonal species and leave spawning fish undisturbed.",
        }
        : {
          headline:
            `${input.species} are outside their Betsie River migration season.`,
          whereToStart:
            "No dependable Betsie River location for this species right now.",
          detail:
            `A dependable seasonal ${input.species} presence is not expected in the river corridor.`,
          tip:
            "Target a species with an active seasonal window and return as the next migration approaches.",
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
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.winterHoldingContext) {
    return {
      headline:
        `${input.species} have transitioned from fall entry into winter holding in the Betsie.`,
      whereToStart:
        "Deep, slow corridor holes with nearby current and an easy feeding lane, always outside the signed Homestead closure.",
      detail:
        "The fish have not simply left the river. The seasonal migration model has ended, while retained Steelhead can remain distributed through the below-Homestead corridor for winter.",
      tip:
        "Treat 61/100 as retained seasonal presence, not a live activity score. Verify current conditions directly, use controlled cold-water presentations, and follow the signed 100-foot Homestead closure.",
    };
  }

  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be gathering around Betsie Lake and beginning to enter the river.`,
          whereToStart:
            "Frankfort harbor, Betsie Lake, the river mouth, and one deliberate check of the first deep travel-and-resting water after the lake-to-river transition.",
          detail:
            "An occasional early fish is possible, but dependable fall presence has not developed throughout the corridor.",
          tip:
            "Keep most effort near the lake-to-river transition and treat an isolated fish as an exception—not proof that the system has filled in.",
        }
        : {
          headline: `${input.species} fall entry has not started yet.`,
          whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
          detail:
            "A dependable fall Steelhead presence is not expected in the Betsie River this early.",
          tip:
            "Do not build an inland-river trip around Steelhead yet. Return as the seasonal entry window approaches.",
        };
    case "beginning":
      return {
        headline:
          `The first ${input.species} are beginning to enter the Betsie's below-Homestead corridor.`,
        whereToStart:
          "Begin at the lake-to-river transition, then cover travel lanes feeding the first substantial corridor holes toward Homestead—not the structure itself.",
        detail:
          "Fresh fish may be scattered through the short corridor, from the lake transition to legal holding water downstream of Homestead.",
        tip:
          "Cover travel water and resting holes from downstream toward Homestead, always outside the signed 300-foot closure.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are broadly established through the accessible Betsie system.`,
          whereToStart:
            "Substantial corridor holes from the lakeward end through the legal Homestead approach, always outside the signed closure.",
          detail:
            "Multiple entry periods have given Steelhead time to occupy the full short migratory corridor between Betsie Lake and Homestead.",
          tip:
            "Cover deep holes, bends and current breaks rather than waiting at the structure. Stay outside the signed closure and use direct fish activity to choose a section.",
        };
      }
      if (input.establishedBuildingContext) {
        return {
          headline:
            `${input.species} are becoming established across more of the Betsie.`,
          whereToStart:
            "Substantial holes from the lakeward travel water through legal holding water short of the Homestead closure.",
          detail:
            "Earlier arrivals have had time to pass the structure while newer fish continue entering from Betsie Lake, so concentrations can differ sharply between holes.",
          tip:
            "Cover each substantial below-Homestead hole and let direct fish activity determine where to slow down.",
        };
      }
      return {
        headline:
          `More ${input.species} are entering and spreading through the Betsie.`,
        whereToStart:
          "Travel water nearest the lake-to-river transition where current feeds the first substantial holes and resting pockets.",
        detail:
          "Presence is growing beyond isolated early fish, although arrivals and concentrations can still be uneven from hole to hole.",
        tip:
          "Stay mobile through the short corridor and remain outside the signed 300-foot closure instead of waiting near the dam.",
      };
    case "peak":
      return {
        headline:
          `This is typically the strongest Betsie fall ${input.species} opportunity.`,
        whereToStart:
          "Substantial corridor holes from the lakeward end through the legal Homestead approach, always outside the signed closure.",
        detail:
          "Multiple entry periods have given Steelhead time to spread through the accessible system, while dependable concentrations can still form in deep corridor holes.",
        tip:
          "Cover each substantial hole from head through seams and tail, stay outside the signed closure, and let direct fish activity determine where to slow down.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} presence remains high as the Betsie shifts toward winter holding.`,
        whereToStart:
          "Proven corridor holes, especially slower edges beside productive current and legal holding water short of Homestead.",
        detail:
          "Steelhead remain broadly available, but the seasonal emphasis is shifting from new upstream entry toward fish already holding in the river.",
        tip:
          "Prioritize efficient holding water, verify conditions directly, and remain outside the signed Homestead closure.",
      };
    case "ending":
      return {
        headline:
          `${input.species} remain strongly present as fall entry hands off to winter holding.`,
        whereToStart:
          "Deep, slower corridor holes with nearby current, including legal water short of Homestead.",
        detail:
          "The migration phase is ending—not the in-river fishery. Many fall-entering Steelhead can remain in the Betsie through winter before spawning in spring.",
        tip:
          "Slow the presentation as water cools, verify current conditions directly, and follow the signed Homestead closure rather than treating the structure as a fishing target.",
      };
    case "post_run":
      return {
        headline: `${input.species} fall entry has not started yet.`,
        whereToStart: "Lake Michigan, Frankfort harbor, and Betsie Lake.",
        detail:
          "A dependable fall Steelhead presence is not expected in the Betsie River this early.",
        tip:
          "Do not build an inland-river trip around Steelhead yet. Return as the seasonal entry window approaches.",
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
            "Middle and upper river holding water, with lower travel lanes added when Push supports fresh arrivals.",
          detail:
            "By November, multiple entry periods have given steelhead time to spread through lower, middle, and upper sections wherever passage is open. The upper river is now a primary option, even though dependable concentrations can remain in lower and middle holding water.",
          tip:
            "Choose a middle- or upper-river section and cover its substantial holes, deep bends, and current breaks. Shift extra attention lower only when Push supports a fresh wave entering the river.",
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
            "Begin in dependable lower- or middle-river holding water and work deep holes, outside bends, and current breaks. Move into upper sections when direct fish activity or local knowledge supports it, and use Push to decide whether lower travel lanes deserve extra attention.",
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
          "Choose an accessible section and cover each substantial hole from the head through its seams and tail. Let Push decide whether lower travel lanes deserve extra time.",
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
          "Start with dependable holding water. Check lower travel lanes only when Push shows a credible movement signal.",
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
          "Prioritize deep, speed-controlled holding water and use Push only as a secondary fresh-arrival check. The winter fishery read takes over after this stage.",
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
  if (input.winterHoldingContext) {
    return "Deep, speed-controlled legal holding water from the lower Michigan corridor through Niles and into Indiana below Twin Branch, always outside posted dam and fish-ladder restrictions.";
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "The St. Joseph harbor and river mouth, plus one deliberate lower-Michigan travel-water check; Skamania may already be inland, but that is separate from the winter-run build."
        : "Lake Michigan off St. Joseph, the harbor, and the river mouth for new-entry context; do not infer an inland fall build yet.";
    case "beginning":
      return "Lower Michigan travel and holding water toward Berrien Springs, while recognizing that summer-run Skamania may already be distributed farther upstream through open passage.";
    case "building":
      return input.broadBuildingContext
        ? "Compare legal holding water in the lower Michigan corridor, the Niles reach, and South Bend-Mishawaka below Twin Branch; stay outside every posted ladder and dam boundary."
        : input.establishedBuildingContext
        ? "Begin with the Niles reach and substantial lower-Michigan holding water, then compare legal Indiana reaches for accumulated fish."
        : "Lower Michigan travel water through the first substantial Berrien Springs and Buchanan-area holding reaches, outside all dam and ladder restrictions.";
    case "peak":
      return "Compare substantial legal holding water below Berrien Springs, through Buchanan and Niles, and in South Bend-Mishawaka below Twin Branch; use the Niles gauge only for the Niles reach.";
    case "tapering":
      return "Established deep holding water from the Michigan corridor through legal Indiana water below Twin Branch; add lower travel lanes only when Niles Push supports fresh movement.";
    case "ending":
      return "Deep, speed-controlled holding water with adjacent feeding current below Twin Branch, outside the 100-foot Indiana ladder restrictions and all posted dam boundaries.";
    case "post_run":
      return "No active fall-entry starting reach; use a dedicated winter Steelhead read when available rather than extending this fall model.";
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
  if (input.winterHoldingContext) {
    return {
      ...base,
      headline:
        `${input.species} remain broadly present as St. Joseph fall entry hands off to winter holding.`,
      whereToStart,
      detail:
        "The fish have not left the 63-mile accessible corridor. Colder water changes the useful question from new entry to holding position; Activity describes likely responsiveness at Niles, not river-wide movement.",
      tip,
    };
  }
  if (input.stage === "pre_run") {
    return {
      ...base,
      headline: input.stagingContext
        ? "Summer-run Skamania can already be present, while the later winter-run Steelhead build is still ahead."
        : "The modeled St. Joseph fall-entry build has not started, although summer-run Skamania are a separate possibility.",
      whereToStart,
      detail:
        "This fall read separates summer-run Steelhead already in the St. Joseph system from the later winter-run component that normally begins building in fall.",
      tip,
    };
  }
  return {
    ...base,
    whereToStart,
    detail:
      `${base.detail} Five passage facilities allow distribution from the lower river through South Bend and Mishawaka, but Twin Branch is the hard upstream limit and Niles measurements are reach-specific.`,
    tip,
  };
}

function stJosephFallEntryTip(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
}): string {
  if (input.winterHoldingContext) {
    return "Choose one deep, speed-controlled Michigan or Indiana holding reach, verify its water directly, and treat Activity as a Niles response read—not proof that Steelhead are feeding everywhere.";
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? "Separate summer-run Skamania from the later winter-run build. Check direct local reports before going inland, and do not use one Skamania as proof of a new fall wave."
        : "Keep new-entry effort around Lake Michigan, the St. Joseph harbor, and the mouth. Use direct local evidence—not this inactive fall calendar—if targeting Skamania already inland.";
    case "beginning":
      return "Cover lower-Michigan travel lanes and their first deep resting water before moving toward Niles. Treat inland Skamania separately from evidence of a new winter-run wave.";
    case "building":
      return input.broadBuildingContext
        ? "Compare one legal Michigan holding section with South Bend or Mishawaka, then let direct fish activity decide where to stay; remain outside every posted ladder and dam boundary."
        : "Begin in substantial lower-Michigan or Niles holding water, then compare legal Indiana water only after a clean search; use Push to decide whether lower travel lanes deserve extra time.";
    case "peak":
      return "Choose a substantial legal holding section below Berrien Springs, near Buchanan or Niles, or in South Bend-Mishawaka and cover it completely before changing reaches.";
    case "tapering":
      return "Start in deep established holding water and slow the presentation as temperature falls. Add lower travel lanes only when Niles Push supports fresh movement.";
    case "ending":
      return "Prioritize deep, speed-controlled holding water below Twin Branch and use Activity for responsiveness. Do not interpret a muted Push as fish leaving the river.";
    case "post_run":
      return "Use an active winter Steelhead read when available. Do not extend this fall-entry calendar into a winter or spring recommendation.";
  }
}

export function stageForDate(localDate: string, window: DateWindow): RunStage {
  if (compareLocalDates(localDate, window.preRunStartDate) < 0) {
    return "post_run";
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
          "Start with dependable lower- or middle-river holding water, then cover established upper holes, outside bends, and current breaks. Use Push to decide whether fresh lower-river travel lanes deserve extra time.",
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
      ? "Begin in the river's most dependable established holding water and cover each deep hole, outside bend, and current break carefully. If Push is Possible or stronger, finish with one deliberate lower-river travel-lane check."
      : "Begin in a dependable middle-river section, then work through its deep holes, outside bends, and current breaks. If Push is Possible or stronger, finish with a deliberate lower-river travel-lane check.",
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
    ? "Begin with established middle- and upper-river holding water, especially deep holes and slower edges. If Push is Possible or stronger, finish with lower travel lanes for a fresh late wave."
    : opportunity.distributionScope === "sectional"
    ? "Begin in the river's established holding sections, especially deep holes and slower edges. If Push is Possible or stronger, finish with lower travel lanes for a fresh late wave."
    : "Begin in the river's most dependable deep holes and slower holding edges. If Push is Possible or stronger, finish with one lower travel-lane check for a fresh late arrival.";
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
