/**
 * One-off: print full generator prompts for listed fly ids (stdout).
 * deno run -A scripts/emit-fly-prompts.ts
 */
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import {
  BACKGROUND_BLOCK,
  COMPOSITION_BLOCK,
  NEGATIVE_BLOCK,
  SHARED_STYLE_BLOCK,
  getTacklePromptEntry,
} from "./data/recommenderTackleImageManifest.ts";

const IDS = [
  "deceiver",
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "rabbit_strip_leech",
] as const;

for (const id of IDS) {
  const profile = FLY_ARCHETYPES_V4.find((p) => p.id === id);
  if (!profile) throw new Error(`missing fly ${id}`);
  const entry = getTacklePromptEntry(id);
  if (!entry || entry.kind !== "fly") throw new Error(`manifest fly ${id}`);

  const prompt = [
    `Create one app-ready illustration of: ${profile.display_name} (real fly anglers use).`,
    "",
    SHARED_STYLE_BLOCK,
    "",
    COMPOSITION_BLOCK,
    "",
    BACKGROUND_BLOCK,
    "",
    NEGATIVE_BLOCK,
    "",
    "Anatomy & construction (priority — must match this):",
    entry.anatomy,
    "",
    `Context (secondary only): fishing category ${profile.family_group.replace(/_/g, " ")}; water column ${profile.column}; imitates ${profile.forage_tags.join("/").replace(/_/g, " ")}.`,
  ].join("\n");

  console.log(`\n========== ${id} ==========\n`);
  console.log(prompt);
}
