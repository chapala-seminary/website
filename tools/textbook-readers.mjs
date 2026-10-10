/* CTS Spanish translations of the assigned chapters of the full textbooks
 * (Dr. Cook, 10 Oct 2026): Blaikie on Joshua, Findlay on Galatians, Moule
 * on Romans. The Master's textbook exams (src/data/textbooks/staged/) may be
 * installed only when the student can read the assigned chapters in Spanish.
 *
 *   node tools/textbook-readers.mjs            # check (writes nothing)
 *   node tools/textbook-readers.mjs --write    # write public/textbooks/<Book>_Spanish.html
 *   node tools/textbook-readers.mjs --strict   # also fail on a chapter not yet translated
 *
 * Translations: docs/readers/textbooks/<book>/es/<ROMAN>.md, one per
 * assigned chapter, starting with a "## Capítulo ..." heading. The check
 * confirms every Spanish answer of the book's exam is in the Spanish text of
 * the chapter its question cites (or a listed alternate is).
 */
import fs from 'node:fs';
import path from 'node:path';

const WRITE = process.argv.includes('--write'), STRICT = process.argv.includes('--strict');
const BOOKS = [
  { key: 'joshua', title: 'El libro de Josué', series: 'The Expositor’s Bible', author: 'William Garden Blaikie', year: '1893', gutenberg: 42319,
    english: 'CTSJoshua_Blaikie_English.html', out: 'public/textbooks/CTSJoshua_Blaikie_Spanish.html', room: 'CTSJoshReadings.html',
    bank: 'src/data/textbooks/staged/joshua-blaikie.bank.v3.json',
    groups: [['I', 'II', 'III'], ['X', 'XI'], ['XVIII', 'XIX', 'XX'], ['XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI'], ['XXX', 'XXXI', 'XXXII', 'XXXIII']] },
  { key: 'galatians', title: 'La epístola a los Gálatas', series: 'The Expositor’s Bible', author: 'George G. Findlay', year: '1888', gutenberg: 42645,
    english: 'CTSGalatians_Findlay_English.html', out: 'public/textbooks/CTSGalatians_Findlay_Spanish.html', room: 'CTSGalatiansReadings.html',
    bank: 'src/data/textbooks/staged/galatians-findlay.bank.v1c.json',
    groups: [['IV'], ['X'], ['XIV', 'XVI'], ['XXII', 'XXV'], ['XXVI', 'XXVII']] },
  { key: 'romans', title: 'La epístola de san Pablo a los Romanos', series: 'The Expositor’s Bible', author: 'Handley C. G. Moule', year: '1894', gutenberg: 48858,
    english: 'CTSRomans_Moule_English.html', out: 'public/textbooks/CTSRomans_Moule_Spanish.html', room: 'CTSRomansReadings.html',
    bank: 'src/data/textbooks/staged/romans-moule.bank.v2.json',
    groups: [['III', 'VIII'], ['IX', 'XII'], ['XIV', 'XVII'], ['XX', 'XXIV'], ['XXV', 'XXIX']] },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s)
  .replace(/\\\*/g, '*')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*\w])\*([^*\n]+)\*(?![*\w])/g, '$1<em>$2</em>')
  .replace(/^\[(\d+)\]/, '<sup>$1</sup>');
