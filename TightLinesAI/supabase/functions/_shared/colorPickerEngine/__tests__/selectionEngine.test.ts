import { PICKER_CHOICES } from "../pickerChoices.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { createColorPickerEngine, ColorPickerError, secureRandomInt, type DrawInput } from "../selectionEngine.ts";
import { compileResearchMatrix, RESEARCH_VERSION } from "../researchMatrix.ts";
import { RESEARCH_PROFILES } from "../researchProfiles.ts";

const pools = compileResearchMatrix().pools;
const input: DrawInput = { userId: "angler-a", requestId: "tap-a", reportId: "report-a", generatedAt: "2026-09-05T12:00:00.000Z", typeId: "stick_worm", clarity: "dirty", lights: ["sunny", "cloudy"] };
const next = (n: number, extra: Partial<DrawInput> = {}): DrawInput => ({ ...input, requestId: `tap-${n}`, reportId: `report-${n}`, generatedAt: `2026-09-05T12:${String(n).padStart(2, "0")}:00.000Z`, ...extra });
const errorCode = (code: string) => (e: unknown) => e instanceof ColorPickerError && e.code === code;

test("all 336 cells draw two distinct eligible colors with accurate identity and no ranking", () => {
  const engine = createColorPickerEngine(() => 0);
  for (const cell of pools) {
    const result = engine.draw({ ...input, typeId: cell.typeId, clarity: cell.clarity, lights: [cell.light] });
    const group = result.groups[0];
    assert.equal(group.choices.length, 2);
    assert.equal(new Set(group.choices.map(c => c.patternId)).size, 2);
    assert.equal(group.canRotate, false);
    for (const choice of group.choices) {
      assert(cell.patternIds.includes(choice.patternId));
      assert(choice.explanation.length > 20 && choice.explanation.length < 180);
      assert(choice.swatches.length > 0);
      assert(!("score" in choice) && !("rank" in choice));
      assert.equal(choice.imageId, `${cell.typeId}__${choice.patternId}`);
    }
  }
});

test("exhaustive equal-probability random paths give uniform unweighted combinations", () => {
  const cell = pools.find(c => c.patternIds.length === 4)!;
  const counts = new Map<string, number>();
  function visit(path: number[]) {
    let cursor = 0;
    const engine = createColorPickerEngine(max => {
      if (cursor === path.length) throw { branch: max };
      return path[cursor++];
    });
    try {
      const draw = engine.draw({ ...input, typeId: cell.typeId, clarity: cell.clarity, lights: [cell.light] });
      const key = [...draw.report.groups[0].patternIds].sort().join("/");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    } catch (e) {
      if (e && typeof e === "object" && "branch" in e) for (let i = 0; i < Number(e.branch); i++) visit([...path, i]);
      else throw e;
    }
  }
  visit([]);
  assert.equal(counts.size, 6);
  assert.equal(new Set(counts.values()).size, 1);
});

test("daily draws ignore past colors", () => {
  const engine = createColorPickerEngine(() => 0);
  const first = engine.draw(input).report;
  assert.deepEqual(engine.draw(next(1), { history: [first] }), engine.draw(next(1)));
});

test("unrelated or stale history cannot influence a draw", () => {
  const engine = createColorPickerEngine(() => 0);
  const old = engine.draw({ ...input, lights: ["sunny"] }).report;
  const target = next(1, { lights: ["cloudy"] });
  assert.deepEqual(engine.draw(target, { history: [old] }), engine.draw(target));
  for (const change of [{ userId: "other" }, { typeId: "finesse_worm" }, { clarity: "clear" as const }, { catalogVersion: "old" }]) {
    assert.deepEqual(engine.draw(next(1), { history: [{ ...old, ...change }] }), engine.draw(next(1)));
  }
});

test("identical light pools are sampled once and presented as shared guidance", () => {
  const engine = createColorPickerEngine(() => 0);
  const first = engine.draw({ ...input, typeId: "hollow_frog" });
  assert(first.groups.every(g => !g.canRotate && g.poolSize === 3));
  assert.equal(first.sharedAcrossLight, true);
  assert.deepEqual(first.report.groups[0].patternIds, first.report.groups[1].patternIds);
  assert.deepEqual(first.groups[0].choices, first.groups[1].choices);
  const second = engine.draw(next(1, { typeId: "hollow_frog" }), { history: [first.report] });
  assert.deepEqual(new Set(first.report.groups[0].patternIds), new Set(second.report.groups[0].patternIds));
});

test("replay and persisted retries preserve IDs and order without randomness", () => {
  const first = createColorPickerEngine(() => 0).draw(input);
  const neverRandom = createColorPickerEngine(() => { throw new Error("Replay rerolled"); });
  assert.deepEqual(neverRandom.replay(JSON.parse(JSON.stringify(first.report)), input.userId), first);
  assert.deepEqual(neverRandom.draw({ ...next(1), requestId: input.requestId }, { retryReport: first.report }), first);
  assert.deepEqual(neverRandom.draw(input, { history: [first.report] }), first);
  assert.throws(() => neverRandom.draw({ ...input, clarity: "clear" }, { retryReport: first.report }), errorCode("REQUEST_CONFLICT"));
  assert.throws(() => neverRandom.replay(first.report, "other"), errorCode("INVALID_REPORT"));
});

