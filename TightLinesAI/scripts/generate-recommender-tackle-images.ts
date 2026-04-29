/**
 * Batch-generate recommender tackle PNGs via OpenAI Images API (`gpt-image-2` by default).
 *
 * Prompt wording lives in `scripts/data/recommenderTackleImageManifest.ts` (FinFindr paper
 * vibe: accurate tackle, not clip art, not hyper-scientific plates).
 *
 * Transparency: `gpt-image-2` does **not** support API `background: "transparent"`.
 * This script asks for a flat solid “paper” backdrop (see `CHROMA_KEY_HEX`), then you run
 * `scripts/strip-recommender-tackle-backgrounds.sh` (rembg) for true RGBA — see
 * `scripts/RECOMMENDER_TACKLE_IMAGES.md`.
 *
 * Full reset (backup + delete existing PNGs + regenerate all 68), from TightLinesAI/:
 *   npm run gen:recommender-tackle-images:replace
 *   (loads OPENAI_API_KEY from .env via --env-file; or export OPENAI_API_KEY manually.)
 *
 * Options:
 *   --dry-run
 *   --skip-existing
 *   --replace-catalog      Backup lures/ + flies/ PNGs, delete them, then generate (requires full `all` run, no `--id`)
 *   --kind=lures|flies|all
 *   --id=<archetype_id>
 *   --limit=<n>
 *   --model=<id>         default gpt-image-2
 *   --quality=low|medium|high|auto
 *   --size=1024x1024
 *   --delay-ms=1200
 *   --background=opaque|transparent|auto   (transparent disallowed for gpt-image-2)
 */

import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import type { ArchetypeProfileV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  BACKGROUND_BLOCK,
  COMPOSITION_BLOCK,
  NEGATIVE_BLOCK,
  SHARED_STYLE_BLOCK,
  getTacklePromptEntry,
} from "./data/recommenderTackleImageManifest.ts";

type Kind = "lure" | "fly";

