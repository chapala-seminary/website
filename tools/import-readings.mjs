/* The required-reading tests (Dr. Cook's "CTS Add-ons", 4 Oct 2026): a
 * forty-question fill-in-the-blank bank for Genesis Intensive and one for
 * World Religions, bound to the course the way a Master's textbook test is
 * (docs/textbooks.md): twenty drawn at random, eighteen to pass, required for
 * an M.Div. or Th.M. completion of the course, optional for everyone else.
 *
 *   node tools/import-readings.mjs            # report
 *   node tools/import-readings.mjs --write    # write src/content/readings/<slug>.json
 *
 * Sources, both under src/data/readings/:
 *   <slug>.bank.json     Dr. Cook's bank, copied verbatim from the delivery
 *                        (one answer per blank, in each language)
 *   <slug>.accept.json   the accepted alternates, keyed by question id --
 *                        Dr. Cook asked for "three to five accepted answers
 *                        where appropriate", so a plural, a fuller name or an
 *                        obvious equivalent does not fail a right answer.
 * The two are merged into one question in the same shape as a textbook's
 * (src/content.config.ts: prompt, answer, accept), with the blank written
 * ____ as every fill-in on the site writes it. Nothing else is changed.
 *
 * A bank grouped by reading (World Religions, revised 10 Oct 2026) also
 * says which reading each question is on (`reading`, 1..5), how many to draw
 * from each (format.questions_per_reading) and its revision
 * (format.revision). They become the question's `group` and the test's
 * `perGroup` and `revision`: cts-textbook.js then draws that many from each
 * reading, and starts a fresh attempt when the revision changes, so an
 * attempt begun on the old questions is never graded against the new ones.
 *
 * A test may have a `next` bank waiting to replace its current one. It is
 * checked on every run, written to src/content only once its row says
 * `active: true`, and can be written elsewhere for the browser tests:
 *   node tools/import-readings.mjs --next-out DIR   # DIR/<slug>.json
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'src/data/readings', OUT = 'src/content/readings';
const WRITE = process.argv.includes('--write');
const NEXT_OUT = (() => { const i = process.argv.indexOf('--next-out'); return i > 0 ? process.argv[i + 1] : null; })();

/* One row per test. `page` names the page the test belongs to -- the room
   the student reads first -- and the test is at <page>Test.html. */
