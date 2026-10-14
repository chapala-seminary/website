// French on every certificate page: each course, the degree pages and
// Christian Ethics (French review, 13 Oct 2026).
//
//   node tools/add-certificate-french.mjs          write the French into public/
//   node tools/add-certificate-french.mjs --check  fail if a page lacks it
//
// The certificate pages are hand-written HTML with each sentence in an English
// element followed by a Spanish one (class en-only / lang-en, es-only /
// lang-es, ...). The language build (tools/language-pages.mjs) turns those
// pairs into one page per language; a French element beside them is what
// makes /fr/ French. This writes that element, after the Spanish one, from
// tools/data/certificate-fr.mjs, keyed by the English wording. A sentence the
// page shows without any language mark (the catalog link, the crest, the
// certificate ID label) is marked first, with English and Spanish unchanged.
//
// English and Spanish pages are not changed: the build removes the French
// element from them. Running it twice changes nothing.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { markedLanguage } from '../src/lib/language-content.ts';
import { CERTIFICATE_FR } from './data/certificate-fr.mjs';

// Every certificate page: each course's (with its M.Div. and Th.M. pages),
// the degree pages and Christian Ethics -- except the pages that have their
// own French dictionary in src/data/french-pages (the four degree pages),
// which tools/language-pages.mjs translates at build time. One mechanism per page.
export const PAGES = fs.readdirSync('public')
  .filter((f) => /Certificate\.html$/.test(f) || f === 'ethics_certificate.html' || f === 'CTSCertificateOfMinistry.html')
  .filter((f) => !fs.existsSync(path.join('src/data/french-pages', f.replace(/\.html$/, '.json'))))
  .sort();

// Unmarked wording: [exact source, French]. English and Spanish keep the source.
const UNMARKED = [
  ['📚 Catalog / Catálogo', '📚 Catalogue'],
  ['Chapala Theological Seminary &middot; Seminario Teol&oacute;gico de Chapala', 'Séminaire théologique de Chapala'],
  ['Certificate ID:', 'N° de certificat&nbsp;:'],
  ['Chapala Theological Seminary · Seminario Teológico de Chapala', 'Séminaire théologique de Chapala'],
  ['Matthew 28:19&ndash;20 &middot; Mateo 28:19&ndash;20', 'Matthieu 28:19&ndash;20'],
  ['Acts 20:28 &middot; Hechos 20:28', 'Actes 20:28'],
  ['Psalm 1:1&ndash;2 &middot; Salmo 1:1&ndash;2', 'Psaume 1:1&ndash;2'],
  ['Chapala Theological Seminary', 'Séminaire théologique de Chapala'],
  ['Dr. Wayne Cook', 'Dr Wayne Cook'],
  ['Dr. Ted Rogers', 'Dr Ted Rogers'],
  // pages written in English only (Church Growth) or with English headings
  ['Certificate of Completion', 'Certificat de réussite'],
  ['This certifies that', 'Le présent document atteste que'],
  ['Student Name', 'Nom de l’étudiant(e)'],
  ['has faithfully completed all twelve units of the course of study', 'a fidèlement accompli les douze unités du programme d’études'],
  ['Church Growth', 'Croissance de l’Église'],
  ['Certificate Track', 'Parcours Certificat'],
  ['&ldquo;I will build My church, and the gates of Hades shall not prevail against it.&rdquo; &mdash; Matthew 16:18', '&laquo;&nbsp;Je bâtirai mon Église, et les portes du séjour des morts ne prévaudront point contre elle.&nbsp;&raquo; &mdash; Matthieu 16:18'],
  ['Author &amp; Instructor', 'Auteur et enseignant'],
  ['Director', 'Directeur'],
  ['Cook<br>Theological<br>Seminary', 'Séminaire<br>théologique<br>Cook'],
  ['Print / Save as PDF', 'Imprimer / enregistrer en PDF'],
  ['Enter Name', 'Saisir le nom'],
  ['Ruth and Esther', 'Ruth et Esther'],
  ['The Art of the Story Sermon', 'L’art du sermon-récit'],
];

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const FR = new Map(CERTIFICATE_FR.map(([en, fr]) => [norm(en), fr]));
const SWAP = { 'lang-es': 'lang-fr', 'es-only': 'fr-only', 'block-es': 'block-fr', 'teach-es': 'teach-fr', 'es-lbl': 'fr-lbl', es: 'fr', spanish: 'fr',
               'lang-en': 'lang-fr', 'en-only': 'fr-only', 'block-en': 'block-fr', 'teach-en': 'teach-fr', 'en-lbl': 'fr-lbl', en: 'fr', english: 'fr' };

