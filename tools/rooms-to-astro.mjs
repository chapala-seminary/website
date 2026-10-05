/* The reading rooms onto the unit design (Robert, 5 Oct 2026): one masthead,
 * one sticky bar with the English / Español / Both switch, one footer, the
 * course's colour -- the furniture of a unit page -- instead of 45 rooms in
 * two families and a dozen looks, half of which showed both languages at
 * once with no way to choose.
 *
 * Run once, on 5 Oct 2026; kept, like tools/to-astro.mjs, as the record of
 * what was done. The pages it read are gone from public/ (git history has
 * them), so it cannot be run again; the rooms are edited in src/body/rooms.
 *
 *   node tools/rooms-to-astro.mjs        # public/CTS*Readings.html, CTSWRRequired.html
 *                                        #   -> src/body/rooms/<page>.html + src/data/rooms.json
 *
 * The honors page (cts-honors.html) was converted by hand the same way.
 *
 * What it does to each room, and nothing else:
 *   - lifts the room's own title block into src/data/rooms.json, which the
 *     layout (src/layouts/Room.astro) renders as a unit masthead, and drops
 *     the room's own header, language bar(s), footer and stylesheets
 *     (public/assets/css/cts-rooms.css now styles every room);
 *   - in the 25 rooms that showed both languages at once (Spanish in
 *     .es / .fs-es, English unmarked), marks each English passage lang-en and
 *     its Spanish lang-es, the convention of the units and of the other 20
 *     rooms, so the switch can show one language or both;
 *   - splits the "English / Español" labels written as one string, and gives
 *     Spanish to the short topic labels that had none
 *     (tools/data/room-topics-es.json -- machine drafts, for Dr. Cook).
 * The digests, the readings, the scripts and the prose pass through
 * untouched. Checked when it ran: every word of every old page is on the new
 * one, apart from the furniture the layout replaced (each room's own header,
 * language bar and footer) and the sentences listed in
 * _review/reading-rooms-spanish-drafts.md.
 * The shelf and attestation blocks are rewritten afterwards by
 * tools/reading-rooms.mjs, which owns them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const SRC = 'public';
const OUT = 'src/body/rooms';
const DATA = 'src/data/rooms.json';
const ES = JSON.parse(fs.readFileSync('tools/data/room-topics-es.json', 'utf8'));

/* The course each room belongs to (src/content/courses), for its name, its
   colour and the way back to it. src/lib/partials.ts has the same mapping for
   the courses on the unit engine; the four single-page courses and Ethics
   have rooms but no units. */
const partials = fs.readFileSync('src/lib/partials.ts', 'utf8');
const COURSE = {};
for (const m of partials.matchAll(/^\s+(\w+): "(CTS\w+Readings)\.html",$/gm)) COURSE[m[2]] = m[1];
Object.assign(COURSE, {
  CTSCounselingReadings: 'CTSCounseling',
  CTSEthicsReadings: 'ethics_unit01',
  CTSNarrativePreachingReadings: 'CTS_Narrative_Preaching',
  CTSPreachingReadings: 'CTS_WiseSpeak_Preaching',
  CTSWRRequired: 'CTSWR',
});

/* Runs in the browser, on the page as a browser parses it (the rooms are
   hand-written, and a lenient parser read some of them differently from
   the way a student's browser does). Scripts are off. */
