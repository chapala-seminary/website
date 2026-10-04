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
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'src/data/readings', OUT = 'src/content/readings';
const WRITE = process.argv.includes('--write');

/* One row per test. `page` names the page the test belongs to -- the room
   the student reads first -- and the test is at <page>Test.html. */
const TESTS = [
  { slug: 'genesisreadings', page: 'CTSGenesisReadings', course: 'CTSGenesis', kind: 'reading',
    title: { en: 'Genesis Intensive: Required Readings', es: 'Intensivo de Génesis: Lecturas Requeridas' },
    room: { en: 'the five readings in the Genesis Reading Room', es: 'las cinco lecturas de la Sala de Lecturas de Génesis' } },
  { slug: 'wrreadings', page: 'CTSWRRequired', course: 'CTSWR', kind: 'reading',
    title: { en: 'World Religions: Required Readings', es: 'Religiones del Mundo: Lecturas Requeridas' },
    room: { en: 'the five assigned readings on the Required Readings page', es: 'las cinco lecturas asignadas de la página de Lecturas Requeridas' } },
];

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
let problems = 0;
for (const t of TESTS) {
  const bank = JSON.parse(fs.readFileSync(path.join(SRC, `${t.slug}.bank.json`), 'utf8'));
  const accept = JSON.parse(fs.readFileSync(path.join(SRC, `${t.slug}.accept.json`), 'utf8'));
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
    return { prompt: { en: blank(q.en), es: blank(q.es) }, answer: { en: q.answer_en, es: q.answer_es }, accept: { en, es } };
  });
  const out = { slug: t.slug, page: t.page, course: t.course, kind: t.kind, title: t.title, room: t.room,
    source: { file: `src/data/readings/${t.slug}.bank.json`, course: bank.course },
    test: { draw: f.questions_per_attempt, pass: f.passing_score, questions } };
  const counts = questions.map((q) => 1 + q.accept.en.length);
  console.log(`${t.slug}: ${questions.length} questions, accepted answers per question ${Math.min(...counts)}–${Math.max(...counts)} (English), for ${t.course}`);
  if (WRITE) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, `${t.slug}.json`), JSON.stringify(out, null, 1) + '\n'); console.log(`  wrote ${OUT}/${t.slug}.json`); }
}
if (problems) { console.error(`${problems} problem(s)`); process.exit(1); }
