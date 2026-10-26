/* French reading material in the build (tools/french-readings-lib.mjs says
 * how it is stored). Two steps around the language pages
 * (tools/language-pages.mjs), both run by astro.config.mjs:
 *
 *   before  inserts the French of the digests (public/CTS_*_digest.html) and
 *           of the reading rooms' content (main#content of each room page)
 *           beside their English, marked lang-fr, as a third language. The
 *           language pages then pair it with the English on /fr/ and drop
 *           it from the English and Spanish pages, which do not change.
 *   after   marks every French page with machine-translated reading content
 *           as a draft: the review notice, and noindex.
 *
 * Textbooks and reading tests need neither: their French is in their
 * collection records and their pages render it (src/pages/[textbook].astro,
 * src/layouts/Textbook.astro; the test data carries prompt.fr/answer.fr). */
import fs from 'node:fs';
import path from 'node:path';
import { DIGEST, loadStore, augmentHtml } from './french-readings-lib.mjs';
import { isPrivateReading, readingQuestions } from './grading-keys-lib.mjs';

const drafts = new Set();
const reviewed = new Set();

export const NOTICE = '<aside class="cts-translation-pending" lang="fr">Traduction provisoire publiée pour relecture. Des corrections peuvent encore être apportées ; vous pouvez afficher le texte anglais de référence.</aside>';
const ASKS = ' Vos réponses sont acceptées en français ou en anglais.';

const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const machine = (tr) => tr?.fr?.status === 'machine';

/* The pages each collection record's French appears on. */
function recordPages() {
  const out = [];
  for (const [dir, test] of [['src/content/textbooks', true], ['src/content/readings', false]]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const r = json(path.join(dir, f));
      const fields = Object.values(r.tr || {});
      /* A private reading bank keeps its French stamps in assessment-keys
         (they hash the answer); read them there, or, without the checkout,
         count any French prompt as a machine draft so the notice is kept. */
      const qs = !test && isPrivateReading(r)
        ? (() => { try { return readingQuestions('.', r).questions; } catch { return (r.test?.questions || []).map((q) => (q.prompt?.fr ? { ...q, tr: { fr: { status: 'machine' } } } : q)); } })()
        : (r.test?.questions || []);
      const questions = qs.map((q) => q.tr).filter((t) => t?.fr);
      const any = fields.some((t) => t?.fr) || questions.length;
      if (!any) continue;
      const draft = fields.some(machine) || questions.some(machine);
      // a textbook's page shows its body; both pages show its masthead
      if (test && fields.length) out.push([`${r.page}.html`, draft]);
      out.push([`${r.page}Test.html`, draft]);
    }
  }
  return out;
}

export function frenchReadingsBefore(dir) {
  const { memory } = loadStore();
  if (!memory.size) return { pages: 0, inserted: 0 };
  const rooms = json('src/data/rooms.json').rooms;
  const targets = [
    ...fs.readdirSync(dir).filter((f) => DIGEST.test(f)).map((f) => [f, null]),
    ...Object.entries(rooms).filter(([, r]) => r.kind !== 'honors').map(([p]) => [`${p}.html`, '#content']),
  ];
  let pages = 0, inserted = 0;
  for (const [file, scope] of targets) {
    const target = path.join(dir, file);
    if (!fs.existsSync(target)) continue;
    const html = fs.readFileSync(target, 'utf8');
    const out = augmentHtml(html, memory, { scope });
    if (!out.inserted) continue;
    fs.writeFileSync(target, out.html);
    pages++; inserted += out.inserted;
    (out.status === 'machine' ? drafts : reviewed).add(file);
  }
  return { pages, inserted };
}

export function frenchReadingsAfter(dir) {
  for (const [file, draft] of recordPages()) (draft ? drafts : reviewed).add(file);
  let marked = 0;
  for (const file of drafts) {
    const target = path.join(dir, 'fr', file);
    if (!fs.existsSync(target)) continue;
    let html = fs.readFileSync(target, 'utf8');
    const before = html;
    if (!/<meta name="robots"[^>]*noindex/.test(html)) html = html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>');
    // A page whose French is in its test data alone (a reading test) was
    // built as if untranslated: it is not, so the "not available" notice
    // goes, and the reader may show the English source beside the French.
    html = html.replace(/<aside class="cts-translation-pending" lang="[a-z]+">(?!Traduction provisoire)[\s\S]*?<\/aside>/g, '');
    html = html.replace(/(<input type="checkbox" id="cts-show-source")\s+disabled/, '$1');
    if (!/class="cts-translation-pending" lang="fr">Traduction provisoire/.test(html)) {
      const asks = /id="tb-questions"|cts-fill\.js|cts-engine\.js/.test(html);
      const notice = asks ? NOTICE.replace('</aside>', ASKS + '</aside>') : NOTICE;
      html = html.replace(/<body\b[^>]*>/, (m) => m + notice);
    }
    if (html !== before) { fs.writeFileSync(target, html); marked++; }
  }
  return marked;
}

export function frenchReadingsIntegrations() {
  const dirOf = (dir) => (dir instanceof URL ? dir.pathname : String(dir));
  return [
    { name: 'cts-french-readings', hooks: { 'astro:build:done': ({ dir, logger }) => {
      drafts.clear(); reviewed.clear();
      const r = frenchReadingsBefore(dirOf(dir));
      logger.info(`French reading content beside the English on ${r.pages} page(s) (${r.inserted} passages)`);
    } } },
    { name: 'cts-french-readings-drafts', hooks: { 'astro:build:done': ({ dir, logger }) => {
      const n = frenchReadingsAfter(dirOf(dir));
      logger.info(`${n} French reading page(s) marked as drafts (notice, noindex)`);
    } } },
  ];
}
