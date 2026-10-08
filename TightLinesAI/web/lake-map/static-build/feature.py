#!/usr/bin/env python3
"""Set a lake-map feature flag in one explicitly selected R2 bucket."""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LAKE_MAP = HERE.parent
sys.path.insert(0, str(LAKE_MAP / "job"))
from build import ENV_KEYS, Log, load_env_file  # noqa: E402
from lakemap import store  # noqa: E402

FEATURES = {"tempDepth"}
STATES = {"off", "on"}


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("feature", choices=sorted(FEATURES))
    parser.add_argument("state", choices=sorted(STATES))
    parser.add_argument("--env-file", default=str(LAKE_MAP.parent.parent / ".env"))
    parser.add_argument("--allow-production", action="store_true")
    args = parser.parse_args(argv)
    log = Log()
    load_env_file(Path(args.env_file), log)
    if not all(os.environ.get(key) for key in ENV_KEYS[:3]):
        log("R2 credentials are missing — refusing to write a feature flag.")
        return 2
    bucket = store.bucket()
    if bucket == "piercast-lake-map" and not args.allow_production:
        log("Production feature changes require --allow-production; nothing was written.")
        return 2
    s3 = store.client()
    current = store.read_json(s3, "map/features.json")
    features = current if isinstance(current, dict) else {}
    features[args.feature] = args.state
    store.put(s3, "map/features.json", json.dumps(features, separators=(",", ":")).encode(),
              "public, max-age=30")
    log(f"Set {args.feature}={args.state} in bucket {bucket}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
