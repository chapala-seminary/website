/* The Master's textbooks, from Dr. Cook's delivery folder into the site.
 *
 *   node tools/import-textbooks.mjs <delivery folder> [--write]
 *
 * The delivery (CTS-2026.1-Nine-Book-FINAL, October 2026) holds one folder
 * per book, 01-Cults … 09-Deaconship, each with the book in English and
 * Spanish as Word and PDF -- sometimes zipped -- and a FILL-IN-BANK-DATA
 * folder with the nine question banks as JSON. Later deliveries come "as
 * content updates in the same format", so this is a tool and not a one-off:
 * run it again on the new folder and commit what changed.
 *
 * WHAT IT WRITES (with --write; without it, it only reads and reports)
 *   src/content/textbooks/<slug>.json     the book, both languages, as HTML,
 *                                         with its forty-question test
 *   src/data/textbooks/<slug>-<lang>.docx the Word masters it was made from
 *   public/textbooks/<slug>-<lang>.pdf    the PDFs students can download
 *
 * WHAT IT NEVER COPIES
 *   The test-bank Word and PDF files ("Test Bank", "Banco de Preguntas",
 *   "Question Bank"). They show the answers and are for staff only (Dr. Cook,
 *   3 Oct 2026). The questions reach the site from the JSON banks, and only
 *   through the test page. tools/verify-textbooks.mjs fails if one of those
 *   files ever lands in public/.
 *
 * HOW A BOOK BECOMES HTML
 *   mammoth converts the Word file: Heading 1 -> h2, Heading 2 -> h3, List
 *   Bullet -> li, bold and italic kept, everything else a paragraph. The
 *   paragraphs before the first heading are the title page (title, subtitle,
 *   author and edition lines) and are lifted out of the body. Headings get
 *   ids so the page can offer a table of contents.
 *
 *   One file is different: the English Deaconship (09) was "reconstructed
 *   from the PDF" and has no heading styles -- every printed line is its own
 *   paragraph, page footers included. It is reflowed here: footers dropped,
 *   the bold numbered lines are the chapters, short unpunctuated lines the
 *   sections, bullet lines a list, and the rest joined back into paragraphs at
 *   a line that ends a sentence short of the margin. The Spanish Deaconship
 *   has proper headings, and the two are compared at the end as a check. This
 *   is the one book that should be re-sent as a styled Word file.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import mammoth from 'mammoth';
import { parse } from 'node-html-parser';

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const SRC = args.find((a) => !a.startsWith('-'));
if (!SRC || !fs.existsSync(SRC)) { console.error('usage: node tools/import-textbooks.mjs <delivery folder> [--write]'); process.exit(2); }

/* The nine books: the delivery folder's number, the page name (permanent once
   live: it is the address students bookmark), the course it belongs to (the
   catalog card, src/content/courses), and the question-bank file. The
   display titles are the books' own, from their title pages. */
const BOOKS = [
  { number: 1, slug: 'cults',       page: 'CTSTextbookCults',               course: 'CTSCults',                bank: '01-cults.json',
    title: { en: 'Cults and the Gospel', es: 'Sectas y el Evangelio' } },
  { number: 2, slug: 'counseling',  page: 'CTSTextbookCounseling',          course: 'CTSCounseling',           bank: '02-counseling.json',
    title: { en: 'Biblical Counseling', es: 'Consejería Bíblica' } },
  { number: 3, slug: 'situations',  page: 'CTSTextbookCounselingSituations', course: 'CTSCS',                  bank: '03-situations.json',
    title: { en: 'Counseling Situations', es: 'Situaciones de Consejería' } },
  { number: 4, slug: 'worship',     page: 'CTSTextbookWorship',             course: 'CTSWorship',              bank: '04-worship.json',
    title: { en: 'Christian Worship', es: 'Adoración Cristiana' } },
  { number: 5, slug: 'language',    page: 'CTSTextbookLanguage',            course: 'CTSLA',                   bank: '05-language.json',
    title: { en: 'Language Appreciation', es: 'Apreciación de los Idiomas Bíblicos' } },
  { number: 6, slug: 'narrative',   page: 'CTSTextbookNarrativePreaching',  course: 'CTS_Narrative_Preaching', bank: '06-narrative.json',
    title: { en: 'Narrative Preaching', es: 'Predicación Narrativa' } },
  { number: 7, slug: 'doctrinal',   page: 'CTSTextbookDoctrinalPreaching',  course: 'CTSDP',                   bank: '07-doctrinal.json',
    title: { en: 'Doctrinal Preaching', es: 'Predicación Doctrinal' } },
  { number: 8, slug: 'pentecostal', page: 'CTSTextbookPentecostal',         course: 'CTSPentecostal',          bank: '08-pentecostal.json',
    title: { en: 'Pentecostal and Charismatic Theology', es: 'Teología Pentecostal y Carismática' } },
  { number: 9, slug: 'deaconship',  page: 'CTSTextbookDeaconship',          course: 'CTSDeaconFamilyMinistry', bank: '09-deaconship.json',
    title: { en: 'The Deaconship (Howell, adapted)', es: 'El Diaconado (Howell, adaptado)' } },
];
const DRAW = 20, PASS = 18;          // Dr. Cook, 3 Oct 2026: 20 of the 40, 18 right to pass
const STAFF_ONLY = /test-bank|banco-preguntas|question-bank|banco de preguntas/i;
const OUT = 'src/content/textbooks', MASTERS = 'src/data/textbooks', PDFS = 'public/textbooks';

