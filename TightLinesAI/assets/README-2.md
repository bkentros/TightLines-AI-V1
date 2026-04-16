# TightLines asset generation pack

This pack contains:
- `prompts.json`: the full 54-asset prompt inventory, now with app-facing filenames
- `generate_assets.py`: generator that saves lure PNGs into `assets/images/lures/` and fly PNGs into `assets/images/flies/`
- `create_batch_jsonl.py`: turns `prompts.json` into a Batch API JSONL file
- `download_batch_results.py`: downloads finished Batch API results and writes the PNG files
- `batch_input.jsonl`: prebuilt batch input based on the current asset list

## Current asset count
- Lures: 33
- Flies: 21
- Total: 54

## Your current app paths
Absolute app root:
- `/Users/brandonkentros/TightLines AI V1/TightLinesAI`

Expected image folders:
- `/Users/brandonkentros/TightLines AI V1/TightLinesAI/assets/images/lures/`
- `/Users/brandonkentros/TightLines AI V1/TightLinesAI/assets/images/flies/`

Repo-relative equivalents when running from the parent folder:
- `TightLinesAI/assets/images/lures/`
- `TightLinesAI/assets/images/flies/`

The generator defaults to that exact app root, so you can run it without passing output folders unless your repo is in a different location.

## Important filename behavior
The script now saves files using the basenames your app is expected to `require()`, not the old `lure_...` / `fly_...` naming. It also includes the known exception:
- `weightless_stick_worm` -> `texas_rigged_stick_worm.png`

If `lureImages.ts` or `flyImages.ts` has any other exceptions, add them to `FILENAME_OVERRIDES` in `generate_assets.py` before generating.

## Install deps
On macOS/Homebrew Python (PEP 668), use the pack venv under `scripts/asset_generation/`:

```bash
cd scripts/asset_generation
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade openai pillow python-dotenv
```

## Environment variable
`supabase secrets list` only shows digests; it cannot print `OPENAI_API_KEY`. Use the same key value you store in Supabase Edge Function secrets:

```bash
# Option A — gitignored file at repo root (loaded automatically by generate_assets.py)
echo 'OPENAI_API_KEY=sk-...' >> ../../.env.local

# Option B — shell for this session
export OPENAI_API_KEY="YOUR_API_KEY"
```

## Dry run first
This prints exactly where every file will go (from `scripts/asset_generation/` with venv active, or from `assets/` with the same flags):
```bash
python3 generate_assets.py --dry-run
```

## Generate all 54 and replace existing images
```bash
python3 generate_assets.py --overwrite
```

## Generate only a few specific assets
```bash
python3 generate_assets.py --only spinnerbait sculpzilla texas_rigged_stick_worm.png --overwrite
```

## If your repo path changes
```bash
python3 generate_assets.py --repo-root "/path/to/TightLinesAI" --overwrite
```

## Notes
- The scripts save each image as an individual transparent PNG in the existing app asset folders.
- The prompts are tuned to keep the spinnerbait-style theme while preserving lure/fly recognizability.
- The most niche flies have extra grounding in their subject descriptions, especially balanced leech, Sculpzilla, Game Changer, and dungeon-style streamer patterns.
