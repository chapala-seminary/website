#!/usr/bin/env node
/* Installs a textbook whose assigned reading is five short excerpts (Dr. Cook,
 * 10 Oct 2026: "option 2"), from a ChatGPT faculty-draft package:
 *   - the five English excerpts and their CTS Spanish translations (Markdown),
 *   - a 40-question bilingual bank (eight per excerpt).
 * Writes src/content/textbooks/<slug>.json with files: { excerpts: true } and
 * requiredFrom: null (the test counts for no one until Dr. Cook activates it),
 * keeps the sources in docs/readers/textbooks/<slug>/excerpts/ and the bank in
 * src/data/textbooks/staged/, and adds an optional-test notice to the room.
 *
 *   node tools/install-excerpt-textbook.mjs <config.json>          dry run
 *   node tools/install-excerpt-textbook.mjs <config.json> --write  write
 *
 * config: { slug, page, course, number, title, subtitle, credits, edition,
 *           bank, en: [5 paths], es: [5 paths], room, digest? }
 * Checks, and refuses on failure: 40 questions in five groups of eight, one
 * blank per prompt, every answer (or an accepted one) a whole word of its own
 * excerpt in that language, no answer word in another question's prompt, and
 * no primary answer that is also a primary answer of the course's reading test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { carryFrench } from './french-readings-lib.mjs';

const [cfgPath, flag] = process.argv.slice(2);
if (!cfgPath) { console.error('usage: install-excerpt-textbook.mjs <config.json> [--write]'); process.exit(2); }
const write = flag === '--write';
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const base = path.dirname(cfgPath);
const rd = (p) => fs.readFileSync(path.resolve(base, p), 'utf8');
const problems = [];
const bad = (m) => problems.push(m);
/* An answer word that appears in another question's prompt is listed for the
   faculty reviewers, not refused: in a book about Ruth, "Boaz" will be both. */
const warnings = [];

