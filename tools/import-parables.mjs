/* Parables of the Bible, from Dr. Cook's delivered unit pages into the site's
 * data: one lesson file and one exam file per unit, and the four unit
 * illustrations as image files.
 *
 *   node tools/import-parables.mjs <folder with CTSParablesUnit1..15.html> [--write]
 *
 * Without --write it only reads and reports. The delivered pages carry their
 * own test engine, which Dr. Cook asked us not to use (a student could pass it
 * without reading: a wrong multiple-choice click highlights the right answer,
 * and 100 characters of filler reveals the model answer). Only the content is
 * taken: the lesson text, and the three question banks, which go through the
 * site's one engine (public/assets/js/cts-engine.js) like every other course.
 *
 * WHAT IS TAKEN FROM EACH PAGE
 *   the title card        h1, the professor line, the epigraph  -> three blocks
 *   figure.unit-figure    (four units) the JPEG, written to
 *                         public/assets/img/parables/unitN.jpg and referenced
 *                         by path rather than carried as 200 KB of base64
 *   #teachingContent      .lang-en and .lang-es, whose children (h2, h3, p)
 *                         pair up one to one -> one block per pair
 *   the exam card         heading, instructions, the two button labels
 *   mcQuestions           20 multiple choice; the answer index is encoded as
 *                         c = (answer + 7*(position+3)) mod 251 and decoded here
 *   kwQuestions           10 short answer with keyword stems and model answers
 *   fibQuestions          10 fill in the blank; the first accepted answer is
 *                         the answer, the rest are `accept`
 *
 * WHAT IS NOT TAKEN
 *   the registration card, the navigation, the language buttons (the layout
 *   renders those once for every course), the honours card (the honours box
 *   is a partial, src/lib/partials.ts, pointed at CTSParablesReadings.html),
 *   and the inline engine.
 *
 * The lesson template is the same shape as The Gospel of John's, the model
 * course in docs/adding-a-course.md. Every piece of text is a block, so the
 * CMS can reach it (tools/verify-editable.mjs); nothing is left frozen in the
 * template.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { parse } from 'node-html-parser';
import { hash } from '../src/lib/lesson.ts';

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const SRC = args.find((a) => !a.startsWith('-'));
if (!SRC) { console.error('usage: node tools/import-parables.mjs <folder> [--write]'); process.exit(2); }

const COURSE = 'CTSParables';          // page prefix and lesson course id
const SLUG = 'parables';               // storage key: cts_parables_progress
const TOTAL = 15;
const LESSONS = `src/content/lessons/${COURSE}`;
const UNITS = `src/content/units/${COURSE}`;
const IMG_DIR = 'public/assets/img/parables';

/* The pages are UTF-8 and use characters, not entities, except a few of the
   structural kind, which stay as they are (the lesson schema allows exactly
   these three). Anything else is reported rather than guessed at. */
const ENTITY = /&(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#[xX][0-9a-fA-F]+);/g;
const STRUCTURAL = /^&(?:amp|lt|gt);$/;
const problems = [];
const say = (m) => problems.push(m);

function text(el) {
  const t = el.innerHTML.replace(/\s+/g, ' ').trim();
  for (const e of new Set(t.match(ENTITY) || [])) if (!STRUCTURAL.test(e)) say(`entity ${e} in "${t.slice(0, 60)}"`);
  if (/<(?!\/?(em|strong|br|b|i|span|a)\b)/.test(t)) say(`unexpected markup in block text: "${t.slice(0, 80)}"`);
  return t;
}
const biText = (el) => {                 // an element holding .lang-en and .lang-es spans
  const en = el.querySelector('.lang-en'), es = el.querySelector('.lang-es');
  if (!en || !es) throw new Error(`no language pair in <${el.tagName}>: ${el.innerHTML.slice(0, 80)}`);
  return { en: text(en), es: text(es) };
};
const bi = (id) => `<span class="lang-en"><!--cts:${id}:en--></span><span class="lang-es"><!--cts:${id}:es--></span>`;

/* The question arrays, read by running only the three declarations: nothing
   from the page's engine runs. */
function questions(html) {
  const a = html.indexOf('const mcQuestions = ['), b = html.indexOf('let currentLang');
  if (a < 0 || b < 0) throw new Error('question arrays not found');
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(html.slice(a, b) + ';__q = { mc: mcQuestions, kw: kwQuestions, fib: fibQuestions };', ctx, { timeout: 5000 });
  return ctx.__q;
}
const unnumber = (s) => String(s).replace(/^\s*\d+[.)]\s*/, '').trim();
const decode = (q, pos) => ((q.c - 7 * (pos + 3)) % 251 + 251) % 251;

const titles = { en: [], es: [] };
const out = [];                       // [{ n, lesson, unit, image }]

