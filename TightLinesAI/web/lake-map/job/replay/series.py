#!/usr/bin/env python3
"""Turns NDBC history files (job/replay/data/*.txt.gz) into clean hourly water
temperature seasons (°F, May 1 – Nov 15) for the surge-rule replay.

  python3 job/replay/series.py [data dir] > seasons.json
Cleaning: hourly means; physically impossible values and single-reading
spikes (> 6 °F from the ±3 h median) are dropped. Missing hours are null.
"""
import gzip
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from statistics import median


def read(path):
    rows = {}
    with gzip.open(path, "rt", errors="replace") as f:
        head = f.readline().lstrip("#").split()
        f.readline()
        i = {k: head.index(k) for k in ("YY", "MM", "DD", "hh", "WTMP")} if "YY" in head else None
        if i is None:
            return {}
        for line in f:
            v = line.split()
            if len(v) <= i["WTMP"]:
                continue
            t = float(v[i["WTMP"]])
            if t >= 99 or t < -2 or t > 32:
                continue
            key = datetime(int(v[i["YY"]]), int(v[i["MM"]]), int(v[i["DD"]]), int(v[i["hh"]]), tzinfo=timezone.utc)
            rows.setdefault(key, []).append(t * 9 / 5 + 32)
    return {k: sum(x) / len(x) for k, x in rows.items()}


def season(hourly, year):
    start, end = datetime(year, 5, 1, tzinfo=timezone.utc), datetime(year, 11, 16, tzinfo=timezone.utc)
    n = int((end - start).total_seconds() // 3600)
    s = [hourly.get(start + timedelta(hours=h)) for h in range(n)]
    out = list(s)
    for h, v in enumerate(s):
        if v is None:
            continue
        near = [x for x in s[max(0, h - 3):h + 4] if x is not None]
        if len(near) >= 4 and abs(v - median(near)) > 6:
            out[h] = None
    return {"start": start.isoformat(), "values": [None if v is None else round(v, 2) for v in out]}


def main():
    data = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent / "data")
    out = {}
    for p in sorted(data.glob("*h20??.txt.gz")):
        station, year = p.name[:5], int(p.name[6:10])
        s = season(read(p), year)
        if sum(v is not None for v in s["values"]) >= 24 * 30:  # at least a month of readings
            out[f"{station}-{year}"] = s
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
