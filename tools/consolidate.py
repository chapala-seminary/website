#!/usr/bin/env python3
"""
Stage 1 consolidation: split a course's unit pages into
  shared engine  +  per-unit data  +  shared stylesheet.

Design rule: this tool REFUSES to write anything unless every unit's engine
reduces to identical text after removing config/data and normalising the one
known piece of per-unit drift. If engines differ for any other reason it
reports the diff and exits non-zero.

Usage:
    python3 tools/consolidate.py --course CTS1Peter --slug 1peter
    python3 tools/consolidate.py --course CTS1Peter --slug 1peter --apply
"""
import argparse, difflib, hashlib, os, re, sys
from collections import defaultdict

SITE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site"))

DATA_DECLS = ["unitTitlesEn", "unitTitlesEs", "mcQuestions", "kwQuestions", "saQuestions"]
CONFIG_DECLS = ["UNIT", "COURSE", "NEXT_UNIT_URL", "totalUnits", "FILE_PREFIX"]


def balanced(s, start):
    opener = s[start]
    closer = {"[": "]", "{": "}", "(": ")"}[opener]
    depth = 0; i = start; quote = None; esc = False
    while i < len(s):
        ch = s[i]
        if quote:
            if esc: esc = False
            elif ch == "\\": esc = True
            elif ch == quote: quote = None
        else:
            if ch in "\"'`": quote = ch
            elif ch == opener: depth += 1
            elif ch == closer:
                depth -= 1
                if depth == 0: return i + 1
        i += 1
    raise ValueError("unbalanced bracket at %d" % start)


def take_decl(src, name):
    m = re.search(r"(?:const|let|var)\s+" + re.escape(name) + r"\s*=\s*([\[{])", src)
    if not m: return src, None
    start = m.end() - 1
    end = balanced(src, start)
    tail = end
    while tail < len(src) and src[tail] in " \t;": tail += 1
    return src[:m.start()] + src[tail:], src[m.start():tail].rstrip()


def take_scalar(src, name):
    m = re.search(r"^[ \t]*(?:const|let|var)\s+" + re.escape(name) + r"\s*=\s*[^\n;]+;[ \t]*$", src, re.M)
    if not m: return src, None
    return src[:m.start()] + src[m.end():], m.group(0).strip()


# The per-unit drift inside the engine: the "already passed" message hardcodes
# the next destination, which is "Unit N+1" for every unit except the last,
# where it is "the Certificate". Both forms collapse to one expression that
# reproduces each original string byte-for-byte.
CHECK = "\u2713"
PASSED_MSG = re.compile(
    "\"<span style='color:#1f6b3b'>" + CHECK + r" Unidad ya aprobada\. Haga clic en "
    r"(?:Unidad \d+|el Certificado) arriba\.</span>\""
    r"(\s*:\s*)"
    "\"<span style='color:green'>" + CHECK + r" Unit already passed! Click "
    r"(?:Unit \d+|the Certificate) above\.</span>\"")
PASSED_REPL = (
    "`<span style='color:#1f6b3b'>" + CHECK + " Unidad ya aprobada. Haga clic en "
    "${UNIT < totalUnits ? 'Unidad ' + (UNIT + 1) : 'el Certificado'} arriba.</span>`"
    "\\1"
    "`<span style='color:green'>" + CHECK + " Unit already passed! Click "
    "${UNIT < totalUnits ? 'Unit ' + (UNIT + 1) : 'the Certificate'} above.</span>`")


def split_script(src):
    config, data = [], []
    for name in CONFIG_DECLS:
        src, txt = take_scalar(src, name)
        if txt: config.append(txt)
    for name in DATA_DECLS:
        src, txt = take_decl(src, name)
        if txt: data.append(txt)
    src, n = PASSED_MSG.subn(PASSED_REPL, src)
    return src, config, data, n


def canon(engine):
    e = re.sub(r"/\*.*?\*/", "", engine, flags=re.S)
    e = re.sub(r"^\s*//[^\n]*$", "", e, flags=re.M)
    return re.sub(r"\s+", " ", e).strip()


