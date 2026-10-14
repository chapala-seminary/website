/* French for the whole site around the lessons: the static pages, page
 * titles, the fallback notice and French typography. Course lessons and
 * answer keys are never translated here.
 *
 * A static page is translated by its own dictionary, src/data/french-pages/
 * <page>.json, keyed by the page's English markup (whitespace collapsed). The
 * French is inserted beside the English as the page's third language, so
 * "Afficher l’anglais" still shows the source. A changed English sentence has
 * no French until someone translates it again: the build stops rather than
 * show stale French or slip English onto a French page. Every key must still
 * be used, so a dictionary cannot carry dead entries either. */
import fs from 'node:fs';
import { parse, type HTMLElement } from 'node-html-parser';
import { markedLanguage } from './language-content.ts';

const DIR = 'src/data/french-pages';
export const SITE_NAME_FR = 'Séminaire théologique de Chapala';
const BLOCK = /^(DIV|SECTION|ARTICLE|HEADER|FOOTER|MAIN|ASIDE|NAV|FIGURE|P|UL|OL|DL|LI|H[1-6]|TABLE|BLOCKQUOTE|FORM)$/;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const FR_CLASS: Record<string, string> = { en: 'fr', 'en-only': 'fr-only', 'lang-en': 'lang-fr', 'block-en': 'block-fr', english: 'fr' };

function hasMarkedAncestor(el: HTMLElement) {
  for (let p = el.parentNode as HTMLElement | null; p; p = p.parentNode as HTMLElement | null) if (markedLanguage(p)) return true;
  return false;
}
export function frenchPageDictionary(file: string): Record<string, string> | null {
  const p = `${DIR}/${file.replace(/\.html$/, '')}.json`;
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}
/** The English units of a page that need French: marked English nodes, and
 *  elements whose own English is unmarked beside a marked Spanish child. */
export function frenchPageUnits(root: HTMLElement) {
  const units: { node: HTMLElement; key: string; kind: 'marked' | 'parent' }[] = [];
  for (const node of root.querySelectorAll('body *')) {
    if (node.closest('script,style,[data-cts-legacy-control],.langbtn,#langToggle')) continue;
    const lang = markedLanguage(node);
    if (lang === 'en' && !hasMarkedAncestor(node)) {
      // Already French beside it (a layout's own lang-fr)?
      let sib = node.nextElementSibling, hasFr = false;
      while (sib && markedLanguage(sib) !== 'en') { if (markedLanguage(sib) === 'fr') { hasFr = true; break; } sib = sib.nextElementSibling; }
      if (hasFr) continue;
      const key = norm(node.innerHTML);
      if (key && /[A-Za-z]/.test(node.text)) units.push({ node, key, kind: 'marked' });
    } else if (!lang && !hasMarkedAncestor(node)) {
      const kids = node.childNodes.filter(n => (n as HTMLElement).tagName) as HTMLElement[];
      if (!kids.some(k => markedLanguage(k) === 'es') || kids.some(k => markedLanguage(k) === 'en')) continue;
      if (kids.some(k => markedLanguage(k) !== 'es' && BLOCK.test(k.tagName))) continue;
      const copy = parse(node.innerHTML, { parseNoneClosedTags: true });
      for (const k of copy.childNodes) if ((k as HTMLElement).tagName && markedLanguage(k as HTMLElement) === 'es') k.remove();
      const key = norm(copy.innerHTML.replace(/(?:\s*<br\s*\/?>\s*)+$/i, ''));
      if (key && /[A-Za-z]/.test(copy.text)) units.push({ node, key, kind: 'parent' });
    }
  }
  return units;
}
/** Insert each page's French beside its English. Returns false when the page
 *  has no dictionary (it stays an English fallback). */
