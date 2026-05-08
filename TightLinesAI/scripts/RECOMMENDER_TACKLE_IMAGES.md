# Recommender tackle images (68 lures + flies)

## Where files land (easy to review)

Generation writes **opaque** (paper `#F0E8D4`) PNGs **in place** — same paths the app will use after you strip:

| Kind | Folder (under `TightLinesAI/`) |
|------|--------------------------------|
| Lures | `assets/images/lures/` — one file per archetype id, e.g. `spinnerbait.png` |
| Flies | `assets/images/flies/` — e.g. `clouser_minnow.png` |

Open those two folders in Finder, review every image, re-run singles with `--id=<archetype_id>` if needed, **then** run the strip step for transparency.

### Batched runs (e.g. 10 at a time)

Order is **all lures** (catalog order), then **all flies**. From `TightLinesAI/`:

| Batch | Command |
|-------|---------|
| 1–10 | `npm run gen:recommender-tackle-images -- --offset=0 --limit=10` |
| 11–20 | `npm run gen:recommender-tackle-images -- --offset=10 --limit=10` |
| 21–30 | `--offset=20 --limit=10` |
| 31–40 | `--offset=30 --limit=10` |
| 41–50 | `--offset=40 --limit=10` |
| 51–60 | `--offset=50 --limit=10` |
| 61–68 | `--offset=60 --limit=10` |

Preview a batch without calling the API: add `--dry-run`.

**Do not** use `--replace-catalog` with `--offset` or `--limit` (it would delete every PNG but only regenerate part of the list). Batches assume you already have assets or you only overwrite those slots.

**Optional:** To fill gaps without counting offsets, `--skip-existing` skips files that are already on disk and keeps going until `--limit` new images are written (handy if you regenerated a few ids by hand).

## What you asked for vs what the API can do

- **`gpt-image-2`** is the right default for quality, but it **does not support** `background: "transparent"` on `images/generations`. You get an opaque render.
- **App-ready transparency** is still achievable: generate on a **single flat paper color** (encoded in prompts as `#F0E8D4`, matching `paperLight` in `lib/theme.ts`), then run **`strip-recommender-tackle-backgrounds.sh`**, which uses **[rembg](https://github.com/danielgatis/rembg)** to produce **RGBA PNGs** without hand masking.

Alternative if you ever accept non–Image-2: `gpt-image-1.5` with `--background=transparent` can return alpha directly (script supports it), but you requested GPT Image 2.

## Prompt / theme wording

All copy is centralized in **`scripts/data/recommenderTackleImageManifest.ts`**:

- FinFindr **paper / ink** vibe: warm, premium, readable at small size.
- **Not** flat clip art, **not** overloaded scientific plates.
- **Anatomy-first** bullets per archetype so hardware stays believable.

Edit that file if you want to tune voice; the generator stitches shared blocks + anatomy + light engine context (`family_group`, column, forage).

Placeholder **1×1 transparent PNGs** may exist for newly added ids until you run a full generation (keeps Metro from failing on missing `require` targets).

## Replace the whole catalog (backup + delete old PNGs + regenerate)

From **`TightLinesAI/`**, with the key in **`.env`** (not committed; see `.gitignore`):

```bash
# .env
OPENAI_API_KEY=sk-...   # never EXPO_PUBLIC_* — that would ship the key in the app

npm run gen:recommender-tackle-images:replace
```

(`package.json` runs Deno with `--env-file=.env` so you do not need `export` in the shell.)

### `gpt-image-2` and organization verification (403)

If the API returns **403** — *your organization must be verified to use `gpt-image-2`*:

1. Complete **Verify organization**: https://platform.openai.com/settings/organization/general (after approval, access can take up to ~15 minutes).
2. **Or** use **`gpt-image-1.5`**:  
   `npm run gen:recommender-tackle-images -- --offset=0 --limit=10 --model=gpt-image-1.5`  
   Same paper background + strip flow. For native transparent PNGs from the API on 1.5 only, see `--background=transparent` in the script header.

**`npm run gen:recommender-tackle-images:replace`:**

1. Copies every existing `assets/images/lures/*.png` and `flies/*.png` into `assets/images/_backups/tackle-<timestamp>/`.
2. Deletes those PNGs from the asset folders.
3. Regenerates **all 37 + 31 = 68** files from the v4 catalogs.

When you’re happy with the opaque previews, strip backgrounds (requires `rembg`):

```bash
npm run postgen:recommender-tackle-alpha
# same as: bash scripts/strip-recommender-tackle-backgrounds.sh
```

## One-off / preview

```bash
deno run -A scripts/generate-recommender-tackle-images.ts --dry-run --limit=2
deno run -A scripts/generate-recommender-tackle-images.ts --kind=lures --id=spinnerbait
```

## Client maps

`lib/lureImages.ts` and `lib/flyImages.ts` must `require()` every archetype id. The repo includes all **68** keys so new PNGs resolve immediately after generation.

## npm

`package.json` exposes `gen:recommender-tackle-images` (same Deno entry). You can add a `post` strip step locally if you want a one-liner chain.
