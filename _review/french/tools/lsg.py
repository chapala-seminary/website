#!/usr/bin/env python3
"""Louis Segond 1910 lookup (public-domain text, offline).
usage: lsg.py "Jean 3:16" ["Genèse 1:1-3" ...]   (French or English book names)
       lsg.py --search "mots exacts"              find verses containing a phrase
"""
import sys, re, unicodedata, xml.etree.ElementTree as ET
FR = ["Genèse","Exode","Lévitique","Nombres","Deutéronome","Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Esther","Job","Psaumes","Proverbes","Ecclésiaste","Cantique des cantiques","Ésaïe","Jérémie","Lamentations","Ézéchiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie","Matthieu","Marc","Luc","Jean","Actes","Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude","Apocalypse"]
EN = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]
def key(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', s)
NAMES = {}
for i, (f, e) in enumerate(zip(FR, EN), 1):
    for n in (f, e): NAMES[key(n)] = i
for a, i in [('psaume', 19), ('psalm', 19), ('cantique', 22), ('song of songs', 22), ('qohelet', 21), ('ecclesiaste', 21), ('apoc', 66), ('isaie', 23), ('esaie', 23)]: NAMES[key(a)] = i
T = ET.parse(__file__.rsplit('/', 2)[0] + '/lsg/LSG1910.xml').getroot()
V = {}
for b in T.iter('book'):
    for c in b.iter('chapter'):
        for v in c.iter('verse'):
            V[(int(b.get('number')), int(c.get('number')), int(v.get('number')))] = (v.text or '').strip()
def look(ref):
    m = re.match(r'\s*(.+?)\s+(\d+)[:.](\d+)(?:\s*[-–]\s*(?:(\d+)[:.])?(\d+))?\s*$', ref)
    if not m: return f'?? cannot parse {ref!r}'
    b = NAMES.get(key(m.group(1)))
    if not b: return f'?? unknown book {m.group(1)!r}'
    ch, v1 = int(m.group(2)), int(m.group(3))
    ch2 = int(m.group(4)) if m.group(4) else ch
    v2 = int(m.group(5)) if m.group(5) else v1
    out = []
    for (bb, c, v), t in sorted(V.items()):
        if bb == b and (c, v) >= (ch, v1) and (c, v) <= (ch2, v2):
            out.append(f'{FR[b-1]} {c}:{v} {t}')
    return '\n'.join(out) or f'?? no such verse {ref}'
if __name__ == '__main__':
    if sys.argv[1:2] == ['--search']:
        q = key(' '.join(sys.argv[2:]))
        for (b, c, v), t in sorted(V.items()):
            if q in key(t): print(f'{FR[b-1]} {c}:{v} {t}')
    else:
        for r in sys.argv[1:]: print(look(r)); print()