const fold = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const words = (s) => ` ${fold(s).replace(/[^\p{L}\p{N}]+/gu, ' ')} `;
const hasWords = (text, phrase) => words(text).includes(` ${fold(phrase).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

/* An excerpt file: "# N. Title", a source line, optional "> " or all-bold
   notes for reviewers (left out of the page), then paragraphs. */
function parse(md) {
  const blocks = md.replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const head = blocks.shift();
  if (!/^#{1,2} /.test(head)) bad(`excerpt does not start with a "# " heading: ${head.slice(0, 40)}`);
  const title = head.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
  const source = blocks.shift() || '';
  const paras = blocks.filter((b) => !b.startsWith('>') && !/^\*\*[^*]+\*\*$/.test(b)).map((b) => b.replace(/\n/g, ' '));
  return { title, source, paras, text: paras.join('\n') };
}
const ex = { en: cfg.en.map((p) => parse(rd(p))), es: cfg.es.map((p) => parse(rd(p))) };
if (ex.en.length !== 5 || ex.es.length !== 5) bad('five English and five Spanish excerpts are needed');

const body = (lang) => ex[lang].map((e, i) =>
  `<h2 id="${lang}-${i + 1}">${i + 1}. ${inline(e.title)}</h2><p class="small muted">${inline(e.source)}</p>` +
  e.paras.map((p) => `<p>${inline(p)}</p>`).join('')).join('');

const bank = JSON.parse(rd(cfg.bank));
const qs = (bank.questions || []).map((q) => ({ ...q, group: q.group ?? q.reading }));
if (qs.length !== 40) bad(`${qs.length} questions, not 40`);
for (let g = 1; g <= 5; g++) {
  const n = qs.filter((q) => q.group === g).length;
  if (n !== 8) bad(`group ${g} has ${n} questions, not 8`);
}
if (bank.requiredFrom !== null && bank.requiredFrom !== undefined) bad('the bank carries a requiredFrom');

const digest = cfg.digest && fs.existsSync(path.resolve(base, cfg.digest))
  ? (() => { const d = JSON.parse(rd(cfg.digest)); const list = d.questions || (d.test && d.test.questions) || d;
      return new Set(list.flatMap((q) => Object.values(q.answer || {}).map(fold))); })()
  : null;

for (const q of qs) {
  for (const lang of ['en', 'es']) {
    if ((q.prompt[lang].match(/____/g) || []).length !== 1) bad(`${q.id}: not one blank in the ${lang} prompt`);
    const own = ex[lang][q.group - 1]?.text || '';
    const options = [q.answer[lang], ...((q.accept && q.accept[lang]) || [])];
    if (!options.some((a) => hasWords(own, a))) bad(`${q.id}: no ${lang} answer of [${options.join(' / ')}] in excerpt ${q.group}`);
    for (const r of qs) if (r !== q && hasWords(r.prompt[lang], q.answer[lang])) warnings.push(`${q.id}: its ${lang} answer "${q.answer[lang]}" is in the prompt of ${r.id}`);
    if (digest && digest.has(fold(q.answer[lang]))) bad(`${q.id}: ${lang} answer "${q.answer[lang]}" is also a reading-test answer`);
  }
}

const out = {
  slug: cfg.slug, page: cfg.page, course: cfg.course, number: cfg.number,
  title: cfg.title, subtitle: cfg.subtitle, credits: cfg.credits, edition: cfg.edition,
  files: { excerpts: true },
  requiredFrom: null,
  body: { en: body('en'), es: body('es') },
  test: {
    draw: 20, pass: 18,
    questions: qs.map((q) => ({
      prompt: q.prompt, answer: q.answer,
      accept: { en: (q.accept && q.accept.en) || [], es: (q.accept && q.accept.es) || [] },
    })),
  },
};

const files = new Map();
// French added since (tools/french-readings.mjs) is kept wherever its English is unchanged.
const installed = `src/content/textbooks/${cfg.slug}.json`;
files.set(installed, JSON.stringify(carryFrench(fs.existsSync(installed) ? JSON.parse(fs.readFileSync(installed, 'utf8')) : null, out), null, 2) + '\n');
files.set(`src/data/textbooks/staged/${path.basename(cfg.bank)}`, rd(cfg.bank));
cfg.en.forEach((p, i) => files.set(`docs/readers/textbooks/${cfg.slug}/excerpts/en/${i + 1}.md`, rd(p)));
cfg.es.forEach((p, i) => files.set(`docs/readers/textbooks/${cfg.slug}/excerpts/es/${i + 1}.md`, rd(p)));

if (warnings.length) files.set(`docs/textbooks-staged/${cfg.slug}-excerpts-review.md`,
  `# ${cfg.title.en}: answers that appear in another question's prompt\n\nFor the faculty reviewers (made by tools/install-excerpt-textbook.mjs). Not refused: decide whether each is a real clue.\n\n${warnings.map((w) => `- ${w}`).join('\n')}\n`);

const marker = `<!-- ${cfg.slug} textbook exam: optional, assigned excerpts -->`;
const room = fs.readFileSync(cfg.room, 'utf8');
if (!room.includes(marker)) {
  const at = room.indexOf('</div>');
  if (at < 0) bad(`${cfg.room}: no notice to put the textbook notice after`);
  const notice = `\n${marker}\n<div class="notice cts-textbook-test-pilot">\n  <p class="lang-en block"><strong>Optional textbook examination:</strong> read <a href="/${cfg.page}.html">${esc(cfg.title.en)}</a>, five assigned excerpts in English and Spanish, then <a href="/${cfg.page}Test.html">take the 20-question examination</a>. It is not yet required on any track and is separate from the reading test.</p>\n  <p class="lang-es block"><strong>Examen opcional del libro de texto:</strong> lea <a href="/${cfg.page}.html">${esc(cfg.title.es)}</a>, cinco fragmentos asignados en inglés y en español, y luego <a href="/${cfg.page}Test.html">presente el examen de 20 preguntas</a>. Aún no es obligatorio en ningún trayecto y es distinto del examen de lecturas.</p>\n</div>`;
  files.set(cfg.room, room.slice(0, at + 6) + notice + room.slice(at + 6));
}

console.log(JSON.stringify({ slug: cfg.slug, questions: qs.length, digestChecked: !!digest, files: [...files.keys()], warnings: warnings.length, problems }, null, 2));
if (problems.length) { console.error(`REFUSED: ${problems.length} problem(s)`); process.exit(1); }
if (write) {
  for (const [f, t] of files) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); }
  console.log('written');
} else console.log('dry run: nothing written (add --write)');
