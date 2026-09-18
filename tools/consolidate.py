#!/usr/bin/env python3
"""
Stage 1 consolidation: split a course's unit pages into
  shared engine(s) + per-unit data + shared stylesheet(s).

URLs never change. Only each page's own <style> blocks and its largest inline
<script> are moved out.

How it decides what is "content" and what is "engine"
----------------------------------------------------
Rather than hardcoding declaration names, the tool compares all of a course's
units: any top-level declaration whose text differs between units is per-unit
content and moves to data/<slug>/unitN.js; everything else is engine and is
shared. This works whatever a course happens to call its question bank.

Before that comparison, known cosmetic drift is normalised so that units which
differ only by their position in the course collapse together:

  * prev/next button wiring -> one guarded form, hrefs lifted to config
  * localStorage keys with the unit number baked in -> `..._u${UNIT}_...`
  * progress.unitN -> progress[`unit${UNIT}`]
  * "Unit N" / "Unidad N" inside message strings -> ${UNIT} / ${UNIT + 1}
  * the bilingual "already passed, click <next> above" message, which names
    either "Unit N+1" or, on the final unit, "the Certificate"

Engines are then grouped by content. Units that still differ -- usually because
some were built from an older generation of the engine and lack later fixes --
get one engine file PER VARIANT. Variants are never merged: merging would
silently give some units behaviour they never had. Reconciling them is a
separate, reviewed decision.

Usage:
    python3 tools/consolidate.py --course CTSWR --slug wr [--diff]
    python3 tools/consolidate.py --course CTSWR --slug wr --apply
"""
import argparse, difflib, hashlib, os, re, sys
from collections import defaultdict

SITE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site"))
DECL = re.compile(r"(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*")


# ---------------------------------------------------------------- scanning
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


def top_level_decls(src):
    """[(name, start, end)] for declarations at brace depth 0 only."""
    out = []; depth = 0; i = 0; n = len(src)
    while i < n:
        ch = src[i]
        two = src[i:i + 2]
        if two == "//":
            j = src.find("\n", i); i = n if j < 0 else j + 1; continue
        if two == "/*":
            j = src.find("*/", i); i = n if j < 0 else j + 2; continue
        if ch in "\"'`":
            q = ch; i += 1; esc = False
            while i < n:
                c = src[i]
                if esc: esc = False
                elif c == "\\": esc = True
                elif c == q: break
                i += 1
            i += 1; continue
        if ch in "{[(":
            depth += 1; i += 1; continue
        if ch in "}])":
            depth -= 1; i += 1; continue
        if depth == 0 and ch in "clv" and (i == 0 or not (src[i-1].isalnum() or src[i-1] in "_$.")):
            m = DECL.match(src, i)
            if m:
                vs = m.end()
                if vs < n and src[vs] in "[{":
                    try: ve = balanced(src, vs)
                    except ValueError: ve = vs + 1
                else:
                    ve = vs
                    q = None; esc = False
                    while ve < n:
                        c = src[ve]
                        if q:
                            if esc: esc = False
                            elif c == "\\": esc = True
                            elif c == q: q = None
                        elif c in "\"'`": q = c
                        elif c in ";\n": break
                        ve += 1
                while ve < n and src[ve] in " \t;": ve += 1
                out.append((m.group(2), i, ve))
                i = ve; continue
        i += 1
    return out


# ------------------------------------------------------------ normalisers
CHECK = "✓"
PASSED_MSG = re.compile(
    "\"<span style='color:#1f6b3b'>" + CHECK + r" Unidad ya aprobada\. Haga clic en "
    r"(?:Unidad \d+|el Certificado) arriba\.</span>\""
    r"(\s*:\s*)"
    "\"<span style='color:green'>" + CHECK + r" Unit already passed! Click "
    r"(?:Unit \d+|the Certificate) above\.</span>\"")
