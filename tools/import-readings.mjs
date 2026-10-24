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
 * A bank may also say how many questions to draw from each reading
 * (format.questions_drawn_per_reading); each of its questions then names its
 * reading, and every attempt draws that many from each.
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
 *
 * A row may say `private: true` (the elective reading tests, Oct 2026; see
 * docs/reading-rooms.md, "Private reading tests"). Its bank and accept file
 * are read from the private checkout, <keys>/readings-src/<slug>.bank.json
 * and .accept.json, and two files are written:
 *   src/content/readings/<slug>.json   public: prompts, reading numbers,
 *                                      titles, keys: "private"; no answer,
 *                                      accept or tr (French stamps hash the
 *                                      answer)
 *   <keys>/readings/<slug>.json        private: { slug, test: { questions:
 *                                      [{ prompt, answer, accept, reading, tr }] } },
 *                                      what tools/grading-keys-lib.mjs overlays
 * <keys> is ASSESSMENT_KEYS or ../assessment-keys (resolveKeysRoot). A private
 * row stops the run when the checkout is missing. A private row cannot have
 * a `next` bank yet.
 */
import fs from 'node:fs';
import path from 'node:path';
import { carryFrench } from './french-readings-lib.mjs';
import { resolveKeysRoot, privateReadingLeaks, PRIVATE_READING_FIELDS } from './grading-keys-lib.mjs';

const SRC = 'src/data/readings', OUT = 'src/content/readings';
const WRITE = process.argv.includes('--write');
const NEXT_OUT = (() => { const i = process.argv.indexOf('--next-out'); return i > 0 ? process.argv[i + 1] : null; })();

/* One row per test. `page` names the page the test belongs to -- the room
   the student reads first -- and the test is at <page>Test.html. */
