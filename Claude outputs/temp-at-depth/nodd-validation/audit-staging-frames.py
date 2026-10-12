#!/usr/bin/env python3
"""Summarize local staging depth frames without contacting any remote service."""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

DOMAIN = {"west": -92.4, "north": 49.2}
RES = 0.01
DEPTHS = (10, 20, 30, 40, 50)
HOURS = (0, 24, 72, 120)
MODELS = {
    "LSOFS": (-92.0, -84.0, 46.2, 49.1),
    "LMHOFS": (-88.8, -79.5, 41.3, 46.5),
    "LEOFS": (-83.6, -78.7, 41.2, 43.0),
    "LOOFS": (-79.9, -75.8, 43.0, 44.5),
}


def decode(path):
    image = np.asarray(Image.open(path).convert("RGB"))
    raw = image[..., 0].astype(np.uint16) * 256 + image[..., 1].astype(np.uint16)
    return np.where(raw == 65535, np.nan, raw.astype(np.float32) / 20 + 30)


def window(box):
    west, east, south, north = box
    x0 = max(0, round((west - DOMAIN["west"]) / RES))
    x1 = round((east - DOMAIN["west"]) / RES) + 1
    y0 = max(0, round((DOMAIN["north"] - north) / RES))
    y1 = round((DOMAIN["north"] - south) / RES) + 1
    return np.s_[y0:y1, x0:x1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", required=True)
    parser.add_argument("--source", required=True, choices=("thredds", "nodd"))
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    run = Path(args.run_dir)
    rows = []
    for model, box in MODELS.items():
        values = {depth: [] for depth in DEPTHS}
        deltas = []
        for hour in HOURS:
            frames = {depth: decode(run / f"d{depth:03d}/temp/{hour:03d}.png")[window(box)] for depth in DEPTHS}
            common = np.logical_and.reduce([np.isfinite(frame) for frame in frames.values()])
            for depth, frame in frames.items():
                values[depth].append(frame[common])
            deltas.append((frames[50] - frames[10])[common])
        joined = {depth: np.concatenate(parts) for depth, parts in values.items()}
        delta = np.concatenate(deltas)
        rows.append({
            "model": model,
            "samples": int(delta.size),
            "minimumF": round(min(float(np.min(v)) for v in joined.values()), 2),
            "maximumF": round(max(float(np.max(v)) for v in joined.values()), 2),
            "medianByDepthF": {str(depth): round(float(np.median(joined[depth])), 2) for depth in DEPTHS},
            "median50Minus10F": round(float(np.median(delta)), 2),
            "percent50AtOrColderThan10": round(100 * float(np.mean(delta <= 0)), 2),
        })
    result = {
        "source": args.source,
        "hours": list(HOURS),
        "depthsFt": list(DEPTHS),
        "plausibleRangeF": [30, 90],
        "allPlausible": all(30 <= row["minimumF"] <= row["maximumF"] <= 90 for row in rows),
        "models": rows,
    }
    Path(args.out).write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, separators=(",", ":")))


if __name__ == "__main__":
    main()