function frenchTag(open) {
  return open
    .replace(/\sclass="([^"]*)"/, (_m, c) => ` class="${c.split(/\s+/).map((x) => SWAP[x] || x).join(' ')}"`)
    .replace(/\sid="([^"]*?)-(?:en|es)"/, ' id="$1-fr"')
    .replace(/\slang="(?:en|es)"/, ' lang="fr"');
}

function markUnmarked(src) {
  for (const [raw, fr] of UNMARKED) {
    const wrapped = `<span class="en-only">${raw}</span><span class="es-only">${raw}</span><span class="fr-only">${fr}</span>`;
    if (src.includes(wrapped)) continue;
    // only where the wording is the whole text of an element, or a label before one
    const re = new RegExp(`(>\\s*)${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*<)`, 'g');
    src = src.replace(re, (m, a, b, at) => {
      // not inside an element that already names its language
      const tag = src.slice(src.lastIndexOf('<', at), at + 1);
      // only as an element's own text: not after a closing tag, never in a title
      if (/^<(?:\/|title|option|script|style)\b/i.test(tag)) return m;
      return /\bclass="[^"]*\b(?:en-only|lang-en|en|english|es-only|lang-es|es|spanish)\b/.test(tag) ? m : a + wrapped + b;
    });
  }
  return src;
}

export function addFrench(src, file) {
  src = markUnmarked(src);
  const root = parse(src, { comment: true, parseNoneClosedTags: true });
  const inserts = [], missing = [];
  for (const el of root.querySelectorAll('*')) {
    if (markedLanguage(el) !== 'en' || el.closest('script, .lang-toggle')) continue;
    let nested = false;
    for (let p = el.parentNode; p; p = p.parentNode) if (p.tagName && markedLanguage(p)) nested = true;
    if (nested) continue;
    const siblings = el.parentNode.childNodes.filter((n) => n.tagName);
    const following = siblings.slice(siblings.indexOf(el) + 1);
    const next = following.findIndex((n) => markedLanguage(n) === 'en');
    const group = next < 0 ? following : following.slice(0, next);
    if (group.some((n) => markedLanguage(n) === 'fr')) continue;
    const fr = FR.get(norm(el.innerHTML));
    if (fr == null) { missing.push(`${file}: ${norm(el.innerHTML).slice(0, 120)}`); continue; }
    const anchor = group.find((n) => markedLanguage(n) === 'es') || el;
    const [start, end] = anchor.range;
    const open = src.slice(start, src.indexOf('>', start) + 1);
    const lead = /^\s*/.exec(el.innerHTML)[0], trail = /\s*$/.exec(el.innerHTML)[0];
    inserts.push([end, frenchTag(open) + lead + fr + trail + `</${anchor.rawTagName}>`]);
  }
  inserts.sort((a, b) => b[0] - a[0]);
  for (const [at, html] of inserts) src = src.slice(0, at) + html + src.slice(at);
  return { src, missing, added: inserts.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  let problems = [], changed = 0, added = 0;
  for (const file of PAGES) {
    const p = path.join('public', file);
    const before = fs.readFileSync(p, 'utf8');
    const r = addFrench(before, file);
    problems.push(...r.missing);
    added += r.added;
    if (r.src !== before) { changed++; if (!check) fs.writeFileSync(p, r.src); }
  }
  if (problems.length) { console.error(`no French for:\n  ${problems.join('\n  ')}`); process.exit(1); }
  if (check && changed) { console.error(`${changed} certificate page(s) lack French: run node tools/add-certificate-french.mjs`); process.exit(1); }
  console.log(check ? `certificate French: ${PAGES.length} pages up to date` : `certificate French: ${added} element(s) added on ${changed} page(s)`);
}
