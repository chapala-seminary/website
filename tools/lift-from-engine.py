#!/usr/bin/env python3
"""
Copy a unit's question bank out of the engine file that unit uses, into that
unit's data file.

Some courses were built one unit at a time, so consolidate.py could not lift
their question banks: every unit had its own engine and nothing varied *between*
units of a group to mark as content. The banks are still plain declarations
inside those engines, one engine per unit, so they can be copied across.

Nothing is deleted: the engine files become unreferenced once unify.mjs
repoints the pages, so removing the declarations would only risk breaking a
page that has not been ported yet.

    python3 tools/lift-from-engine.py --course CTSCE --slug ce [--apply]
"""
import argparse, os, re, sys
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.normpath(os.path.join(HERE, "..", "site"))
spec = importlib.util.spec_from_file_location("c", os.path.join(HERE, "consolidate.py"))
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)

WANTED = ["mcQuestions", "kwQuestions", "saQuestions", "MC", "SA", "MCQ",
          "QUESTIONS", "DATA", "unitTitlesEn", "unitTitlesEs",
          # some courses hold the answer key in a separate array
          "KEY", "ANSWERS", "ANS", "SA_KEY", "KEYS", "KW"]


def extract(src, name):
    m = re.search(r"(?:const|let|var)\s+" + re.escape(name) + r"\s*=\s*([\[{])", src)
    if not m:
        return None
    start = m.end() - 1
    try:
        end = c.balanced(src, start)
    except ValueError:
        return None
    tail = end
    while tail < len(src) and src[tail] in " \t;":
        tail += 1
    return src[m.start():tail].rstrip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--course", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()

    units = c.unit_files(a.course)
    if not units:
        sys.exit("no units for " + a.course)

    done, missing, already = [], [], 0
    for n, page in units:
        # a unit whose data file already carries a bank needs nothing lifted
        dp = os.path.join(SITE, "data", a.slug, "unit%d.js" % n)
        if os.path.exists(dp):
            body = open(dp, encoding="utf-8").read()
            if re.search(r"(?:const|let|var)\s+(?:mcQuestions|MC|MCQ|QUESTIONS|DATA)\s*=", body):
                already += 1
                continue
        html = open(os.path.join(SITE, page), encoding="utf-8").read()
        m = re.search(r'<script src="(assets/js/engine-[^"]+)"></script>', html)
        if not m:
            missing.append("unit %d: page loads no per-course engine" % n); continue
        eng = os.path.join(SITE, m.group(1))
        if not os.path.exists(eng):
            missing.append("unit %d: %s not found" % (n, m.group(1))); continue
        src = open(eng, encoding="utf-8").read()
        found = [(w, extract(src, w)) for w in WANTED]
        found = [(w, t) for w, t in found if t]
        if not any(w in ("mcQuestions", "MC", "MCQ", "QUESTIONS", "DATA") for w, _ in found):
            missing.append("unit %d: no question bank in %s" % (n, os.path.basename(eng))); continue
        done.append((n, found, os.path.basename(eng)))

    print("%s: %d units already had a bank, %d liftable, %d unresolved"
          % (a.course, already, len(done), len(missing)))
    for m_ in missing:
        print("   " + m_)
    if not a.apply:
        print("   (analysis only -- pass --apply to write)")
        return
    if missing:
        sys.exit("   refusing to write while any unit is unresolved")

    for n, found, eng in done:
        dp = os.path.join(SITE, "data", a.slug, "unit%d.js" % n)
        os.makedirs(os.path.dirname(dp), exist_ok=True)
        body = open(dp, encoding="utf-8").read() if os.path.exists(dp) else \
            "/* %s - unit %d */\n" % (a.course, n)
        # idempotent: drop anything a previous run appended before adding again
        body = re.split(r"\n/\* Question bank copied from ", body)[0].rstrip()
        open(dp, "w", encoding="utf-8").write(
            body + "\n\n/* Question bank copied from %s, which only this unit used. */\n" % eng
            + "\n\n".join(t for _, t in found) + "\n")
    print("   wrote %d data files" % len(done))


if __name__ == "__main__":
    main()
