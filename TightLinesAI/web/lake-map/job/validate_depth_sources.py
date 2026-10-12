#!/usr/bin/env python3
"""Compare native NODD sigma-depth temperatures with THREDDS fixed-z output.

This is a validation tool only.  It never connects to R2 and never publishes.
Both sources are independently projected onto the production temperature grid
and evaluated inside the same reviewed shoreline/depth mask.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build import C_TO_F, iso  # noqa: E402
from lakemap import depth as depth_math, ofs  # noqa: E402
from lakemap.config import EXTEND_CELLS, GEO_PATH, OFS_MODELS, TEMP, TEMP_DEPTHS_FT  # noqa: E402
from lakemap.regrid import Regridder, target_mask, water_mask  # noqa: E402

HOURS = (0, 24, 72, 120)
THRESHOLDS = {"maeF": 1.0, "p95AbsoluteDifferenceF": 2.0, "absoluteBiasF": 0.5}


def parse_cycle(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    parsed = parsed.astimezone(timezone.utc)
    if parsed.minute or parsed.second or parsed.microsecond or parsed.hour not in (0, 6, 12, 18):
        raise ValueError(f"invalid NOAA cycle {value!r}")
    return parsed


def regridder(model: ofs.LakeModel, water, targets):
    return Regridder(
        model.lon,
        model.lat,
        TEMP,
        targets,
        radius=0.3,
        max_edge=4 * max(model.spacing, 0.005),
    )


def expected_grid(model: ofs.LakeModel, rg: Regridder, water, depth_m):
    native = depth_math.expected_cells(model.depth_m, depth_m)
    return np.isfinite(rg.apply(np.where(native, 1.0, np.nan).astype(np.float32))) & water


def comparison_png(thredds, nodd, difference, context) -> bytes:
    finite = np.isfinite(thredds) | np.isfinite(nodd)
    if finite.any():
        ys, xs = np.nonzero(finite)
        pad = 8
        y0, y1 = max(0, int(ys.min()) - pad), min(finite.shape[0], int(ys.max()) + pad + 1)
        x0, x1 = max(0, int(xs.min()) - pad), min(finite.shape[1], int(xs.max()) + pad + 1)
    else:
        y0, y1, x0, x1 = 0, finite.shape[0], 0, finite.shape[1]

    def colors(values, low, high, diverging=False):
        data = values[y0:y1, x0:x1]
        ok = np.isfinite(data)
        unit = np.nan_to_num(np.clip((data - low) / (high - low), 0, 1), nan=0.0)
        rgb = np.full((*data.shape, 3), 238, np.uint8)
        if diverging:
            rgb[..., 0] = np.where(unit < 0.5, unit * 2 * 255, 255).astype(np.uint8)
            rgb[..., 1] = (255 - np.abs(unit - 0.5) * 2 * 255).astype(np.uint8)
            rgb[..., 2] = np.where(unit > 0.5, (1 - unit) * 2 * 255, 255).astype(np.uint8)
        else:
            rgb[..., 0] = (40 + unit * 215).astype(np.uint8)
            rgb[..., 1] = (80 + (1 - np.abs(unit - 0.5) * 2) * 150).astype(np.uint8)
            rgb[..., 2] = (240 - unit * 210).astype(np.uint8)
        rgb[~ok] = (245, 245, 245)
        image = Image.fromarray(rgb, "RGB")
        scale = min(1.0, 520 / max(image.width, 1), 620 / max(image.height, 1))
        return image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.BILINEAR)

    both = np.concatenate([thredds[np.isfinite(thredds)], nodd[np.isfinite(nodd)]])
    lo, hi = (32.0, 75.0) if not both.size else tuple(np.nanpercentile(both, [1, 99]))
    if hi - lo < 2:
        lo, hi = lo - 1, hi + 1
    max_diff = max(2.0, float(np.nanpercentile(np.abs(difference), 99)) if np.isfinite(difference).any() else 2.0)
    panels = [colors(thredds, lo, hi), colors(nodd, lo, hi), colors(difference, -max_diff, max_diff, True)]
    header = 42
    canvas = Image.new("RGB", (sum(p.width for p in panels), max(p.height for p in panels) + header), "white")
    draw = ImageDraw.Draw(canvas)
    x = 0
    for title, panel in zip(("THREDDS °F", "NODD °F", "NODD − THREDDS °F"), panels):
        canvas.paste(panel, (x, header))
        draw.text((x + 6, 5), title, fill="black")
        x += panel.width
    draw.text((6, 23), context, fill="black")
    out = io.BytesIO()
    canvas.save(out, "PNG", optimize=True)
    return out.getvalue()


def validate(cycles, out_dir: Path):
    water = water_mask(TEMP, GEO_PATH)
    targets = target_mask(water, EXTEND_CELLS)
    depths_ft = tuple(TEMP_DEPTHS_FT)
    depths_m = depth_math.feet_to_m(depths_ft)
    accum = {
        (model["id"], depth): {"differences": [], "maskMatches": 0, "maskCells": 0, "candidate": None}
        for model in OFS_MODELS for depth in depths_ft
    }
    for model in OFS_MODELS:
        for cycle in cycles:
            thredds = ofs.LakeModel(model, cycle, distribution="thredds")
            nodd = ofs.LakeModel(model, cycle, distribution="nodd")
            thredds_rg, nodd_rg = regridder(thredds, water, targets), regridder(nodd, water, targets)
            thredds_expected = [expected_grid(thredds, thredds_rg, water, z) for z in depths_m]
            nodd_expected = [expected_grid(nodd, nodd_rg, water, z) for z in depths_m]
            for hour in HOURS:
                print(f"{model['id']} {iso(cycle)} f{hour:03d}", flush=True)
                thredds_values, _ = thredds.depth_temperatures_c(hour, depths_ft)
                nodd_values, _ = nodd.depth_temperatures_c(hour, depths_ft)
                for index, depth_ft in enumerate(depths_ft):
                    thredds_grid = thredds_rg.apply(C_TO_F(thredds_values[index]))
                    nodd_grid = nodd_rg.apply(C_TO_F(nodd_values[index]))
                    domain = thredds_expected[index] | nodd_expected[index]
                    thredds_mask = np.isfinite(thredds_grid)
                    nodd_mask = np.isfinite(nodd_grid)
                    both = domain & thredds_mask & nodd_mask
                    difference = np.where(both, nodd_grid - thredds_grid, np.nan)
                    state = accum[(model["id"], depth_ft)]
                    state["differences"].append(difference[both].astype(np.float32))
                    state["maskMatches"] += int(((thredds_mask == nodd_mask) & domain).sum())
                    state["maskCells"] += int(domain.sum())
                    frame_p95 = float(np.nanpercentile(np.abs(difference), 95)) if both.any() else float("inf")
                    if state["candidate"] is None or frame_p95 > state["candidate"][0]:
                        context = f"{model['id']} {depth_ft} ft · {iso(cycle)} · f{hour:03d} · frame p95 {frame_p95:.2f}°F"
                        state["candidate"] = (frame_p95, comparison_png(thredds_grid, nodd_grid, difference, context))

    results = []
    maps = out_dir / "comparison-maps"
    for model in OFS_MODELS:
        for depth_ft in depths_ft:
            state = accum[(model["id"], depth_ft)]
            differences = np.concatenate(state["differences"])
            absolute = np.abs(differences)
            mae = float(np.mean(absolute))
            p95 = float(np.percentile(absolute, 95))
            bias = float(np.mean(differences))
            mask_agreement = 100 * state["maskMatches"] / state["maskCells"]
            passed = mae <= THRESHOLDS["maeF"] and p95 <= THRESHOLDS["p95AbsoluteDifferenceF"] and abs(bias) <= THRESHOLDS["absoluteBiasF"]
            row = {
                "model": model["id"], "lakes": ",".join(model["lakes"]), "depthFt": depth_ft,
                "meanAbsoluteDifferenceF": round(mae, 4), "p95AbsoluteDifferenceF": round(p95, 4),
                "meanBiasF": round(bias, 4), "maskAgreementPercent": round(mask_agreement, 4),
                "comparedCells": int(differences.size), "pass": passed,
            }
            results.append(row)
            if not passed:
                maps.mkdir(parents=True, exist_ok=True)
                (maps / f"{model['id'].lower()}-{depth_ft:03d}ft.png").write_bytes(state["candidate"][1])
    report = {
        "generatedAt": iso(datetime.now(timezone.utc)),
        "cycles": [iso(cycle) for cycle in cycles], "hours": list(HOURS), "depthsFt": list(depths_ft),
        "thresholds": THRESHOLDS, "overallPass": all(row["pass"] for row in results), "results": results,
    }
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "depth-source-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    with (out_dir / "depth-source-validation.csv").open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=results[0].keys(), lineterminator="\n")
        writer.writeheader()
        writer.writerows(results)
    return report


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--cycles", required=True, help="comma-separated UTC cycles; at least two")
    parser.add_argument("--out", required=True)
    args = parser.parse_args(argv)
    try:
        cycles = tuple(parse_cycle(value) for value in args.cycles.split(",") if value.strip())
    except ValueError as err:
        parser.error(str(err))
    if len(cycles) < 2 or len(set(cycles)) != len(cycles):
        parser.error("at least two distinct cycles are required")
    report = validate(cycles, Path(args.out))
    for row in report["results"]:
        print(json.dumps(row, separators=(",", ":")))
    print(f"OVERALL {'PASS' if report['overallPass'] else 'FAIL'}")
    return 0 if report["overallPass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
