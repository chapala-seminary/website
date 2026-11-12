#!/usr/bin/env node
/* Defending the Christian Faith in Conversation with Islam (CTSIslam, 12 units,
 * Wayne 7 Nov 2026), from Markdown sources kept in the private assessment-keys
 * repo (sources/islam/U<n>-<lang>-<lesson|exam>.md, same shapes as the
 * denominational electives: tools/import-electives.mjs parses them).
 *
 *   node tools/import-islam.mjs <sources dir> <assessment-keys dir> [--write]
 *
 * Writes the catalog card, lessons, public question files, private key files
 * and the certificate page, and adds src/content/units/CTSIslam/ to .gitignore.
 * English is the source; other languages are marked machine translations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { hash } from '../src/lib/lesson.ts';
import { parseLesson, parseExam } from './import-electives.mjs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const [SRC, KEYS] = argv.filter((a) => !a.startsWith('--'));
if (!SRC || !KEYS) { console.error('usage: node tools/import-islam.mjs <sources> <assessment-keys> [--write]'); process.exit(2); }

const PREFIX = 'CTSIslam', SLUG = 'islam', UNITS = 12;
const TITLE = {
  en: 'Defending the Christian Faith in Conversation with Islam',
  es: 'Defensa de la fe cristiana en diálogo con el islam',
  fr: 'Défendre la foi chrétienne en dialogue avec l’islam',
};
const CARD = {
  code: PREFIX, entry: `${PREFIX}Unit1.html`, engine: true, group: 'theology-doctrine-and-discipleship', order: 30,
  title: TITLE,
  description: {
    en: 'A twelve-unit course that equips pastors to understand Islam accurately and to answer its claims about Jesus, the Trinity, the cross and the Bible with biblical and historical evidence, gently and with respect.',
    es: 'Un curso de doce unidades que capacita a los pastores para entender el islam con precisión y responder a sus afirmaciones sobre Jesús, la Trinidad, la cruz y la Biblia con evidencia bíblica e histórica, con mansedumbre y respeto.',
    fr: 'Un cours en douze unités qui prépare les pasteurs à comprendre l’islam avec justesse et à répondre à ses affirmations sur Jésus, la Trinité, la croix et la Bible par des preuves bibliques et historiques, avec douceur et respect.',
  },
};
const LANGS = ['en', 'es', 'fr', 'sw'];
const PROF = {
  en: '<strong>Professor:</strong> Dr. Wayne Cook | <strong>Director:</strong> Dr. Ted Rogers',
  es: '<strong>Profesor:</strong> Dr. Wayne Cook | <strong>Director:</strong> Dr. Ted Rogers',
  fr: '<strong>Professeur :</strong> Dr Wayne Cook | <strong>Directeur :</strong> Dr Ted Rogers',
  sw: '<strong>Profesa:</strong> Dkt. Wayne Cook | <strong>Mkurugenzi:</strong> Dkt. Ted Rogers',
};
const EXAM_UI = {
  head: { en: (n) => `Unit ${n} Exam`, es: (n) => `Examen de la Unidad ${n}`, fr: (n) => `Examen de l’unité ${n}`, sw: (n) => `Mtihani wa Sehemu ya ${n}` },
  intro: {
    en: '<strong>Certificate track:</strong> the 20 multiple-choice questions. <strong>Associate track:</strong> add the 10 fill-in-the-blank questions. <strong>Master’s tracks:</strong> add the 10 short-answer questions.',
    es: '<strong>Programa de certificado:</strong> las 20 preguntas de opción múltiple. <strong>Asociado:</strong> añada las 10 preguntas de completar. <strong>Programas de maestría:</strong> añada las 10 preguntas de respuesta corta.',
    fr: '<strong>Parcours certificat :</strong> les 20 questions à choix multiples. <strong>Associé :</strong> ajoutez les 10 phrases à compléter. <strong>Parcours de master :</strong> ajoutez les 10 questions à réponse courte.',
    sw: '<strong>Cheti:</strong> maswali 20 ya kuchagua jibu. <strong>Shahada ya Mshiriki:</strong> ongeza maswali 10 ya kujaza nafasi. <strong>Shahada za Uzamili:</strong> ongeza maswali 10 ya majibu mafupi.',
  },
  submit: { en: 'Submit Exam &amp; Check Pass', es: 'Enviar examen y verificar', fr: 'Envoyer l’examen et vérifier', sw: 'Wasilisha Mtihani na Uangalie Matokeo' },
  reset: { en: 'Reset', es: 'Reiniciar', fr: 'Recommencer', sw: 'Anza Upya' },
};
const UNIT_WORD = { en: 'Unit', es: 'Unidad', fr: 'Unité', sw: 'Sehemu ya' };

const problems = [];
function readSlot(n, slot) { const f = path.join(SRC, `U${n}-${slot}.md`); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; }

function buildUnit(n) {
  const L = {}, E = {};
  for (const lang of LANGS) {
    const lm = readSlot(n, `${lang}-lesson`), em = readSlot(n, `${lang}-exam`);
    if (lm == null || em == null) { if (lang === 'en') throw new Error(`U${n}: English missing`); continue; }
    try { L[lang] = parseLesson(lm, `U${n} ${lang} lesson`); E[lang] = parseExam(em, `U${n} ${lang} exam`); }
    catch (e) { if (lang === 'en') throw e; problems.push(`${e.message}; ${lang} left out`); delete L[lang]; delete E[lang]; }
  }
  const langs = LANGS.filter((l) => L[l]);
  for (const l of langs.filter((x) => x !== 'en')) {
    if (L[l].items.length !== L.en.items.length) { problems.push(`U${n} ${l}: ${L[l].items.length} lesson blocks vs ${L.en.items.length} English; ${l} left out`); langs.splice(langs.indexOf(l), 1); continue; }
    const bad = E.en.key.findIndex((k, i) => E[l].key[i] !== k);
    if (bad >= 0) { problems.push(`U${n} ${l}: answer key differs at mc ${bad + 1}; ${l} left out`); langs.splice(langs.indexOf(l), 1); }
  }
  return { L, E, langs };
}

function lessonFile(n, title, U) {
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
  const body = L.en.items.map((it, i) => ({ type: it.type, level: it.level, id: add(it.type, (l) => L[l].items[i].text) }));
  const eHead = add('heading', (l) => EXAM_UI.head[l](n));
  const eIntro = add('prose', EXAM_UI.intro);
  const eSub = add('label', EXAM_UI.submit);
  const eRes = add('label', EXAM_UI.reset);
  const both = (id) => `<span class="lang-en"><!--cts:${id}:en--></span><span class="lang-es"><!--cts:${id}:es--></span>`;
  const col = (lang) => body.map((b) => b.type === 'heading' ? `<h${b.level}><!--cts:${b.id}:${lang}--></h${b.level}>` : `<p${b.type === 'scripture' ? ' class="scripture" style="font-style:italic;"' : ''}><!--cts:${b.id}:${lang}--></p>`).join('\n');
  const template = `<div class="container">
<div class="card">
    <h1>${both(tTitle)}</h1>
    <p>${both(tProf)}</p>
</div>
<div class="card">
<div class="lang-en">
${col('en')}
</div>
<div class="lang-es">
${col('es')}
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
${fs.existsSync(`src/body/rooms/${PREFIX}Readings.html`) ? '\n<!--cts-part:honours-->\n' : ''}`;
  return { course: PREFIX, unit: n, sourceLang: 'en', langs, template, blocks };
}

const fold = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/ñ/g, 'ñ').replace(/(\p{Script=Latin})[̀-ͯ]+/gu, '$1').normalize('NFC');
const norm = (x) => ' ' + fold(x).normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ') + ' ';
const inText = (form, text) => { const t = norm(form).trim(); return t && text.includes(t); };
const hits = (groups, text) => groups.filter((g) => (Array.isArray(g) ? g : [g]).some((f) => inText(f, text))).length;
const promptPasses = [];

function unitFiles(n, unitTitles, U) {
  const { E, langs } = U;
  const per = (f) => Object.fromEntries(langs.map((l) => [l, f(l)]));
  const pub = {
    course: SLUG, pagePrefix: PREFIX, unit: n, totalUnits: UNITS,
    title: `CTS ${TITLE.en} — Unit ${n}: ${U.L.en.title}`,
    bodyClass: 'lang-en', styles: [], scripts: ['cts-lang.js', 'cts-track.js', 'cts-curriculum.js'],
    prevHref: n === 1 ? null : `${PREFIX}Unit${n - 1}.html`,
    nextHref: n === UNITS ? `${PREFIX}Certificate.html` : `${PREFIX}Unit${n + 1}.html`,
    filePrefix: PREFIX, unitTitles,
    mc: E.en.mc.map((_, i) => ({ stem: per((l) => E[l].mc[i].stem), options: per((l) => E[l].mc[i].options) })),
    sa: E.en.sa.map((_, i) => ({ prompt: per((l) => E[l].sa[i].prompt) })),
    fill: E.en.fill.map((_, i) => ({ prompt: per((l) => E[l].fill[i].prompt) })),
  };
  const keys = {
    source: `islam U${n}`,
    mc: E.en.key.map((k) => ({ answer: k })),
    sa: E.en.sa.map((_, i) => ({
      keywords: per((l) => E[l].sa[i].keywords.map((g) => (g.length === 1 ? g[0] : g))),
      model: per((l) => E[l].sa[i].model),
    })),
    fill: E.en.fill.map((_, i) => {
      const answer = per((l) => E[l].fill[i].acc[0]);
      const accept = Object.fromEntries(langs.map((l) => [l, E[l].fill[i].acc.slice(1)]));
      return Object.values(accept).some((a) => a.length) ? { answer, accept } : { answer };
    }),
  };
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
    const langsK = Object.keys(k.keywords);
    const most = Math.max(...langsK.map((l) => hits(k.keywords[l], norm(pub.sa[i].prompt[l]))));
    const fewest = Math.min(...langsK.map((l) => k.keywords[l].length));
    if (most >= Math.min(k.minHits || 3, fewest)) {
      if (most + 1 <= fewest) k.minHits = most + 1;
      else promptPasses.push(`U${n} sa ${i + 1}`);
    }
  });
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

function certificate(unitTitles) {
  let h = fs.readFileSync('public/CTSParablesCertificate.html', 'utf8');
  const rep = (a, b) => { if (!h.includes(a)) throw new Error(`certificate template changed: "${a.slice(0, 40)}"`); h = h.split(a).join(b); };
  rep('CTS Parables of the Bible &mdash;', `CTS ${TITLE.en} &mdash;`);
  rep("const COURSE = 'parables';", `const COURSE = '${SLUG}';`);
  rep('const totalUnits = 15;', `const totalUnits = ${UNITS};`);
  rep('CTSParablesUnit', `${PREFIX}Unit`);
  rep('all 15 units of <em>Parables of the Bible</em>', `all ${UNITS} units of <em>${TITLE.en}</em>`);
  rep('las 12 unidades de <em>El Evangelio de Juan</em>', `las ${UNITS} unidades de <em>${TITLE.es}</em>`);
  rep('les 15 unités de <em>Les paraboles de la Bible</em>', `les ${UNITS} unités de <em>${TITLE.fr}</em>`);
  rep('all fifteen units', 'all twelve units');
  rep('las quince unidades', 'las doce unidades');
  rep('<span class="lang-en">Parables of the Bible</span><span class="lang-es">Las Parábolas de la Biblia</span><span class="lang-fr">Les paraboles de la Bible</span>',
    `<span class="lang-en">${TITLE.en}</span><span class="lang-es">${TITLE.es}</span><span class="lang-fr">${TITLE.fr}</span>`);
  rep('A 15-unit', `A ${UNITS}-unit`); rep('de 15 unidades', `de ${UNITS} unidades`); rep('en 15 unités', `en ${UNITS} unités`);
  h = h.replace(/const unitTitlesEn = \[[^\]]*\];/, `const unitTitlesEn = ${JSON.stringify(unitTitles.en)};`);
  const esLine = /const unitTitlesEs = \[[^\]]*\];/;
  if (esLine.test(h)) h = h.replace(esLine, `const unitTitlesEs = ${JSON.stringify(unitTitles.es)};`);
  if (/parab/i.test(h)) throw new Error('certificate still mentions Parables');
  return h;
}

const units = [];
for (let n = 1; n <= UNITS; n++) units.push(buildUnit(n));
const unitTitles = Object.fromEntries(['en', 'es'].map((l) => [l, units.map((u, i) => `${UNIT_WORD[l]} ${i + 1} - ${(u.L[l] || u.L.en).title}`)]));
console.log(`${PREFIX}: ${units.length} units; langs per unit: ${units.map((u) => u.langs.join('+')).join(' ')}`);
if (WRITE) {
  fs.mkdirSync(`src/content/lessons/${PREFIX}`, { recursive: true });
  fs.mkdirSync(`src/content/units-public/${PREFIX}`, { recursive: true });
  fs.mkdirSync(path.join(KEYS, 'units', PREFIX), { recursive: true });
  fs.writeFileSync(`src/content/courses/${PREFIX}.json`, JSON.stringify(CARD, null, 2) + '\n');
  units.forEach((U, i) => {
    const n = i + 1;
    const uTitle = Object.fromEntries(U.langs.map((l) => [l, `${TITLE[l] || TITLE.en} — ${UNIT_WORD[l]} ${n}: ${U.L[l].title}`]));
    fs.writeFileSync(`src/content/lessons/${PREFIX}/${n}.json`, JSON.stringify(lessonFile(n, uTitle, U), null, 1) + '\n');
    const { pub, keys } = unitFiles(n, unitTitles, U);
    fs.writeFileSync(`src/content/units-public/${PREFIX}/${n}.json`, JSON.stringify(pub, null, 1) + '\n');
    const kf = path.join(KEYS, 'units', PREFIX, `${n}.json`);
    if (fs.existsSync(kf)) { const old = JSON.parse(fs.readFileSync(kf, 'utf8')); keys.sa.forEach((q, j) => { if (old.sa?.[j]?.rubric) q.rubric = old.sa[j].rubric; }); }
    fs.writeFileSync(kf, JSON.stringify(keys, null, 1) + '\n');
  });
  fs.writeFileSync(`public/${PREFIX}Certificate.html`, certificate(unitTitles));
  const gi = fs.readFileSync('.gitignore', 'utf8');
  const line = `src/content/units/${PREFIX}/`;
  if (!gi.split('\n').map((l) => l.trim()).includes(line)) fs.writeFileSync('.gitignore', gi.replace(/\n*$/, '\n') + line + '\n');
}
if (problems.length) { console.log(`\n${problems.length} note(s):`); for (const p of problems) console.log('  - ' + p); }
if (promptPasses.length) console.log(`\n${promptPasses.length} prompt(s) still pass as their own answer:\n  ` + promptPasses.join('\n  '));
