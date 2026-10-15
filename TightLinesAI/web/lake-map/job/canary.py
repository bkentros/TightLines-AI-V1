#!/usr/bin/env python3
"""Build and validate the newest complete lake-map cycle without any upload."""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import build
from lakemap import piercast
from lakemap.config import HOURS


def validate_artifacts(out: Path) -> dict:
    latest_path = out / "latest.json"
    if not latest_path.is_file():
        raise ValueError("dry run did not produce latest.json")
    latest = json.loads(latest_path.read_text())
    run_id = latest.get("run")
    if not isinstance(run_id, str) or latest.get("base") != f"runs/{run_id}/":
        raise ValueError("dry-run surface pointer schema is invalid")
    run = out / "runs" / run_id
    manifest = json.loads((run / "manifest.json").read_text())
    frames = manifest.get("frames")
    if manifest.get("run") != run_id or not isinstance(frames, list) or len(frames) != HOURS:
        raise ValueError("dry-run manifest is incomplete")
    if [frame.get("hour") for frame in frames] != list(range(HOURS)):
        raise ValueError("dry-run manifest hours are not 0–120")
    for frame in frames:
        for layer in ("temp", "wind", "waves"):
            relative = frame.get(layer)
            if not isinstance(relative, str) or not (run / relative).is_file():
                raise ValueError(f"dry-run {layer} frame f{frame.get('hour')} is missing")
    feed = json.loads((run / "piercast-points.json").read_text())
    piercast.validate_payload(feed)
    if feed.get("run") != run_id or feed.get("cycle") != latest.get("cycle"):
        raise ValueError("dry-run PierCast feed does not match the surface run")
    return {"run": run_id, "cycle": latest["cycle"]}


def run(out: Path, now: datetime, attempts: int = 5) -> dict:
    for index in range(attempts):
        candidate_now = now - timedelta(hours=6 * index)
        attempt_out = out / f"attempt-{index}"
        result = build.main([
            "--out", str(attempt_out),
            "--now", candidate_now.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        ])
        if result != 0:
            raise RuntimeError(f"dry-run build failed with exit code {result}")
        if (attempt_out / "latest.json").is_file():
            validated = validate_artifacts(attempt_out)
            print(
                f"Canary validated complete run {validated['run']} "
                f"for {validated['cycle']} with no upload or pointer write.",
                flush=True,
            )
            return validated
        print(
            f"No complete common cycle at {candidate_now.isoformat()}; trying the prior cycle window.",
            flush=True,
        )
    raise RuntimeError("no complete common NOAA cycle found in the canary lookback")


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--now")
    args = parser.parse_args(argv)
    now = (datetime.fromisoformat(args.now.replace("Z", "+00:00"))
           if args.now else datetime.now(timezone.utc))
    try:
        run(Path(args.out), now)
    except Exception as error:
        print(f"Canary failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
