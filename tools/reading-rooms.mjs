/* The reading rooms (public/CTS*Readings.html), Dr. Cook's "CTS Add-ons" of
 * 4 Oct 2026, as he answered Robert's questions:
 *
 *   (a) keep the five existing CTS digests and their honours requirement
 *       (any three of the five, read in full, recorded on the student's
 *       honour); add the ten-work public-domain shelf below them, as
 *       supplemental further study -- not a replacement, not "three of
 *       fifteen", and without the words "included in your course download",
 *       which is not true on the website;
 *   (b) add the honours-reading attestation to the 25 rooms that lacked it.
 *
 * This writes both into the rooms, between markers, so it can be run again
 * when the delivery changes and nothing else on the page is touched:
 *
 *   node tools/reading-rooms.mjs           # write
 *   node tools/reading-rooms.mjs --check   # the rooms carry what the data says (run by npm test)
 *
 * The shelf comes from src/data/reading-shelf.json (extracted verbatim from
 * the delivery by tools/extract-reading-shelf.mjs). The rooms are
 * src/body/rooms/<page>.html, built into the unit design by
 * src/pages/[room].astro (5 Oct 2026); every room now switches language with
 * <span class="lang-en">/<span class="lang-es"> and body.lang-xx, and the
 * blocks written here do the same. Their look is public/assets/css/cts-rooms.css.
 * The rooms still came from two families:
 *   - 20 rooms (CTSJohnReadings.html is the model) have an attestation of
 *     their own, which writes localStorage cts_honors_v1:<CODE>;
 *   - 25 rooms had a "Select" checkbox on each of the five digests and no
 *     attestation.
 * The attestation added to the second family writes the same key with the
 * same shape ({name, date, course, works}), under the code the certificate
 * page reads it by (cts-cert-pdf.js: CTS<Code>Certificate.html -> Code),
 * so a recorded reading shows "with honors" on the diploma either way.
 */
import fs from 'node:fs';
import path from 'node:path';

const CHECK = process.argv.includes('--check');
const DATA = JSON.parse(fs.readFileSync('src/data/reading-shelf.json', 'utf8')).rooms;
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const DIR = 'src/body/rooms';
const SHELF = ['<!-- CTS-SHELF: the public-domain shelf, written by tools/reading-rooms.mjs from src/data/reading-shelf.json; edit there -->', '<!-- /CTS-SHELF -->'];
const ATTEST = ['<!-- CTS-ATTEST: the honours-reading attestation, written by tools/reading-rooms.mjs; edit there -->', '<!-- /CTS-ATTEST -->'];
const fails = [];
let written = 0, shelves = 0, attests = 0;

