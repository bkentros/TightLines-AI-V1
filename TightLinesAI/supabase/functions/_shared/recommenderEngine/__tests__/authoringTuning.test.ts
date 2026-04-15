import { assertEquals } from "jsr:@std/assert";
import {
  allowedColumnsForSeasonalColumn,
  allowedPacesForMood,
  allowedPresenceForStyle,
  columnPreferenceOrderForSeasonalColumn,
  pacePreferenceOrderForMood,
  presencePreferenceOrderForStyle,
} from "../v3/seasonal/tuning.ts";

function assertSubset<T extends string>(
  label: string,
  inner: readonly T[],
  outer: readonly T[],
) {
  const allow = new Set(outer);
  for (const v of inner) {
    if (!allow.has(v)) {
      throw new Error(`${label}: '${v}' not in [${[...allow].join(", ")}]`);
    }
  }
}

Deno.test("Phase 2 pace allowed vs preference tables", () => {
  const cases: {
    mood: Parameters<typeof allowedPacesForMood>[0];
    allowed: string;
    pref: string;
  }[] = [
    { mood: "dormant", allowed: "slow", pref: "slow" },
    { mood: "negative", allowed: "slow,medium", pref: "slow,medium" },
    { mood: "neutral_subtle", allowed: "slow,medium", pref: "medium,slow" },
    { mood: "neutral", allowed: "slow,medium,fast", pref: "medium,slow,fast" },
    { mood: "active", allowed: "medium,fast", pref: "medium,fast" },
    { mood: "aggressive", allowed: "medium,fast", pref: "fast,medium" },
  ];
  for (const { mood, allowed, pref } of cases) {
    const a = allowedPacesForMood(mood).join(",");
    const p = pacePreferenceOrderForMood(mood).join(",");
    assertEquals(a, allowed);
    assertEquals(p, pref);
    assertSubset("pace pref ⊆ allowed", pacePreferenceOrderForMood(mood), allowedPacesForMood(mood));
  }
});

Deno.test("Phase 2 presence allowed vs preference tables", () => {
  const cases: {
    style: Parameters<typeof allowedPresenceForStyle>[0];
    allowed: string;
    pref: string;
  }[] = [
    { style: "subtle", allowed: "subtle", pref: "subtle" },
    { style: "leaning_subtle", allowed: "subtle,moderate", pref: "subtle,moderate" },
    {
      style: "balanced",
      allowed: "subtle,moderate,bold",
      pref: "moderate,subtle,bold",
    },
    { style: "leaning_bold", allowed: "moderate,bold", pref: "moderate,bold" },
    { style: "bold", allowed: "bold", pref: "bold" },
  ];
  for (const { style, allowed, pref } of cases) {
    const a = allowedPresenceForStyle(style).join(",");
    const p = presencePreferenceOrderForStyle(style).join(",");
    assertEquals(a, allowed);
    assertEquals(p, pref);
    assertSubset(
      "presence pref ⊆ allowed",
      presencePreferenceOrderForStyle(style),
      allowedPresenceForStyle(style),
    );
  }
});

Deno.test("Phase 2 column allowed sets and preference subsets", () => {
  const topSurf = allowedColumnsForSeasonalColumn("top", true);
  assertEquals(topSurf.join(","), "surface,upper,mid");
  assertSubset(
    "top surf pref",
    columnPreferenceOrderForSeasonalColumn("top", true),
    topSurf,
  );

  const midNo = allowedColumnsForSeasonalColumn("mid", false);
  assertEquals(midNo.join(","), "upper,mid,bottom");
  assertSubset(
    "mid no-surf pref",
    columnPreferenceOrderForSeasonalColumn("mid", false),
    midNo,
  );

  const low = allowedColumnsForSeasonalColumn("low", false);
  assertEquals(low.join(","), "bottom,mid");
  assertSubset(
    "low pref",
    columnPreferenceOrderForSeasonalColumn("low", true),
    low,
  );
});