function convert({ ES, file }) {
  const report = [];
  const $$ = (sel, r = document) => Array.from(r.querySelectorAll(sel));
  const inner = (el) => el.innerHTML.replace(/\s+/g, ' ').trim();
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const isWs = (n) => n.nodeType === 3 && !n.data.trim();
  const isEl = (n, tag) => n && n.nodeType === 1 && (!tag || n.tagName === tag);
  const span = (cls, html) => `<span class="${cls}">${html}</span>`;
  const pair = (en, es, block = false) => span(`lang-en${block ? ' block' : ''}`, en) + span(`lang-es${block ? ' block' : ''}`, es);
  const topicEs = (t) => { const es = ES.topics[t]; if (!es) throw new Error(`${file}: no Spanish for the topic "${t}" (tools/data/room-topics-es.json)`); return es; };
  const labelEs = (t) => { const es = ES.labels[t]; if (es === undefined) throw new Error(`${file}: no Spanish for the label "${t}" (tools/data/room-topics-es.json)`); return es; };

  /* "English / Español" in one string. A shared lead ("F. B. Jevons · public
     domain / dominio público") stays with both; so does a trailing arrow. */
  function splitSlash(html) {
    const i = html.indexOf(' / ');
    if (i < 0) return null;
    let en = html.slice(0, i).trim(), es = html.slice(i + 3).trim();
    const lead = Math.max(en.lastIndexOf(' · '), en.lastIndexOf(' — '));
    if (lead > 0) es = en.slice(0, lead + 3) + es;
    const arrow = es.match(/\s*↗$/);
    if (arrow && !/↗$/.test(en)) en += arrow[0];
    return [en, es];
  }

  /* ── The title block, for the masthead ── */
  function heading() {
    const mast = document.querySelector('.mast');
    if (mast) {   // the first family: eyebrow, h1 in both languages, a line under it
      const h = mast.querySelector('h1'), sub = mast.querySelector('.sub');
      return { heading: { en: inner(h.querySelector('.lang-en')), es: inner(h.querySelector('.lang-es')) },
               tagline: sub ? { en: inner(sub.querySelector('.lang-en')), es: inner(sub.querySelector('.lang-es')) } : null };
    }
    const header = $$('header').find((h) => !h.closest('.dg-block, .fs-wrap'));
    if (header) {
      const h1 = header.querySelector('h1');
      if (h1.querySelector('.es')) {   // the single-page courses: "Biblical Counseling<br><span class="es">..."
        // their line under the title ("Public-domain readings · English &
        // Español") described showing both languages at once; it goes
        return { heading: { en: 'Supplemental Reading Room', es: 'Sala de Lecturas Complementarias' }, tagline: null };
      }
      const after = (s) => { const i = s.indexOf(' — '); return i < 0 ? s : s.slice(i + 3); };
      const kids = Array.from(header.children);
      const i = kids.indexOf(h1);
      const esEl = kids[i + 1];
      const out = { heading: { en: after(inner(h1)), es: after(esEl ? inner(esEl).replace(/ · catalog course \d+$/, '') : '') }, tagline: null };
      const p = kids[i + 2], pes = kids[i + 3];
      if (p && p.tagName === 'P' && pes && pes.classList.contains('es')) out.tagline = { en: inner(p), es: inner(pes) };
      return out;
    }
    // Parables: a card with the title in it
    const h1 = document.querySelector('h1');
    const m = h1 && h1.querySelector('.lang-en') && inner(h1.querySelector('.lang-en')).match(/— (.+)$/);
    const n = h1 && h1.querySelector('.lang-es') && inner(h1.querySelector('.lang-es')).match(/— (.+)$/);
    if (!m || !n) throw new Error(`${file}: no title block found`);
    return { heading: { en: m[1], es: n[1] }, tagline: null };
  }

  /* ── English beside Spanish, in the rooms that showed both at once ── */
  function markPairs() {
    for (const el of $$('.es, .fs-es')) {
      if (el.closest('.dg-block')) continue;
      const parent = el.parentNode;
      let prev = el.previousSibling; while (prev && isWs(prev)) prev = prev.previousSibling;
      el.classList.remove('es', 'fs-es');
      if (el.tagName !== 'SPAN' && isEl(prev) && prev.tagName !== 'BR' && !prev.classList.contains('lang-en')) {
        // a block of Spanish after its English block: <p>..</p><p class="es">..</p>
        prev.classList.add('lang-en');
        el.classList.add('lang-es');
        continue;
      }
      // the English is the nodes before it, back to the start of the element
      // or the last pair already marked; the number of a shelf entry stays outside
      const en = [];
      for (let n = el.previousSibling; n; n = n.previousSibling) {
        if (isEl(n) && (n.classList.contains('lang-es') || n.classList.contains('lang-en') || n.classList.contains('cts-shelf-num'))) break;
        en.unshift(n);
      }
      let broke = false;
      while (en.length && (isWs(en[en.length - 1]) || isEl(en[en.length - 1], 'BR'))) {
        const n = en.pop(); if (isEl(n, 'BR')) broke = true; n.remove();
      }
      while (en.length && isWs(en[0])) en.shift();
      if (!en.length) { report.push(`a Spanish passage with nothing before it, left as Spanish: "${text(el).slice(0, 70)}"`); el.classList.add('lang-es'); continue; }
      // the slash between them
      const first = el.firstChild;
      if (first && first.nodeType === 3) first.data = first.data.replace(/^\s*\/\s*/, '');
      const last = en[en.length - 1];
      if (last.nodeType === 3) last.data = last.data.replace(/\s+$/, '');
      const block = broke || el.tagName !== 'SPAN';
      const w = document.createElement('span');
      w.className = 'lang-en' + (block ? ' block' : '');
      parent.insertBefore(w, en[0]);
      for (const n of en) w.appendChild(n);
      el.classList.add('lang-es'); if (block) el.classList.add('block');
    }
  }

  /* ── The labels written as one string ── */
  function splitLabels() {
    for (const el of $$('.num')) {
      if (el.closest('.dg-block, .cts-attest, .title') || el.querySelector('.lang-en')) continue;   // .title: the first family's "1."
      const t = text(el);
      let m;
      if ((m = t.match(/^Reading (\d+) \/ Lectura \1 · (.+)$/))) el.innerHTML = pair(`Reading ${m[1]} · ${m[2]}`, `Lectura ${m[1]} · ${topicEs(m[2])}`);
      else if ((m = t.match(/^Reading (\d+) [/·] Lectura \1$/))) el.innerHTML = pair(`Reading ${m[1]}`, `Lectura ${m[1]}`);
      else if (el.closest('article')) report.push(`a reading number not understood: "${t}"`);
    }
    for (const el of $$('.byline, .fs-kind, .actions a')) {
      if (el.closest('.dg-block') || el.querySelector('.lang-en, .lang-es')) continue;
      const s = splitSlash(inner(el));
      if (s) el.innerHTML = pair(...s);
    }
    for (const el of $$('.counter')) {
      if (el.querySelector('.lang-en')) continue;
      const h = inner(el);
      const m = h.match(/^Selected \/ Elegidas: (<strong id="count">\d+<\/strong>) of (\d+)$/);
      if (!m) { report.push(`a counter not understood: ${h}`); continue; }
      el.innerHTML = `${pair('Selected:', 'Elegidas:')} ${m[1]} ${pair(`of ${m[2]}`, `de ${m[2]}`)}`;
    }
    for (const el of $$('label.pick, label.btn')) {
      const box = el.querySelector('input'); if (!box || el.querySelector('.lang-en')) continue;
      const t = text(el);
      const [en, es] = t.includes(' / ') ? t.split(' / ') : t.split(' · ');
      if (!es) { report.push(`a select label not understood: "${t}"`); continue; }
      el.innerHTML = `${box.outerHTML} ${pair(en.trim(), es.trim())}`;
    }
    // the single-page courses' rooms: "anchored in Baxter & Watson", "How to read"
    for (const el of $$('article .meta')) {
      const t = inner(el);
      const m = t.match(/^CTS bilingual digest · anchored in (.+)$/);
      if (!m) { report.push(`a meta line not understood: "${t}"`); continue; }
      el.innerHTML = pair(t, `Resumen bilingüe del STC · basado en ${m[1].replace(/ &amp; /g, ' y ')}`);
    }
    for (const el of $$('article .portion')) {
      const m = text(el).match(/about ([\d,]+) words per language/);
      if (!m) { report.push(`a "how to read" note not understood: "${text(el).slice(0, 80)}"`); continue; }
      // "Use the Español button inside the reading" no longer applies: the
      // digest follows the page's switch
      el.innerHTML = pair(`<strong>How to read:</strong> read the whole digest (about ${m[1]} words per language).`,
                          `<strong>Cómo leer:</strong> lea el resumen completo (unas ${m[1]} palabras por idioma).`);
    }
    // a reading title with no Spanish: the digest's own Spanish title
    for (const h of $$('article.reading > h3')) {
      if (h.querySelector('.lang-es')) continue;
      const es = h.parentNode.querySelector('.lang-es.dg-block h1');
      if (!es) { report.push(`a reading title with no Spanish anywhere: "${text(h)}"`); continue; }
      h.innerHTML = pair(inner(h), inner(es));
    }
    for (const el of $$('h2')) {
      if (el.closest('.dg-block') || el.querySelector('.lang-en, .lang-es') || el.classList.contains('lang-en')) continue;
      const m = inner(el).match(/^(.+?) · (Las .+)$/);
      if (m) el.innerHTML = pair(m[1], m[2]);
    }
    for (const el of $$('.fs-eyebrow')) if (!el.querySelector('.lang-en')) el.innerHTML = pair(inner(el), labelEs(text(el)));
    for (const el of $$('.fs-meta')) {
      const first = el.firstChild;
      if (first && first.nodeType === 3 && first.data.trim()) {
        const t = first.data.trim(), es = labelEs(t);
        if (es !== t) { first.remove(); el.insertAdjacentHTML('afterbegin', pair(t, es) + ' '); }
      }
    }
  }

  const head = heading();
  const title = document.title.trim();
  const body = document.body;
  // the room's own furniture, which the layout now renders
  for (const el of $$('style')) el.remove();
  for (const el of $$('.bar, .mast')) el.remove();
  for (const el of $$('header')) if (!el.closest('.dg-block, .fs-wrap')) el.remove();
  // Parables: its catalog link and toggle above the title card, and the title
  for (const b of $$('button[data-lang]')) { const d = b.parentNode; if (d && d.tagName === 'DIV' && d.isConnected) d.remove(); }
  for (const h1 of $$('.card > h1')) h1.remove();
  // the closing footer: links the layout's footer now carries, or a note worth keeping
  for (const ft of $$('footer')) {
    if (ft.closest('.dg-block, .fs-wrap, details')) continue;
    const t = inner(ft), i = t.indexOf(' · Cada ');
    if (!ft.querySelector('a') && i > 0) ft.outerHTML = `<p class="room-note">${pair(t.slice(0, i), t.slice(i + 3), true)}</p>`;
    else ft.remove();
  }

  markPairs();
  splitLabels();

  // the column the page lived in: the layout has its own
  const wrap = Array.from(body.children).find((n) => n.tagName === 'DIV' && (n.classList.contains('wrap') || n.classList.contains('container')));
  if (wrap) wrap.replaceWith(...Array.from(wrap.childNodes));
  // one <main> per page, and it is the layout's
  const mains = $$('main');
  if (mains.length > 1) throw new Error(`${file}: ${mains.length} <main> elements`);
  if (mains[0]) {
    const d = document.createElement('div');
    for (const a of mains[0].attributes) d.setAttribute(a.name, a.value);
    d.id = d.id || 'cts-readings';
    d.append(...Array.from(mains[0].childNodes));
    mains[0].replaceWith(d);
  }
  return { out: body.innerHTML, title, head, report };
}

