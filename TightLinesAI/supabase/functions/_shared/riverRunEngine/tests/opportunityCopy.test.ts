import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type PrimitiveDisplay,
  resolveInterpretationNote,
  resolveRunOpportunityStrength,
  resolveRunStage,
  type RiverRunProfile,
  scoreFishInRiver,
  validateRunProfile,
} from "../index.ts";

const strongRun = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const moderateRun = opportunityRun(6, "sectional");
const limitedRun = opportunityRun(3, "concentrated");

Deno.test("presence maximum deterministically selects all three copy strengths", () => {
  assertEquals(resolveRunOpportunityStrength(1), "limited");
  assertEquals(resolveRunOpportunityStrength(3), "limited");
  assertEquals(resolveRunOpportunityStrength(4), "moderate");
  assertEquals(resolveRunOpportunityStrength(7), "moderate");
  assertEquals(resolveRunOpportunityStrength(8), "strong");
  assertEquals(resolveRunOpportunityStrength(10), "strong");
});

Deno.test("PM Chinook strong and broad Migration Stage copy remains stable", () => {
  const building = resolveRunStage(strongRun, "2026-09-05");
  const peak = resolveRunStage(strongRun, "2026-09-20");
  const tapering = resolveRunStage(strongRun, "2026-10-01");

  assertEquals(
    building.headline,
    "Chinook salmon are spreading across much more of the river.",
  );
  assertEquals(
    peak.detail,
    "Multiple waves have had time to spread, so Chinook salmon are likely distributed throughout the accessible river—from lower travel water through upstream holding and spawning reaches, except above dams or other barriers.",
  );
  assertEquals(
    tapering.detail,
    "Good numbers of Chinook salmon may still be spread through the river. At this point in the seasonal pattern, the balance often shifts from new arrivals toward fish already holding or spawning.",
  );
});

Deno.test("moderate and limited Migration Stage copy is complete for every state", () => {
  const dates = [
    "2026-08-01",
    "2026-08-15",
    "2026-08-25",
    "2026-09-05",
    "2026-09-20",
    "2026-10-01",
    "2026-10-22",
    "2026-10-28",
    "2026-11-11",
  ];
  for (const run of [moderateRun, limitedRun]) {
    for (const localDate of dates) {
      const display = resolveRunStage(run, localDate);
      assertComplete(display);
      const whereToStart = display.whereToStart;
      assert(whereToStart);
      assert(whereToStart.trim().length > 0);
      assertEquals(/\brun\b/i.test(whereToStart), false);
    }
  }

  const moderatePeak = resolveRunStage(moderateRun, "2026-09-20");
  assertMatch(moderatePeak.detail, /several dependable river sections/);
  assertEquals(
    /throughout the accessible river/i.test(text(moderatePeak)),
    false,
  );

  const limitedPeak = resolveRunStage(limitedRun, "2026-09-20");
  assertMatch(
    limitedPeak.headline,
    /overall seasonal presence remains limited/,
  );
  assertMatch(limitedPeak.detail, /smaller number of Coho salmon/i);
  assertMatch(limitedPeak.detail, /most dependable holding and spawning areas/);

  const limitedTaper = resolveRunStage(limitedRun, "2026-10-01");
  assertMatch(limitedTaper.headline, /limited Coho salmon opportunity/);
  assertMatch(limitedTaper.detail, /smaller number of Coho salmon/);
  assertEquals(/Good numbers/i.test(text(limitedTaper)), false);
});

Deno.test("moderate and limited Fish In River copy covers every seasonal state", () => {
  const dates = [
    "2026-08-10",
    "2026-08-15",
    "2026-08-25",
    "2026-09-05",
    "2026-09-14",
    "2026-09-20",
    "2026-09-24",
    "2026-10-02",
    "2026-10-15",
    "2026-10-23",
    "2026-11-03",
    "2026-11-08",
  ];
  for (const run of [moderateRun, limitedRun]) {
    for (const localDate of dates) {
      assertComplete(scoreFishInRiver(run, localDate));
    }
  }

  const moderatePeak = scoreFishInRiver(moderateRun, "2026-09-20");
  assertEquals(moderatePeak.score, 60);
  assertMatch(moderatePeak.headline, /their highest seasonal presence/);
  assertMatch(moderatePeak.detail, /several dependable river sections/);
  assertEquals(
    /river-wide|throughout the accessible river/i.test(text(moderatePeak)),
    false,
  );

  const limitedPeak = scoreFishInRiver(limitedRun, "2026-09-20");
  assertEquals(limitedPeak.score, 30);
  assertMatch(limitedPeak.headline, /overall opportunity remains limited/);
  assertMatch(limitedPeak.detail, /seasonal opportunity remains limited/);
  assertEquals(
    /strong presence|substantial presence|river-wide/i.test(text(limitedPeak)),
    false,
  );

  const limitedFalling = scoreFishInRiver(limitedRun, "2026-10-02");
  assertMatch(limitedFalling.headline, /limited Coho salmon presence/);
  assertMatch(limitedFalling.headline, /dependable water/);
  assertEquals(
    /strong Coho salmon presence/i.test(text(limitedFalling)),
    false,
  );
});

