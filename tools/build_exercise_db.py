#!/usr/bin/env python3
"""Build js/data/exercise-db.js from Free Exercise DB.

Free Exercise DB (https://github.com/yuhonas/free-exercise-db) is public domain.
It labels muscles with ~17 broad groups ("shoulders", "chest", "middle back"...).
This script converts those to the 23 muscles the body map uses, using the
exercise name to pick the detail (e.g. "lateral raise" -> side delts,
"incline" -> upper chest). The rules are heuristics: fix them here, not in
the generated file.

Usage:
    python3 tools/build_exercise_db.py                 # downloads the dataset
    python3 tools/build_exercise_db.py exercises.json  # uses a local copy
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

DATASET_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "js" / "data" / "exercise-db.js"

# Stretching and cardio entries are left out: they don't help build a split.
KEEP = {"strength", "powerlifting", "olympic weightlifting", "strongman", "plyometrics"}

EQUIPMENT = {
    "barbell": "Barbell", "e-z curl bar": "Barbell", "dumbbell": "Dumbbell",
    "cable": "Cable", "machine": "Machine", "body only": "Body only",
    "kettlebells": "Kettlebell", "bands": "Bands",
}

GROUP = {
    "chest": "Chest", "chest_upper": "Chest", "serratus": "Chest", "neck": "Shoulders & traps",
    "lats": "Back", "upper_back": "Back", "lower_back": "Back",
    "delt_front": "Shoulders & traps", "delt_side": "Shoulders & traps", "delt_rear": "Shoulders & traps",
    "traps_upper": "Shoulders & traps", "traps_mid": "Shoulders & traps",
    "biceps": "Arms", "brachialis": "Arms", "brachioradialis": "Arms", "triceps": "Arms",
    "forearm_flex": "Arms", "forearm_ext": "Arms",
    "abs": "Core", "obliques": "Core", "hip_flexors": "Core", "tibialis": "Legs",
    "glutes": "Legs", "quads": "Legs", "hamstrings": "Legs", "adductors": "Legs", "calves": "Legs",
}


def has(name, pattern):
    return re.search(pattern, name, re.I) is not None


def shoulder_head(name, primaries, is_primary):
    if has(name, r"rear|bent[- ]over.*lateral|pull[- ]apart|reverse fl(y|ye)|reverse pec|face pull|"
                 r"bent[- ]over.*(raise|fly|flye)|posterior|external rotation|back fly|reverse cable cross"):
        return "delt_rear"
    if has(name, r"lateral|side raise|upright|\by[- ]raise|lu raise|iron cross"):
        return "delt_side"
    if not is_primary and any(m in primaries for m in ("lats", "middle back", "traps")):
        return "delt_rear"  # helper on a pulling exercise
    return "delt_front"


def map_muscle(muscle, name, primaries, is_primary):
    if muscle == "abdominals":
        oblique = (r"oblique|twist|side bend|side plank|side bridge|wood ?chop|russian|windmill|"
                   r"rotation|pallof|saxon|side jackknife|side crunch|landmine 180")
        return "obliques" if has(name, oblique) else "abs"
    if muscle == "abductors":
        return "glutes"
    if muscle == "biceps":
        if has(name, r"hammer|zottman|cross[- ]body|pinwheel"):
            return "brachialis"
        if has(name, r"reverse"):
            return "brachioradialis"
        return "biceps"
    if muscle == "chest":
        if has(name, r"push[- ]?ups?"):
            return "chest_upper" if has(name, r"decline") else "chest"
        if has(name, r"incline|low[- ]to[- ]high|low cable|reverse[- ]grip.*bench|upward"):
            return "chest_upper"
        return "chest"
    if muscle == "forearms":
        if has(name, r"reverse|extension|palms?[- ]down|extensor"):
            return "forearm_ext"
        if has(name, r"hammer"):
            return "brachioradialis"
        return "forearm_flex"
    if muscle == "traps":
        if has(name, r"face pull|prone|\by[- ]raise|reverse fl|scap|rear"):
            return "traps_mid"
        return "traps_upper"
    if muscle == "shoulders":
        return shoulder_head(name, primaries, is_primary)
    return {
        "adductors": "adductors", "calves": "calves", "glutes": "glutes",
        "hamstrings": "hamstrings", "quadriceps": "quads", "lats": "lats",
        "lower back": "lower_back", "middle back": "upper_back", "triceps": "triceps",
        "neck": "neck",
    }.get(muscle)


def add_companions(name, main, helpers):
    """Helpers the dataset usually leaves out."""
    if has(name, r"hip flexion"):
        main[:] = ["hip_flexors"] + [m for m in main if m not in ("quads", "hip_flexors")]
    elif has(name, r"leg raise|knee raise|knee tuck|knee/hip raise|jackknife|v-up|flutter|scissor|mountain climber|toes to bar|hanging pike|leg pull-in"):
        helpers.append("hip_flexors")
    if has(name, r"pullover|scaption|push-?ups?|serratus|scapular push"):
        helpers.append("serratus")
    if has(name, r"toe raise|tibialis|dorsiflex"):
        main[:] = ["tibialis"]
    if "delt_front" in main and has(name, r"press|jerk|handstand|pike"):
        helpers += ["delt_side", "triceps"]
    if "chest" in main and has(name, r"press|push-?up|dip"):
        helpers.append("chest_upper")
    if "chest_upper" in main:
        helpers.append("chest")
    if "upper_back" in main and has(name, r"row"):
        helpers.append("traps_mid")
    if "biceps" in main and has(name, r"curl"):
        helpers.append("brachialis")


def build(rows):
    out = []
    for x in rows:
        if x.get("category") not in KEEP:
            continue
        name = x["name"].strip()
        main, helpers = [], []
        for m in x["primaryMuscles"]:
            r = map_muscle(m, name, x["primaryMuscles"], True)
            if r and r not in main:
                main.append(r)
        for m in x["secondaryMuscles"]:
            r = map_muscle(m, name, x["primaryMuscles"], False)
            if r and r not in main and r not in helpers:
                helpers.append(r)
        if not main:
            continue
        add_companions(name, main, helpers)
        helpers = [m for i, m in enumerate(helpers) if m not in main and m not in helpers[:i]]
        equipment = "Machine" if has(name, r"smith") else EQUIPMENT.get(x.get("equipment"), "Other")
        level = {"beginner": "B", "intermediate": "I", "expert": "E"}.get(x.get("level"), "")
        steps = "\n".join(s.strip() for s in x.get("instructions", []) if s.strip())
        out.append([name, GROUP[main[0]], " ".join(main), " ".join(helpers), equipment, level,
                    steps, x["id"], len(x.get("images", []))])
    return out


def main():
    if len(sys.argv) > 1:
        rows = json.loads(Path(sys.argv[1]).read_text())
    else:
        with urllib.request.urlopen(DATASET_URL) as r:
            rows = json.load(r)
    out = build(rows)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        f.write("/* Generated by tools/build_exercise_db.py from Free Exercise DB (public domain, github.com/yuhonas/free-exercise-db).\n"
                "   Row: [name, group, main muscles, helper muscles, equipment, level B/I/E, instructions, image folder, image count] */\n")
        f.write("window.EXERCISE_DB=[\n" + ",\n".join(
            json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in out) + "\n];\n")
    print(f"Wrote {len(out)} exercises to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