test("invalid inputs, random sources and modified saved reports fail closed", () => {
  const engine = createColorPickerEngine(() => 0);
  for (const patch of [{ typeId: "saltwater" }, { clarity: "muddy" }, { lights: [] }, { lights: ["sunny", "sunny"] }, { lights: ["night"] }, { userId: " " }, { generatedAt: "yesterday" }]) {
    assert.throws(() => engine.draw({ ...input, ...patch }), errorCode("INVALID_INPUT"));
  }
  for (const value of [-1, NaN, 0.5, Infinity, 1000]) assert.throws(() => createColorPickerEngine(() => value).draw(input), errorCode("INVALID_RANDOM"));
  const report = engine.draw(input).report;
  assert.throws(() => engine.replay({ ...report, catalogVersion: "old" }, input.userId), errorCode("VERSION_MISMATCH"));
  const altered = structuredClone(report); altered.groups[0].patternIds[0] = "hard_firetiger";
  assert.throws(() => engine.replay(altered, input.userId), errorCode("INVALID_REPORT"));
  const dup = structuredClone(report); dup.groups[0].patternIds[0] = dup.groups[0].patternIds[1];
  assert.throws(() => engine.replay(dup, input.userId), errorCode("INVALID_REPORT"));
});

test("caller mutations cannot change replayed results or catalog snapshot", () => {
  const engine = createColorPickerEngine(() => 0);
  const first = engine.draw(input); const saved = structuredClone(first.report);
  first.groups[0].choices[0].name = "invented";
  first.report.groups[0].patternIds[0] = "invented";
  const replay = engine.replay(saved, input.userId);
  assert.notEqual(replay.groups[0].choices[0].name, "invented");
  assert.equal(replay.report.catalogVersion, RESEARCH_VERSION);
});

test("broken catalog has no cross-bait fallback", () => {
  const profile = RESEARCH_PROFILES[0]; const original = profile.cells.clear_sunny;
  try {
    profile.cells.clear_sunny = [];
    assert.throws(() => createColorPickerEngine(), errorCode("INVALID_CATALOG"));
  } finally { profile.cells.clear_sunny = original; }
});

test("default secure random source respects bounds", () => {
  for (const max of [1, 3, 11, 0x100000000]) for (let i = 0; i < 20; i++) {
    const n = secureRandomInt(max); assert(Number.isInteger(n) && n >= 0 && n < max);
  }
});

test("history length and duplicate rows do not affect new draws", () => {
  const engine = createColorPickerEngine(() => 0);
  const history = Array.from({ length: 11 }, (_, n) => engine.draw(next(n, { lights: ["cloudy"] })).report);
  const target = next(12, { lights: ["cloudy"] });
  const recent = history.slice(1);
  assert.deepEqual(engine.draw(target, { history }), engine.draw(target, { history: recent }));
  assert.deepEqual(engine.draw(target, { history: [...history, ...history] }), engine.draw(target, { history }));
});

test("all 23 broad picker choices draw correctly in all 138 clarity/light cells", () => {
  assert.equal(PICKER_CHOICES.length, 23);
  const engine = createColorPickerEngine(() => 0);
  for (const type of PICKER_CHOICES) {
    for (const clarity of ["clear", "stained", "dirty"] as const) {
      for (const light of ["sunny", "cloudy"] as const) {
        const pool = pools.find(p => p.typeId === type.poolTypeId && p.clarity === clarity && p.light === light)!;
        assert(pool, `${type.id}/${clarity}/${light}`);
        const draw = engine.draw({ ...input, typeId: type.id, clarity, lights: [light] });
        assert.equal(draw.report.typeId, type.id);
        assert.equal(new Set(draw.groups[0].choices.map(c => c.patternId)).size, 2);
        for (const choice of draw.groups[0].choices) {
          assert(pool.patternIds.includes(choice.patternId));
          assert.equal(choice.imageId, `${type.id}__${choice.patternId}`);
        }
      }
    }
  }
});

test("approved familiarity exclusions apply to broad choices and all legacy aliases", async () => {
  const { FAMILIARITY_EXCLUSIONS } = await import("../familiarityReview.ts");
  for (const choice of PICKER_CHOICES) {
    const excluded = FAMILIARITY_EXCLUSIONS[choice.id] ?? [];
    for (const cell of pools.filter(p => p.typeId === choice.poolTypeId || (choice.legacyTypeIds as readonly string[]).includes(p.typeId))) {
      assert(!cell.patternIds.some(id => excluded.includes(id)), `${cell.typeId}/${cell.clarity}/${cell.light}`);
    }
  }
  for (const typeId of ["casting_spoon", "weedless_spoon", "trolling_spoon", "jigging_spoon"]) {
    for (const cell of pools.filter(p => p.typeId === typeId && p.clarity === "dirty")) {
      assert.deepEqual(new Set(cell.patternIds), new Set(["metal_firetiger", "metal_gold", "metal_red_white", "metal_five_diamonds"]));
    }
  }
  for (const [typeId, id] of [["stick_worm", "plastic_black"], ["paddle_tail_swimbait", "plastic_black"], ["curly_tail_grub", "plastic_black"], ["curly_tail_grub", "plastic_junebug"], ["fly_popper", "popper_blue"], ["hard_jerkbait", "hard_firetiger"], ["hard_swimbait", "hard_firetiger"], ["baitfish_streamer", "fly_black_purple"]]) {
    assert(pools.some(p => p.typeId === typeId && p.patternIds.includes(id)), `Keep ${typeId}/${id}`);
  }
});