Deno.test("High presence copy is explicitly relative to each river season", () => {
  const dates = [
    "2026-09-10",
    "2026-09-14",
    "2026-10-02",
    "2026-10-10",
  ];
  for (const run of [strongRun, moderateRun, limitedRun]) {
    const highReads = dates
      .map((localDate) => scoreFishInRiver(run, localDate))
      .filter((read) => read.label === "High presence");
    assert(highReads.length > 0);
    for (const read of highReads) {
      assertMatch(
        read.detail,
        /elevated relative to the rest of the season|approaching its strongest seasonal point/i,
      );
      assertEquals(
        /usually (?:brings|supports) high presence/i.test(read.detail),
        false,
      );
    }
  }
});

Deno.test("peak weak-Push interpretation scales its absolute abundance words", () => {
  const strong = peakWeakPushInterpretation(strongRun);
  const moderate = peakWeakPushInterpretation(moderateRun);
  const limited = peakWeakPushInterpretation(limitedRun);

  assert(strong?.detail.startsWith("Many fish may already be in the river"));
  assert(
    moderate?.detail.startsWith(
      "Fish may already be established in the river's dependable sections",
    ),
  );
  assert(
    limited?.detail.startsWith(
      "Some fish may already be established in the river's most dependable holding water",
    ),
  );
  assertEquals(/Many fish/i.test(moderate?.detail ?? ""), false);
  assertEquals(/Many fish/i.test(limited?.detail ?? ""), false);
});

Deno.test("distribution scope is required and validated independently", () => {
  const invalid = {
    ...moderateRun,
    historicalPresence: {
      ...moderateRun.historicalPresence,
      distributionScope: "everywhere",
    },
  } as unknown as RiverRunProfile;
  const result = validateRunProfile(invalid, PERE_MARQUETTE_RIVER_PROFILE);
  assert(
    result.issues.some((issue) =>
      issue.field === "historicalPresence.distributionScope" &&
      issue.code === "config_invalid_value"
    ),
  );
});

Deno.test("strength and distribution remain independent across all nine combinations", () => {
  const strengths = [
    [3, "limited"],
    [6, "moderate"],
    [10, "strong"],
  ] as const;
  const scopes = ["concentrated", "sectional", "broad"] as const;
  for (const [maximum, strength] of strengths) {
    for (const distributionScope of scopes) {
      const run = {
        ...strongRun,
        species: "coho_salmon" as const,
        historicalPresence: {
          ...strongRun.historicalPresence,
          maximum,
          distributionScope,
        },
      };
      const stage = resolveRunStage(run, "2026-09-20");
      const tapering = resolveRunStage(run, "2026-10-01");
      const falling = scoreFishInRiver(run, "2026-10-02");
      assertComplete(stage);
      assertComplete(tapering);
      assertComplete(falling);
      const combined = `${text(stage)} ${text(tapering)} ${text(falling)}`;
      if (strength === "strong") {
        assertMatch(combined, /Good numbers|strong Coho salmon presence/i);
      } else {
        assertEquals(
          /Good numbers|strong Coho salmon presence/i.test(combined),
          false,
        );
      }
      if (distributionScope !== "broad") {
        assertEquals(
          /throughout the accessible river|spread through the river|broad part|river-wide/i
            .test(combined),
          false,
        );
      }
      if (distributionScope === "concentrated") {
        assertMatch(combined, /dependable holding|dependable water/i);
      }
    }
  }
});

function opportunityRun(
  maximum: 3 | 6,
  distributionScope: "concentrated" | "sectional",
): RiverRunProfile {
  return {
    ...strongRun,
    runId: `copy_fixture_${maximum}`,
    displayName: maximum === 6 ? "Moderate Coho" : "Limited Coho",
    species: "coho_salmon",
    historicalPresence: {
      ...strongRun.historicalPresence,
      maximum,
      distributionScope,
    },
  };
}

function peakWeakPushInterpretation(run: RiverRunProfile) {
  return resolveInterpretationNote({
    runStage: "peak",
    conditionsSuggestLabel: "Typical",
    push: display(20, "Weak"),
    fishability: display(70, "Good"),
    fishInRiver: scoreFishInRiver(run, "2026-09-20"),
  });
}

function display(score: number, label: string): PrimitiveDisplay {
  return {
    score,
    label,
    headline: label,
    detail: label,
    tip: label,
    reasonCodes: [],
  };
}

function assertComplete(display: PrimitiveDisplay): void {
  assert(display.label.trim().length > 0);
  assert(display.headline.trim().length > 0);
  assert(display.detail.trim().length > 0);
  assert(display.tip.trim().length > 0);
}

function text(display: PrimitiveDisplay): string {
  return `${display.headline} ${display.detail} ${display.tip}`;
}
