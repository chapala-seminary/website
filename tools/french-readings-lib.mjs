/* French for the reading material: textbooks, required-reading tests, reading
 * rooms and the CTS digests. Shared by the translation driver
 * (tools/french-readings.mjs) and the build (tools/french-readings-pages.mjs).
 *
 * TWO KINDS OF STORE
 *
 * Textbooks and reading tests are collections (src/content/textbooks,
 * src/content/readings). Their French sits beside the English and Spanish in
 * the same fields -- body.fr, subtitle.fr, prompt.fr, answer.fr, accept.fr --
 * with provenance: `tr.<field>.fr` on the record for whole fields, and the
 * question's own `tr.fr` (src/content.config.ts), as lessons and units do.
 *
 * The digests and rooms are markup (public/CTS_*_digest.html, src/body/rooms)
 * with English and Spanish written side by side. Their French is a separate
 * store, src/data/french-readings/<type>/<id>.json, keyed by the English it
 * translates: each English "leaf" (an element holding running text, e.g. a
 * paragraph) is identified by a hash of its text and the names of its inline
 * tags. The build inserts a French copy of each English element whose every
 * leaf has French, so a changed English sentence simply loses its French
 * (the page falls back to English there) and the old entry is reported as
 * stale. Nothing is matched by position, so an edit elsewhere on the page
 * cannot shift a translation onto the wrong paragraph.
 *
 * The digests also appear inside the reading rooms (the "Read the full
 * digest" panels) with slightly different markup -- other class names, other
 * entities. Keys ignore both, and the French is fitted to the markup it is
 * inserted into (fitTags), so one translation serves both copies. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { hash } from '../src/lib/lesson.ts';

export { hash };
export const STORE = 'src/data/french-readings';
export const CHROME_ROOMS = 'src/data/french-pages/_rooms.json';
export const DIGEST = /^CTS_.+_digest\.html$/;

export const FLOW = /^(DIV|SECTION|ARTICLE|HEADER|FOOTER|MAIN|ASIDE|NAV|FIGURE|FIGCAPTION|DETAILS|SUMMARY|P|LI|H[1-6]|UL|OL|DL|DT|DD|BLOCKQUOTE|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|HR)$/;
const SKIP = /^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/;
const MARK_EN = ['lang-en', 'en-only', 'block-en', 'teach-en', 'en-lbl', 'en', 'english'];
const MARK_ANY = [...MARK_EN, 'lang-es', 'es-only', 'block-es', 'teach-es', 'es-lbl', 'es', 'spanish', 'lang-fr', 'fr-only', 'block-fr', 'teach-fr', 'fr-lbl', 'fr'];
const TO_FR = { 'lang-en': 'lang-fr', 'en-only': 'fr-only', 'block-en': 'block-fr', 'teach-en': 'teach-fr', 'en-lbl': 'fr-lbl', en: 'fr', english: 'fr' };

const classes = (el) => (el.getAttribute?.('class') || '').split(/\s+/).filter(Boolean);
/* The same test as src/lib/language-content.ts markedLanguage(), for English. */
export function isEnglish(el) {
  if (!el?.tagName || el.tagName === 'BODY' || el.tagName === 'HTML') return false;
  return classes(el).some((c) => MARK_EN.includes(c)) || /-en$/.test(el.id || '') || el.id === 'titleEn';
}
function isMarked(el) {
  if (!el?.tagName || el.tagName === 'BODY' || el.tagName === 'HTML') return false;
  return classes(el).some((c) => MARK_ANY.includes(c)) || /-(en|es|fr)$/.test(el.id || '') || el.id === 'titleEn' || el.id === 'titleEs';
}
function markedAncestor(el) {
  for (let p = el.parentNode; p; p = p.parentNode) if (isMarked(p)) return true;
  return false;
}

/* ---- text, keys and tags ------------------------------------------------- */

