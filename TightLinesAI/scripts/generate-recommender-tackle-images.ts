/**
 * Batch-generate recommender tackle PNGs via OpenAI Images API (GPT Image family).
 *
 * Sources of truth for *which* items to render:
 *   `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
 *   `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
 *
 * ── One terminal paste (replace the key only; works from any directory) ───────
 *
 *   OPENAI_API_KEY='sk-…YOUR_KEY…' deno run -A "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/generate-recommender-tackle-images.ts"
 *
 * Default model is `gpt-image-2` (GPT Image 2, API changelog April 2026). OpenAI may require
 * [organization verification](https://platform.openai.com/settings/organization/general) for it;
 * if you get 403, verify there (wait up to ~15 min) or temporarily use e.g. `--model=gpt-image-1.5`.
 *
 * The field-guide image prompt is built inside this file (per archetype); you do not paste it separately.
 *
 * Options:
 *   --dry-run              Print prompts + paths only
 *   --skip-existing        Skip if output PNG already exists
 *   --kind=lures|flies|all (default: all)
 *   --id=<archetype_id>    Only this id (e.g. weightless_stick_worm)
 *   --limit=<n>            Stop after n generations (after filters)
 *   --model=<id>           Default: gpt-image-2
 *   --quality=low|medium|high|auto
 *   --size=1024x1024       Square recommended for app tiles
 *   --delay-ms=1200        Pause between successful API calls
 *   --background=opaque|transparent|auto   Passed to Images API when set. OpenAI documents
 *     that `gpt-image-2` does not support `transparent`; use `gpt-image-1.5` for PNG alpha.
 *
 * Regenerate one fly with API transparency (example — use full path, not an ellipsis):
 *   OPENAI_API_KEY='sk-…' deno run -A "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/generate-recommender-tackle-images.ts" \\
 *     --kind=flies --id=unweighted_baitfish_streamer --model=gpt-image-1.5 --background=transparent
 *
 * Leech trio (dedicated tiles; each writes assets/images/flies/<id>.png):
 *   …same deno prefix… --kind=flies --id=jighead_marabou_leech --model=gpt-image-1.5 --background=transparent
 *   …same deno prefix… --kind=flies --id=lead_eye_leech --model=gpt-image-1.5 --background=transparent
 *   …same deno prefix… --kind=flies --id=feather_jig_leech --model=gpt-image-1.5 --background=transparent
 *
 * Model note: `gpt-image-2` still benefits from transparency wording in the prompt, but true
 * alpha needs `background: "transparent"` on a model that supports it (e.g. `gpt-image-1.5`).
 */