export const TESTS = [
  { slug: 'genesisreadings', page: 'CTSGenesisReadings', course: 'CTSGenesis', kind: 'reading',
    title: { en: 'Genesis Intensive: Required Readings', es: 'Intensivo de Génesis: Lecturas Requeridas' },
    room: { en: 'the five readings in the Genesis Reading Room', es: 'las cinco lecturas de la Sala de Lecturas de Génesis' } },
  { next: { bank: 'wrreadings.v2', active: false }, slug: 'wrreadings', page: 'CTSWRRequired', course: 'CTSWR', kind: 'reading',
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
  /* The eight Master's five-reading tests on the CTS reading digests (10 Oct
     2026), from ChatGPT's banks in src/data/readings/staged/. Dr. Cook asked
     for them online now -- open to every student, required of no one
     (requiredFrom null) -- with the academic review to follow. Their accepted
     alternates are optional, as he decided for reading tests whose answer is
     one clear word (Oct 2026): a question with no alternate yet is reported,
     not refused, and faculty add alternates to the .accept.json later. */
  ...[
    ['otsreadings', 'CTSOTSReadings', 'CTS', 'Old Testament Survey', 'Panorama del Antiguo Testamento'],
    ['ntreadings', 'CTSNTReadings', 'CTSNT', 'New Testament Survey', 'Panorama del Nuevo Testamento'],
    ['streadings', 'CTSSTReadings', 'CTSST', 'Systematic Theology', 'Teología Sistemática'],
    ['evangelismreadings', 'CTSEvangelismReadings', 'CTSEvangelism', 'Evangelism', 'Evangelismo'],
    ['pmreadings', 'CTSPMReadings', 'CTSPM', 'Pastoral Ministries', 'Ministerios Pastorales'],
    ['chreadings', 'CTSCHReadings', 'CTSCH', 'Church History', 'Historia de la Iglesia'],
    ['wisespeakreadings', 'CTSPreachingReadings', 'CTS_WiseSpeak_Preaching', 'Preaching', 'Predicación'],
    ['hermeneuticsreadings', 'CTSHermeneuticsReadings', 'CTSHermeneutics', 'Hermeneutics', 'Hermenéutica'],
  ].map(([slug, page, course, en, es]) => ({ slug, page, course, kind: 'reading', requiredFrom: null, dir: 'src/data/readings/staged', alternates: 'optional',
    title: { en: `${en}: Required Readings`, es: `${es}: Lecturas Requeridas` },
    room: { en: `the five readings in the ${en} Reading Room`, es: `las cinco lecturas de la Sala de Lecturas de ${es}` } })),
  /* Batch B (10 Oct 2026, ChatGPT's banks): Joshua, Galatians, Romans, Acts
     and Matthew, on the five CTS digests. Same terms as the eight above;
     Acts and Matthew have no alternates yet (optional). */
  { slug: 'joshuareadings', page: 'CTSJoshReadings', course: 'CTSJosh', kind: 'reading', requiredFrom: null,
    title: {"en": "Joshua: Required Readings", "es": "Josué: Lecturas Requeridas"},
    room: {"en": "the five readings in the Joshua Reading Room", "es": "las cinco lecturas de Josué"} },
  { slug: 'galatiansreadings', page: 'CTSGalatiansReadings', course: 'CTSGalatians', kind: 'reading', requiredFrom: null,
    title: {"en": "Galatians: Required Readings", "es": "Gálatas: Lecturas Requeridas"},
    room: {"en": "the five readings in the Galatians Reading Room", "es": "las cinco lecturas de Gálatas"} },
  { slug: 'romansreadings', page: 'CTSRomansReadings', course: 'CTSRomans', kind: 'reading', requiredFrom: null,
    title: {"en": "Romans: Required Readings", "es": "Romanos: Lecturas Requeridas"},
    room: {"en": "the five readings in the Romans Reading Room", "es": "las cinco lecturas de Romanos"} },
  { slug: 'actsreadings', page: 'CTSActsReadings', course: 'CTSActs', kind: 'reading', requiredFrom: null, alternates: 'optional',
    title: {"en": "Acts: Required Readings", "es": "Hechos: Lecturas Requeridas"},
    room: {"en": "the five readings in the Acts Reading Room", "es": "las cinco lecturas de Hechos"} },
  { slug: 'mattreadings', page: 'CTSMattReadings', course: 'CTSMatt', kind: 'reading', requiredFrom: null, alternates: 'optional',
    title: {"en": "Matthew Intensive: Required Readings", "es": "Intensivo de Mateo: Lecturas Requeridas"},
    room: {"en": "the five readings in the Matthew Reading Room", "es": "las cinco lecturas de Mateo"} },
  /* Batch C (11 Oct 2026, ChatGPT's "complete course packages"): the five
     CTS digests of six more rooms. Same terms: open to all, required of no
     one until tools/activate-required.mjs dates them; alternates optional.
     Claude's review: every answer is in its room in both languages; one
     Spanish prompt reworded (John #26), Marcelino for Psalms #4, numerals
     accepted where the answer is a number. */
  ...[
    ['firstpeterreadings', 'CTS1PeterReadings', 'CTS1Peter', '1 Peter', '1 Pedro'],
    ['johnreadings', 'CTSJohnReadings', 'CTSJohn', 'John', 'Juan'],
    ['ruthestherreadings', 'CTSREReadings', 'CTSRE', 'Ruth and Esther', 'Rut y Ester'],
    ['revelationreadings', 'CTSRevReadings', 'CTSRev', 'Revelation', 'Apocalipsis'],
    ['psalmsreadings', 'CTSPsalmsReadings', 'CTSPsalms', 'Psalms', 'Salmos'],
    ['pentreadings', 'CTSPentReadings', 'CTSPent', 'Pentateuch', 'Pentateuco'],
  ].map(([slug, page, course, en, es]) => ({ slug, page, course, kind: 'reading', requiredFrom: null, alternates: 'optional',
    title: { en: `${en}: Required Readings`, es: `${es}: Lecturas Requeridas` },
    room: { en: `the five readings in the ${en} Reading Room`, es: `las cinco lecturas de ${es}` } })),  /* Batch D (11 Oct 2026, Claude's banks, Dr. Cook's go-ahead): the five CTS
     digests of the remaining 22 rooms. Same terms: open to all, required of
     no one until activated; alternates optional. */
  ...[
    ['alreadings', 'CTSALReadings', 'CTSAL', 'Church Administration & Leadership', 'Administración y Liderazgo de la Iglesia'],
    ['apolreadings', 'CTSApolReadings', 'CTSApol', 'Apologetics', 'Apologética'],
    ['biblecharactersreadings', 'CTSBibleCharactersReadings', 'CTSBibleCharacters', 'Bible Characters', 'Personajes Bíblicos'],
    ['biblecharacterstworeadings', 'CTSBibleCharacters2Readings', 'CTSBibleCharacters2', 'Bible Characters II', 'Personajes Bíblicos II'],
    ['biblereadings', 'CTSBibleReadings', 'CTSBible', 'How We Got the Bible', 'Cómo Obtuvimos la Biblia'],
    ['cereadings', 'CTSCEReadings', 'CTSCE', 'Christian Education', 'Educación Cristiana'],
    ['cgreadings', 'CTSCGReadings', 'CTSCG', 'Church Growth', 'Crecimiento de la Iglesia'],
    ['csreadings', 'CTSCSReadings', 'CTSCS', 'Counseling Situations', 'Situaciones de Consejería'],
    ['counselingreadings', 'CTSCounselingReadings', 'CTSCounseling', 'Counseling', 'Consejería'],
    ['cultsreadings', 'CTSCultsReadings', 'CTSCults', 'Cults & World Religions', 'Sectas y Religiones del Mundo'],
    ['dpreadings', 'CTSDPReadings', 'CTSDP', 'Doctrinal Preaching', 'Predicación Doctrinal'],
    ['deaconreadings', 'CTSDeaconFamilyMinistryReadings', 'CTSDeaconFamilyMinistry', 'Deacon Family Ministry Plan', 'Plan de Ministerio Familiar del Diácono'],
    ['evanpreachreadings', 'CTSEvanPreachReadings', 'CTSEvanPreach', 'Evangelistic Preaching', 'Predicación Evangelística'],
    ['hsreadings', 'CTSHSReadings', 'CTSHS', 'The Holy Spirit', 'El Espíritu Santo'],
    ['lareadings', 'CTSLAReadings', 'CTSLA', 'Language Appreciation', 'Apreciación de los Idiomas Bíblicos'],
    ['locreadings', 'CTSLOCReadings', 'CTSLOC', 'The Life of Christ', 'La Vida de Cristo'],
    ['missionsreadings', 'CTSMissionsReadings', 'CTSMissions', 'World Missions', 'Misiones Mundiales'],
    ['narrativereadings', 'CTSNarrativePreachingReadings', 'CTS_Narrative_Preaching', 'Narrative Preaching', 'Predicación Narrativa'],
    ['ptreadings', 'CTSPTReadings', 'CTSPT', 'Practical Theology', 'Teología Práctica'],
    ['parablesreadings', 'CTSParablesReadings', 'CTSParables', 'Parables of the Bible', 'Las Parábolas de la Biblia'],
    ['radicalreadings', 'CTSRadicalReadings', 'CTSRadical', 'Radical Christianity', 'Cristianismo Radical'],
    /* Christian Ethics (single-page course, ethics_unit01), added 11 Oct 2026:
       the last course without a five-reading test. */
    ['ethicsreadings', 'CTSEthicsReadings', 'ethics_unit01', 'Pastoral & Christian Ethics', 'Ética Pastoral y Cristiana'],
    ['worshipreadings', 'CTSWorshipReadings', 'CTSWorship', 'Worship', 'Adoración Cristiana'],
  ].map(([slug, page, course, en, es]) => ({ slug, page, course, kind: 'reading', requiredFrom: null, alternates: 'optional',
    title: { en: `${en}: Required Readings`, es: `${es}: Lecturas Requeridas` },
    room: { en: `the five readings in the ${en} Reading Room`, es: `las cinco lecturas de ${es}` } })),
];

/* The rows whose keys are private: their public files are checked by
   tools/verify-no-keys.mjs as well as by the content schema. */
export const PRIVATE_READINGS = TESTS.filter((t) => t.private).map((t) => t.slug);

const SCHEDULED = fs.existsSync('src/data/required-from.json') ? JSON.parse(fs.readFileSync('src/data/required-from.json', 'utf8')) : {};
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
let problems = 0, optionalMissing = 0;
/* Where a private row's bank is read from: <keys>/readings-src. */
const privateSource = (keysRoot) => path.join(keysRoot, 'readings-src');
/** Merge a reading row's bank and accept file into the test, as written to
 *  src/content (with its answers: a private row is split by writeTest). */
export function buildTest(t, name, { keysRoot = null } = {}) {
  if (t.private && !keysRoot) { console.error(`${t.slug}: a private reading bank needs the assessment-keys checkout (ASSESSMENT_KEYS or ../assessment-keys); nothing written`); process.exit(2); }
  if (t.private && t.next) { console.error(`${t.slug}: a private reading bank cannot have a next bank yet`); process.exit(2); }
  const dir = t.private ? privateSource(keysRoot) : (t.dir || SRC);
  const bank = JSON.parse(fs.readFileSync(path.join(dir, `${name}.bank.json`), 'utf8'));
  const accept = JSON.parse(fs.readFileSync(path.join(dir, `${name}.accept.json`), 'utf8'));
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
      if (!a.length) { if (t.alternates === 'optional') optionalMissing++; else { console.error(`${t.slug} #${q.id}: no accepted ${lang} alternate`); problems++; } }
    }
    for (const [lang, p] of [['en', q.en], ['es', q.es]])
      if (blank(p).split('____').length !== 2) { console.error(`${t.slug} #${q.id}: not one blank in ${lang}: ${p}`); problems++; }
    return { prompt: { en: blank(q.en), es: blank(q.es) }, answer: { en: q.answer_en, es: q.answer_es }, accept: { en, es },
      ...(perReading !== null ? { reading: q.reading } : {}) };
  });
  // a test made required by tools/activate-required.mjs takes its moment from
  // src/data/required-from.json; one in force since its install has no requiredFrom
  if ('requiredFrom' in t && SCHEDULED[t.slug]) t.requiredFrom = SCHEDULED[t.slug];
  const out = { slug: t.slug, page: t.page, course: t.course, kind: t.kind, title: t.title, room: t.room,
    ...('requiredFrom' in t ? { requiredFrom: t.requiredFrom } : {}),
    // a private bank names where it lives without the machine's own path
    source: { file: t.private ? `assessment-keys/readings-src/${t.slug}.bank.json` : `${dir}/${t.slug}.bank.json`, course: bank.course },
    test: { draw: f.questions_per_attempt, pass: f.passing_score, ...(perReading !== null ? { perReading } : {}), questions } };
  if (t.requiredFrom != null && Number.isNaN(Date.parse(t.requiredFrom))) { console.error(`${t.slug}: requiredFrom is not a date and time: ${t.requiredFrom}`); process.exit(2); }
  const counts = questions.map((q) => 1 + q.accept.en.length);
  console.log(`${t.slug}: ${questions.length} questions, accepted answers per question ${Math.min(...counts)}–${Math.max(...counts)} (English), for ${t.course}`);
  if (t.next?.bank === name && f.questions_per_reading) {
    const per = f.questions_per_reading, k = f.readings, sizes = {};
    for (const [i, q] of bank.questions.entries()) {
      if (!Number.isInteger(q.reading) || q.reading < 1 || q.reading > k) { console.error(`${name} #${i + 1}: invalid reading`); problems++; }
      sizes[q.reading] = (sizes[q.reading] || 0) + 1;
      questions[i].group = q.reading;
    }
    for (let g = 1; g <= k; g++) if ((sizes[g] || 0) < per) problems++;
    if (per * k !== out.test.draw || !f.revision) problems++;
    out.test.perGroup = per;
    out.source.file = `${dir}/${name}.bank.json`;
  }
  if (f.revision) out.test.revision = String(f.revision);
  if (f.reset_wait_on_revision === true) out.test.resetWaitOnRevision = true;
  if (t.private) out.keys = 'private';
  return out;
}

