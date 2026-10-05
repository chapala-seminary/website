/* The Master's textbooks (Dr. Cook's delivery, Oct 2026): do the data, the
 * pages and the rules still hold together?
 *
 *   node tools/verify-textbooks.mjs [dist]        # run by npm test
 *
 * Source, no browser needed:
 *   - every textbook belongs to a course with a catalog card;
 *   - its page name follows the pattern the two routes build from;
 *   - the test has at least a full draw of questions, draws twenty and asks
 *     for eighteen (Dr. Cook, 3 Oct 2026) -- the file says so, and so does
 *     CTSFill's 90% rule, which is what actually marks it;
 *   - every answer and every accepted variant is marked RIGHT by the grader
 *     the page uses (fillRight(), read out of cts-fill.js rather than
 *     copied, so the two cannot drift), and the empty answer is marked wrong;
 *   - no staff-only file -- the test banks with the answers, as Word or PDF
 *     -- is anywhere under public/.
 * Built, from dist/:
 *   - the book page and the test page exist for every textbook;
 *   - every unit page of the course links to the book and to the test, and
 *     the two single-page courses do too;
 *   - the front page lists every textbook;
 *   - the test page does not carry the book: a sentence from each chapter
 *     of the book is absent from it, so the browser's Find cannot search the
 *     book for an answer -- the reason the test is a separate page.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] || 'dist';
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };

const books = fs.readdirSync('src/content/textbooks').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join('src/content/textbooks', f), 'utf8')));
ok(books.length >= 9, `${books.length} textbooks in src/content/textbooks; expected the nine`);

/* The grader, taken from cts-fill.js (tools/verify-fill-single.mjs holds it
   equal to cts-engine.js's). */
const FILL = fs.readFileSync('public/assets/js/cts-fill.js', 'utf8');
const fn = (name) => {
  const m = new RegExp(`\\n  function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n  \\}`).exec(FILL);
  if (!m) { console.error(`cannot find ${name}() in cts-fill.js`); process.exit(2); }
  return m[0];
};
const fillRight = new Function(`${fn('normalise')}\n${fn('fold')}\n${fn('bare')}\n${fn('fillRight')}\nreturn fillRight;`)();

const courses = Object.fromEntries(fs.readdirSync('src/content/courses').filter((f) => f.endsWith('.json'))
  .map((f) => [f.replace(/\.json$/, ''), JSON.parse(fs.readFileSync(path.join('src/content/courses', f), 'utf8'))]));
const units = Object.fromEntries(fs.readdirSync('src/content/units')
  .map((d) => [d, fs.readdirSync(path.join('src/content/units', d)).filter((f) => /^\d+\.json$/.test(f)).map((f) => +f.replace('.json', ''))]));

for (const b of books) {
  const card = courses[b.course];
  ok(!!card, `${b.slug}: course "${b.course}" has no catalog card`);
  ok(/^CTSTextbook[A-Za-z]+$/.test(b.page), `${b.slug}: page name "${b.page}" does not fit CTSTextbookX`);
  const { draw, pass, questions } = b.test;
  ok(draw === 20 && pass === 18, `${b.slug}: the test draws ${draw} and asks for ${pass}; Dr. Cook's rule is 20 and 18`);
  ok(Math.ceil(draw * 0.9) === pass, `${b.slug}: CTSFill's 90% rule gives ${Math.ceil(draw * 0.9)} of ${draw}, the file says ${pass}`);
  ok(questions.length >= draw, `${b.slug}: ${questions.length} questions, fewer than the draw of ${draw}`);
  questions.forEach((q, i) => {
    for (const lang of ['en', 'es']) {
      ok((q.prompt[lang].match(/____/g) || []).length === 1, `${b.slug} #${i + 1}: not one blank in ${lang}`);
      ok(fillRight(q, q.answer[lang]), `${b.slug} #${i + 1}: the ${lang} answer "${q.answer[lang]}" is not marked right`);
      for (const a of (q.accept && q.accept[lang]) || []) ok(fillRight(q, a), `${b.slug} #${i + 1}: accepted ${lang} answer "${a}" is not marked right`);
    }
    ok(!fillRight(q, ''), `${b.slug} #${i + 1}: an empty answer is marked right`);
  });
  for (const lang of ['en', 'es']) {
    ok(fs.existsSync(path.join('public', b.files.pdf[lang])), `${b.slug}: ${b.files.pdf[lang]} is not in public/`);
    ok(fs.existsSync(b.files.docx[lang]), `${b.slug}: the Word master ${b.files.docx[lang]} is missing`);
    ok(/<h2 /.test(b.body[lang]), `${b.slug}: the ${lang} book has no chapter headings`);
  }
}

// staff-only files never reach the site
const STAFF = /test-bank|banco-preguntas|question-bank|banco de preguntas/i;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const leaked = walk('public').filter((f) => STAFF.test(path.basename(f)));
ok(!leaked.length, `staff-only test-bank files under public/: ${leaked.join(', ')}`);

