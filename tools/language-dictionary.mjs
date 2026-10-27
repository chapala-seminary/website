/* The page frame for a language whose interface words live in a dictionary
 * (src/lib/languages.mjs DICTIONARY_LANGUAGES; Swahili first), not in the
 * layouts. Called by tools/language-pages.mjs for each such page.
 *
 *   src/data/interface/<lang>.json   English wording -> translation
 *     "@course"  course code -> course title          (titles, cards)
 *     "@notice"  the notices this file writes         (see below)
 *     every other key: interface text, matched as src/lib/ui-dictionary.mjs says
 *
 * Interface text a layout wrote in English only (the page frame, registration,
 * exam labels, honors box, textbook and reading-test pages, certificates) is
 * replaced where the dictionary has it. Course content (a lesson block,
 * marked data-cts-block) is never replaced from the dictionary: a lesson
 * without its translation shows the English with the translation-pending
 * notice. Interface text in the frame that the dictionary lacks is reported
 * (.astro/interface-missing-<lang>.json) and stays English.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { makeTranslator, browserScript } from '../src/lib/ui-dictionary.mjs';
import { ENGLISH_IN, LANGUAGE_NAMES, LOCALE } from '../src/lib/languages.mjs';

const cache = new Map();
export function dictionary(lang) {
  if (!cache.has(lang)) {
    const file = `src/data/interface/${lang}.json`;
    const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
    const flat = {};
    // Sections are for people editing the file; lookups see one table.
    for (const [key, value] of Object.entries(dict)) {
      if (key.startsWith('@')) continue;
      if (value && typeof value === 'object') Object.assign(flat, value); else flat[key] = value;
    }
    cache.set(lang, { dict, flat, t: makeTranslator(flat), misses: new Map() });
  }
  return cache.get(lang);
}
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

/* The browser script for a language, written once per build into dist/. */
export function writeBrowserScript(dir, lang) {
  const { flat } = dictionary(lang);
  const text = browserScript(lang, flat);
  const rel = `assets/js/cts-ui-${lang}.js`;
  fs.mkdirSync(path.join(dir, 'assets/js'), { recursive: true });
  fs.writeFileSync(path.join(dir, rel), text);
  return `/${rel}?v=${crypto.createHash('sha256').update(text).digest('hex').slice(0, 10)}`;
}

/* A notice in the reader's language. */
export function notice(lang, key, vars = {}) {
  const text = dictionary(lang).dict['@notice']?.[key];
  if (!text) throw new Error(`src/data/interface/${lang}.json has no @notice.${key}`);
  return text.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? '');
}
export const showSourceLabel = (lang) => notice(lang, 'showSource', { source: ENGLISH_IN[lang] || 'English' });
export const languageGroupLabel = (lang) => notice(lang, 'language');

export function courseTitle(lang, code) {
  return dictionary(lang).dict['@course']?.[code] ?? null;
}

/* Replace the frame's English with the dictionary's words. */
export function applyDictionary(root, lang, file) {
  const D = dictionary(lang);
  const miss = (text) => { if (text && /[A-Za-z]/.test(text)) D.misses.set(text, (D.misses.get(text) || new Set()).add(file)); };
  for (const node of root.querySelectorAll('.cts-reading[data-cts-fallback]')) {
    if (node.closest('[data-cts-block], [data-cts-legacy-control]')) continue;
    const key = norm(node.innerHTML);
    const value = D.t(key);
    if (value != null) {
      node.set_content(value);
      node.setAttribute('lang', lang);
      node.removeAttribute('data-cts-fallback');
    } else if (node.closest('[data-cts-chrome]') || node.hasAttribute('data-cts-chrome')) miss(key);
  }
  // Interface text with no language marking: buttons and links of older pages.
  for (const node of root.querySelectorAll('body a, body button, body label, body h2, body th, body .btn')) {
    if (node.closest('script, style, .cts-text-pair, [data-cts-block], [data-cts-legacy-control]') || node.querySelector('*')) continue;
    const value = D.t(norm(node.innerHTML));
    if (value != null) node.set_content(value);
  }
  // Accessible names and form fields.
  for (const node of root.querySelectorAll('[aria-label]')) {
    if (node.closest('.cts-language-controls')) continue;
    const value = D.t(node.getAttribute('aria-label'));
    if (value != null) node.setAttribute('aria-label', value);
  }
  for (const node of root.querySelectorAll('[placeholder]')) {
    const value = D.t(node.getAttribute('data-en') || node.getAttribute('placeholder'));
    if (value != null) node.setAttribute(`data-${lang}`, value), node.setAttribute('placeholder', value);
  }
  const regions = new Intl.DisplayNames([LOCALE[lang] || lang], { type: 'region' });
  for (const option of root.querySelectorAll('option')) {
    const en = option.getAttribute('data-en') || norm(option.text);
    let value = null;
    if (/^[A-Z]{2}$/.test(option.getAttribute('value') || '') && option.getAttribute('value') !== 'OT') {
      try { value = regions.of(option.getAttribute('value')); } catch { value = null; }
    }
    value ??= D.t(en);
    if (value == null) continue;
    option.setAttribute('data-en', en);
    option.setAttribute(`data-${lang}`, value);
    option.set_content(value);
  }
  // The legacy segmented switcher (hidden on language pages) and certificate seals.
  for (const node of root.querySelectorAll('.cts-seg[aria-label="Language / Idioma"]')) node.setAttribute('aria-label', languageGroupLabel(lang));
  // The <title> of a unit page: the course's name in this language, and the unit.
  const m = /^(.*)Unit(\d+)\.html$/.exec(file);
  const title = root.querySelector('title');
  if (m && title) {
    const course = courseTitle(lang, m[1]);
    const unit = D.t(`Unit ${m[2]}`);
    if (course && unit) title.set_content(`${course} — ${unit}`.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
  } else if (title) {
    const value = D.t(norm(title.text));
    if (value != null) title.set_content(value.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
  }
}

/* After the build: what the frame still shows in English, for the translator. */
export function reportMisses(lang) {
  const D = cache.get(lang);
  if (!D) return 0;
  const out = Object.fromEntries([...D.misses].sort().map(([k, files]) => [k, [...files].slice(0, 3)]));
  fs.mkdirSync('.astro', { recursive: true });
  fs.writeFileSync(`.astro/interface-missing-${lang}.json`, JSON.stringify(out, null, 1) + '\n');
  return D.misses.size;
}

export const languageName = (lang) => LANGUAGE_NAMES[lang] || lang;