/** A private test as its two files: the public one without answer, accept
 *  or tr, and the private one in the shape overlayQuestions reads. */
export function splitPrivate(full) {
  const pub = { ...full, keys: 'private', test: { ...full.test,
    questions: full.test.questions.map((q) => Object.fromEntries(Object.entries(q).filter(([k]) => !PRIVATE_READING_FIELDS.includes(k)))) } };
  const keep = ['prompt', 'answer', 'accept', 'reading', 'group', 'tr'];
  const priv = { slug: full.slug, test: { questions: full.test.questions.map((q) => Object.fromEntries(keep.filter((k) => q[k] !== undefined).map((k) => [k, q[k]]))) } };
  const leaks = privateReadingLeaks(pub);
  if (leaks.length) throw new Error(leaks.join('\n'));
  return { pub, priv };
}

const readIf = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
/** Write one test. French added since (tools/french-readings.mjs) is kept
 *  wherever its English is unchanged; for a private test the previous French
 *  is read from both its files, as one, and written back split. */
export function writeTest(t, out, { outDir = OUT, keysRoot = null, say = console.log } = {}) {
  const pubFile = path.join(outDir, `${out.slug}.json`);
  fs.mkdirSync(outDir, { recursive: true });
  if (!t.private) {
    fs.writeFileSync(pubFile, JSON.stringify(carryFrench(readIf(pubFile), out, say), null, 1) + '\n');
    say(`  wrote ${pubFile}`);
    return;
  }
  const keysFile = path.join(keysRoot, 'readings', `${out.slug}.json`);
  const oldPub = readIf(pubFile), oldKeys = readIf(keysFile);
  const previous = oldPub && { ...oldPub, test: { ...oldPub.test, questions: (oldPub.test?.questions || []).map((q, i) => ({ ...q, ...(oldKeys?.test?.questions?.[i] || {}) })) } };
  const { pub, priv } = splitPrivate(carryFrench(previous, out, say));
  fs.mkdirSync(path.dirname(keysFile), { recursive: true });
  fs.writeFileSync(keysFile, JSON.stringify(priv, null, 1) + '\n');
  fs.writeFileSync(pubFile, JSON.stringify(pub, null, 1) + '\n');
  say(`  wrote ${pubFile} (prompts only) and ${keysFile} (keys)`);
}

