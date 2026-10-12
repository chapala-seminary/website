#!/usr/bin/env python3
"""Check a French draft against its English source packet using the live
site's grading rules (public/assets/js/cts-engine.js: normalise, keywordPass,
fold, bare). usage: validate.py <source.json> <fr.json>   exit 1 on errors.

Draft format (<COURSE>-unit<N>-fr.json):
{ "course", "unit", "source_commit",
  "blocks": { "<block id>": "<French text>" , ...},          every source block id
  "mc":   [ {"stem","options":[4..],"why"?} ...],             same order as source
  "fill": [ {"prompt","answer","accept":[...]} ...],
  "sa":   [ {"prompt","keywords":[str | [str,...]],"model"} ...] }
"""
import json, re, sys, unicodedata
from collections import Counter

SA_HIT_MIN = 3

def normalise(s):
    s = unicodedata.normalize('NFC', str(s or '').lower())
    s = ''.join(ch if (unicodedata.category(ch)[0] in 'LN' or ch.isspace()) else ' ' for ch in s)
    return ' ' + re.sub(r'\s+', ' ', s) + ' '

def keyword_pass(ks, answer, min_hits=None):
    if not ks:
        return True
    a = normalise(answer); hits = 0
    for k in ks:
        forms = k if isinstance(k, list) else [k]
        if any((n := normalise(f).strip()) and n in a for f in forms):
            hits += 1
    return hits >= min(min_hits or SA_HIT_MIN, len(ks))

def kw_hits(ks, answer):
    a = normalise(answer)
    return [k for k in ks if any((n := normalise(f).strip()) and n in a for f in (k if isinstance(k, list) else [k]))]

def fold(s):
    s = unicodedata.normalize('NFD', str(s or '').lower()).replace('ñ', 'ñ')
    s = re.sub(r'([A-Za-z])[̀-ͯ]+', r'\1', s)
    return unicodedata.normalize('NFC', s)

def bare(s):
    return re.sub(r'^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)', '', normalise(fold(s)).strip())

TAG = re.compile(r'</?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>')
def tags(s):
    return Counter(m.group(0) if m.group(1).lower() in ('a', 'img') else '<' + ('/' if m.group(0)[1] == '/' else '') + m.group(1).lower() + '>' for m in TAG.finditer(s or ''))

def main(srcp, frp):
    S = json.load(open(srcp)); F = json.load(open(frp))
    err, warn = [], []
    fb = F.get('blocks', {})
    for b in S['blocks']:
        t = fb.get(b['id'])
        if not isinstance(t, str) or not t.strip():
            err.append(f"block {b['id']}: missing French"); continue
        if tags(b['en']) != tags(t):
            err.append(f"block {b['id']}: HTML tags differ {dict(tags(b['en']) - tags(t))} / {dict(tags(t) - tags(b['en']))}")
        if re.search(r'\b(the|and|which|that|of the)\b', re.sub(r'<[^>]+>', '', t)) and len(t) > 60:
            warn.append(f"block {b['id']}: possible untranslated English")
    extra = set(fb) - {b['id'] for b in S['blocks']}
    if extra: err.append(f'unknown block ids: {sorted(extra)}')
    for k in ('mc', 'fill', 'sa'):
        if len(F.get(k, [])) != len(S[k]):
            err.append(f'{k}: {len(F.get(k, []))} items, source has {len(S[k])}')
    for i, (s, f) in enumerate(zip(S['mc'], F.get('mc', [])), 1):
        if not (f.get('stem') or '').strip(): err.append(f'mc{i}: no stem')
        if len(f.get('options', [])) != len(s['options']) or not all(str(o).strip() for o in f.get('options', [])):
            err.append(f'mc{i}: option count/blank differs')
        if 'why' in s and not (f.get('why') or '').strip(): err.append(f'mc{i}: missing why')
        if 'answer' in f and f['answer'] != s['answer']: err.append(f'mc{i}: answer index changed')
    for i, (s, f) in enumerate(zip(S['fill'], F.get('fill', [])), 1):
        p = f.get('prompt') or ''
        if s['prompt'].count('____') == 1 and p.count('____') != 1:
            err.append(f'fill{i}: French prompt must have exactly one ____')
        if not (f.get('answer') or '').strip(): err.append(f'fill{i}: no answer'); continue
        acc = f.get('accept') or []
        if not isinstance(acc, list): err.append(f'fill{i}: accept must be a list')
        if len(acc) < 2 and not re.fullmatch(r"[\w\-' ]*\d[\w\-' ]*|[A-ZÉÈ][\w\-']+( [A-ZÉÈ][\w\-']+)*", f['answer']):
            warn.append(f"fill{i}: only {len(acc)} alternates for '{f['answer']}' (standard is 3-5 accepted forms)")
        for a in acc:
            if bare(a) == bare(f['answer']): warn.append(f'fill{i}: alternate "{a}" redundant after folding')
        if f['answer'].lower() in p.lower().replace('____', ''):
            warn.append(f'fill{i}: answer appears elsewhere in the prompt')
    for i, (s, f) in enumerate(zip(S['sa'], F.get('sa', [])), 1):
        ks, m = f.get('keywords') or [], f.get('model') or ''
        if len(ks) != len(s['keywords_en'] or []):
            err.append(f"sa{i}: {len(ks)} keyword groups, English has {len(s['keywords_en'] or [])}")
        for k in ks:
            for form in (k if isinstance(k, list) else [k]):
                n = normalise(form).strip()
                if len(n) < 4: warn.append(f'sa{i}: keyword "{form}" shorter than 4 letters, false-positive risk')
                if n != normalise(fold(form)).strip() and not (isinstance(k, list) and any(normalise(x).strip() == normalise(fold(form)).strip() for x in k)):
                    warn.append(f'sa{i}: accented keyword "{form}" has no unaccented form; phone typists may miss it')
        if not m.strip(): err.append(f'sa{i}: no model answer')
        elif not keyword_pass(ks, m, s.get('minHits')):
            err.append(f'sa{i}: French model fails its own keywords (hits {kw_hits(ks, m)})')
        if keyword_pass(ks, f.get('prompt', ''), s.get('minHits')):
            warn.append(f'sa{i}: the prompt alone passes the keywords (hits {kw_hits(ks, f.get("prompt", ""))})')
    for e in err: print('ERROR', e)
    for w in warn: print('warn ', w)
    print(f"{'FAIL' if err else 'OK'}: {len(err)} errors, {len(warn)} warnings")
    return 1 if err else 0

if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:3]))