const TESTS = [
  { slug: 'genesisreadings', page: 'CTSGenesisReadings', course: 'CTSGenesis', kind: 'reading',
    title: { en: 'Genesis Intensive: Required Readings', es: 'Intensivo de Génesis: Lecturas Requeridas' },
    room: { en: 'the five readings in the Genesis Reading Room', es: 'las cinco lecturas de la Sala de Lecturas de Génesis' } },
  { slug: 'wrreadings', page: 'CTSWRRequired', course: 'CTSWR', kind: 'reading',
    title: { en: 'World Religions: Required Readings', es: 'Religiones del Mundo: Lecturas Requeridas' },
    room: { en: 'the five assigned readings on the Required Readings page', es: 'las cinco lecturas asignadas de la página de Lecturas Requeridas' },
    /* The revised bank: eight questions on each assigned reading, four drawn
       from each (approved 10 Oct 2026). Not yet in force: it is not to be
       required before the readings can be read in Spanish (decision of
       10 Oct 2026). Turning it on is this one word, then --write; see
       docs/reading-rooms.md. */
    next: { bank: 'wrreadings.v2', active: false } },
];

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
let problems = 0;
function build(t, name) {
  const bank = JSON.parse(fs.readFileSync(path.join(SRC, `${name}.bank.json`), 'utf8'));
  const accept = JSON.parse(fs.readFileSync(path.join(SRC, `${name}.accept.json`), 'utf8'));
  const f = bank.format || {};
  if (f.questions_per_attempt !== 20 || f.passing_score !== 18 || f.type !== 'fill-in-the-blank') { console.error(`${t.slug}: the bank's format is not 20 of 40, 18 to pass, fill-in-the-blank`); process.exit(2); }
  const questions = bank.questions.map((q) => {
    const blank = (s) => s.replace(/_{3,}/g, '____').replace(/\.''$/, ".'").trim();
    const alt = accept[String(q.id)] || {};
    const list = (lang, answer) => {
      const seen = new Set([fold(answer)]);
      const out = [];
      for (const a of alt[lang] || []) { const k = fold(a); if (!seen.has(k)) { seen.add(k); out.push(a); } }
      return out;
    };
    const en = list('en', q.answer_en), es = list('es', q.answer_es);
    for (const [lang, a] of [['en', en], ['es', es]]) {
      if (a.length + 1 > 5) { console.error(`${t.slug} #${q.id}: ${a.length + 1} ${lang} answers; Dr. Cook asked for three to five`); problems++; }
      if (!a.length) { console.error(`${t.slug} #${q.id}: no accepted ${lang} alternate`); problems++; }
    }
    for (const [lang, p] of [['en', q.en], ['es', q.es]])
      if (blank(p).split('____').length !== 2) { console.error(`${t.slug} #${q.id}: not one blank in ${lang}: ${p}`); problems++; }
    const out = { prompt: { en: blank(q.en), es: blank(q.es) }, answer: { en: q.answer_en, es: q.answer_es }, accept: { en, es } };
    if (f.questions_per_reading) out.group = q.reading;
    return out;
  });
  const test = { draw: f.questions_per_attempt, pass: f.passing_score, questions };
  if (f.questions_per_reading) {
    // grouped by reading: every question names one, each reading has enough to draw from, and the draws add up to the attempt
    const per = f.questions_per_reading, k = f.readings, sizes = {};
    for (const [i, q] of bank.questions.entries()) {
      if (!Number.isInteger(q.reading) || q.reading < 1 || q.reading > k) { console.error(`${name} #${q.id ?? i + 1}: reading ${q.reading} is not one of 1..${k}`); problems++; }
      sizes[q.reading] = (sizes[q.reading] || 0) + 1;
    }
    for (let g = 1; g <= k; g++) if ((sizes[g] || 0) < per) { console.error(`${name}: reading ${g} has ${sizes[g] || 0} questions; ${per} are drawn from each`); problems++; }
    if (per * k !== test.draw) { console.error(`${name}: ${per} from each of ${k} readings is not the ${test.draw} drawn`); problems++; }
    if (!f.revision) { console.error(`${name}: a grouped bank needs format.revision, so an attempt begun on another bank is not graded against this one`); problems++; }
    test.perGroup = per;
    test.revision = String(f.revision);
  }
  const out = { slug: t.slug, page: t.page, course: t.course, kind: t.kind, title: t.title, room: t.room,
    source: { file: `src/data/readings/${name}.bank.json`, course: bank.course }, test };
  const counts = questions.map((q) => 1 + q.accept.en.length);
  console.log(`${name}: ${questions.length} questions, accepted answers per question ${Math.min(...counts)}–${Math.max(...counts)} (English), for ${t.course}${test.perGroup ? `, ${test.perGroup} drawn from each of ${f.readings} readings, revision ${test.revision}` : ''}`);
  return out;
}
for (const t of TESTS) {
  const live = t.next && t.next.active ? t.next.bank : t.slug;
  const out = build(t, live);
  if (WRITE) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, `${t.slug}.json`), JSON.stringify(out, null, 1) + '\n'); console.log(`  wrote ${OUT}/${t.slug}.json`); }
  if (t.next && !t.next.active) {
    const next = build(t, t.next.bank);
    console.log(`  ${t.next.bank} is checked but not in force: ${t.slug} still uses ${live}`);
    if (NEXT_OUT) { fs.mkdirSync(NEXT_OUT, { recursive: true }); fs.writeFileSync(path.join(NEXT_OUT, `${t.slug}.json`), JSON.stringify(next, null, 1) + '\n'); console.log(`  wrote ${NEXT_OUT}/${t.slug}.json (for the browser tests; not the site)`); }
  }
}
if (problems) { console.error(`${problems} problem(s)`); process.exit(1); }