export const normText = (html) => parse(`<x>${html}</x>`).text.replace(/[\u00a0\u202f]/g, ' ').replace(/\s+/g, ' ').trim();
const OPEN = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?\/?>/g;
export const openTags = (html) => [...String(html).matchAll(OPEN)].map((m) => m[0]);
export const tagNames = (html) => openTags(html).map((t) => /^<([a-zA-Z0-9]+)/.exec(t)[1].toLowerCase());
const closeCounts = (html) => {
  const c = {};
  for (const m of String(html).matchAll(/<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g)) c[m[1].toLowerCase()] = (c[m[1].toLowerCase()] || 0) + 1;
  return c;
};
/* The key of an English leaf: its text, and the names of its inline tags --
   not their attributes, which differ between a digest and its copy in a room. */
export const leafKey = (html) => hash(normText(html) + '\u0001' + tagNames(html).join(','));
export const hasWords = (html) => /\p{L}/u.test(normText(html));

/* A translation must carry the same tags as its source, each exactly as
   written; they may move within the sentence. Returns a problem or null. */
export function tagProblem(en, fr) {
  const a = openTags(en).sort(), b = openTags(fr).sort();
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    const missing = a.filter((t) => !b.includes(t)), extra = b.filter((t) => !a.includes(t));
    return `tags differ (missing ${JSON.stringify(missing.slice(0, 3))}, extra ${JSON.stringify(extra.slice(0, 3))})`;
  }
  if (JSON.stringify(closeCounts(en)) !== JSON.stringify(closeCounts(fr))) return 'closing tags differ';
  const comments = (s) => (String(s).match(/<!--[\s\S]*?-->/g) || []).join('');
  if (comments(en) !== comments(fr)) return 'HTML comments differ';
  return null;
}
/* Fit a translation made against one copy of an English leaf (`en`) to
   another copy (`target`) with the same tag names in the same order: each tag
   of the French takes the attributes of the corresponding tag of the target. */
export function fitTags(en, fr, target) {
  if (en === target) return fr;
  const a = openTags(en), c = openTags(target);
  if (a.length !== c.length || tagNames(en).join() !== tagNames(target).join()) return null;
  const used = new Set();
  return String(fr).replace(OPEN, (t) => {
    const i = a.findIndex((x, k) => x === t && !used.has(k));
    if (i < 0) return t;
    used.add(i);
    return c[i];
  });
}

/* ---- leaves --------------------------------------------------------------- */

/* The leaves of an element: itself when it holds running text or inline
   markup, else the leaves of its block children, in document order. */
export function leaves(el) {
  if (SKIP.test(el.tagName || '')) return [];
  const kids = el.childNodes;
  const text = kids.some((n) => n.nodeType === 3 && n.rawText.trim());
  const elems = kids.filter((n) => n.nodeType === 1 && !SKIP.test(n.tagName));
  if (!text && elems.length && elems.every((e) => FLOW.test(e.tagName))) return elems.flatMap(leaves);
  return [el];
}
export const translatable = (leaf) => hasWords(leaf.innerHTML) && !leaf.querySelector('script,style');

/* The English elements of a page that carry reading content: marked English
   with no marked ancestor, outside scripts and the legacy controls. `scope`
   narrows the search (a room's own content is in main#content). */
export function englishUnits(root, scope = null) {
  const base = scope ? root.querySelector(scope) : root;
  if (!base) return [];
  return base.querySelectorAll('*').filter((el) => isEnglish(el) && !markedAncestor(el)
    && !el.closest('script,style,.toggle,[data-cts-legacy-control],.cts-seg'));
}

/* ---- the interface dictionary the rooms already have ---------------------- */

/* The reading rooms' interface (instructions, the honours form) is translated
   by the page frame's own dictionary, src/data/french-pages/_rooms.json, keyed
   as roomKey() below keys it. That dictionary wins: an English element it
   names is left to it, here and in the packets. */