export function frenchPage(root: HTMLElement, file: string): boolean {
  const dict = frenchPageDictionary(file);
  if (!dict) return false;
  const used = new Set<string>();
  const missing: string[] = [];
  const take = (key: string) => { if (!(key in dict)) { missing.push(key); return null; } used.add(key); return dict[key]; };
  for (const { node, key, kind } of frenchPageUnits(root)) {
    const fr = take(key);
    if (fr == null) continue;
    if (kind === 'marked') {
      const marker = (node.getAttribute('class') || '').split(/\s+/).find(c => FR_CLASS[c]) || 'en';
      node.insertAdjacentHTML('afterend', `<${node.rawTagName} class="${FR_CLASS[marker]}">${fr}</${node.rawTagName}>`);
    } else {
      // The English is unmarked: mark it, so the page builder pairs it.
      const es = node.childNodes.filter(n => (n as HTMLElement).tagName && markedLanguage(n as HTMLElement) === 'es').map(n => (n as HTMLElement).innerHTML).join(' ');
      const own = parse(node.innerHTML, { parseNoneClosedTags: true });
      for (const k of own.childNodes) if ((k as HTMLElement).tagName && markedLanguage(k as HTMLElement) === 'es') k.remove();
      node.set_content(`<span class="en">${own.innerHTML.replace(/(?:\s*<br\s*\/?>\s*)+$/i, '')}</span><span class="es">${es}</span><span class="fr">${fr}</span>`);
    }
  }
  // Whole elements with no language marking (page titles, buttons, notes).
  for (const [key, fr] of Object.entries(dict)) {
    if (used.has(key) || key.startsWith('@')) continue;
    for (const node of root.querySelectorAll('body *')) {
      if (node.closest('script,style') || markedLanguage(node) || hasMarkedAncestor(node)) continue;
      if (norm(node.innerHTML) === key) { node.set_content(`<span class="en">${node.innerHTML}</span><span class="fr">${fr}</span>`); used.add(key); }
    }
  }
  if (dict['@title']) { root.querySelector('title')?.set_content(dict['@title']); used.add('@title'); }
  if (dict['@description']) {
    for (const sel of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) root.querySelector(sel)?.setAttribute('content', dict['@description']);
    used.add('@description');
  }
  if (missing.length) throw new Error(`Missing French for ${file} (${missing.length}); add to ${DIR}/${file.replace(/\.html$/, '')}.json:\n` + missing.slice(0, 20).map(k => '  ' + JSON.stringify(k)).join('\n'));
  const stale = Object.keys(dict).filter(k => !used.has(k));
  if (stale.length) throw new Error(`Unused French in ${DIR}/${file.replace(/\.html$/, '')}.json (the English changed?):\n` + stale.slice(0, 20).map(k => '  ' + JSON.stringify(k)).join('\n'));
  return true;
}

/* The notice on a page whose content is not in the reader's language. */
const LANG_IN: Record<string, Record<string, string>> = {
  fr: { en: 'en anglais', es: 'en espagnol' },
  es: { en: 'en inglés', fr: 'en francés' },
  en: { es: 'in Spanish', fr: 'in French' },
};
export function fallbackNotice(lang: string, sourceLang: string, answers: boolean) {
  const shown = LANG_IN[lang]?.[sourceLang] ?? sourceLang;
  const text = lang === 'fr'
    ? `La traduction française de cette page n’est pas encore disponible : le texte est affiché ${shown}.` + (answers ? ` Sur cette page, vous pouvez répondre ${shown}.` : '')
    : lang === 'es'
      ? `La traducción al español de esta página aún no está disponible: el texto se muestra ${shown}.`
      : `An English translation of this page is not available yet: the text is shown ${shown}.`;
  return `<aside class="cts-translation-pending" lang="${lang}">${text}</aside>`;
}

