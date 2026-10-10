/* The World Religions Spanish readers (10 Oct 2026): CTS's own Spanish
 * translations of the five assigned readings, so a Spanish-speaking student
 * reads what the revised test (src/data/readings/wrreadings.v2.bank.json) is
 * on. The translations live in docs/readers/world-religions/es/*.md (see the
 * README there); this writes one page per reading into public/ and checks
 * that every Spanish answer in the revised bank is in its reading's reader.
 *
 *   node tools/wr-readers.mjs            # check: pages up to date, answers supported
 *   node tools/wr-readers.mjs --write    # write public/CTSWRLectura<n><Name>.html
 *   node tools/wr-readers.mjs --strict   # also fail on a reader not yet translated
 *
 * The bank may not be switched on (tools/import-readings.mjs) until --strict
 * passes: until then a Spanish-speaking student would be tested on a reading
 * they cannot read in Spanish.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'docs/readers/world-religions/es';
const WRITE = process.argv.includes('--write');
/* Strict by request, and always once the revised bank is in force (its row in
   tools/import-readings.mjs says active: true). */
const ACTIVE = /bank:\s*'wrreadings\.v2',\s*active:\s*true/.test(fs.readFileSync('tools/import-readings.mjs', 'utf8'));
const STRICT = process.argv.includes('--strict') || ACTIVE;

/* The five readings, in the order of the Required Readings page, with the
   translation files that make up each one's reader. */