function main() {
  const keysRoot = TESTS.some((t) => t.private) ? resolveKeysRoot('.') : null;
  if (TESTS.some((t) => t.private) && (!keysRoot || !fs.existsSync(privateSource(keysRoot)))) {
    console.error(`${PRIVATE_READINGS.join(', ')}: private reading banks are read from assessment-keys/readings-src, and no such checkout was found (set ASSESSMENT_KEYS or place ../assessment-keys beside this repo); nothing written`);
    process.exit(2);
  }
  const outputs = [], nextOutputs = [];
  for (const t of TESTS) {
    outputs.push([t, buildTest(t, t.next?.active ? t.next.bank : t.slug, { keysRoot })]);
    if (t.next && !t.next.active) nextOutputs.push(buildTest(t, t.next.bank, { keysRoot }));
  }
  if (optionalMissing) console.log(`${optionalMissing} answer(s) with no accepted alternate yet, on tests where alternates are optional (faculty to add)`);
  if (problems) { console.error(`${problems} problem(s); nothing written`); process.exit(1); }
  /* Written only when every test is sound, so a bank with a problem never
     leaves half its tests updated. */
  if (WRITE) for (const [t, out] of outputs) writeTest(t, out, { keysRoot });

  if (NEXT_OUT) for (const out of nextOutputs) { fs.mkdirSync(NEXT_OUT, { recursive: true }); fs.writeFileSync(path.join(NEXT_OUT, `${out.slug}.json`), JSON.stringify(out, null, 1) + "\n"); }
}
/** The problems counted while building (for a caller other than main). */
export const buildProblems = () => ({ problems, optionalMissing });

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) main();
