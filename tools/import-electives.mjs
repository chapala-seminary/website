#!/usr/bin/env node
/* The twenty denominational electives (interim edition, Wayne 21 Oct 2026),
 * from the Google Docs exported as Markdown into the private assessment-keys
 * repo (sources/denominational/<CODE>/U<n>-<slot>.md) into the site.
 *
 *   node tools/import-electives.mjs <sources dir> <assessment-keys dir> [CODE ...] [--write]
 *
 * Without --write it only reads and reports. CODE is A-C1 … D-C5 (A Pentecostal–
 * Charismatic, B Baptist–Congregational, C Methodist–Wesleyan–Nazarene,
 * D Reformed–Presbyterian); default is every code with sources present.
 *
 * Per course it writes
 *   src/content/courses/<Prefix>.json             the catalog card
 *   src/content/lessons/<Prefix>/<n>.json         lesson blocks, en/es/fr
 *   src/content/units-public/<Prefix>/<n>.json    questions WITHOUT keys (public)
 *   <keys>/units/<Prefix>/<n>.json                the keys (private repo only)
 *   public/<Prefix>Certificate.html               from the Parables certificate
 * and adds src/content/units/<Prefix>/ to .gitignore (tools/private-units.mjs
 * merges the two halves at build time; see that file).
 *
 * English is the source; es and fr are marked machine translations. The exam
 * answer letters must agree in all three languages, and the lesson paragraphs
 * must pair one to one, or the unit is refused with a message.
 */
import fs from 'node:fs';
import path from 'node:path';
import { hash } from '../src/lib/lesson.ts';
import { heldPrefixes } from './elective-held.mjs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const [SRC, KEYS, ...rest] = argv.filter((a) => !a.startsWith('--'));
// importable for its names (TRADITIONS, prefixOf: tools/build-elective-readings.mjs); it runs only from the command line
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain && (!SRC || !KEYS)) { console.error('usage: node tools/import-electives.mjs <sources> <assessment-keys> [CODE ...] [--write]'); process.exit(2); }

export const TRADITIONS = {
  A: { id: 'pentecostal-charismatic-electives', tag: 'PC',
       title: { en: 'Pentecostal–Charismatic Electives', es: 'Electivas pentecostales y carismáticas', fr: 'Cours optionnels pentecôtistes et charismatiques' } },
  B: { id: 'baptist-electives', tag: 'Bap',
       title: { en: 'Baptist–Congregational Electives', es: 'Electivas bautistas y congregacionales', fr: 'Cours optionnels baptistes et congrégationalistes' } },
  C: { id: 'wesleyan-electives', tag: 'Wes',
       title: { en: 'Methodist–Wesleyan–Nazarene Electives', es: 'Electivas metodistas, wesleyanas y nazarenas', fr: 'Cours optionnels méthodistes, wesleyens et nazaréens' } },
  D: { id: 'reformed-electives', tag: 'Ref',
       title: { en: 'Reformed–Presbyterian Electives', es: 'Electivas reformadas y presbiterianas', fr: 'Cours optionnels réformés et presbytériens' } },
};
const DESC = {
  A: { en: 'Interim elective written from within the Pentecostal and Charismatic tradition.', es: 'Electiva provisional escrita desde la tradición pentecostal y carismática.', fr: 'Cours optionnel provisoire rédigé de l’intérieur de la tradition pentecôtiste et charismatique.' },
  B: { en: 'Interim elective written from within the Baptist and Congregational tradition.', es: 'Electiva provisional escrita desde la tradición bautista y congregacional.', fr: 'Cours optionnel provisoire rédigé de l’intérieur de la tradition baptiste et congrégationaliste.' },
  C: { en: 'Interim elective written from within the Methodist, Wesleyan and Nazarene tradition.', es: 'Electiva provisional escrita desde la tradición metodista, wesleyana y nazarena.', fr: 'Cours optionnel provisoire rédigé de l’intérieur de la tradition méthodiste, wesleyenne et nazaréenne.' },
  D: { en: 'Interim elective written from within the Reformed and Presbyterian tradition.', es: 'Electiva provisional escrita desde la tradición reformada y presbiteriana.', fr: 'Cours optionnel provisoire rédigé de l’intérieur de la tradition réformée et presbytérienne.' },
};
/* A-C1 -> CTSElecPC1 / elecpc1 / CTSELECPC1. Names are permanent once live. */
export const prefixOf = (code) => `CTSElec${TRADITIONS[code[0]].tag}${code.slice(-1)}`;
export const slugOf = (code) => prefixOf(code).slice(3).toLowerCase();
const UNITS = 10;
/* The course-readings box (src/lib/partials.ts honours) goes on a unit only
   once the course has its reading room (tools/build-elective-readings.mjs),
   so no unit links a room that does not exist. */