const problems = [];
const say = (m) => problems.push(m);

// ---- find each book's files ------------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-textbooks-'));
function filesFor(book) {
  const dir = fs.readdirSync(SRC).find((d) => d.startsWith(String(book.number).padStart(2, '0') + '-'));
  if (!dir) throw new Error(`no folder ${String(book.number).padStart(2, '0')}-* in ${SRC}`);
  const folder = path.join(SRC, dir);
  let files = fs.readdirSync(folder).map((f) => path.join(folder, f));
  for (const z of files.filter((f) => f.endsWith('.zip'))) {
    const into = path.join(tmp, book.slug);
    fs.mkdirSync(into, { recursive: true });
    execFileSync('unzip', ['-o', '-q', z, '-d', into]);
    files = files.concat(fs.readdirSync(into).map((f) => path.join(into, f)));
  }
  files = files.filter((f) => /\.(docx|pdf)$/i.test(f) && !STAFF_ONLY.test(path.basename(f)) && !path.basename(f).startsWith('.'));
  const lang = (f) => /-EN-|-Adapted-/i.test(path.basename(f)) ? 'en' : /-ES-|-Adaptado-/i.test(path.basename(f)) ? 'es' : null;
  const pick = (ext, l) => {
    const c = files.filter((f) => f.toLowerCase().endsWith('.' + ext) && lang(f) === l);
    if (c.length !== 1) throw new Error(`${book.slug}: expected one ${l.toUpperCase()} ${ext}, found ${c.length}: ${c.map((x) => path.basename(x)).join(', ')}`);
    return c[0];
  };
  return { docx: { en: pick('docx', 'en'), es: pick('docx', 'es') }, pdf: { en: pick('pdf', 'en'), es: pick('pdf', 'es') } };
}
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

// ---- Word -> HTML -------------------------------------------------------------
const STYLE_MAP = [
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  "p[style-name='List Bullet'] => ul > li:fresh",
];
async function toHtml(file) {
  const r = await mammoth.convertToHtml({ path: file }, { styleMap: STYLE_MAP });
  for (const m of r.messages) if (m.type === 'error') say(`${path.basename(file)}: ${m.message}`);
  return r.value;
}
const clean = (s) => s.replace(/\s+/g, ' ').trim();

/* The title page: every paragraph before the first heading. The first is the
   title, the second the subtitle; the rest are the author and edition lines,
   which the Word files run together with line breaks. */
function splitFront(root) {
  const front = [];
  for (const el of [...root.childNodes]) {
    if (!el.tagName) { el.remove(); continue; }
    if (/^h[23]$/i.test(el.tagName)) break;
    if (el.tagName.toLowerCase() !== 'p') break;
    front.push(el);
    el.remove();
  }
  const lines = front.flatMap((p) => p.innerHTML.split(/<br\s*\/?>/i).map((x) => clean(x.replace(/<[^>]+>/g, '')))).filter(Boolean);
  return { title: lines[0] || '', subtitle: lines[1] || '', credits: lines.slice(2).join(' · ') };
}

/* The English Deaconship: see the note at the top. Returns the body with its
   paragraphs rebuilt, and the title-page lines. */