PASSED_REPL = (
    "`<span style='color:#1f6b3b'>" + CHECK + " Unidad ya aprobada. Haga clic en "
    "${UNIT < TOTAL() ? 'Unidad ' + (UNIT + 1) : 'el Certificado'} arriba.</span>`"
    "\\1"
    "`<span style='color:green'>" + CHECK + " Unit already passed! Click "
    "${UNIT < TOTAL() ? 'Unit ' + (UNIT + 1) : 'the Certificate'} above.</span>`")

NAV = re.compile(
    r"document\.getElementById\(\s*'(prev|next)UnitBtn'\s*\)\.onclick\s*=\s*\(\s*\)\s*=>\s*\{\s*"
    r"location\.href\s*=\s*[\"']([^\"']+)[\"']\s*;?\s*\}\s*;?")
PREV_DISABLED = re.compile(
    r"document\.getElementById\(\s*'prevUnitBtn'\s*\)\.disabled\s*=\s*true\s*;")
CANON_PREV = ("if (PREV_HREF) document.getElementById('prevUnitBtn').onclick = "
              "() => { location.href = PREV_HREF; }; "
              "else document.getElementById('prevUnitBtn').disabled = true;")
CANON_NEXT = ("if (NEXT_HREF) document.getElementById('nextUnitBtn').onclick = "
              "() => { location.href = NEXT_HREF; };")

STRING_LIT = re.compile(r'"((?:[^"\\\n]|\\.)*)"' + r"|'((?:[^'\\\n]|\\.)*)'")
UNIT_WORD = re.compile(r"\b(Unit|Unidad)\s+(\d+)\b")


def template_unit_numbers(src, unit):
    edits = []
    for m in STRING_LIT.finditer(src):
        body = m.group(1) if m.group(1) is not None else m.group(2)
        if "`" in body or "${" in body:
            continue
        def swap(w):
            n = int(w.group(2))
            if n == unit: return "%s ${UNIT}" % w.group(1)
            if n == unit + 1: return "%s ${UNIT + 1}" % w.group(1)
            return w.group(0)
        new = UNIT_WORD.sub(swap, body)
        if new != body:
            edits.append((m.start(), m.end(), "`%s`" % new))
    for s, e, r in reversed(edits):
        src = src[:s] + r + src[e:]
    return src


def normalise(src, unit):
    synth = []
    hrefs = {}

    def nav_sub(m):
        hrefs[m.group(1)] = m.group(2)
        return CANON_PREV if m.group(1) == "prev" else CANON_NEXT

    src, n_nav = NAV.subn(nav_sub, src)
    if "prev" not in hrefs:
        src, n_dis = PREV_DISABLED.subn(lambda m: CANON_PREV, src)
        if not n_dis and n_nav and CANON_NEXT in src:
            src = src.replace(CANON_NEXT, CANON_PREV + " " + CANON_NEXT, 1)
        n_nav += n_dis
    if n_nav:
        synth.append("const PREV_HREF = %s;" % (repr(hrefs["prev"]) if "prev" in hrefs else "null"))
        synth.append("const NEXT_HREF = %s;" % (repr(hrefs["next"]) if "next" in hrefs else "null"))

    src = re.sub(r"(['\"])([A-Za-z0-9_]*_u)%d(_[A-Za-z0-9_]+)\1" % unit,
                 lambda m: "`%s${UNIT}%s`" % (m.group(2), m.group(3)), src)
    src = re.sub(r"progress\.unit%d\b" % unit, "progress[`unit${UNIT}`]", src)
    src = template_unit_numbers(src, unit)

    src, n_msg = PASSED_MSG.subn(PASSED_REPL, src)
    if n_msg:
        synth.append("function TOTAL() { return typeof totalUnits !== 'undefined' "
                     "? totalUnits : TOTAL_UNITS; }")
    return src, synth


def canon(text):
    t = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    t = re.sub(r"^\s*//[^\n]*$", "", t, flags=re.M)
    return re.sub(r"\s+", " ", t).strip()


def unit_files(course):
    out = []
    for f in os.listdir(SITE):
        m = re.fullmatch(re.escape(course) + r"Unit(\d+)\.html", f)
        if m: out.append((int(m.group(1)), f))
    return sorted(out)