function render(md) {
  const out = []; let title = '';
  for (const block of md.replace(/\r/g, '').split(/\n{2,}/)) {
    const b = block.trim();
    if (!b) continue;
    if (/^## /.test(b)) { title = b.slice(3).trim(); continue; }
    if (/^### /.test(b)) { out.push(`<h3>${inline(b.slice(4).trim())}</h3>`); continue; }
    if (/^>/.test(b)) { out.push(`<blockquote>${b.split('\n').map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>')}</blockquote>`); continue; }
    if (/^\[\d+\]/.test(b)) { out.push(`<p class="fn">${inline(b)}</p>`); continue; }
    out.push(`<p>${b.split('\n').map(inline).join('<br>')}</p>`);
  }
  return { title, html: out.join('\n') };
}
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();

function page(b, parts, missing) {
  const groupOf = (ch) => b.groups.findIndex((g) => g.includes(ch)) + 1;
  const toc = `<nav class="toc"><b>Capítulos asignados</b><ol>${parts.map((p) => `<li><a href="#chapter-${p.ch}">${esc(p.title || 'Capítulo ' + p.ch)}</a> <span class="grp">· grupo ${groupOf(p.ch)}</span></li>`).join('')}</ol>${missing.length ? `<p class="pending">En preparación: capítulos ${missing.join(', ')}.</p>` : ''}</nav>`;
  const body = parts.map((p) => `<section id="chapter-${p.ch}">\n<h2>${esc(p.title || 'Capítulo ' + p.ch)}</h2>\n${p.html}\n</section>`).join('\n');
  return `<!DOCTYPE html>
<!-- Written by tools/textbook-readers.mjs from docs/readers/textbooks/${b.key}/es/: edit the translation there, then run node tools/textbook-readers.mjs --write. -->
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(b.title)} (${esc(b.author)}) — capítulos asignados en español, CTS</title>
<style>
  :root{--ink:#2b2124; --soft:#6f5b60; --line:#e6dccf; --paper:#fbf8f3; --accent:#7a4a1e; --note:#f3ebe0;}
  *{box-sizing:border-box;}
  body{margin:0; background:var(--paper); color:var(--ink); font-family:Georgia,"Times New Roman",serif; line-height:1.62; font-size:18px; -webkit-text-size-adjust:100%;}
  .wrap{max-width:44rem; margin:0 auto; padding:2rem 1.25rem 4rem;}
  header.doc{border-bottom:2px solid var(--line); padding-bottom:1.1rem; margin-bottom:1.4rem;}
  .kicker{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:.8rem; letter-spacing:.04em; text-transform:uppercase; color:var(--accent); margin:0;}
  h1{font-size:1.7rem; line-height:1.25; margin:.3rem 0 .4rem;}
  .by{color:var(--soft); font-style:italic; margin:0 0 .6rem;}
  .note{background:var(--note); border-left:3px solid var(--accent); padding:.9rem 1rem; margin:1.4rem 0; font-size:.95rem; line-height:1.55;}
  .toc{font-size:.95rem; margin:1rem 0 1.6rem;} .toc ol{margin:.3rem 0 0 1.2rem; padding:0;} .grp,.pending{color:var(--soft);}
  h2{font-size:1.3rem; margin:2.4rem 0 .4rem; padding-top:.6rem; border-top:2px solid var(--line);}
  h3{font-size:1.08rem; margin:1.6rem 0 .5rem;}
  p{margin:0 0 1rem;} p.fn{font-size:.9rem; color:#4a3f42;}
  blockquote{margin:1.2rem 0; padding:.2rem 0 .2rem 1rem; border-left:3px solid var(--line); color:#333;}
  .back{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:.9rem;}
  a{color:var(--accent);}
  footer.doc{margin-top:2.4rem; padding-top:1rem; border-top:2px solid var(--line); font-size:.84rem; color:var(--soft); line-height:1.5;}
</style>
</head>
<body>
<div class="wrap">
<p class="back"><a href="../${b.room}">← Sala de lecturas del curso</a> · <a href="${b.english}">English edition</a></p>
<header class="doc">
<p class="kicker">Libro de texto de maestría · capítulos asignados · traducción de CTS</p>
<h1>${esc(b.title)}</h1>
<p class="by">${esc(b.author)} · ${esc(b.series)} · ${esc(b.year)}</p>
</header>
<div class="note"><p><b>Nota de CTS.</b> Traducción íntegra y fiel, párrafo por párrafo, de los capítulos asignados para el examen del libro de texto de maestría. Conserva las opiniones y la terminología del autor y de su época, que CTS no necesariamente comparte. Las citas bíblicas siguen la Reina-Valera 1960 cuando el pasaje es claramente el mismo. Los capítulos llevan la numeración de la edición inglesa (Project Gutenberg n.º ${b.gutenberg}).</p></div>
${toc}
${body}
<footer class="doc">Traducción al español de Chapala Theological Seminary (Seminario Teológico de Chapala), 2026, de la obra original en inglés de ${esc(b.author)}, que es de dominio público. <a href="../${b.room}">Volver a la sala de lecturas</a></footer>
</div>
</body>
</html>
`;
}

let problems = 0;
for (const b of BOOKS) {
  const dir = `docs/readers/textbooks/${b.key}/es`;
  const chs = b.groups.flat();
  const parts = [], missing = [], texts = {};
  for (const ch of chs) {
    const f = path.join(dir, `${ch}.md`);
    if (!fs.existsSync(f)) { missing.push(ch); continue; }
    const md = fs.readFileSync(f, 'utf8');
    parts.push({ ch, ...render(md) });
    texts[ch] = fold(md);
  }
  if (missing.length && STRICT) problems++;
  const bank = JSON.parse(fs.readFileSync(b.bank, 'utf8'));
  let ok = 0, waiting = 0;
  for (const q of bank.questions) {
    const t = texts[q.source_chapter];
    if (t === undefined) { waiting++; continue; }
    const answers = [q.answer.es, ...(q.accept?.es || [])].map(fold);
    if (answers.some((a) => ` ${t} `.includes(` ${a} `))) ok++;
    else { console.error(`${b.key} ${q.id} (ch. ${q.source_chapter}): no Spanish answer of [${[q.answer.es, ...(q.accept?.es || [])].join(' / ')}] in the translation`); problems++; }
  }
  console.log(`${b.key}: ${chs.length - missing.length} of ${chs.length} chapters translated; ${ok} Spanish answers found${waiting ? `, ${waiting} on chapters not yet translated` : ''}`);
  if (WRITE && parts.length) { fs.writeFileSync(b.out, page(b, parts, missing)); console.log(`  wrote ${b.out}`); }
}
if (problems) { console.error(`FAIL: ${problems} problem(s)`); process.exit(1); }
console.log('PASS');