const norm = (s) => s.replace(/\s+/g, ' ').trim();
export function roomKey(html) {
  return norm(html.replace(/<a\b([^>]*?)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (_m, pre, href, post, inner) => {
    if (/\/CTSTextbook[A-Za-z]+\.html$/.test(href) && !/Test\.html$/.test(href)) inner = '{book}';
    return `<a${pre}href=X${post}>${inner}</a>`;
  }));
}
let chromeKeys = null;
export function chromeRoomKeys(extra = null) {
  if (extra) return new Set(Object.keys(extra));
  if (chromeKeys) return chromeKeys;
  chromeKeys = new Set(fs.existsSync(CHROME_ROOMS) ? Object.keys(JSON.parse(fs.readFileSync(CHROME_ROOMS, 'utf8'))) : []);
  return chromeKeys;
}

/* ---- the store ------------------------------------------------------------ */

export function storeFile(type, id) { return path.join(STORE, type, `${id}.json`); }
export function loadStore(dir = STORE) {
  const memory = new Map(), files = [];
  if (!fs.existsSync(dir)) return { memory, files };
  for (const type of fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory())) {
    for (const f of fs.readdirSync(path.join(dir, type)).filter((f) => f.endsWith('.json'))) {
      const file = path.join(dir, type, f), data = JSON.parse(fs.readFileSync(file, 'utf8'));
      files.push({ file, data });
      for (const [key, entry] of Object.entries(data.entries || {})) if (!memory.has(key)) memory.set(key, { ...entry, key, file });
    }
  }
  return { memory, files };
}

/* Build the French copy of an English element: the same markup with each
   leaf's words in French, marked French, without ids (the page builder keeps
   the English element's ids). Null when any leaf lacks French. */
export function frenchCopy(el, memory, used = null) {
  const copy = parse(el.toString(), { comment: true, parseNoneClosedTags: true }).firstChild;
  const src = leaves(el), dst = leaves(copy);
  if (src.length !== dst.length) return null;
  let status = null;
  for (let i = 0; i < src.length; i++) {
    if (!translatable(src[i])) continue;
    const entry = memory.get(leafKey(src[i].innerHTML));
    if (!entry) return null;
    const fr = fitTags(entry.en, entry.fr, src[i].innerHTML);
    if (fr == null) return null;
    dst[i].set_content(fr);
    used?.add(entry.key);
    status = status === 'machine' || entry.tr?.fr?.status === 'machine' ? 'machine' : (entry.tr?.fr?.status || status);
  }
  for (const node of [copy, ...copy.querySelectorAll('[id]')]) node.removeAttribute?.('id');
  const cls = classes(copy).map((c) => TO_FR[c] || c);
  if (!cls.some((c) => Object.values(TO_FR).includes(c))) cls.push('lang-fr');
  copy.setAttribute('class', cls.join(' '));
  return { html: copy.toString(), status };
}

/* Insert French beside every English unit of a page that has it. Works on
   the page's own text by offsets, so nothing else in the file changes.
   Returns { html, inserted, missing, status }. */
export function augmentHtml(html, memory, { scope = null, used = null, chrome = chromeRoomKeys() } = {}) {
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  const inserts = [];
  let missing = 0, status = null;
  for (const el of englishUnits(root, scope)) {
    if (chrome.has(roomKey(el.innerHTML))) continue;
    if (!leaves(el).some(translatable)) continue;
    // already French beside it (a layout's own lang-fr)?
    let sib = el.nextElementSibling, has = false;
    while (sib && !isEnglish(sib)) { if (/\b(lang-fr|fr-only|block-fr|fr)\b/.test(sib.getAttribute('class') || '')) { has = true; break; } sib = sib.nextElementSibling; }
    if (has) continue;
    const fr = frenchCopy(el, memory, used);
    if (!fr) { missing++; continue; }
    if (fr.status === 'machine') status = 'machine'; else status ??= fr.status;
    inserts.push([el.range[1], fr.html]);
  }
  let out = html;
  for (const [at, text] of inserts.sort((a, b) => b[0] - a[0])) out = out.slice(0, at) + text + out.slice(at);
  // node-html-parser offsets must land on the closing '>' of each element
  return { html: out, inserted: inserts.length, missing, status };
}

