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
 *                        A question with one clear answer may have none.
 * A bank may also say how many questions to draw from each reading
 * (format.questions_drawn_per_reading); each of its questions then names its
 * reading, and every attempt draws that many from each.
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
  /* The Master's five-reading test (Dr. Cook and ChatGPT's authorization, 9
     Oct 2026), piloted on Pentecostalism & the Charismatic Movement before the
     other courses: forty questions, eight on each of the room's five
     readings, twenty drawn -- four from each reading -- and eighteen to pass.
     The course keeps its textbook test as well; a master's student passes
     both (worker/awards.js).

     `requiredFrom` is when the test begins to count. Until it is set (null)
     the test is open to everyone and required of no one. Robert sets it to
     the moment the requirement begins -- an ISO date and time, e.g.
     '2026-11-01T00:00:00Z', and a moment AFTER the deploy that carries it,
     so that every completion recorded before it is recorded by a Worker that
     already knows the date -- then runs this tool with --write and
     gen-worker-catalog.mjs. From then on a master's completion of the course
     needs the pass, except a master's completion the student record already
     held before that moment (docs/reading-rooms.md, "Master's reading
     tests"). Genesis and World Religions carry no such date: their tests have
     counted since 4 Oct 2026, and nothing about them changes. */
  { slug: 'pentecostalreadings', page: 'CTSPentecostalReadings', course: 'CTSPentecostal', kind: 'reading', requiredFrom: null,
    title: { en: 'Pentecostalism & the Charismatic Movement: Required Readings', es: 'El Pentecostalismo y el Movimiento Carismático: Lecturas Requeridas' },
    room: { en: 'the five readings in the Pentecostalism Reading Room', es: 'las cinco lecturas de la Sala de Lecturas del Pentecostalismo' } },
];

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
let problems = 0;
for (const t of TESTS) {
  const bank = JSON.parse(fs.readFileSync(path.join(SRC, `${t.slug}.bank.json`), 'utf8'));
  const accept = JSON.parse(fs.readFileSync(path.join(SRC, `${t.slug}.accept.json`), 'utf8'));
  const f = bank.format || {};
  if (f.questions_per_attempt !== 20 || f.passing_score !== 18 || f.type !== 'fill-in-the-blank') { console.error(`${t.slug}: the bank's format is not 20 of 40, 18 to pass, fill-in-the-blank`); process.exit(2); }
  /* A bank that names how many questions to draw from each reading tags
     every question with its reading (1 to 5) and has enough on each. */
  const perReading = f.questions_drawn_per_reading ?? null;
  if (perReading !== null) {
    const counts = {};
    for (const q of bank.questions) {
      if (!Number.isInteger(q.reading) || q.reading < 1) { console.error(`${t.slug} #${q.id}: no reading number`); process.exit(2); }
      counts[q.reading] = (counts[q.reading] || 0) + 1;
    }
    const groups = Object.keys(counts).length;
    if (groups * perReading !== f.questions_per_attempt) { console.error(`${t.slug}: ${groups} readings x ${perReading} is not ${f.questions_per_attempt} a draw`); process.exit(2); }
    for (const [r, c] of Object.entries(counts)) if (c < perReading) { console.error(`${t.slug}: reading ${r} has ${c} questions, fewer than the ${perReading} drawn from it`); process.exit(2); }
  }
  const single = { en: 0, es: 0 };
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
      // An alternate is optional (Dr. Cook, 10 Oct 2026): a question with one clear
      // answer -- Polycarp, Nicaea, 325 -- goes in as it is rather than with an
      // invented synonym that would mark a wrong answer right. Counted, not refused.
      if (!a.length) single[lang]++;
    }
    for (const [lang, p] of [['en', q.en], ['es', q.es]])
      if (blank(p).split('____').length !== 2) { console.error(`${t.slug} #${q.id}: not one blank in ${lang}: ${p}`); problems++; }
    return { prompt: { en: blank(q.en), es: blank(q.es) }, answer: { en: q.answer_en, es: q.answer_es }, accept: { en, es },
      ...(perReading !== null ? { reading: q.reading } : {}) };
  });
  const out = { slug: t.slug, page: t.page, course: t.course, kind: t.kind, title: t.title, room: t.room,
    ...('requiredFrom' in t ? { requiredFrom: t.requiredFrom } : {}),
    source: { file: `src/data/readings/${t.slug}.bank.json`, course: bank.course },
    test: { draw: f.questions_per_attempt, pass: f.passing_score, ...(perReading !== null ? { perReading } : {}), questions } };
  if (t.requiredFrom != null && Number.isNaN(Date.parse(t.requiredFrom))) { console.error(`${t.slug}: requiredFrom is not a date and time: ${t.requiredFrom}`); process.exit(2); }
  const counts = questions.map((q) => 1 + q.accept.en.length);
  console.log(`${t.slug}: ${questions.length} questions, accepted answers per question ${Math.min(...counts)}–${Math.max(...counts)} (English), for ${t.course}`);
  if (single.en || single.es) console.log(`  ${single.en} English and ${single.es} Spanish questions take their one answer only (no alternate)`);
  if (WRITE) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, `${t.slug}.json`), JSON.stringify(out, null, 1) + '\n'); console.log(`  wrote ${OUT}/${t.slug}.json`); }
}
if (problems) { console.error(`${problems} problem(s)`); process.exit(1); }
