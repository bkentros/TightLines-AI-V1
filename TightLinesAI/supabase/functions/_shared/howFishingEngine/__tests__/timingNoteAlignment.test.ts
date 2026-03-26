import { assert, assertEquals } from "jsr:@std/assert@1";
import {
  notePoolKeyForDaypartFlags,
  synthesizeDaypartNoteForPeriods,
} from "../timing/timingNotes.ts";

Deno.test("timing: morning-only flags map to dawn/morning pools not warmest_window", () => {
  assertEquals(notePoolKeyForDaypartFlags([false, true, false, false]), "fallback_dawn_morning");
});

Deno.test("timing: synthesized morning-only note does not push afternoon warmth copy", () => {
  const note = synthesizeDaypartNoteForPeriods([false, true, false, false]);
  assert(
    !/\bafternoon warmth\b|\bwarmest part of the afternoon\b|\bpeak warmth\b/i.test(note),
    `unexpected warm-afternoon phrasing: ${note}`,
  );
});

Deno.test("timing: afternoon-only still uses warmth-oriented pool", () => {
  assertEquals(notePoolKeyForDaypartFlags([false, false, true, false]), "warmest_window");
});

Deno.test("timing: morning+evening (0101) uses shoulder pool not midday stretch", () => {
  assertEquals(notePoolKeyForDaypartFlags([false, true, false, true]), "fallback_morning_evening");
});