/* ---- packets for markup --------------------------------------------------- */

/* The leaves of a page that need French, in order, once each: [{key, en, where}] */
export function markupSegments(html, { scope = null, chrome = chromeRoomKeys(), skip = new Set() } = {}) {
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  const out = [], seen = new Set();
  for (const el of englishUnits(root, scope)) {
    if (chrome.has(roomKey(el.innerHTML))) continue;
    for (const leaf of leaves(el)) {
      if (!translatable(leaf)) continue;
      const key = leafKey(leaf.innerHTML);
      if (seen.has(key) || skip.has(key)) continue;
      seen.add(key);
      out.push({ key, en: leaf.innerHTML, tag: leaf.tagName.toLowerCase() });
    }
  }
  return out;
}

/* ---- textbook bodies ------------------------------------------------------- */

export function bodyLeaves(html) {
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  return { root, list: leaves(root).filter((l) => l !== root || root.childNodes.length) };
}
/* The French body: the English markup with each leaf in French. It keeps
   the English heading ids: the French page pairs each French heading with
   its English one, which carries that id, so the French contents link to
   it (an id of its own would survive on the English page as an empty hook). */
export function frenchBody(enHtml, frLeaves) {
  const { root, list } = bodyLeaves(enHtml);
  const words = list.filter(translatable);
  if (words.length !== frLeaves.length) throw new Error(`body has ${words.length} passages, translation has ${frLeaves.length}`);
  words.forEach((leaf, i) => leaf.set_content(frLeaves[i]));
  return root.toString();
}

/* ---- carrying French through a re-import ---------------------------------- */

/* The importers rebuild a textbook or reading-test record from its masters.
   French (and any other added language) is carried over wherever the English
   it translates is unchanged; anything else is reported, not kept. */
const BASE = new Set(['en', 'es']);
export function carryFrench(previous, next, say = console.log) {
  if (!previous) return next;
  const extra = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? Object.keys(o).filter((k) => !BASE.has(k) && k !== 'tr') : []);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const field of ['title', 'subtitle', 'credits', 'room', 'body']) {
    const langs = extra(previous[field]);
    if (!langs.length || !next[field]) continue;
    if (same(previous[field].en, next[field].en)) {
      for (const l of langs) next[field][l] = previous[field][l];
      if (previous.tr?.[field]) (next.tr ??= {})[field] = previous.tr[field];
    } else say(`${next.slug}: ${field} changed in English; its ${langs.join(', ')} translation was dropped`);
  }
  const oldQ = previous.test?.questions || [], newQ = next.test?.questions || [];
  newQ.forEach((q, i) => {
    const o = oldQ[i];
    if (!o) return;
    const fields = ['prompt', 'answer', 'accept'];
    const langs = [...new Set(fields.flatMap((f) => extra(o[f])))];
    if (!langs.length) return;
    if (fields.every((f) => same(o[f]?.en, q[f]?.en))) {
      for (const f of fields) for (const l of langs) if (o[f]?.[l] != null) { q[f] ??= {}; q[f][l] = o[f][l]; }
      if (o.tr) q.tr = o.tr;
    } else say(`${next.slug} Q${i + 1}: changed in English; its ${langs.join(', ')} translation was dropped`);
  });
  return next;
}

/* French spacing (the same rule as the page frame's build pass): a narrow
   no-break space before ; ! ? and a no-break space before : and inside « ».
   Translators type ordinary spaces; this is applied as French is stored, so
   French drawn by a script (the test questions) is spaced right as well.
   Text only: tags and their attributes are left alone. */
export function frenchSpaces(html) {
  return String(html).split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : part
    .replace(/(\S)[ \u00a0](?=[;!?](?:\s|$|[«»"’)<&]))/g, '$1\u202f')
    .replace(/(\S) (?=:(?:\s|$|<|&))/g, '$1\u00a0')
    .replace(/«[ \u00a0](?=\S)/g, '«\u00a0')
    .replace(/(\S)[ \u00a0]»/g, '$1\u00a0»'))).join('');
}