// the built pages
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error(`no build at ${DIST}/ — run npm run build first`); process.exit(2); }
const page = (f) => fs.existsSync(path.join(DIST, f)) ? fs.readFileSync(path.join(DIST, f), 'utf8') : null;
const index = page('index.html');
for (const b of books) {
  const book = page(`${b.page}.html`), test = page(`${b.page}Test.html`);
  ok(!!book, `${b.page}.html was not built`);
  ok(!!test, `${b.page}Test.html was not built`);
  ok(index.includes(`href="${b.page}.html"`), `the front page does not list ${b.page}`);
  if (book) ok(book.includes(`${b.page}Test.html`), `${b.page}.html does not lead to its test`);
  if (test) {
    ok(test.includes(`${b.page}.html`), `${b.page}Test.html does not lead back to the book`);
    // the book's paragraphs must not be on the test page (a question may
    // quote one of its sentences; a whole paragraph is the book itself)
    for (const lang of ['en', 'es']) {
      ok(!test.includes(`<h2 id="${lang}-1">`), `${b.page}Test.html carries the ${lang} book's chapter headings`);
      const paras = [...b.body[lang].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).filter((t) => t.length > 220);
      const sample = paras.filter((_, i) => i % 5 === 0).map((t) => t.slice(0, 160));
      ok(sample.length > 0 && !sample.some((s) => test.includes(s)), `${b.page}Test.html carries the ${lang} book's text: the test must stand apart from the book`);
    }
  }
  // the course links to its book: every unit of a unit course, or the single page
  const card = courses[b.course];
  const unitList = units[b.course];
  const pages = unitList ? unitList.map((n) => `${b.course}Unit${n}.html`) : [card.entry];
  for (const p of pages) {
    const h = page(p);
    ok(!!h && h.includes(`${b.page}.html`) && h.includes(`${b.page}Test.html`), `${p} does not link to ${b.page} and its test`);
  }
}

/* The required-reading tests (src/content/readings; Dr. Cook's Add-ons, 4 Oct
   2026): the same checks as a textbook's, on the readings' page instead of a
   book -- and the page the student reads must stand apart from the test. */
const readings = fs.existsSync('src/content/readings') ? fs.readdirSync('src/content/readings').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join('src/content/readings', f), 'utf8'))) : [];
ok(readings.length === 2, `${readings.length} required-reading tests in src/content/readings; expected Genesis Intensive and World Religions`);
for (const r of readings) {
  ok(!!courses[r.course], `${r.slug}: course "${r.course}" has no catalog card`);
  ok(/readings$/.test(r.slug) && !books.some((b) => b.slug === r.slug), `${r.slug}: the slug must end in "readings" and not be a textbook's`);
  ok(fs.existsSync(path.join('public', `${r.page}.html`)), `${r.slug}: the readings page public/${r.page}.html is missing`);
  const { draw, pass, questions } = r.test;
  ok(draw === 20 && pass === 18 && questions.length === 40, `${r.slug}: draws ${draw}, asks ${pass}, of ${questions.length}; the delivery says 20 of 40, 18 to pass`);
  questions.forEach((q, i) => {
    for (const lang of ['en', 'es']) {
      ok((q.prompt[lang].match(/____/g) || []).length === 1, `${r.slug} #${i + 1}: not one blank in ${lang}`);
      ok(fillRight(q, q.answer[lang]), `${r.slug} #${i + 1}: the ${lang} answer "${q.answer[lang]}" is not marked right`);
      const acc = (q.accept && q.accept[lang]) || [];
      ok(acc.length >= 1 && acc.length + 1 <= 5, `${r.slug} #${i + 1}: ${acc.length + 1} accepted ${lang} answers; Dr. Cook asked for alternates, three to five in all`);
      for (const a of acc) ok(fillRight(q, a), `${r.slug} #${i + 1}: accepted ${lang} answer "${a}" is not marked right`);
    }
    ok(!fillRight(q, ''), `${r.slug} #${i + 1}: an empty answer is marked right`);
  });
  // Dr. Cook's example: "beginning" must not fail for "beginnings"
  if (r.slug === 'genesisreadings') ok(fillRight(questions[0], 'beginning') && fillRight(questions[0], 'Beginning'), 'Genesis #1: "beginning" is not accepted for "beginnings"');
  const room = page(`${r.page}.html`), test = page(`${r.page}Test.html`);
  ok(!!room, `${r.page}.html was not built`);
  ok(!!test, `${r.page}Test.html was not built`);
  ok(index.includes(`href="${r.page}.html"`), `the front page does not list the required readings ${r.page}`);
  if (room) ok(room.includes(`${r.page}Test.html`), `${r.page}.html does not lead to its test`);
  if (test) {
    ok(test.includes(`${r.page}.html`), `${r.page}Test.html does not lead back to the readings`);
    ok(/data-textbook-kind="reading"/.test(test), `${r.page}Test.html does not say it is a required-reading test`);
    // the readings' own paragraphs are not on the test page
    const paras = [...(room || '').matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).filter((t) => t.length > 200).map((t) => t.slice(0, 120));
    ok(paras.length > 0 && !paras.some((t) => test.includes(t)), `${r.page}Test.html carries the readings' text: the test must stand apart from the readings`);
  }
  for (const n of units[r.course] || []) {
    const h = page(`${r.course}Unit${n}.html`);
    ok(!!h && h.includes(`${r.page}.html`) && h.includes(`${r.page}Test.html`), `${r.course}Unit${n}.html does not link to ${r.page} and its test`);
  }
  // the certificate page holds the diploma on a master's track until the pass (cts-textbook-gate.js)
  const code = Object.values(JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8')).completions).find((c) => c.name && page(c.page) && page(c.page).includes(`data-textbook="${r.slug}"`));
  ok(!!code, `no certificate page names data-textbook="${r.slug}" for the gate`);
}

console.log(`${checks} textbook assertions across ${books.length} textbooks and ${readings.length} required-reading tests`);
if (!fails.length) console.log('PASS — the textbooks, their tests and their pages agree.');
else { console.log(`FAIL — ${fails.length}:`); fails.slice(0, 30).forEach((f) => console.log('  ' + f)); if (fails.length > 30) console.log(`  … and ${fails.length - 30} more`); process.exit(1); }