def variant_names(stem, count):
    return [stem] + ["%s-v%d" % (stem, i + 1) for i in range(1, count)]


# ------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--course", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--diff", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    units = unit_files(args.course)
    if not units: sys.exit("no unit files for %s" % args.course)

    # pass 1: normalise, then record every top-level declaration
    stage, n_styles = {}, None
    for n, f in units:
        html = open(os.path.join(SITE, f), encoding="utf-8").read()
        scripts = list(re.finditer(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S))
        if not scripts: sys.exit("%s: no inline script" % f)
        big = max(scripts, key=lambda m: len(m.group(1)))
        if len(big.group(1)) < 3000:
            sys.exit("%s: largest inline script is only %d bytes" % (f, len(big.group(1))))
        styles = list(re.finditer(r"<style[^>]*>(.*?)</style>", html, re.S))
        if not styles: sys.exit("%s: no inline <style>" % f)
        if any(s.start() > big.start() for s in styles):
            sys.exit("%s: a <style> follows the engine script" % f)
        if n_styles is None: n_styles = len(styles)
        elif len(styles) != n_styles:
            sys.exit("%s: %d <style> blocks, others have %d" % (f, len(styles), n_styles))

        norm, synth = normalise(big.group(1), n)
        decls = top_level_decls(norm)
        stage[f] = dict(html=html, unit=n, script_m=big, styles=styles,
                        norm=norm, synth=synth,
                        decls={name: canon(norm[s:e]) for name, s, e in decls},
                        spans=decls)

    # Which declarations vary across the course? Those are per-unit content.
    # A declaration missing from some units is NOT treated as varying: absence
    # is a structural difference, and those units simply land in a different
    # engine variant. (Lifting on absence would move a declaration into the
    # data file for units where its dependencies still live in the engine.)
    names = set()
    for f in stage: names |= set(stage[f]["decls"])
    varying = set()
    for nm in names:
        present = [stage[f]["decls"][nm] for f in stage if nm in stage[f]["decls"]]
        if len(set(present)) > 1:
            varying.add(nm)

    # pass 2: lift varying declarations out of the engine, together with
    # anything earlier they depend on (the data file loads before the engine,
    # so a lifted declaration must not reference something left behind)
    for f, p in stage.items():
        pos = {name: (s, e) for name, s, e in p["spans"]}
        funcs = set(re.findall(r"^\s*function\s+([A-Za-z_$][\w$]*)", p["norm"], re.M))
        want = {nm for nm in varying if nm in pos}
        changed = True
        while changed:
            changed = False
            for nm in list(want):
                s0, e0 = pos[nm]
                text = p["norm"][s0:e0]
                for ident in set(re.findall(r"[A-Za-z_$][\w$]*", text)):
                    if ident == nm:
                        continue
                    if ident in funcs and re.search(r"\b%s\s*\(" % re.escape(ident), text):
                        sys.exit("%s: per-unit declaration %s calls function %s() at load "
                                 "time; this course needs manual handling" % (f, nm, ident))
                    if ident in pos and ident not in want and pos[ident][0] < s0:
                        want.add(ident); changed = True
        lifted, keep = [], []
        for name, s, e in sorted(p["spans"], key=lambda x: x[1]):
            (lifted if name in want else keep).append((name, s, e))
        out, prev = [], 0
        for _, s, e in lifted:
            out.append(p["norm"][prev:s]); prev = e
        out.append(p["norm"][prev:])
        p["engine"] = "".join(out)
        cfg = [p["norm"][s:e].strip() for _, s, e in lifted]
        # the normalisers above reference UNIT; some courses never declared it
        # (they used currentUnit), so make sure the data file defines it
        if not any(name == "UNIT" for name, _, _ in p["spans"]):
            cfg.insert(0, "const UNIT = %d;" % p["unit"])
        p["config"] = cfg + p["synth"]

    egroups = defaultdict(list)
    for n, f in units:
        egroups[hashlib.md5(canon(stage[f]["engine"]).encode()).hexdigest()].append(f)
    eorder = sorted(egroups.values(), key=lambda fl: (-len(fl), fl[0]))

    sorders = []
    for idx in range(n_styles):
        g = defaultdict(list)
        for n, f in units:
            g[hashlib.md5(stage[f]["styles"][idx].group(1).encode()).hexdigest()].append(f)
        sorders.append(sorted(g.values(), key=lambda fl: (-len(fl), fl[0])))

    if not args.quiet:
        print("%s - %d unit pages" % (args.course, len(units)))
        print("  per-unit declarations lifted: %s" % (", ".join(sorted(varying)) or "(none)"))
        print("  engine variants : %d  (%s)" % (len(eorder), ", ".join(str(len(g)) for g in eorder)))
        for i, g in enumerate(eorder):
            if len(eorder) > 1: print("      v%d: %s" % (i + 1, ", ".join(g)))
        for idx, order in enumerate(sorders):
            print("  stylesheet %d    : %d variant(s) (%s)"
                  % (idx + 1, len(order), ", ".join(str(len(g)) for g in order)))

    if args.diff and len(eorder) > 1:
        a, b = eorder[0][0], eorder[1][0]
        la, lb = canon(stage[a]["engine"]).split(" "), canon(stage[b]["engine"]).split(" ")
        print("\n  --- %s vs %s ---" % (a, b))
        for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, la, lb).get_opcodes():
            if tag != "equal":
                print("    - %s" % " ".join(la[i1:i2])[:170])
                print("    + %s" % " ".join(lb[j1:j2])[:170])

    if not args.apply:
        print("RESULT %s engines=%d styles=%s"
              % (args.course, len(eorder), "/".join(str(len(o)) for o in sorders)))
        return

    for d in ("assets/js", "assets/css", "data/" + args.slug):
        os.makedirs(os.path.join(SITE, d), exist_ok=True)

    engine_for = {}
    for name, group in zip(variant_names("engine-%s" % args.slug, len(eorder)), eorder):
        rel = "assets/js/%s.js" % name
        head = ("/* Exam engine for %s (shared by %d unit page%s).\n"
                "   Extracted from those pages' inline <script>; per-unit config and\n"
                "   question banks live in data/%s/unitN.js. */\n"
                % (args.course, len(group), "" if len(group) == 1 else "s", args.slug))
        open(os.path.join(SITE, rel), "w", encoding="utf-8").write(
            head + stage[group[0]]["engine"].strip() + "\n")
        for f in group: engine_for[f] = rel

    css_for = defaultdict(dict)
    for idx, order in enumerate(sorders):
        stem = "course-%s" % args.slug if n_styles == 1 else "course-%s-%d" % (args.slug, idx + 1)
        for name, group in zip(variant_names(stem, len(order)), order):
            rel = "assets/css/%s.css" % name
            open(os.path.join(SITE, rel), "w", encoding="utf-8").write(
                stage[group[0]]["styles"][idx].group(1).strip() + "\n")
            for f in group: css_for[f][idx] = rel

    for n, f in units:
        p = stage[f]
        data_rel = "data/%s/unit%d.js" % (args.slug, n)
        open(os.path.join(SITE, data_rel), "w", encoding="utf-8").write(
            "/* %s - unit %d: per-unit configuration and content. */\n\n" % (args.course, n)
            + "\n\n".join(p["config"]) + "\n")
        html = p["html"]
        s, e = p["script_m"].span()
        html = (html[:s] + '<script src="%s"></script>\n<script src="%s"></script>'
                % (data_rel, engine_for[f]) + html[e:])
        for idx in sorted(range(n_styles), reverse=True):
            s2, e2 = p["styles"][idx].span()
            html = html[:s2] + '<link rel="stylesheet" href="%s">' % css_for[f][idx] + html[e2:]
        open(os.path.join(SITE, f), "w", encoding="utf-8").write(html)

    print("  wrote %d engine file(s), %d stylesheet(s), %d data files"
          % (len(eorder), sum(len(o) for o in sorders), len(units)))


if __name__ == "__main__":
    main()