const pages = fs.readdirSync(SRC).filter((f) => /^CTS\w*Readings\.html$/.test(f) || f === 'CTSWRRequired.html').sort();
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const ctx = await browser.newContext({ javaScriptEnabled: false });
const page = await ctx.newPage();
await page.route('**/*', (r) => r.abort());

const rooms = {};
let notes = 0;
for (const f of pages) {
  const key = f.replace(/\.html$/, '');
  const course = COURSE[key];
  if (!course) throw new Error(`${f}: no course for this room`);
  await page.setContent(fs.readFileSync(path.join(SRC, f), 'utf8'));
  const { out, title, head, report } = await page.evaluate(convert, { ES, file: f });
  let html = out
    // the "no more than three" alert, in the reader's language
    .replace("alert('Choose no more than three readings. / Elija no más de tres lecturas.')",
      "alert(document.body.classList.contains('lang-es')?'Elija no más de tres lecturas.':document.body.classList.contains('lang-both')?'Choose no more than three readings. / Elija no más de tres lecturas.':'Choose no more than three readings.')")
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n').trim() + '\n';
  fs.writeFileSync(path.join(OUT, f), html);
  rooms[key] = { course, title, kind: key === 'CTSWRRequired' ? 'required' : 'room', ...head };
  for (const r of report) { console.log(`  ${f}: ${r}`); notes++; }
}
await browser.close();

fs.writeFileSync(DATA, JSON.stringify({
  _: 'The reading rooms (src/body/rooms/<page>.html), as src/pages/[room].astro builds them: the course each belongs to, its page title, and its masthead. Made by tools/rooms-to-astro.mjs (5 Oct 2026); edit here.',
  rooms,
}, null, 1) + '\n');
console.log(`${pages.length} rooms -> ${OUT}/ and ${DATA}${notes ? `, ${notes} note(s) above` : ''}`);