/* French typography (Imprimerie nationale): a narrow no-break space before
 * ; ! ? and a no-break space before : and inside « ». Only spaces already
 * there are changed, only in French text nodes, never in attributes, scripts,
 * styles or code; "10:30" and URLs have no space, so they are untouched. */
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE', 'svg']);
export function frenchSpaces(text: string) {
  return text
    .replace(/(\S)[  ](?=[;!?](?:\s|$|[«»"’)<&]))/g, '$1 ')
    .replace(/(\S) (?=:(?:\s|$|<|&))/g, '$1 ')
    .replace(/«[  ](?=\S)/g, '« ')
    .replace(/(\S)[  ]»/g, '$1 »');
}
export function frenchTypography(root: HTMLElement) {
  const walk = (el: HTMLElement, lang: string) => {
    for (const node of el.childNodes) {
      if (node.nodeType === 3) {
        if (lang === 'fr') { const raw = (node as any).rawText as string; const next = frenchSpaces(raw); if (next !== raw) (node as any).rawText = next; }
      } else if (node.nodeType === 1) {
        const child = node as HTMLElement;
        if (SKIP.has(child.tagName) || SKIP.has(child.rawTagName)) continue;
        walk(child, (child.getAttribute('lang') || lang).slice(0, 2));
      }
    }
  };
  const html = root.querySelector('html');
  if (html) walk(html, (html.getAttribute('lang') || 'fr').slice(0, 2));
}

/* The reading rooms share their instructions and honors form, room by room
 * (src/data/french-pages/_rooms.json). Links and book titles differ between
 * rooms: a key writes each link as href=X and a textbook's title as {book};
 * the French uses the same placeholders, in the same order. The rooms' own
 * readings are content and stay as they are. */
const ROOM_USED = new Set<string>();
let roomDict: Record<string, string> | null = null;
export function roomKey(html: string) {
  const hrefs: string[] = [], books: string[] = [];
  const key = html.replace(/<a\b([^>]*?)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (_m, pre, href, post, inner) => {
    hrefs.push(href);
    if (/\/CTSTextbook[A-Za-z]+\.html$/.test(href) && !/Test\.html$/.test(href)) { books.push(inner); inner = '{book}'; }
    return `<a${pre}href=X${post}>${inner}</a>`;
  });
  return { key: norm(key), hrefs, books };
}
export function frenchRoom(root: HTMLElement, bookTitle: (en: string) => string) {
  roomDict ??= JSON.parse(fs.readFileSync(`${DIR}/_rooms.json`, 'utf8'));
  const dict = roomDict!;
  for (const { node, kind } of frenchPageUnits(root)) {
    if (kind !== 'marked') continue;
    const { key, hrefs, books } = roomKey(node.innerHTML);
    if (!(key in dict)) continue;
    ROOM_USED.add(key);
    let i = 0, j = 0;
    const fr = dict[key].replace(/href=X/g, () => `href="${hrefs[i++]}"`).replace(/\{book\}/g, () => bookTitle(books[j++]));
    const marker = (node.getAttribute('class') || '').split(/\s+/).find(c => FR_CLASS[c]) || 'en';
    const cls = (node.getAttribute('class') || '').split(/\s+/).map(c => FR_CLASS[c] || c).join(' ');
    node.insertAdjacentHTML('afterend', `<${node.rawTagName} class="${cls || FR_CLASS[marker]}">${fr}</${node.rawTagName}>`);
    // Interface, not the room's content: the room still shows its English notice.
    node.setAttribute('data-cts-chrome', '');
  }
  // Interface elements a room writes in English with no language marking
  // (the further-study buttons, the bylines of some rooms): whole elements,
  // listed under "@plain" so they never match marked English above.
  const plain = (dict['@plain'] ?? {}) as unknown as Record<string, string>;
  for (const node of root.querySelector('#content')?.querySelectorAll('*') ?? []) {
    if (node.closest('script,style,[data-cts-legacy-control]') || markedLanguage(node) || hasMarkedAncestor(node)) continue;
    const key = norm(node.innerHTML);
    if (!(key in plain)) continue;
    ROOM_USED.add('@plain:' + key);
    node.set_content(`<span class="en">${node.innerHTML}</span><span class="fr">${plain[key]}</span>`);
    node.setAttribute('data-cts-chrome', '');
  }
}
/** After every room is built: a room entry no room uses is stale. */
export function checkRoomDictionary() {
  if (!roomDict) return;
  const plain = Object.keys((roomDict['@plain'] ?? {}) as unknown as Record<string, string>).map(k => '@plain:' + k);
  const stale = [...Object.keys(roomDict).filter(k => !k.startsWith('@')), ...plain].filter(k => !ROOM_USED.has(k));
  if (stale.length) throw new Error(`Unused French in ${DIR}/_rooms.json (the English changed?):\n` + stale.slice(0, 20).map(k => '  ' + JSON.stringify(k)).join('\n'));
}
