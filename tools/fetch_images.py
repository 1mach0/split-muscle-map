#!/usr/bin/env python3
"""Download and shrink the exercise photos listed in js/data/exercise-db.js.

Photos come from Free Exercise DB (public domain). They are saved to
images/exercises/<folder>/<n>.jpg, resized to 480px wide to keep the repo small.
Existing files are skipped, so it is safe to re-run after rebuilding the data.

Needs Pillow:  pip install pillow
Usage:         python3 tools/fetch_images.py
"""
import io
import json
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "js" / "data" / "exercise-db.js"
OUT = ROOT / "images" / "exercises"
BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"
WIDTH = 480


def load_rows():
    text = DATA.read_text()
    return json.loads(re.search(r"window\.EXERCISE_DB=(\[.*\]);", text, re.S).group(1))


def fetch(job):
    folder, n = job
    dest = OUT / folder / f"{n}.jpg"
    if dest.exists():
        return "skip"
    url = BASE + urllib.parse.quote(f"{folder}/{n}.jpg")
    with urllib.request.urlopen(url, timeout=30) as r:
        im = Image.open(io.BytesIO(r.read())).convert("RGB")
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=74, optimize=True, progressive=True)
    return "ok"


def main():
    jobs = [(row[7], n) for row in load_rows() for n in range(row[8])]
    with ThreadPoolExecutor(max_workers=16) as pool:
        results = list(pool.map(fetch, jobs))
    print(f"{results.count('ok')} downloaded, {results.count('skip')} already present")


if __name__ == "__main__":
    main()