test("two-choice curated pools still draw two unique colors with either order", () => {
  for (const cell of pools.filter(p => p.patternIds.length === 2)) {
    const args = { ...input, typeId: cell.typeId, clarity: cell.clarity, lights: [cell.light] };
    const first = createColorPickerEngine(() => 0).draw(args);
    const second = createColorPickerEngine(max => max - 1).draw(args);
    assert.deepEqual(new Set(first.report.groups[0].patternIds), new Set(cell.patternIds));
    assert.deepEqual(first.report.groups[0].patternIds, [...second.report.groups[0].patternIds].reverse());
  }
});


test("all live reports stay within each reviewed light pool", () => {
  for (const bait of PICKER_CHOICES) for (const clarity of ["clear", "stained", "dirty"] as const) {
    const source = ["sunny", "cloudy"].map(light => pools.find(p => p.typeId === bait.poolTypeId && p.clarity === clarity && p.light === light)!);
    for (const random of [() => 0, (max: number) => max - 1]) {
      const result = createColorPickerEngine(random).draw({ ...input, typeId: bait.id, clarity });
      result.report.groups.forEach((g, i) => assert(g.patternIds.every(id => source[i].patternIds.includes(id))));
      const samePool = source[0].patternIds.length === source[1].patternIds.length &&
        source[0].patternIds.every(id => source[1].patternIds.includes(id));
      assert.equal(result.sharedAcrossLight, samePool);
      if (samePool) {
        assert.deepEqual(result.report.groups[0].patternIds, result.report.groups[1].patternIds);
        assert.deepEqual(result.groups[0].choices, result.groups[1].choices);
      }
    }
  }
});

test("overlapping light pools retain equal marginal probability", () => {
  const included = [new Map<string, number>(), new Map<string, number>()];
  let outcomes = 0;
  function visit(path: number[]) {
    let cursor = 0;
    try {
      const result = createColorPickerEngine(max => {
        if (cursor === path.length) throw { branch: max };
        return path[cursor++];
      }).draw({ ...input, typeId: "soft_craw", clarity: "clear" });
      outcomes++;
      result.report.groups.forEach((group, index) => group.patternIds.forEach(id => included[index].set(id, (included[index].get(id) ?? 0) + 1)));
    } catch (e) {
      if (e && typeof e === "object" && "branch" in e) for (let i = 0; i < Number(e.branch); i++) visit([...path, i]);
      else throw e;
    }
  }
  visit([]);
  assert(outcomes > 1);
  assert.deepEqual(new Set(included[0].values()).size, 1);
  assert.deepEqual(new Set(included[1].values()).size, 1);
});

test("verified additions deepen common baits without broadening unrelated pools", () => {
  for (const cell of pools.filter(p => p.typeId === "stick_worm")) {
    assert(cell.patternIds.length >= 8);
    assert(cell.patternIds.includes("plastic_blue_black"));
    assert.equal(cell.patternIds.includes("plastic_gp_chart_tail"), cell.clarity !== "clear");
    assert.equal(cell.patternIds.includes("plastic_gp_watermelon"), cell.clarity !== "dirty");
  }
  for (const cell of pools.filter(p => p.typeId === "paddle_tail_swimbait")) {
    assert(cell.patternIds.length >= 5);
    assert(cell.patternIds.includes("plastic_black_blue"));
    if (cell.clarity !== "clear") assert(cell.patternIds.includes("plastic_junebug") && cell.patternIds.includes("plastic_chart_white"));
  }
  for (const cell of pools.filter(p => p.typeId === "underspin" && p.clarity === "dirty")) {
    assert.equal(cell.patternIds.length, 4);
    assert(cell.patternIds.includes("underspin_black_blue") && cell.patternIds.includes("underspin_junebug"));
  }
  assert(pools.filter(p => p.typeId === "soft_jerkbait" && p.clarity !== "clear").every(p => p.patternIds.includes("plastic_junebug")));
  assert(pools.filter(p => p.typeId === "walking_bait" && p.clarity === "stained").every(p => p.patternIds.includes("hard_clown")));
  assert(pools.filter(p => p.typeId === "walking_bait" && p.clarity === "dirty").every(p => !p.patternIds.includes("hard_clown")));
  assert(!pools.some(p => p.typeId === "soft_craw" && p.patternIds.includes("plastic_gp_chart_tail")));
});