const hasRoom = (prefix) => !heldPrefixes().has(prefix) && fs.existsSync(`src/body/rooms/${prefix}Readings.html`);   // never for a held course (src/data/elective-held.json)
const LANGS = ['en', 'es', 'fr'];

const INTERIM = {
  en: '<strong>Interim edition.</strong> This elective is written from inside its own tradition and counts toward CTS degrees like any other course. It will be revised or joined with lecture material from faculty of this tradition.',
  es: '<strong>Edición provisional.</strong> Esta electiva está escrita desde dentro de su propia tradición y cuenta para los títulos del STC como cualquier otro curso. Será revisada o complementada con material de clases de profesores de esta tradición.',
  fr: '<strong>Édition provisoire.</strong> Ce cours optionnel est rédigé de l’intérieur de sa propre tradition et compte pour les diplômes du STC comme tout autre cours. Il sera révisé ou complété par des cours de professeurs de cette tradition.',
};
const PROF = {
  en: '<strong>Professor:</strong> Dr. Wayne Cook | <strong>Director:</strong> Dr. Ted Rogers',
  es: '<strong>Profesor:</strong> Dr. Wayne Cook | <strong>Director:</strong> Dr. Ted Rogers',
  fr: '<strong>Professeur :</strong> Dr Wayne Cook | <strong>Directeur :</strong> Dr Ted Rogers',
};
const EXAM_UI = {
  head: { en: (n) => `Unit ${n} Exam`, es: (n) => `Examen de la Unidad ${n}`, fr: (n) => `Examen de l’unité ${n}` },
  intro: {
    en: '<strong>Certificate track:</strong> the 20 multiple-choice questions. <strong>Associate track:</strong> add the 10 fill-in-the-blank questions. <strong>Master’s tracks:</strong> add the 10 short-answer questions.',
    es: '<strong>Programa de certificado:</strong> las 20 preguntas de opción múltiple. <strong>Asociado:</strong> añada las 10 preguntas de completar. <strong>Programas de maestría:</strong> añada las 10 preguntas de respuesta corta.',
    fr: '<strong>Parcours certificat :</strong> les 20 questions à choix multiples. <strong>Associé :</strong> ajoutez les 10 phrases à compléter. <strong>Parcours de master :</strong> ajoutez les 10 questions à réponse courte.',
  },
  submit: { en: 'Submit Exam &amp; Check Pass', es: 'Enviar examen y verificar', fr: 'Envoyer l’examen et vérifier' },
  reset: { en: 'Reset', es: 'Reiniciar', fr: 'Recommencer' },
};
const UNIT_WORD = { en: 'Unit', es: 'Unidad', fr: 'Unité' };