function buildPrompt(profile: ArchetypeProfileV4, kind: Kind): string {
  const entry = getTacklePromptEntry(profile.id);
  if (!entry || entry.kind !== kind) {
    throw new Error(
      `Missing manifest entry for ${kind} id=${profile.id}. Update scripts/data/recommenderTackleImageManifest.ts`,
    );
  }
  const lureOrFly = kind === "lure" ? "lure" : "fly";
  return [
    `Create one app-ready illustration of: ${profile.display_name} (real ${lureOrFly} anglers use).`,
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
}

function outUrl(kind: Kind, id: string): URL {
  const folder = kind === "lure" ? "lures" : "flies";
  return new URL(`../assets/images/${folder}/${id}.png`, import.meta.url);
}

function assetsSubdir(sub: "lures" | "flies"): URL {
  return new URL(`../assets/images/${sub}/`, import.meta.url);
}

type Cli = {
  dryRun: boolean;
  skipExisting: boolean;
  replaceCatalog: boolean;
  kind: "all" | "lures" | "flies";
  id: string | null;
  limit: number | null;
  model: string;
  quality: string;
  size: string;
  delayMs: number;
  background: "opaque" | "transparent" | "auto" | null;
};

function parseArgs(argv: string[]): Cli {
  const get = (prefix: string): string | null => {
    const hit = argv.find((a) => a.startsWith(prefix));
    if (!hit) return null;
    return hit.slice(prefix.length);
  };
  const dryRun = argv.includes("--dry-run");
  const skipExisting = argv.includes("--skip-existing");
  const replaceCatalog = argv.includes("--replace-catalog");
  const kindRaw = get("--kind=");
  const kind =
    kindRaw === "lures" || kindRaw === "flies" ? kindRaw : "all";
  const id = get("--id=");
  const limitStr = get("--limit=");
  const limit = limitStr != null && limitStr !== "" ? Number(limitStr) : null;
  const bgRaw = get("--background=");
  const background =
    bgRaw === "opaque" || bgRaw === "transparent" || bgRaw === "auto"
      ? bgRaw
      : null;
  return {
    dryRun,
    skipExisting,
    replaceCatalog,
    kind,
    id,
    limit: limit != null && Number.isFinite(limit) ? limit : null,
    model: get("--model=") ?? "gpt-image-2",
    quality: get("--quality=") ?? "high",
    size: get("--size=") ?? "1024x1024",
    delayMs: Math.max(0, Number(get("--delay-ms=") ?? "1200") || 1200),
    background,
  };
}

type GenResponse = {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: { message?: string; type?: string; code?: string };
};

async function generateImage(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Uint8Array> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as GenResponse;
  if (!res.ok) {
    const msg = json.error?.message ?? res.statusText;
    let hint = "";
    if (/billing|hard limit|quota|insufficient/i.test(msg)) {
      hint =
        " Billing/credits: https://platform.openai.com/settings/organization/billing";
    } else if (/must be verified|verify organization/i.test(msg)) {
      hint =
        " Organization verification: https://platform.openai.com/settings/organization/general";
    }
    throw new Error(`OpenAI images/generations ${res.status}: ${msg}${hint}`);
  }
  const first = json.data?.[0];
  if (!first) throw new Error("OpenAI response missing data[0]");
  if (first.b64_json) {
    return Uint8Array.from(atob(first.b64_json), (c) => c.charCodeAt(0));
  }
  if (first.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) throw new Error(`Failed to download image URL: ${imgRes.status}`);
    return new Uint8Array(await imgRes.arrayBuffer());
  }
  throw new Error("OpenAI response had neither b64_json nor url");
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

function backupStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

async function backupAndClearPngFolders(args: {
  dryRun: boolean;
  backupRoot: URL;
}): Promise<void> {
  const { dryRun, backupRoot } = args;
  for (const name of ["lures", "flies"] as const) {
    const src = assetsSubdir(name);
    const dest = new URL(`${name}/`, backupRoot.href);
    try {
      await Deno.mkdir(src, { recursive: true });
    } catch {
      /* exists */
    }
    const files: string[] = [];
    for await (const e of Deno.readDir(src)) {
      if (e.isFile && e.name.endsWith(".png")) files.push(e.name);
    }
    if (files.length === 0) continue;
    if (dryRun) {
      console.log(`[dry-run] Would backup ${files.length} file(s) from ${name}/ to ${dest.pathname}`);
      continue;
    }
    await Deno.mkdir(dest, { recursive: true });
    for (const fn of files) {
      await Deno.copyFile(new URL(fn, src.href), new URL(fn, dest.href));
    }
    console.log(`Backed up ${files.length} ${name} PNG(s) → ${dest.pathname}`);
    for (const fn of files) {
      await Deno.remove(new URL(fn, src.href));
    }
    console.log(`Removed original ${name} PNG(s) from assets folder.`);
  }
}

async function main(): Promise<void> {
  const cli = parseArgs(Deno.args);
  const apiKeyRaw = Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!cli.dryRun && !apiKeyRaw) {
    console.error("Missing OPENAI_API_KEY (optional for --dry-run only).");
    Deno.exit(1);
  }
  const apiKey = apiKeyRaw as string;

  if (cli.background === "transparent" && cli.model === "gpt-image-2") {
    console.error(
      "gpt-image-2 does not support transparent backgrounds in the API. Omit --background (opaque), then run scripts/strip-recommender-tackle-backgrounds.sh — see RECOMMENDER_TACKLE_IMAGES.md.",
    );
    Deno.exit(1);
  }

  if (cli.replaceCatalog && (cli.id != null || cli.kind !== "all")) {
    console.error("--replace-catalog applies only to a full catalog run (default --kind=all, no --id).");
    Deno.exit(1);
  }

  type Job = { kind: Kind; profile: ArchetypeProfileV4 };
  const jobs: Job[] = [];

  if (cli.kind !== "flies") {
    for (const p of LURE_ARCHETYPES_V4) {
      jobs.push({ kind: "lure", profile: p });
    }
  }
  if (cli.kind !== "lures") {
    for (const p of FLY_ARCHETYPES_V4) {
      jobs.push({ kind: "fly", profile: p });
    }
  }

  for (const { kind, profile } of jobs) {
    try {
      buildPrompt(profile, kind);
    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
      Deno.exit(1);
    }
  }

  const filtered = jobs.filter((j) => (cli.id ? j.profile.id === cli.id : true));
  if (filtered.length === 0) {
    console.error(cli.id ? `No archetype matched id=${cli.id}` : "No jobs.");
    Deno.exit(1);
  }

  if (cli.replaceCatalog) {
    const backupRoot = new URL(
      `../assets/images/_backups/tackle-${backupStamp()}/`,
      import.meta.url,
    );
    console.log(`\n→ --replace-catalog: backup + remove existing PNGs first`);
    await backupAndClearPngFolders({ dryRun: cli.dryRun, backupRoot });
  }

  let effectiveBg = cli.background;
  if (effectiveBg == null && cli.model === "gpt-image-2") {
    effectiveBg = "opaque";
  }

  console.log(
    `\n→ model: ${cli.model}` +
      (effectiveBg ? `, background: ${effectiveBg}` : ""),
  );
  console.log(
    "→ After generation: run strip-recommender-tackle-backgrounds.sh for RGBA (gpt-image-2 cannot output true transparency).",
  );

  let done = 0;
  for (const { kind, profile } of filtered) {
    if (cli.limit != null && done >= cli.limit) break;

    const dest = outUrl(kind, profile.id);
    if (cli.skipExisting && !cli.replaceCatalog) {
      try {
        await Deno.stat(dest);
        console.log(`SKIP (exists): ${profile.id} → ${dest.pathname}`);
        continue;
      } catch {
        // not exists
      }
    }

    const prompt = buildPrompt(profile, kind);
    console.log(`\n── ${kind.toUpperCase()} ${profile.id} ──`);
    console.log(prompt.slice(0, 220) + (prompt.length > 220 ? "…" : ""));

    if (cli.dryRun) {
      console.log(`[dry-run] would write: ${dest.pathname}`);
      done++;
      continue;
    }

    const body: Record<string, unknown> = {
      model: cli.model,
      prompt,
      n: 1,
      size: cli.size,
      quality: cli.quality,
    };
    if (effectiveBg != null) {
      body.background = effectiveBg;
    }

    let bytes: Uint8Array;
    let attempt = 0;
    for (;;) {
      try {
        bytes = await generateImage(apiKey, body);
        break;
      } catch (e) {
        attempt++;
        const msg = e instanceof Error ? e.message : String(e);
        const retryable = /429|503|502|timeout/i.test(msg) && attempt < 5;
        if (!retryable) throw e;
        const backoff = Math.min(30_000, 2000 * 2 ** attempt);
        console.warn(`Retry ${attempt} after error: ${msg} (sleep ${backoff}ms)`);
        await sleep(backoff);
      }
    }

    await Deno.writeFile(dest, bytes!);
    console.log(`Wrote ${dest.pathname} (${bytes!.byteLength} bytes)`);
    done++;
    if (cli.delayMs > 0 && done < filtered.length) await sleep(cli.delayMs);
  }

  console.log(`\nDone. ${done} image(s) processed.`);
  console.log("Next: scripts/strip-recommender-tackle-backgrounds.sh (transparent PNGs).");
}

await main();