def unit_files(course):
    out = []
    for f in os.listdir(SITE):
        m = re.fullmatch(re.escape(course) + r"Unit(\d+)\.html", f)
        if m: out.append((int(m.group(1)), f))
    return [f for _, f in sorted(out)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--course", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    files = unit_files(args.course)
    if not files: sys.exit("no unit files for %s" % args.course)
    print("course %s - %d unit pages" % (args.course, len(files)))

    engines, css_groups, parsed = {}, defaultdict(list), {}
    for f in files:
        html = open(os.path.join(SITE, f), encoding="utf-8").read()
        scripts = list(re.finditer(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S))
        if not scripts: sys.exit("%s: no inline script" % f)
        big = max(scripts, key=lambda m: len(m.group(1)))
        styles = list(re.finditer(r"<style[^>]*>(.*?)</style>", html, re.S))
        if len(styles) != 1: sys.exit("%s: expected 1 <style>, found %d" % (f, len(styles)))
        if styles[0].start() > big.start(): sys.exit("%s: <style> after <script>" % f)

        engine, config, data, drift = split_script(big.group(1))
        engines[f] = engine
        parsed[f] = dict(html=html, script_m=big, style_m=styles[0], engine=engine,
                         config=config, data=data, drift=drift)
        css_groups[hashlib.md5(styles[0].group(1).encode()).hexdigest()].append(f)

    fps = defaultdict(list)
    for f, e in engines.items():
        fps[hashlib.md5(canon(e).encode()).hexdigest()].append(f)

    print("\nengine variants after removing config+data: %d" % len(fps))
    for h, fl in sorted(fps.items(), key=lambda x: -len(x[1])):
        print("   %2d pages  %s  %s" % (len(fl), h[:8], ", ".join(fl[:4])))

    if len(fps) != 1:
        print("\nENGINES DO NOT RECONCILE - first differing pair:\n")
        groups = sorted(fps.values(), key=lambda x: -len(x))
        a, b = groups[0][0], groups[1][0]
        la, lb = canon(engines[a]).split(" "), canon(engines[b]).split(" ")
        for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, la, lb).get_opcodes():
            if tag != "equal":
                print("  %-9s %s: %s" % (tag, a, " ".join(la[i1:i2])[:150]))
                print("  %-9s %s: %s" % ("", b, " ".join(lb[j1:j2])[:150]))
        sys.exit(1)

    print("\nall %d engines reconcile to one (drift normalised in %d pages)"
          % (len(files), sum(1 for f in files if parsed[f]["drift"])))
    print("\nstylesheet variants: %d" % len(css_groups))
    if len(css_groups) != 1: sys.exit("stylesheets differ within course - aborting")

    if not args.apply:
        print("\n(analysis only - pass --apply to write)")
        return

    eng_rel = "assets/js/engine-%s.js" % args.slug
    css_rel = "assets/css/course-%s.css" % args.slug
    os.makedirs(os.path.join(SITE, "assets", "js"), exist_ok=True)
    os.makedirs(os.path.join(SITE, "assets", "css"), exist_ok=True)
    os.makedirs(os.path.join(SITE, "data", args.slug), exist_ok=True)

    first = parsed[files[0]]
    header = ("/* Shared exam engine for %s.\n"
              "   Extracted from the inline <script> of the %d unit pages; per-unit\n"
              "   config and question data live in data/%s/unitN.js. */\n"
              % (args.course, len(files), args.slug))
    open(os.path.join(SITE, eng_rel), "w", encoding="utf-8").write(header + first["engine"].strip() + "\n")
    open(os.path.join(SITE, css_rel), "w", encoding="utf-8").write(first["style_m"].group(1).strip() + "\n")

    for f in files:
        p = parsed[f]
        n = int(re.search(r"Unit(\d+)\.html", f).group(1))
        data_rel = "data/%s/unit%d.js" % (args.slug, n)
        body = ("/* %s - unit %d: configuration and question bank. */\n\n" % (args.course, n)
                + "\n".join(p["config"]) + "\n\n" + "\n\n".join(p["data"]) + "\n")
        open(os.path.join(SITE, data_rel), "w", encoding="utf-8").write(body)

        html = p["html"]
        s, e = p["script_m"].span()
        html = html[:s] + ('<script src="%s"></script>\n<script src="%s"></script>' % (data_rel, eng_rel)) + html[e:]
        s2, e2 = p["style_m"].span()
        html = html[:s2] + ('<link rel="stylesheet" href="%s">' % css_rel) + html[e2:]
        open(os.path.join(SITE, f), "w", encoding="utf-8").write(html)

    print("\nwrote %s, %s and %d data files" % (eng_rel, css_rel, len(files)))


if __name__ == "__main__":
    main()