function reflowDeaconship(root) {
  const lines = [];
  for (const el of root.childNodes) {
    if (!el.tagName) continue;
    const t = clean(el.text);
    if (!t) continue;
    const bold = /^<strong>[\s\S]*<\/strong>$/.test(el.innerHTML.trim());
    lines.push({ t, bold, html: el.innerHTML.trim() });
  }
  // the reconstruction's own two header lines, and every page footer
  const body = lines.filter((l, i) => !(i < 2 && /Howell Adapted - CTS|reconstructed from the CTS/.test(l.t)) && !/^Chapala Theological Seminary \| \d+$/.test(l.t));
  const CHAPTER = /^(\d+\. .+|Editorial Note|CTS Concluding Observations|Source Note)$/;
  const startAt = body.findIndex((l) => l.t === 'Editorial Note');
  if (startAt < 0) throw new Error('deaconship: "Editorial Note" not found');
  const frontLines = body.slice(0, startAt).map((l) => l.t);
  const out = [];
  let para = [], list = [];
  // lines rejoined; a word the PDF broke at the margin ("twenty- first") is mended
  const flushPara = () => { if (para.length) { out.push(`<p>${para.join(' ').replace(/([a-z])- ([a-z])/g, '$1-$2')}</p>`); para = []; } };
  const flushList = () => { if (list.length) { out.push(`<ul>${list.map((x) => `<li>${x}</li>`).join('')}</ul>`); list = []; } };
  const isHeading = (l) => (l.bold && CHAPTER.test(l.t)) || CHAPTER.test(l.t)
    || (l.t.length < 60 && /^[A-Z]/.test(l.t) && !/[.!?:;,"”)]$/.test(l.t) && !l.t.startsWith('•'));
  for (let i = startAt; i < body.length; i++) {
    const l = body[i];
    if (l.t.startsWith('•')) { flushPara(); list.push(clean(l.html.replace(/^(<strong>)?•\s*/, '$1'))); continue; }
    flushList();
    if (isHeading(l)) { flushPara(); out.push(CHAPTER.test(l.t) ? `<h2>${l.t}</h2>` : `<h3>${l.t}</h3>`); continue; }
    para.push(l.html.replace(/^<strong>|<\/strong>$/g, ''));
    // a line that ends a sentence short of the margin ends the paragraph
    if (/[.!?:"”)]$/.test(l.t) && l.t.length < 76) flushPara();
  }
  flushPara(); flushList();
  return { html: out.join('\n'), front: frontLines };
}

/* Ids on the headings, so the contents list can point at them, and nothing
   else: the text is the book's. */
function finish(html, lang) {
  const root = parse(html);
  /* A paragraph typed with a bullet character is a list item -- the Spanish
     Deaconship's contents, for one -- and runs of them are one list. */
  for (const p of root.querySelectorAll('p')) {
    if (!/^\s*•/.test(p.text)) continue;
    const li = parse(`<li>${p.innerHTML.replace(/^(\s*<[^>]+>)*\s*•\s*/, '$1')}</li>`).firstChild;
    const prev = p.previousElementSibling;
    if (prev && prev.tagName === 'UL') { prev.appendChild(li); p.remove(); }
    else { p.replaceWith(parse('<ul></ul>').firstChild); root.querySelectorAll('ul').pop().appendChild(li); }
  }
  let n = 0;
  for (const h of root.querySelectorAll('h2, h3')) {
    n++;
    h.setAttribute('id', `${lang}-${n}`);
  }
  // mammoth writes <br />; the site writes <br>
  return root.toString().replace(/<br\s*\/>/g, '<br>').trim();
}
const stats = (html) => ({ h2: (html.match(/<h2\b/g) || []).length, h3: (html.match(/<h3\b/g) || []).length,
                           li: (html.match(/<li\b/g) || []).length, p: (html.match(/<p\b/g) || []).length,
                           chars: html.replace(/<[^>]+>/g, '').length });

// ---- the question bank ------------------------------------------------------
function bank(book) {
  const f = path.join(SRC, 'FILL-IN-BANK-DATA', book.bank);
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!Array.isArray(j.items)) throw new Error(`${book.bank}: no items`);
  return j.items.map((q, i) => {
    const blank = (s, l) => { const t = clean(s); if ((t.match(/_{2,}/g) || []).length !== 1) say(`${book.bank} #${i + 1} (${l}): not exactly one blank`); return t.replace(/_{2,}/, '____'); };
    const en = (q.a_en || []).map(clean).filter(Boolean), es = (q.a_es || []).map(clean).filter(Boolean);
    if (en.length < 3 || es.length < 3) say(`${book.bank} #${i + 1}: fewer than three accepted answers (${en.length} EN, ${es.length} ES)`);
    const out = { prompt: { en: blank(q.en, 'en'), es: blank(q.es, 'es') }, answer: { en: en[0], es: es[0] } };
    const acc = {}; if (en.length > 1) acc.en = en.slice(1); if (es.length > 1) acc.es = es.slice(1);
    if (Object.keys(acc).length) out.accept = acc;
    return out;
  });
}

// ---- go ---------------------------------------------------------------------
const results = [];
for (const book of BOOKS) {
  const files = filesFor(book);
  const body = {}, front = {};
  for (const lang of ['en', 'es']) {
    const html = await toHtml(files.docx[lang]);
    const root = parse(html);
    let fm, out;
    if (book.slug === 'deaconship' && lang === 'en') {
      const r = reflowDeaconship(root);
      fm = { title: r.front[0] || '', subtitle: r.front[1] || '', credits: r.front.slice(2).join(' · ') };
      out = r.html;
    } else {
      fm = splitFront(root);
      out = root.toString();
    }
    front[lang] = fm;
    body[lang] = finish(out, lang);
    const st = stats(body[lang]);
    console.log(`${book.slug.padEnd(12)} ${lang}  h2=${String(st.h2).padStart(2)} h3=${String(st.h3).padStart(2)} li=${String(st.li).padStart(2)} p=${String(st.p).padStart(3)} chars=${String(st.chars).padStart(6)}  ${fm.title} — ${fm.subtitle.slice(0, 50)}`);
    if (!st.h2) say(`${book.slug} ${lang}: no chapter headings came through`);
    if (!fm.title) say(`${book.slug} ${lang}: no title`);
  }
  const questions = bank(book);
  results.push({
    slug: book.slug, page: book.page, course: book.course, number: book.number,
    title: book.title,
    subtitle: { en: front.en.subtitle, es: front.es.subtitle },
    credits: { en: front.en.credits, es: front.es.credits },
    edition: '2026.1',
    files: {
      pdf: { en: `textbooks/${book.slug}-en.pdf`, es: `textbooks/${book.slug}-es.pdf` },
      docx: { en: `${MASTERS}/${book.slug}-en.docx`, es: `${MASTERS}/${book.slug}-es.docx` },
      sha256: { en: sha(files.docx.en), es: sha(files.docx.es) },
    },
    body, test: { draw: DRAW, pass: PASS, questions },
    _copy: files,
  });
}
// the two Deaconship books should have the same shape, within reason
{
  const d = results.find((r) => r.slug === 'deaconship');
  const en = stats(d.body.en), es = stats(d.body.es);
  console.log(`deaconship: EN reflowed to ${en.h2} chapters / ${en.h3} sections / ${en.p} paragraphs; ES has ${es.h2} / ${es.h3} / ${es.p}`);
  if (en.h2 !== es.h2 || Math.abs(en.h3 - es.h3) > 2) say(`deaconship: the reflowed English (${en.h2} chapters, ${en.h3} sections) does not match the Spanish (${es.h2}, ${es.h3})`);
}
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`); problems.forEach((p) => console.error('  ' + p)); process.exit(1);
}
if (!WRITE) { console.log('\nread-only run; add --write to write the files'); process.exit(0); }

for (const d of [OUT, MASTERS, PDFS]) fs.mkdirSync(d, { recursive: true });
for (const r of results) {
  const { _copy, ...data } = r;
  fs.writeFileSync(path.join(OUT, `${r.slug}.json`), JSON.stringify(data, null, 1) + '\n');
  for (const lang of ['en', 'es']) {
    fs.copyFileSync(_copy.docx[lang], path.join(MASTERS, `${r.slug}-${lang}.docx`));
    fs.copyFileSync(_copy.pdf[lang], path.join(PDFS, `${r.slug}-${lang}.pdf`));
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\nwrote ${results.length} textbooks to ${OUT}/, their Word masters to ${MASTERS}/, their PDFs to ${PDFS}/`);