for (let n = 1; n <= TOTAL; n++) {
  const file = path.join(SRC, `${COURSE}Unit${n}.html`);
  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html);
  const blocks = [];
  let seq = 0;
  const block = (type, t) => { const id = 'b' + String(++seq).padStart(3, '0'); blocks.push({ id, type, text: t }); return id; };

  // ---- the title card ----------------------------------------------------
  const cards = root.querySelectorAll('body > .container > .card, body > .container > figure');
  const titleCard = cards.find((c) => c.querySelector('h1'));
  if (!titleCard) throw new Error(`unit ${n}: no title card`);
  const h1 = biText(titleCard.querySelector('h1'));
  const ps = titleCard.querySelectorAll('p');
  if (ps.length !== 2) throw new Error(`unit ${n}: title card has ${ps.length} paragraphs, expected 2`);
  const bTitle = block('title', h1);
  const bProf = block('prose', biText(ps[0]));
  const bEpi = block('scripture', biText(ps[1]));
  const m = { en: /Unit (\d+): (.+)$/.exec(h1.en.replace(/<[^>]+>/g, '')), es: /Unidad (\d+): (.+)$/.exec(h1.es.replace(/<[^>]+>/g, '')) };
  if (!m.en || !m.es || +m.en[1] !== n || +m.es[1] !== n) throw new Error(`unit ${n}: cannot read the unit title from "${h1.en}" / "${h1.es}"`);
  titles.en.push(`Unit ${n} - ${m.en[2]}`);
  titles.es.push(`Unidad ${n} - ${m.es[2]}`);

  let template = `<div class="container">\n<div class="card">\n    <h1>${bi(bTitle)}</h1>\n    <p>${bi(bProf)}</p>\n    <p style="margin-top:10px; font-style:italic;">${bi(bEpi)}</p>\n</div>\n`;

  // ---- the illustration (four units) ---------------------------------------
  let image = null;
  const fig = root.querySelector('figure.unit-figure');
  if (fig) {
    const img = fig.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const mm = /^data:image\/(jpeg|png);base64,(.+)$/s.exec(src);
    if (!mm) throw new Error(`unit ${n}: the figure's image is not an embedded JPEG/PNG`);
    const ext = mm[1] === 'jpeg' ? 'jpg' : 'png';
    image = { file: `${IMG_DIR}/unit${n}.${ext}`, data: Buffer.from(mm[2], 'base64') };
    const alt = (img.getAttribute('alt') || '').replace(/"/g, '&quot;');
    const cap = fig.querySelector('figcaption');
    template += `<figure class="illustration"><img src="/assets/img/parables/unit${n}.${ext}" alt="${alt}" loading="lazy">`;
    if (cap) {
      const bCap = cap.querySelector('.lang-en') ? block('caption', biText(cap)) : block('caption', { en: text(cap), es: text(cap) });
      template += `<figcaption>${bi(bCap)}</figcaption>`;
    }
    template += `</figure>\n`;
  }

  // ---- the lesson ----------------------------------------------------------
  const tc = root.querySelector('#teachingContent');
  const en = tc?.querySelector(':scope > .lang-en'), es = tc?.querySelector(':scope > .lang-es');
  if (!en || !es) throw new Error(`unit ${n}: no #teachingContent with .lang-en and .lang-es`);
  const kids = (d) => d.childNodes.filter((x) => x.tagName);
  const kEn = kids(en), kEs = kids(es);
  if (kEn.length !== kEs.length) throw new Error(`unit ${n}: ${kEn.length} English elements, ${kEs.length} Spanish`);
  const lessonEn = [], lessonEs = [];
  kEn.forEach((e, i) => {
    const s = kEs[i];
    const tag = e.tagName.toLowerCase();
    if (tag !== s.tagName.toLowerCase()) throw new Error(`unit ${n}: element ${i + 1} is <${tag}> in English and <${s.tagName.toLowerCase()}> in Spanish`);
    if (!['h2', 'h3', 'p'].includes(tag)) throw new Error(`unit ${n}: unexpected <${tag}> in the lesson`);
    const id = block(tag === 'p' ? 'prose' : 'heading', { en: text(e), es: text(s) });
    // the element's own attributes (a centred signature line) stay in the template
    const attrs = (el) => Object.entries(el.attributes || {}).map(([k, v]) => ` ${k}="${v}"`).join('');
    if (attrs(e) !== attrs(s)) say(`unit ${n}: element ${i + 1} has different attributes in the two languages`);
    lessonEn.push(`<${tag}${attrs(e)}><!--cts:${id}:en--></${tag}>`);
    lessonEs.push(`<${tag}${attrs(e)}><!--cts:${id}:es--></${tag}>`);
  });
  template += `<div class="card">\n<div class="lang-en">\n${lessonEn.join('\n')}\n</div>\n<div class="lang-es">\n${lessonEs.join('\n')}\n</div>\n</div>\n`;

  // ---- the exam card -------------------------------------------------------
  const exam = cards.find((c) => c.querySelector('#questionsContainer'));
  if (!exam) throw new Error(`unit ${n}: no exam card`);
  const bHead = block('heading', biText(exam.querySelector('h2')));
  const bNote = block('prose', biText(exam.querySelector('p')));
  const bSubmit = block('label', biText(exam.querySelector('#submitExamBtn')));
  const bReset = block('label', biText(exam.querySelector('#resetExamBtn')));
  template += `<div class="card">\n    <h2>${bi(bHead)}</h2>\n    <p>${bi(bNote)}</p>\n    <div id="questionsContainer"></div>\n    <div style="margin-top:20px;">\n        <button id="submitExamBtn" class="small">${bi(bSubmit)}</button>\n        <button id="resetExamBtn" class="small" style="background:#8a1f1f;">${bi(bReset)}</button>\n        <div id="examResult" style="margin-top:15px; font-weight:bold;"></div>\n        <div id="mcBankedNotice" style="margin-top:10px; font-size:0.9rem; color:#1f6b3b; display:none;"></div>\n    </div>\n</div>\n</div>\n\n<!--cts-part:honours-->\n`;

  for (const b of blocks) {
    if (!b.text.en || !b.text.es) say(`unit ${n}: block ${b.id} is empty in one language`);
    b.tr = { es: { status: 'human', from: hash(b.text.en) } };
  }
  const lesson = { course: COURSE, unit: n, sourceLang: 'en', langs: ['en', 'es'], template, blocks };

  // ---- the questions -------------------------------------------------------
  const q = questions(html);
  if (q.mc.length !== 20) say(`unit ${n}: ${q.mc.length} multiple-choice questions`);
  if (q.kw.length !== 10) say(`unit ${n}: ${q.kw.length} short-answer questions`);
  if (q.fib.length !== 10) say(`unit ${n}: ${q.fib.length} fill-in questions`);
  const mc = q.mc.map((x, i) => {
    const answer = decode(x, i);
    if (answer >= x.optionsEn.length || x.optionsEn.length !== x.optionsEs.length) say(`unit ${n}: question ${i + 1} answer/options do not fit`);
    return { stem: { en: unnumber(x.textEn), es: unnumber(x.textEs) },
             options: { en: x.optionsEn.map((o) => String(o).trim()), es: x.optionsEs.map((o) => String(o).trim()) },
             answer, why: { en: String(x.explEn).trim(), es: String(x.explEs).trim() } };
  });
  const sa = q.kw.map((x) => ({ prompt: { en: unnumber(x.textEn), es: unnumber(x.textEs) },
                                keywords: { en: x.kw_en.map(String), es: x.kw_es.map(String) },
                                model: { en: String(x.modelEn).trim(), es: String(x.modelEs).trim() } }));
  const blank = (s) => { const t = String(s).trim(); if ((t.match(/_{2,}/g) || []).length !== 1) say(`unit ${n}: a fill-in has not exactly one blank: "${t.slice(0, 60)}"`); return t.replace(/_{2,}/, '____'); };
  const fill = q.fib.map((x) => {
    const en = x.answersEn.map((a) => String(a).trim()), es = x.answersEs.map((a) => String(a).trim());
    if (!en.length || !es.length) say(`unit ${n}: a fill-in has no accepted answer`);
    const f = { prompt: { en: blank(x.textEn), es: blank(x.textEs) }, answer: { en: en[0], es: es[0] } };
    const acc = {}; if (en.length > 1) acc.en = en.slice(1); if (es.length > 1) acc.es = es.slice(1);
    if (Object.keys(acc).length) f.accept = acc;
    return f;
  });
  const unit = {
    course: SLUG, pagePrefix: COURSE, unit: n, totalUnits: TOTAL,
    title: `CTS Parables of the Bible — Unit ${n}: ${m.en[2]}`,
    bodyClass: 'lang-en', styles: [], scripts: ['cts-lang.js', 'cts-track.js', 'cts-curriculum.js'],
    prevHref: n === 1 ? null : `${COURSE}Unit${n - 1}.html`,
    nextHref: n === TOTAL ? `${COURSE}Certificate.html` : `${COURSE}Unit${n + 1}.html`,
    filePrefix: COURSE, unitTitles: titles,   // filled in below once every title is read
    mc, sa, fill,
  };
  out.push({ n, lesson, unit, image });
  console.log(`unit ${n}: ${blocks.length} blocks, ${mc.length} MC, ${sa.length} SA, ${fill.length} fill-ins${image ? ', one illustration' : ''} — ${m.en[2]}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
if (!WRITE) { console.log('\nread-only run; add --write to write the files'); process.exit(0); }

fs.mkdirSync(LESSONS, { recursive: true });
fs.mkdirSync(UNITS, { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });
for (const { n, lesson, unit, image } of out) {
  fs.writeFileSync(path.join(LESSONS, `${n}.json`), JSON.stringify(lesson, null, 1) + '\n');
  fs.writeFileSync(path.join(UNITS, `${n}.json`), JSON.stringify(unit, null, 1) + '\n');
  if (image) fs.writeFileSync(image.file, image.data);
}
console.log(`\nwrote ${out.length} lessons to ${LESSONS}/, ${out.length} exams to ${UNITS}/, ${out.filter((o) => o.image).length} images to ${IMG_DIR}/`);
