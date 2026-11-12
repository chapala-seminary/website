#!/usr/bin/env node
/* Turn an elective's translated Google Docs (Markdown, in the private
 * assessment-keys repo: sources/denominational/<CODE>/U<n>-<lang>-lesson.md
 * and -exam.md) into the packets tools/import-language.mjs reads, so a later
 * language (Swahili first) comes into an elective the same way it comes into a
 * core course. See docs/swahili.md.
 *
 *   node tools/elective-packets.mjs --lang sw --sources <keys>/sources/denominational --out <dir> [B-C1 ...]
 *
 * The English side of each packet is the site's current lesson and unit
 * (src/content/lessons, src/content/units), so the importer maps every item
 * one to one. The Markdown must pair with the English exactly: the same
 * number of lesson paragraphs, 20 multiple-choice questions with the same
 * answer letters, 10 short answers, 10 fill-ins. A unit that does not pair is
 * left out and listed; nothing is guessed.
 *
 * The frame of each elective lesson (professor line, interim note, exam
 * heading, instructions and buttons) comes from FRAME below.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseLesson, parseExam, prefixOf } from './import-electives.mjs';

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const LANG = arg('--lang'), SOURCES = arg('--sources'), OUT = arg('--out');
const codes = argv.filter((a, i) => /^[A-D]-C[1-5]$/.test(a) && !argv[i - 1]?.startsWith('--'));
if (!LANG || !SOURCES || !OUT) { console.error('usage: node tools/elective-packets.mjs --lang sw --sources <dir> --out <dir> [CODE ...]'); process.exit(2); }

const FRAME = {
  sw: {
    unit: (n) => `Sehemu ya ${n}`,
    prof: '<strong>Profesa:</strong> Dkt. Wayne Cook | <strong>Mkurugenzi:</strong> Dkt. Ted Rogers',
    interim: '<strong>Toleo la muda.</strong> Kozi hii ya kuchagua imeandikwa kutoka ndani ya mapokeo yake yenyewe na inahesabiwa kwa tuzo za CTS kama kozi nyingine yoyote. Itarekebishwa au kuunganishwa na mihadhara ya walimu wa mapokeo haya.',
    head: (n) => `Mtihani wa Sehemu ya ${n}`,
    intro: '<strong>Programu ya Cheti:</strong> maswali 20 ya kuchagua jibu. <strong>Shahada ya Mshiriki:</strong> ongeza maswali 10 ya kujaza pengo. <strong>Programu za Uzamili:</strong> ongeza maswali 10 ya majibu mafupi.',
    submit: 'Wasilisha mtihani na uone kama umefaulu',
    reset: 'Anza upya',
  },
};
const F = FRAME[LANG];
if (!F) { console.error(`no elective frame words for ${LANG} in tools/elective-packets.mjs`); process.exit(2); }
const dict = JSON.parse(fs.readFileSync(`src/data/interface/${LANG}.json`, 'utf8'));

const problems = [];
let written = 0;
const all = codes.length ? codes : fs.readdirSync(SOURCES).filter((c) => /^[A-D]-C[1-5]$/.test(c)).sort();
for (const code of all) {
  const prefix = prefixOf(code), dir = path.join(SOURCES, code);
  const courseTitle = dict['@course']?.[prefix];
  if (!courseTitle) { problems.push(`${code}: src/data/interface/${LANG}.json has no @course.${prefix}`); continue; }
  for (let n = 1; n <= 10; n++) {
    const lm = path.join(dir, `U${n}-${LANG}-lesson.md`), em = path.join(dir, `U${n}-${LANG}-exam.md`);
    if (!fs.existsSync(lm) || !fs.existsSync(em)) { problems.push(`${code} U${n}: no ${LANG} lesson or exam`); continue; }
    const lesson = JSON.parse(fs.readFileSync(`src/content/lessons/${prefix}/${n}.json`, 'utf8'));
    const unit = JSON.parse(fs.readFileSync(`src/content/units/${prefix}/${n}.json`, 'utf8'));
    let L, E;
    try { L = parseLesson(fs.readFileSync(lm, 'utf8'), `${code} U${n} ${LANG} lesson`); E = parseExam(fs.readFileSync(em, 'utf8'), `${code} U${n} ${LANG} exam`); }
    catch (e) { problems.push(e.message); continue; }
    // "Kipindi 1 kati ya 10" ("Unit 1 of 10" in other words) before the first heading is not a paragraph.
    const firstHeading = L.items.findIndex((it) => it.type === 'heading');
    L.items = L.items.filter((it, i) => !(i < firstHeading && it.type === 'prose' && /^\D*\d+\D+10\.?$/.test(it.text)));
    // The site's blocks: title, professor, interim note, the body, then four exam blocks.
    const body = lesson.blocks.slice(3, -4);
    if (L.items.length !== body.length) { problems.push(`${code} U${n}: ${L.items.length} ${LANG} lesson paragraphs, ${body.length} on the site`); continue; }
    const kinds = L.items.findIndex((it, i) => (it.type === 'heading') !== (body[i].type === 'heading'));
    if (kinds >= 0) { problems.push(`${code} U${n}: paragraph ${kinds + 1} is a heading in one language only`); continue; }
    const badKey = unit.mc.findIndex((q, i) => E.key[i] !== q.answer);
    if (badKey >= 0) { problems.push(`${code} U${n}: ${LANG} answer letter differs at mc ${badKey + 1}`); continue; }
    const text = [`${courseTitle} — ${F.unit(n)}: ${L.title}`, F.prof, F.interim, ...L.items.map((it) => it.text), F.head(n), F.intro, F.submit, F.reset];
    const [s1, s2, s3, s4] = lesson.blocks.slice(-4).map((b) => b.type);
    if (s1 !== 'heading' || s3 !== 'label' || s4 !== 'label' || s2 !== 'prose') { problems.push(`${code} U${n}: the site lesson does not end with the four exam blocks`); continue; }
    const source = {
      course: prefix, unit: n,
      blocks: lesson.blocks.map((b) => ({ id: b.id, type: b.type, en: b.text.en })),
      mc: unit.mc.map((q) => ({ stem: q.stem.en, options: q.options.en, answer: q.answer, why: q.why?.en ?? '' })),
      sa: unit.sa.map((q) => ({ prompt: q.prompt.en, keywords: q.keywords?.en, model: q.model?.en })),
      fill: unit.fill.map((q) => ({ prompt: q.prompt.en, answer: q.answer?.en, accept: q.accept?.en ?? [] })),
    };
    const draft = {
      course: prefix, unit: n, title: L.title,
      blocks: lesson.blocks.map((b, i) => ({ id: b.id, [LANG]: text[i] })),
      mc: E.mc.map((q) => ({ stem: q.stem, options: q.options, why: '' })),
      sa: E.sa.map((q) => ({ prompt: q.prompt, keywords: q.keywords.map((g) => (g.length === 1 ? g[0] : g)), model: q.model })),
      fill: E.fill.map((q) => ({ prompt: q.prompt, answer: q.acc[0], accept: q.acc.slice(1) })),
      notes: `From ${code} U${n} ${LANG} Google Docs (assessment-keys sources/denominational).`,
    };
    if (draft.mc.length !== source.mc.length || draft.sa.length !== source.sa.length || draft.fill.length !== source.fill.length) { problems.push(`${code} U${n}: question counts differ from the site`); continue; }
    const out = path.join(OUT, prefix);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, `${prefix}-unit${n}-source.json`), JSON.stringify(source, null, 1) + '\n');
    fs.writeFileSync(path.join(out, `${prefix}-unit${n}-${LANG}.json`), JSON.stringify(draft, null, 1) + '\n');
    written++;
  }
}
console.log(`${written} unit packet(s) written to ${OUT}.`);
if (problems.length) { console.log(`${problems.length} unit(s) left out:`); for (const p of problems) console.log('  - ' + p); process.exitCode = written ? 0 : 1; }