const READERS = [
  { n: 1, page: 'CTSWRLectura1Jevons', title: 'Introducción al estudio de la religión comparada',
    author: 'F. B. Jevons', year: '1908', files: ['jevons-intro.md'] },
  { n: 2, page: 'CTSWRLectura2Carpenter', title: 'Religión comparada',
    author: 'J. Estlin Carpenter', year: 'c. 1913', files: ['carpenter-I.md', 'carpenter-II.md', 'carpenter-VII.md', 'carpenter-VIII.md'] },
  { n: 3, page: 'CTSWRLectura3Clarke', title: 'Diez grandes religiones: un ensayo de teología comparada',
    author: 'James Freeman Clarke', year: '1871', files: ['clarke.md'] },
  { n: 4, page: 'CTSWRLectura4TextosPrimarios', title: 'Textos primarios representativos: Corán, Bhagavad-Gita, Dhammapada',
    author: 'J. M. Rodwell, Edwin Arnold y F. Max Müller (traductores al inglés)', year: '1861–1900', files: ['koran-suras.md', 'gita.md', 'dhammapada.md'] },
  { n: 5, page: 'CTSWRLectura5Farquhar', title: 'La corona del hinduismo',
    author: 'J. N. Farquhar', year: '1913', files: ['farquhar.md'] },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  return esc(s)
    .replace(/\{(\d+)\}/g, (_, p) => `<span class="pg" id="p${p}">p.&nbsp;${p}</span>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?![*\w])/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_([^_\n]+)_(?![_\w])/g, '$1<em>$2</em>');
}
/* The translations' Markdown is simple: headings, paragraphs, block quotes. */
function render(md) {
  const out = [];
  let title = null, source = null;
  for (const block of md.replace(/\r/g, '').split(/\n{2,}/)) {
    const b = block.trim();
    if (!b) continue;
    if (/^# /.test(b)) { title = b.slice(2).trim(); continue; }
    if (title && !source && /^\*Fuente:/.test(b)) { source = b.replace(/^\*|\*$/g, ''); continue; }
    if (/^## /.test(b)) { out.push(`<h3>${inline(b.slice(3).trim())}</h3>`); continue; }
    if (/^>/.test(b)) { out.push(`<blockquote>${b.split('\n').map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>')}</blockquote>`); continue; }
    out.push(`<p>${b.split('\n').map(inline).join('<br>')}</p>`);
  }
  return { title, source, html: out.join('\n') };
}

const NOTE = `<p><b>Nota de CTS.</b> Esta es una traducción íntegra y fiel de un texto histórico, publicada por CTS para que pueda hacer en español las lecturas requeridas de Religiones del Mundo. Conserva los juicios y la terminología del autor y de su época, que CTS no necesariamente comparte; léala críticamente, distinguiendo lo que el autor describe de lo que opina, y compare sus descripciones con lo que las comunidades religiosas dicen hoy de sí mismas. Los números de página (<span class="pg">p.&nbsp;24</span>) son los de la edición inglesa, para que pueda localizar cada pasaje.</p>`;

function page(r, parts) {
  const toc = parts.length > 1 ? `<nav class="toc"><b>Contenido</b><ol>${parts.map((p, i) => `<li><a href="#parte${i + 1}">${esc(p.title || '')}</a></li>`).join('')}</ol></nav>` : '';
  const body = parts.map((p, i) => `<section id="parte${i + 1}">\n<h2>${esc(p.title || '')}</h2>\n${p.source ? `<p class="src">${inline(p.source)}</p>` : ''}\n${p.html}\n</section>`).join('\n');
  return `<!DOCTYPE html>
<!-- Written by tools/wr-readers.mjs from docs/readers/world-religions/es/: edit the translation there, then run node tools/wr-readers.mjs --write. -->
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lectura ${r.n}: ${esc(r.title)} — Religiones del Mundo, CTS</title>
<style>
  :root{--ink:#2b2124; --soft:#6f5b60; --line:#ecdfe3; --paper:#fcf8f9; --accent:#8a4457; --note:#f4e9ec;}
  *{box-sizing:border-box;}
  body{margin:0; background:var(--paper); color:var(--ink); font-family:Georgia,"Times New Roman",serif; line-height:1.62; font-size:18px; -webkit-text-size-adjust:100%;}
  .wrap{max-width:44rem; margin:0 auto; padding:2rem 1.25rem 4rem;}
  header.doc{border-bottom:2px solid var(--line); padding-bottom:1.1rem; margin-bottom:1.4rem;}
  .kicker{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:.8rem; letter-spacing:.04em; text-transform:uppercase; color:var(--accent); margin:0;}
  h1{font-size:1.7rem; line-height:1.25; margin:.3rem 0 .4rem;}
  .by{color:var(--soft); font-style:italic; margin:0 0 .6rem;}
  .note{background:var(--note); border-left:3px solid var(--accent); padding:.9rem 1rem; margin:1.4rem 0; font-size:.95rem; line-height:1.55;}
  .note b{color:var(--accent);}
  .toc{font-size:.95rem; margin:1rem 0 1.6rem;} .toc ol{margin:.3rem 0 0 1.2rem; padding:0;}
  h2{font-size:1.3rem; margin:2.4rem 0 .4rem; padding-top:.6rem; border-top:2px solid var(--line);}
  h3{font-size:1.08rem; margin:1.6rem 0 .5rem;}
  .src{font-size:.88rem; color:var(--soft); margin:.2rem 0 1rem;}
  p{margin:0 0 1rem;}
  blockquote{margin:1.2rem 0; padding:.2rem 0 .2rem 1rem; border-left:3px solid var(--line); color:#333;}
  .pg{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:.68rem; color:var(--soft); background:#fff; border:1px solid var(--line); border-radius:4px; padding:0 .3rem; margin:0 .15rem; white-space:nowrap; vertical-align:.12em;}
  .back{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:.9rem;}
  a{color:var(--accent);}
  footer.doc{margin-top:2.4rem; padding-top:1rem; border-top:2px solid var(--line); font-size:.84rem; color:var(--soft); line-height:1.5;}
</style>
</head>
<body>
<div class="wrap">
<p class="back"><a href="CTSWRRequired.html">← Lecturas requeridas de Religiones del Mundo</a></p>
<header class="doc">
<p class="kicker">Religiones del Mundo · Lectura ${r.n} · Traducción de CTS</p>
<h1>${esc(r.title)}</h1>
<p class="by">${esc(r.author)} · ${esc(r.year)}</p>
</header>
<div class="note">${NOTE}</div>
${toc}
${body}
<footer class="doc">Traducción al español de Chapala Theological Seminary (Seminario Teológico de Chapala), 2026, de la obra original en inglés, que es de dominio público. Se reconoce al autor y, en su caso, al traductor al inglés. <a href="CTSWRRequired.html">Volver a las lecturas</a> · <a href="CTSWRRequiredTest.html">Examen de lecturas requeridas</a></footer>
</div>
</body>
</html>
`;
}

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
let problems = 0, pending = 0;
const texts = {};
for (const r of READERS) {
  const have = r.files.filter((f) => fs.existsSync(path.join(DIR, f)));
  const missing = r.files.filter((f) => !have.includes(f));
  if (missing.length) { pending++; console.log(`reading ${r.n}: not yet translated: ${missing.join(', ')}`); if (STRICT) problems++; }
  texts[r.n] = fold(have.map((f) => fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n'));
  if (!have.length) continue;
  const parts = have.map((f) => render(fs.readFileSync(path.join(DIR, f), 'utf8')));
  const html = page(r, parts), out = path.join('public', `${r.page}.html`);
  if (WRITE) { fs.writeFileSync(out, html); console.log(`  wrote ${out}`); }
  else if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== html) { console.error(`${out} is not what the translations give: run node tools/wr-readers.mjs --write`); problems++; }
}

/* Every Spanish answer of the revised bank, or one of its alternates, is in
   the reader of the question's reading. */
const bank = JSON.parse(fs.readFileSync('src/data/readings/wrreadings.v2.bank.json', 'utf8'));
const accept = JSON.parse(fs.readFileSync('src/data/readings/wrreadings.v2.accept.json', 'utf8'));
let supported = 0, unread = 0;
for (const q of bank.questions) {
  const t = ' ' + texts[q.reading] + ' ';
  if (t.trim() === '') { unread++; continue; }
  const answers = [q.answer_es, ...((accept[String(q.id)] || {}).es || [])];
  // a reading made of several files is checked only once every file is there
  const r = READERS.find((x) => x.n === q.reading);
  const whole = r.files.every((f) => fs.existsSync(path.join(DIR, f)));
  const found = answers.find((a) => t.includes(' ' + fold(a) + ' '));
  if (found) supported++;
  else if (whole) { console.error(`#${q.id} (reading ${q.reading}, ${q.source}): no Spanish answer of [${answers.join(' / ')}] is in the reader`); problems++; }
  else unread++;
}
console.log(`${supported} of ${bank.questions.length} Spanish answers found in their readers${unread ? `; ${unread} on readings not yet (wholly) translated` : ''}`);
if (problems) { console.error(`${problems} problem(s)`); process.exit(1); }
console.log(pending ? `PASS for the readers translated so far (${READERS.length - pending} of ${READERS.length}); --strict needs all ${READERS.length}.` : `PASS — all ${READERS.length} readers, every Spanish answer supported.`);