import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import type { ArchetypeProfileV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

// ── Prompt template (placeholders filled per item) ─────────────────────────

const PROMPT_TEMPLATE = `Create a modern field-guide specimen illustration of {DISPLAY_NAME}, an accurate real fishing {LURE_OR_FLY}. The style should be semi-realistic, tactile, and app-ready: crisp side-profile silhouette, subtle inked outline, soft natural shading, muted outdoor colors, and realistic tackle materials. It should feel like a premium illustrated plate from a vintage fishing field guide, adapted for a modern mobile app.

Centered single object, transparent background, no text, no scene, no hands, no packaging, no water, no rod. The object should fill about 82% of the square canvas and be fully visible. Accuracy matters: {SUBJECT_LINE}.

Avoid photorealistic ecommerce photography, cartoon clip art, childish mascot styling, fantasy lure designs, glossy ad lighting, heavy shadows, extra objects, labels, logos, and over-saturated colors.`;

type Kind = "lure" | "fly";

function humanizeSnake(s: string): string {
  return s.replace(/_/g, " ");
}

function subjectLine(profile: ArchetypeProfileV4, kind: Kind): string {
  const fam = humanizeSnake(profile.family_group);
  const col = profile.column;
  const forage = profile.forage_tags.map(humanizeSnake).join(", ");
  const base =
    `Depict a standard, recognizable ${kind} anglers actually buy and fish: correct proportions, hardware where typical (hooks, line tie, blades, lips, skirts, trailers, fibers, dumbbell eyes, cone/bead, etc. as appropriate). ` +
    `Category: ${fam}. Primary water column: ${col}. Forage cues the pattern imitates: ${forage}.`;
  return base;
}

function buildPrompt(profile: ArchetypeProfileV4, kind: Kind): string {
  const lureOrFly = kind === "lure" ? "lure" : "fly";
  return PROMPT_TEMPLATE
    .replaceAll("{DISPLAY_NAME}", profile.display_name)
    .replaceAll("{LURE_OR_FLY}", lureOrFly)
    .replaceAll("{SUBJECT_LINE}", subjectLine(profile, kind));
}

function outUrl(kind: Kind, id: string): URL {
  const folder = kind === "lure" ? "lures" : "flies";
  return new URL(`../assets/images/${folder}/${id}.png`, import.meta.url);
}

type Cli = {
  dryRun: boolean;
  skipExisting: boolean;
  kind: "all" | "lures" | "flies";
  id: string | null;
  limit: number | null;
  model: string;
  quality: string;
  size: string;
  delayMs: number;
  /** When set, sent as `background` on images/generations (opaque | transparent | auto). */
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
        " This is your OpenAI account billing/cap (not this script). In https://platform.openai.com/settings/organization/billing raise or remove the monthly hard limit, add a payment method, or buy credits, then retry.";
    } else if (/must be verified|verify organization/i.test(msg)) {
      hint =
        " GPT Image 2 (`gpt-image-2`) requires a verified API organization. Complete verification at https://platform.openai.com/settings/organization/general — or rerun with `--model=gpt-image-1.5` (older GPT Image) if your org already has access.";
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

async function main(): Promise<void> {
  const cli = parseArgs(Deno.args);
  const apiKeyRaw = Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!cli.dryRun && !apiKeyRaw) {
    console.error("Missing OPENAI_API_KEY in environment (not required for --dry-run).");
    Deno.exit(1);
  }
  /** Set when not in dry-run (validated above). */
  const apiKey = apiKeyRaw as string;

  if (cli.background === "transparent" && cli.model === "gpt-image-2") {
    console.error(
      "OpenAI does not support background: transparent with gpt-image-2. " +
        "Re-run with e.g. --model=gpt-image-1.5 --background=transparent",
    );
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

  const filtered = jobs.filter((j) => (cli.id ? j.profile.id === cli.id : true));
  if (filtered.length === 0) {
    console.error(cli.id ? `No archetype matched id=${cli.id}` : "No jobs.");
    Deno.exit(1);
  }

  console.log(
    `\n→ images/generations model: ${cli.model}` +
      (cli.model === "gpt-image-2" ? " (GPT Image 2)" : "") +
      (cli.background ? `, background: ${cli.background}` : ""),
  );

  let done = 0;
  for (const { kind, profile } of filtered) {
    if (cli.limit != null && done >= cli.limit) break;

    const dest = outUrl(kind, profile.id);
    if (cli.skipExisting) {
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
    console.log(prompt.slice(0, 200) + (prompt.length > 200 ? "…" : ""));

    if (cli.dryRun) {
      console.log(`[dry-run] would write: ${dest.pathname}`);
      done++;
      continue;
    }

    // GPT Image models (gpt-image-2, etc.) always return base64 in `b64_json`;
    // do not send `response_format` — it is only for dall-e-2/3 and triggers 400.
    const body: Record<string, unknown> = {
      model: cli.model,
      prompt,
      n: 1,
      size: cli.size,
      quality: cli.quality,
    };
    if (cli.background != null) {
      body.background = cli.background;
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
  console.log(
    "If you added new archetype PNGs, ensure `lib/lureImages.ts` / `lib/flyImages.ts` include `require()` entries for those ids.",
  );
}

await main();
