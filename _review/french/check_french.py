"""Check a French draft against its English source packet. Mirrors cts-engine.js grading."""
import json,sys,re,unicodedata
def normalise(s):
    s=unicodedata.normalize('NFC',str(s or '').lower())
    s=''.join(c if (unicodedata.category(c)[0] in 'LN' or c.isspace()) else ' ' for c in s)
    return ' '+re.sub(r'\s+',' ',s)+' '
def fold(s):
    s=unicodedata.normalize('NFD',str(s or '').lower()).replace('ñ','ñ')
    s=re.sub(r'([A-Za-zÀ-ɏ])[̀-ͯ]+',r'\1',s); return unicodedata.normalize('NFC',s)
def bare(s): return re.sub(r'^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)','',normalise(fold(s)).strip())
def kwpass(ks,ans,mh):
    a=normalise(ans);h=0
    for k in ks:
        forms=k if isinstance(k,list) else [k]
        if any(normalise(f).strip() and normalise(f).strip() in a for f in forms): h+=1
    return h>=min(mh or 3,len(ks)),h
tags=lambda s:sorted(re.findall(r'</?([a-zA-Z0-9]+)',s or ''))
def check(srcp,frp):
    S=json.load(open(srcp));F=json.load(open(frp));E=[];W=[]
    fb={b['id']:b.get('fr') for b in F.get('blocks',[])}
    for b in S['blocks']:
        t=fb.get(b['id'])
        if not t or not t.strip(): E.append(f"block {b['id']} missing"); continue
        if tags(b['en'])!=tags(t): W.append(f"block {b['id']} HTML tags differ: {tags(b['en'])} vs {tags(t)}")
        r=len(t.split())/max(1,len(b['en'].split()))
        if len(b['en'].split())>25 and not .8<r<1.8: W.append(f"block {b['id']} length ratio {r:.2f}")
    extra=set(fb)-{b['id'] for b in S['blocks']}
    if extra: E.append(f"unknown blocks {extra}")
    for sec in ['mc','fill','sa']:
        if len(F.get(sec,[]))!=len(S[sec]): E.append(f"{sec} count {len(F.get(sec,[]))} != {len(S[sec])}")
    for i,(s,f) in enumerate(zip(S['mc'],F.get('mc',[])),1):
        if len(f.get('options',[]))!=len(s['options']): E.append(f"mc {i} option count")
        for k in ['stem','why']:
            if s.get(k) and not f.get(k): E.append(f"mc {i} {k} missing")
        if len(set(f.get('options',[])))!=len(f.get('options',[])): E.append(f"mc {i} duplicate options")
    for i,(s,f) in enumerate(zip(S['fill'],F.get('fill',[])),1):
        if (f.get('prompt') or '').count('____')!=1: E.append(f"fill {i} must have exactly one ____")
        if not f.get('answer'): E.append(f"fill {i} answer missing")
        forms=[f.get('answer')]+f.get('accept',[])
        if len({bare(x) for x in forms})!=len(forms): W.append(f"fill {i} accept list has duplicates after folding")
    for i,(s,f) in enumerate(zip(S['sa'],F.get('sa',[])),1):
        ks=f.get('keywords',[])
        if len(ks)!=len(s['keywords']): E.append(f"sa {i} keyword count {len(ks)} != {len(s['keywords'])}")
        if not f.get('model') or not f.get('prompt'): E.append(f"sa {i} prompt/model missing"); continue
        ok,h=kwpass(ks,f['model'],s.get('minHits'))
        if not ok: E.append(f"sa {i} French model answer fails its own keywords ({h} hits)")
        for k in ks:
            for form in (k if isinstance(k,list) else [k]):
                n=normalise(form).strip()
                if len(n)<4: W.append(f"sa {i} very short keyword '{form}' may match inside other words")
    return E,W
if __name__=='__main__':
    E,W=check(sys.argv[1],sys.argv[2])
    for e in E: print('ERROR',e)
    for w in W: print('warn ',w)
    print('OK' if not E else f'{len(E)} errors', f'{len(W)} warnings')