const esc = (s) => String(s).replace(/&(?![a-zA-Z#][a-zA-Z0-9]*;)/g, '&amp;').replace(/"/g, '&quot;');
const text = (s) => String(s).replace(/<[^>]+>/g, '');

/* A thing said in two languages, as every room now says it. */
const L = {
  inline: (en, es) => `<span class="lang-en">${en}</span><span class="lang-es">${es}</span>`,
  block: (en, es, tag = 'p', cls = '') => `<${tag} class="lang-en${cls}">${en}</${tag}><${tag} class="lang-es${cls}">${es}</${tag}>`,
};

function entryHtml(e) {
  const links = e.links.map((l) => `<a class="cts-shelf-link" href="${esc(l.href)}" target="_blank" rel="noopener">${L.inline(l.en || 'Open reading &#8599;', l.es || 'Abrir lectura &#8599;')}</a>`).join(' ');
  const badges = (e.badges || []).map((b) => `<span class="cts-shelf-badge">${b}</span>`).join(' ');
  return `<article class="cts-shelf-entry">
<div class="cts-shelf-locus">${L.inline(e.locusEn, e.locusEs)}</div>
<div class="cts-shelf-title"><span class="cts-shelf-num">${e.id}.</span> ${L.inline(e.nameEn, e.nameEs)}</div>
<div class="cts-shelf-byline">${e.byline}</div>
${L.block(e.captionEn, e.captionEs, 'p', ' cts-shelf-caption')}
<div class="cts-shelf-foot">${links}${badges ? ' ' + badges : ''}</div>
</article>`;
}

function shelfHtml(room) {
  const n = room.entries.length + (room.panels || []).reduce((s, p) => s + p.entries.length, 0);
  const WORDS = { 6: ['six', 'seis'], 10: ['ten', 'diez'], 14: ['fourteen', 'catorce'] }[n] || [String(n), String(n)];
  const headEn = `Further Study: ${WORDS[0][0].toUpperCase() + WORDS[0].slice(1)} Public-Domain Works`;
  const headEs = `Para Profundizar: ${WORDS[1]} obras de dominio público`;
  let h = `${SHELF[0]}
<section class="cts-shelf" id="cts-shelf" aria-labelledby="cts-shelf-h">
<div class="cts-shelf-head"><h2 id="cts-shelf-h">${L.inline(headEn, headEs)}</h2><div class="cts-shelf-rule"></div></div>
${L.block(
  `These ${WORDS[0]} works are for further study, for the student who wants to go on reading. They are not part of the honors reading above: that stays as it is &mdash; the five CTS digests, any three read in full and recorded on your honor. All ${WORDS[0]} are in the public domain; each link opens the work online, and most can also be found in the Internet Archive or Project Gutenberg. Most are in English: the Chrome browser can translate a page (right-click, &ldquo;Translate to&hellip;&rdquo;; on a phone, the browser menu).`,
  `Estas ${WORDS[1]} obras son para profundizar, para el estudiante que quiere seguir leyendo. No forman parte de la lectura con honores de arriba, que sigue igual: los cinco resúmenes del STC, tres cualesquiera leídos por completo y registrados bajo su honor. Las ${WORDS[1]} están en el dominio público; cada enlace abre la obra en línea, y la mayoría también se encuentra en Internet Archive o en el Proyecto Gutenberg. La mayoría están en inglés: el navegador Chrome puede traducir una página (clic derecho, &ldquo;Traducir a&hellip;&rdquo;; en un teléfono, el menú del navegador).`,
  'div', ' cts-shelf-note')}
${room.entries.map((e) => entryHtml(e)).join('\n')}
`;
  for (const p of room.panels || []) {
    h += `<div class="cts-shelf-panel"><h3>${L.inline(p.headEn, p.headEs)}</h3>
${L.block(p.introEn, p.introEs)}
${p.entries.map((e) => entryHtml(e)).join('\n')}
</div>
`;
  }
  return h + `</section>\n${SHELF[1]}`;
}

/* The attestation for a room of the second family: the same record the
   first family's rooms keep (CTSJohnReadings.html), switching language with
   the rest of the page. The record keeps the works' English titles, as it
   always has: cts-cert-pdf.js and the first family read the same shape. */
function attestHtml(code, courseName) {
  return `${ATTEST[0]}
<section class="cts-attest" id="cts-attest" data-honors-code="${esc(code)}" data-honors-course="${esc(courseName)}">
<h2>${L.inline('Record your reading', 'Registre su lectura')}</h2>
${L.block('When you have read your three chosen readings in full, enter your name and affirm it below. This record is kept on your honor, in this browser; it shows on your certificate as <em>with honors</em>.',
  'Cuando haya leído por completo sus tres lecturas elegidas, escriba su nombre y confírmelo abajo. Este registro se guarda bajo su honor, en este navegador; aparece en su certificado como <em>con honores</em>.', 'p', ' cts-intro')}
<label class="cts-field" for="cts-att-name">${L.inline('Your name', 'Su nombre')}</label>
<input type="text" id="cts-att-name" autocomplete="name">
<div class="cts-oath"><input type="checkbox" id="cts-att-oath"><label for="cts-att-oath">${L.inline('On my honor, I have read in full the three readings I selected above.', 'Bajo mi honor, he leído por completo las tres lecturas que seleccioné arriba.')}</label></div>
<button type="button" class="cts-btn" id="cts-att-record">${L.inline('Record my reading', 'Registrar mi lectura')}</button>
<p class="cts-msg" id="cts-att-msg" role="status"></p>
<p class="cts-done" id="cts-att-done">${L.inline('&#10003; Recorded &mdash; this class counts toward your With Honors progress. <a href="cts-honors.html">Reading With Honors &#8599;</a>',
  '&#10003; Registrado &mdash; esta clase cuenta para su progreso Con Honores. <a href="cts-honors.html">Lectura con Honores &#8599;</a>')}</p>
<div class="cts-record" id="cts-att-record-card">
<div class="num">${L.inline('Honors Reading &mdash; recorded', 'Lectura con Honores &mdash; registrada')}</div>
<div class="cts-name" id="cts-att-rec-name"></div>
<p>${L.inline('affirmed on <span id="cts-att-rec-date"></span> to have read, in full:', 'afirmó el <span id="cts-att-rec-date-es"></span> haber leído, por completo:')}</p>
<ul id="cts-att-rec-list"></ul>
<p class="byline">${L.inline(`Chapala Theological Seminary &middot; ${esc(courseName)} &middot; present or print this page as your honors reading record.`, 'Seminario Teológico de Chapala &middot; presente o imprima esta página como su registro de lectura con honores.')}</p>
<p><button type="button" class="cts-btn ghost" onclick="window.print()">${L.inline('Print this record', 'Imprimir')}</button> <button type="button" class="cts-btn ghost" id="cts-att-reset">${L.inline('Start over', 'Empezar de nuevo')}</button></p>
</div>
</section>
<script>
(function(){
  var root=document.getElementById('cts-attest'); if(!root) return;
  var CODE=root.getAttribute('data-honors-code'), COURSE=root.getAttribute('data-honors-course'), MAX=3;
  var KEY='cts_honors_v1:'+CODE;
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function el(id){ return document.getElementById(id); }
  // the five digests' own checkboxes, whatever the page calls them
  function boxes(){ var m=document.querySelector('main')||document; return Array.prototype.slice.call(m.querySelectorAll('article input[type=checkbox]')); }
  // the reading's English title, which is what the record has always kept
  function titleOf(box){ var a=box.closest('article'); var h=a&&a.querySelector('h3'); if(!h) return ''; var c=h.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.lang-es'),function(s){ s.parentNode.removeChild(s); }); return c.textContent.replace(/\\s+/g,' ').trim(); }
  function say(en,es){ el('cts-att-msg').innerHTML=en?'<span class="lang-en">'+en+'</span><span class="lang-es">'+es+'</span>':''; }
  function showDone(on){ el('cts-att-done').style.display=on?'block':'none'; }
  function record(){
    var chosen=boxes().filter(function(b){ return b.checked; });
    var name=el('cts-att-name').value.trim(), oath=el('cts-att-oath').checked;
    if(chosen.length!==MAX){ say('Choose exactly three readings above to record them.','Elija exactamente tres lecturas arriba para registrarlas.'); return; }
    if(!name){ say('Enter your name to record your reading.','Escriba su nombre para registrar su lectura.'); return; }
    if(!oath){ say('Check the box to affirm you have read all three.','Marque la casilla para afirmar que ha leído las tres.'); return; }
    say('');
    var now=new Date(), en=now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    var es; try{ es=now.toLocaleDateString('es-MX',{year:'numeric',month:'long',day:'numeric'}); }catch(e){ es=en; }
    var works=chosen.map(titleOf);
    el('cts-att-rec-name').textContent=name; el('cts-att-rec-date').textContent=en; el('cts-att-rec-date-es').textContent=es;
    var ul=el('cts-att-rec-list'); ul.innerHTML=''; works.forEach(function(w){ var li=document.createElement('li'); li.textContent=w; ul.appendChild(li); });
    set('cts_honors_name_v1', name);
    set(KEY, JSON.stringify({name:name,date:en,course:COURSE,works:works}));
    showDone(true);
    var card=el('cts-att-record-card'); card.classList.add('show'); card.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){ el('cts-att-name').value=''; el('cts-att-oath').checked=false; el('cts-att-record-card').classList.remove('show'); say(''); }
  el('cts-att-record').addEventListener('click', record);
  el('cts-att-reset').addEventListener('click', reset);
  if(get(KEY)) showDone(true);
  var nm=get('cts_honors_name_v1'); if(nm && !el('cts-att-name').value) el('cts-att-name').value=nm;
})();
</script>
${ATTEST[1]}`;
}

function between(html, [open, close]) {
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a === -1 && b === -1) return null;
  if (a === -1 || b === -1 || b < a) throw new Error(`a half marker block (${open.slice(0, 20)}...)`);
  return { a, b: b + close.length };
}
function replaceOrInsert(html, markers, block, insertAt) {
  const cur = between(html, markers);
  if (cur) return html.slice(0, cur.a) + block + html.slice(cur.b);
  const at = insertAt(html);
  if (at < 0) throw new Error('no place to insert');
  return html.slice(0, at) + '\n' + block + '\n' + html.slice(at);
}
const lastIndex = (s, re) => { let m, at = -1; const g = new RegExp(re.source, 'g'); while ((m = g.exec(s))) at = m.index + m[0].length; return at; };

/* Which certificate page reads this room's record (cts-cert-pdf.js). */
function honorsCode(file) {
  const code = file.replace(/^CTS/, '').replace(/Readings\.html$/, '');
  const page = `CTS${code}Certificate.html`;
  const done = Object.values(catalog.completions).find((c) => c.page === page);
  return done ? { code, name: done.name } : null;
}

const rooms = fs.readdirSync(DIR).filter((f) => /^CTS.*Readings\.html$/.test(f)).sort();
for (const f of rooms) {
  const p = path.join(DIR, f);
  let html = fs.readFileSync(p, 'utf8');
  const before = html;
  const spans = /HONORS_CODE=/.test(html);   // the first family, with an attestation of its own
  const key = f.replace(/\.html$/, '');
  const data = DATA[key];
  if (!/^CTS(Genesis|Pentecostal|Parables|WR)Readings\.html$/.test(f) && !data) fails.push(`${f}: no shelf in src/data/reading-shelf.json`);

  // (b) the attestation, where the room has none
  if (!spans) {
    // a room with an attestation of its own (CTSParablesReadings.html) keeps it
    if (/cts_honors_v1/.test(html) && !between(html, ATTEST)) { /* nothing to add */ }
    else {
      const h = honorsCode(f);
      if (!h) fails.push(`${f}: no certificate page CTS<Code>Certificate.html in worker/catalog.json to key its record by`);
      else {
        html = replaceOrInsert(html, ATTEST, attestHtml(h.code, h.name), (s) => lastIndex(s, /<!-- \/cts-readings -->/));
        attests++;
      }
    }
  }
  // (a) the shelf, below the five digests (and, in the first family, below the attestation)
  if (data) {
    html = replaceOrInsert(html, SHELF, shelfHtml(data), (s) => {
      if (spans) { const i = s.indexOf('<p class="footnote">'); if (i !== -1) return i; }
      const at = between(s, ATTEST); if (at) return at.b + 1;
      return lastIndex(s, /<!-- \/cts-readings -->/) + 1;
    });
    shelves++;
  }

  if (CHECK) {
    if (html !== before) fails.push(`${f}: not what tools/reading-rooms.mjs would write — run it`);
    const sh = between(before, SHELF);
    if (sh) {
      const s = before.slice(sh.a, sh.b);
      if (/course download|descarga de su curso|in your download|en su descarga/i.test(s)) fails.push(`${f}: the shelf says the works are in a download`);
      if (/type="checkbox"|data-pick/.test(s)) fails.push(`${f}: the shelf offers a selection; it is further study, not honours reading`);
      const n = (s.match(/<article class="cts-shelf-entry">/g) || []).length;
      const want = data.entries.length + (data.panels || []).reduce((t, p) => t + p.entries.length, 0);
      if (n !== want) fails.push(`${f}: the shelf has ${n} works, the data ${want}`);
    }
    if (!/cts_honors_v1/.test(before)) fails.push(`${f}: no honours attestation`);
  } else if (html !== before) { fs.writeFileSync(p, html); written++; }
}

console.log(`${rooms.length} reading rooms: ${shelves} with a shelf, ${attests} given the attestation${CHECK ? '' : `, ${written} written`}`);
if (fails.length) { console.error(`${fails.length} problem(s):`); fails.forEach((x) => console.error('  ' + x)); process.exit(1); }
if (CHECK) console.log('PASS — every reading room carries its shelf and its honours attestation, as the data says.');