/* ---------------------------------------------------------------- markdown */
const unesc = (s) => s.replace(/\\([\\`*_{}\[\]()#+\-.!|=<>~"'&$%^])/g, '$1');
function inline(s) {
  let t = unesc(s.trim());
  t = t.replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  t = t.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>');
  return t.replace(/\s+/g, ' ');
}
const lines = (md) => md.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, ''));

/* A lesson: "# Title", course line, "Unit n of 10", then ## / ### headings and
   paragraphs. Returns { title, course, items:[{type,text,level}] }. */
export function parseLesson(md, where) {
  const out = { title: '', course: '', items: [] };
  for (const raw of lines(md)) {
    const l = raw.trim();
    if (!l) continue;
    const u = unesc(l);
    const h = /^(#{1,4})\s+(.*)$/.exec(u);
    if (h) {
      if (h[1].length === 1 && !out.title) { out.title = inline(h[2]); continue; }
      out.items.push({ type: 'heading', level: Math.min(Math.max(h[1].length, 2), 3), text: inline(h[2]) });
      continue;
    }
    if (!out.title) continue;
    if (!out.course && !out.items.length && /\d/.test(u) && /:/.test(u)) { out.course = inline(u); continue; }
    if (!out.items.length && /^\S+\s+\d+\s+\S+\s+10$/.test(u)) continue;          // "Unit 1 of 10"
    let text = l, type = 'prose';
    const bullet = /^\\?[-*•]\s+(.*)$/.exec(l);
    if (bullet) text = '• ' + bullet[1];
    out.items.push({ type, text: inline(text) });
  }
  // the paragraph after the first heading (Key Verse) is Scripture
  if (out.items[0]?.type === 'heading' && out.items[1]?.type === 'prose') out.items[1].type = 'scripture';
  if (!out.title) throw new Error(`${where}: no "# Title" line`);
  return out;
}

/* An exam bank: Part A (mc), Part B (sa), Part C (fill), then the key. The
   section words differ by language, so sections are found by order of "##". */
export function parseExam(md, where) {
  const sec = [];
  for (const raw of lines(md)) {
    const u = unesc(raw.trim());
    if (/^##\s/.test(u) && !/^###/.test(u)) { sec.push([]); continue; }
    if (sec.length) sec[sec.length - 1].push(raw.trim());
  }
  if (sec.length < 4) throw new Error(`${where}: expected 4 "##" sections (A, B, C, key), found ${sec.length}`);
  const [A, B, C, K] = sec;
  const mc = [];
  for (const l of A) {
    const u = unesc(l);
    let m = /^(?:[A-Z]{1,3}\s?)?(\d+)\.\s+(.*)$/.exec(u);
    if (m) { mc.push({ stem: inline(m[2]), options: [] }); continue; }
    m = /^([A-D])\.\s+(.*)$/.exec(u);
    if (m && mc.length) mc[mc.length - 1].options.push(inline(m[2]));
  }
  const sa = [];
  for (const l of B) {
    const u = unesc(l);
    let m = /^(?:\*\*)?[A-Z]{1,3}\s?(\d+)\.\s*(.*?)(?:\*\*)?$/.exec(u);
    if (m) { sa.push({ prompt: inline(m[2]), model: '', keywords: [] }); continue; }
    if (!sa.length) continue;
    const cur = sa[sa.length - 1];
    m = /^[^:]{3,40}:\s+(.{20,})$/.exec(u);
    if (!cur.model && m && !/^\d+\./.test(u)) { cur.model = inline(m[1]); continue; }
    m = /^(\d+)\.\s+(.*)$/.exec(u);
    if (m && cur.model) cur.keywords.push(m[2].split('|').map((s) => unesc(s).trim().toLowerCase()).filter(Boolean));
  }
  const fill = [];
  for (const l of C) {
    const u = unesc(l);
    let m = /^(?:[A-Z]{1,3}\s?)?(\d+)\.\s+(.*)$/.exec(u);
    if (m) {
      let n = 0;                                   // a repeated blank (same answer twice) keeps only the first
      fill.push({ prompt: inline(m[2]).replace(/_{3,}/g, () => (n++ ? '…' : '____')), acc: [] });
      continue;
    }
    m = /^[^:]{3,30}:\s+(.*)$/.exec(u);
    if (m && fill.length && !fill[fill.length - 1].acc.length) fill[fill.length - 1].acc = m[1].split(' / ').map((s) => unesc(s).trim()).filter(Boolean);
  }
  const key = [];
  for (const l of K) { const m = /^(\d+)\.\s+([A-D])\s*$/.exec(unesc(l)); if (m) key[+m[1] - 1] = 'ABCD'.indexOf(m[2]); }
  const errs = [];
  if (mc.length !== 20) errs.push(`${mc.length} multiple-choice questions`);
  mc.forEach((q, i) => { if (q.options.length !== 4) errs.push(`mc ${i + 1}: ${q.options.length} options`); });
  if (key.filter((k) => k >= 0).length !== 20) errs.push(`answer key has ${key.filter((k) => k >= 0).length} entries`);
  if (sa.length !== 10) errs.push(`${sa.length} short answers`);
  sa.forEach((q, i) => { if (!q.model) errs.push(`sa ${i + 1}: no model answer`); if (q.keywords.length !== 8) errs.push(`sa ${i + 1}: ${q.keywords.length} keyword groups`); });
  if (fill.length !== 10) errs.push(`${fill.length} fill-ins`);
  fill.forEach((q, i) => { if ((q.prompt.match(/____/g) || []).length !== 1) errs.push(`fill ${i + 1}: needs exactly one blank`); if (!q.acc.length) errs.push(`fill ${i + 1}: no accepted answer`); });
  if (errs.length) throw new Error(`${where}: ${errs.join('; ')}`);
  return { mc, sa, fill, key };
}

/* ---------------------------------------------------------------- build */
function readSlot(dir, n, slot) {
  const f = path.join(dir, `U${n}-${slot}.md`);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}
const titleOnly = (t) => t.replace(/^[^:]*:\s*/, '');      // "Exam: X" -> "X"

function buildUnit(code, n, problems) {
  const dir = path.join(SRC, code);
  const L = {}, E = {};
  for (const lang of LANGS) {
    const lm = readSlot(dir, n, `${lang}-lesson`), em = readSlot(dir, n, `${lang}-exam`);
    if (lm == null || em == null) { if (lang === 'en') throw new Error(`${code} U${n}: English lesson or exam missing`); problems.push(`${code} U${n}: no ${lang}; that language is left out of this unit`); continue; }
    try { L[lang] = parseLesson(lm, `${code} U${n} ${lang} lesson`); E[lang] = parseExam(em, `${code} U${n} ${lang} exam`); }
    catch (e) { if (lang === 'en') throw e; problems.push(`${e.message}; ${lang} left out`); delete L[lang]; delete E[lang]; }
  }
  const langs = LANGS.filter((l) => L[l]);
  for (const l of langs.filter((x) => x !== 'en')) {
    // A translation that adds a paragraph (a translator's note on terms, say) where English goes on to a
    // heading: fold the extra paragraph into the one before it, so the blocks still pair one to one.
    if (L[l].items.length > L.en.items.length) {
      const out = [];
      for (const it of L[l].items) {
        const want = L.en.items[out.length];
        if (want && it.type === 'prose' && want.type === 'heading' && out.length && out[out.length - 1].type !== 'heading') {
          out[out.length - 1] = { ...out[out.length - 1], text: out[out.length - 1].text + '<br><br>' + it.text };
          problems.push(`${code} U${n} ${l}: an extra paragraph was joined to the one before it (block ${out.length})`);
        } else out.push(it);
      }
      L[l].items = out;
    }
    if (L[l].items.length !== L.en.items.length) { problems.push(`${code} U${n} ${l}: ${L[l].items.length} lesson paragraphs vs ${L.en.items.length} English; ${l} left out`); langs.splice(langs.indexOf(l), 1); continue; }
    const bad = E.en.key.findIndex((k, i) => E[l].key[i] !== k);
    if (bad >= 0) { problems.push(`${code} U${n} ${l}: answer key differs at mc ${bad + 1}; ${l} left out`); langs.splice(langs.indexOf(l), 1); }
  }
  return { L, E, langs };
}

function lessonFile(prefix, n, title, U) {
  const { L, langs } = U;
  const tr = (en) => Object.fromEntries(langs.filter((l) => l !== 'en').map((l) => [l, { status: 'machine', from: hash(en) }]));
  const blocks = [];
  const add = (type, text) => {
    const id = 'b' + String(blocks.length + 1).padStart(3, '0');
    const t = Object.fromEntries(langs.map((l) => [l, typeof text === 'function' ? text(l) : text[l]]));
    const b = { id, type, text: t };
    if (langs.length > 1) b.tr = tr(t.en);
    blocks.push(b); return id;
  };
  const tTitle = add('title', (l) => title[l]);
  const tProf = add('prose', PROF);
  const tInterim = add('prose', INTERIM);
  const body = L.en.items.map((it, i) => ({ type: it.type, level: it.level, id: add(it.type, (l) => L[l].items[i].text) }));
  const eHead = add('heading', (l) => EXAM_UI.head[l](n));
  const eIntro = add('prose', EXAM_UI.intro);
  const eSub = add('label', EXAM_UI.submit);
  const eRes = add('label', EXAM_UI.reset);
  const both = (id) => `<span class="lang-en"><!--cts:${id}:en--></span><span class="lang-es"><!--cts:${id}:${langs.includes('es') ? 'es' : 'en'}--></span>`;
  const col = (lang) => body.map((b) => b.type === 'heading' ? `<h${b.level}><!--cts:${b.id}:${lang}--></h${b.level}>` : `<p${b.type === 'scripture' ? ' class="scripture" style="font-style:italic;"' : ''}><!--cts:${b.id}:${lang}--></p>`).join('\n');
  const esCol = langs.includes('es') ? 'es' : 'en';
  const template = `<div class="container">
<div class="card">
    <h1>${both(tTitle)}</h1>
    <p>${both(tProf)}</p>
    <p class="interim-note" style="margin-top:10px; padding:8px 10px; border-left:4px solid #b8860b; background:#fff8e6;">${both(tInterim)}</p>
</div>
<div class="card">
<div class="lang-en">
${col('en')}
</div>
<div class="lang-es">
${col(esCol)}
</div>
</div>
<div class="card">
    <h2>${both(eHead)}</h2>
    <p>${both(eIntro)}</p>
    <div id="questionsContainer"></div>
    <div style="margin-top:20px;">
        <button id="submitExamBtn" class="small">${both(eSub)}</button>
        <button id="resetExamBtn" class="small" style="background:#8a1f1f;">${both(eRes)}</button>
        <div id="examResult" style="margin-top:15px; font-weight:bold;"></div>
        <div id="mcBankedNotice" style="margin-top:10px; font-size:0.9rem; color:#1f6b3b; display:none;"></div>
    </div>
</div>
</div>
${hasRoom(prefix) ? '\n<!--cts-part:honours-->\n' : ''}`;
  return { course: prefix, unit: n, sourceLang: 'en', langs, template, blocks };
}

function unitFiles(code, prefix, slug, n, courseTitle, unitTitles, U) {
  const { E, langs } = U;
  const per = (f) => Object.fromEntries(langs.map((l) => [l, f(l)]));
  const pub = {
    course: slug, pagePrefix: prefix, unit: n, totalUnits: UNITS,
    title: `CTS ${courseTitle.en} — Unit ${n}: ${titleOnly(unitTitles.en[n - 1]).replace(/^Unit \d+ - /, '')}`,
    bodyClass: 'lang-en', styles: [], scripts: ['cts-lang.js', 'cts-track.js', 'cts-curriculum.js'],
    prevHref: n === 1 ? null : `${prefix}Unit${n - 1}.html`,
    nextHref: n === UNITS ? `${prefix}Certificate.html` : `${prefix}Unit${n + 1}.html`,
    filePrefix: prefix, unitTitles,
    mc: E.en.mc.map((_, i) => ({ stem: per((l) => E[l].mc[i].stem), options: per((l) => E[l].mc[i].options) })),
    sa: E.en.sa.map((_, i) => ({ prompt: per((l) => E[l].sa[i].prompt) })),
    fill: E.en.fill.map((_, i) => ({ prompt: per((l) => E[l].fill[i].prompt) })),
  };
  const keys = {
    source: `${code} U${n}`,
    mc: E.en.key.map((k) => ({ answer: k })),
    sa: E.en.sa.map((_, i) => ({
      keywords: per((l) => E[l].sa[i].keywords.map((g) => (g.length === 1 ? g[0] : g))),
      model: per((l) => E[l].sa[i].model),
    })),
    fill: E.en.fill.map((_, i) => {
      const answer = per((l) => E[l].fill[i].acc[0]);
      const accept = Object.fromEntries(langs.map((l) => [l, E[l].fill[i].acc.slice(1)]));
      // every language or none: the schema wants prompts and keys translated together
      return Object.values(accept).some((a) => a.length) ? { answer, accept } : { answer };
    }),
  };
  // A question must not pass as its own answer (test/french-import.test.mjs): where a language's prompt alone
  // would meet the keyword grader (cts-engine.js keywordPass), drop the keyword forms the prompt already
  // contains, keeping any group the prompt would otherwise empty.
  const fold = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/n\u0303/g, '\u00f1')
    .replace(/(\p{Script=Latin})[\u0300-\u036f]+/gu, '$1').normalize('NFC');
  const norm = (x) => ' ' + fold(x).normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ') + ' ';
  const inText = (form, text) => { const n = norm(form).trim(); return n && text.includes(n); };
  const hits = (groups, text) => groups.filter((g) => (Array.isArray(g) ? g : [g]).some((f) => inText(f, text))).length;
  keys.sa.forEach((k, i) => {
    for (const l of Object.keys(k.keywords)) {
      const text = norm(pub.sa[i].prompt[l]), groups = k.keywords[l];
      if (hits(groups, text) < Math.min(3, groups.length)) continue;
      k.keywords[l] = groups.map((g) => {
        const forms = Array.isArray(g) ? g : [g], kept = forms.filter((f) => !inText(f, text));
        const out = kept.length ? kept : forms;
        return out.length === 1 ? out[0] : out;
      });
    }
    // Prompts that name the very facts asked for (dates, names) still hit: ask for one keyword more than
    // the best prompt hits, in every language.
    const langsK = Object.keys(k.keywords);
    const most = Math.max(...langsK.map((l) => hits(k.keywords[l], norm(pub.sa[i].prompt[l]))));
    const fewest = Math.min(...langsK.map((l) => k.keywords[l].length));
    if (most >= Math.min(k.minHits || 3, fewest)) {
      if (most + 1 <= fewest) k.minHits = most + 1;
      else promptPasses.push(`${code} U${n} sa ${i + 1}`);
    }
  });
  // Translation provenance, stamped exactly as tools/translation-plan.mjs does. It hashes the keys too, so it
  // lives with them in the private repo (a public hash of the answer index would give the answer away).
  const QF = ['stem', 'prompt', 'options', 'why', 'answer', 'accept', 'keywords', 'model'];
  for (const sec of ['mc', 'sa', 'fill']) pub[sec].forEach((pq, i) => {
    const q = { ...pq, ...keys[sec][i] };
    const original = Object.fromEntries(QF.filter((k) => q[k]?.en != null).map((k) => [k, q[k].en]));
    const shared = { ...(typeof q.answer === 'number' ? { answerIndex: q.answer } : {}), ...(q.minHits != null ? { minHits: q.minHits } : {}) };
    const from = hash(JSON.stringify({ ...original, ...shared }));
    const tr = Object.fromEntries(langs.filter((l) => l !== 'en').map((l) => [l, { status: 'machine', from }]));
    if (Object.keys(tr).length) keys[sec][i].tr = tr;
  });
  return { pub, keys };
}

function certificate(prefix, slug, title, unitTitles) {
  let h = fs.readFileSync('public/CTSParablesCertificate.html', 'utf8');
  const rep = (a, b) => { if (!h.includes(a)) throw new Error(`certificate template changed: "${a.slice(0, 40)}"`); h = h.split(a).join(b); };
  rep('CTS Parables of the Bible &mdash;', `CTS ${title.en} &mdash;`);
  rep("const COURSE = 'parables';", `const COURSE = '${slug}';`);
  rep('const totalUnits = 15;', `const totalUnits = ${UNITS};`);
  rep('CTSParablesUnit', `${prefix}Unit`);
  rep('all 15 units of <em>Parables of the Bible</em>', `all ${UNITS} units of <em>${title.en}</em>`);
  rep('las 12 unidades de <em>El Evangelio de Juan</em>', `las ${UNITS} unidades de <em>${title.es}</em>`);
  rep('les 15 unités de <em>Les paraboles de la Bible</em>', `les ${UNITS} unités de <em>${title.fr}</em>`);
  rep('all fifteen units', 'all ten units');
  rep('las quince unidades', 'las diez unidades');
  rep('<span class="lang-en">Parables of the Bible</span><span class="lang-es">Las Parábolas de la Biblia</span><span class="lang-fr">Les paraboles de la Bible</span>',
    `<span class="lang-en">${title.en}</span><span class="lang-es">${title.es}</span><span class="lang-fr">${title.fr}</span>`);
  rep('A 15-unit', `A ${UNITS}-unit`); rep('de 15 unidades', `de ${UNITS} unidades`); rep('en 15 unités', `en ${UNITS} unités`);
  h = h.replace(/const unitTitlesEn = \[[^\]]*\];/, `const unitTitlesEn = ${JSON.stringify(unitTitles.en)};`);
  const esLine = /const unitTitlesEs = \[[^\]]*\];/;
  if (esLine.test(h)) h = h.replace(esLine, `const unitTitlesEs = ${JSON.stringify(unitTitles.es)};`);
  if (/parab/i.test(h)) throw new Error(`${prefix} certificate still mentions Parables`);
  return h;
}

/* ---------------------------------------------------------------- main */
const promptPasses = [];
if (isMain) main();
function main() {
const codes = rest.length ? rest : fs.readdirSync(SRC).filter((d) => /^[A-D]-C[1-5]$/.test(d)).sort();
const problems = [];
const ignoreAdd = [];
for (const code of codes) {
  const prefix = prefixOf(code), slug = slugOf(code), trad = TRADITIONS[code[0]];
  const units = [];
  for (let n = 1; n <= UNITS; n++) units.push(buildUnit(code, n, problems));
  const langsAll = LANGS.filter((l) => units.every((u) => u.langs.includes(l)));
  const course = Object.fromEntries(LANGS.map((l) => [l, (units[0].L[l] || units[0].L.en).course.replace(/^[^:]*\d+\s*:\s*/, '')]));
  const unitTitles = Object.fromEntries(['en', 'es'].map((l) => [l, units.map((u, i) => `${UNIT_WORD[l]} ${i + 1} - ${(u.L[l] || u.L.en).title}`)]));
  const title = Object.fromEntries(LANGS.map((l) => [l, `${course[l]}`]));
  const card = {
    code: prefix, entry: `${prefix}Unit1.html`, engine: true, group: trad.id, order: +code.slice(-1),
    title, description: DESC[code[0]],
  };
  console.log(`${code} -> ${prefix} (${slug}): ${title.en} | langs in every unit: ${langsAll.join(',')}`);
  if (!WRITE) continue;
  fs.mkdirSync(`src/content/lessons/${prefix}`, { recursive: true });
  fs.mkdirSync(`src/content/units-public/${prefix}`, { recursive: true });
  fs.mkdirSync(path.join(KEYS, 'units', prefix), { recursive: true });
  fs.writeFileSync(`src/content/courses/${prefix}.json`, JSON.stringify(card, null, 2) + '\n');
  units.forEach((U, i) => {
    const n = i + 1;
    const uTitle = Object.fromEntries(U.langs.map((l) => [l, `${course[l]} — ${UNIT_WORD[l]} ${n}: ${U.L[l].title}`]));
    fs.writeFileSync(`src/content/lessons/${prefix}/${n}.json`, JSON.stringify(lessonFile(prefix, n, uTitle, U), null, 1) + '\n');
    const { pub, keys } = unitFiles(code, prefix, slug, n, title, unitTitles, U);
    fs.writeFileSync(`src/content/units-public/${prefix}/${n}.json`, JSON.stringify(pub, null, 1) + '\n');
    // AI-grading rubrics (docs/ai-grading.md section 3) are written after import and kept across re-imports
    const kf = path.join(KEYS, 'units', prefix, `${n}.json`);
    if (fs.existsSync(kf)) {
      const old = JSON.parse(fs.readFileSync(kf, 'utf8'));
      keys.sa.forEach((q, i) => { if (old.sa?.[i]?.rubric) q.rubric = old.sa[i].rubric; });
    }
    fs.writeFileSync(kf, JSON.stringify(keys, null, 1) + '\n');
  });
  fs.writeFileSync(`public/${prefix}Certificate.html`, certificate(prefix, slug, title, unitTitles));
  ignoreAdd.push(`src/content/units/${prefix}/`);
}
if (WRITE && codes.length) {
  const gf = 'src/data/catalog-groups.json';
  const groups = JSON.parse(fs.readFileSync(gf, 'utf8'));
  for (const t of [...new Set(codes.map((c) => c[0]))].sort()) {
    const { id, title } = TRADITIONS[t];
    if (!groups.some((g) => g.id === id)) groups.push({ id, title: { en: title.en, es: title.es } });
  }
  fs.writeFileSync(gf, JSON.stringify(groups, null, 2) + '\n');
}
if (WRITE && ignoreAdd.length) {
  const gi = fs.readFileSync('.gitignore', 'utf8');
  const MARK = '# ---- Private-key unit exams (tools/private-units.mjs merges them at build; never commit) ----';
  const have = new Set(gi.split('\n').map((l) => l.trim()));
  const add = ignoreAdd.filter((l) => !have.has(l));
  if (add.length) fs.writeFileSync('.gitignore', gi.replace(/\n*$/, '\n') + (gi.includes(MARK) ? '' : `\n${MARK}\n`) + add.join('\n') + '\n');
}
if (problems.length) { console.log(`\n${problems.length} note(s):`); for (const p of problems) console.log('  - ' + p); }
if (promptPasses.length) console.log(`\n${promptPasses.length} prompt(s) still pass as their own answer:\n  ` + promptPasses.join('\n  '));
}
