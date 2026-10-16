/* After language pages exist, give each one a title, description, cards and
 * JSON-LD in that page's language. Certificate titles stay as they are
 * (cts-certify.js reads document.title). Private pages get noindex.
 *
 *   tools/inject-seo.mjs runs from astro.config.mjs on astro:build:done.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import {
  PAGE_META, courseLandingMeta, unitMeta, organizationJsonLd, websiteJsonLd,
  programsJsonLd, facultyJsonLd, breadcrumbJsonLd, localeUrl, SITE, SITE_NAME,
  isPrivatePage, landingFile,
} from '../src/lib/seo.ts';

const LANGUAGES = ['en', 'es', 'fr'];

function loadJsonDir(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

const courses = loadJsonDir('src/content/courses');
const byPrefix = new Map(courses.map((c) => [c.entry.replace(/Unit\d+\.html$/, '').replace(/\.html$/i, ''), c]));
const landingOf = new Map(courses.map((c) => [landingFile(c.entry), c]));

function unitInfo(file) {
  const m = /^(.*)Unit(\d+)\.html$/i.exec(file) || /^(ethics)_unit0*(\d+)\.html$/i.exec(file);
  if (!m) return null;
  const prefix = m[1] === 'ethics' ? 'ethics_unit01' : m[1];
  const course = byPrefix.get(prefix);
  if (!course) return null;
  return { course, unit: Number(m[2]), landing: landingFile(course.entry) };
}

function metaFor(file, lang) {
  if (PAGE_META[file]) return PAGE_META[file][lang];
  const course = landingOf.get(file);
  if (course) return courseLandingMeta(course.title, course.description, lang);
  const unit = unitInfo(file);
  if (unit) {
    const title = unit.course.title[lang] || unit.course.title.en;
    return unitMeta(title, unit.unit, unit.course.title[lang] || unit.course.title.en, lang);
  }
  return null;
}

function setAttr(root, selector, name, value) {
  const el = root.querySelector(selector);
  if (el) el.setAttribute(name, value);
  return el;
}

function ensureMeta(head, attr, key, value) {
  const sel = `meta[${attr}="${key}"]`;
  let el = head.querySelector(sel);
  if (!el) {
    head.insertAdjacentHTML('beforeend', `<meta ${attr}="${key}" content="">`);
    el = head.querySelector(sel);
  }
  el.setAttribute('content', value);
}

function ensureLd(head, type, data) {
  const name = data.name;
  for (const script of head.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed['@type'] === type && (!name || parsed.name === name)) {
        script.set_content(JSON.stringify(data).replace(/</g, '\\u003c'));
        return;
      }
    } catch { /* leave broken scripts alone */ }
  }
  head.insertAdjacentHTML('beforeend', `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function applyPage(filePath, file, lang) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (!new RegExp('</head>', 'i').test(html)) return false;
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  const head = root.querySelector('head');
  const title = root.querySelector('title');
  if (!head || !title) return false;

  if (isPrivatePage(file) && !head.querySelector('meta[name="robots"]'))
    head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex,follow">');

  const meta = metaFor(file, lang);
  if (meta && !root.querySelector('script[src*="cts-certify"], script[src*="cts-completion"]')) {
    title.set_content(meta.title.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
    ensureMeta(head, 'name', 'description', meta.description);
    ensureMeta(head, 'property', 'og:title', meta.title);
    ensureMeta(head, 'property', 'og:description', meta.description);
    ensureMeta(head, 'property', 'og:url', localeUrl(file, lang));
    ensureMeta(head, 'property', 'og:image', `${SITE}/cts-share.png`);
    ensureMeta(head, 'property', 'og:image:width', '1200');
    ensureMeta(head, 'property', 'og:image:height', '630');
    ensureMeta(head, 'property', 'og:image:alt', SITE_NAME[lang]);
    ensureMeta(head, 'property', 'og:locale', lang === 'es' ? 'es_MX' : lang === 'fr' ? 'fr_FR' : 'en_US');
    ensureMeta(head, 'name', 'twitter:card', 'summary_large_image');
    ensureMeta(head, 'name', 'twitter:title', meta.title);
    ensureMeta(head, 'name', 'twitter:description', meta.description);
    ensureMeta(head, 'name', 'twitter:image', `${SITE}/cts-share.png`);
    setAttr(root, 'html', 'lang', lang);
  }

  if (file === 'index.html') {
    ensureLd(head, 'EducationalOrganization', organizationJsonLd(lang));
    ensureLd(head, 'WebSite', websiteJsonLd(lang));
  }
  if (file === 'CTSAbout.html') {
    for (const person of facultyJsonLd()) ensureLd(head, 'Person', person);
  }
  if (file === 'CTSBeforeYouBegin.html') {
    for (const program of programsJsonLd(lang)) ensureLd(head, 'EducationalOccupationalProgram', program);
  }
  const unit = unitInfo(file);
  if (unit) {
    const name = unit.course.title[lang] || unit.course.title.en;
    ensureLd(head, 'BreadcrumbList', breadcrumbJsonLd([
      { name: SITE_NAME[lang], url: localeUrl('index.html', lang) },
      { name, url: localeUrl(unit.landing, lang) },
      { name: `${name} · ${lang === 'es' ? 'Unidad' : lang === 'fr' ? 'Unité' : 'Unit'} ${unit.unit}`, url: localeUrl(file, lang) },
    ]));
  }

  for (const img of root.querySelectorAll('img:not([alt])')) {
    img.setAttribute('alt', SITE_NAME[lang]);
  }
  fs.writeFileSync(filePath, root.toString());
  return true;
}

export function injectSeo(dir) {
  let n = 0;
  for (const lang of LANGUAGES) {
    const folder = lang === 'en' ? dir : path.join(dir, lang);
    if (!fs.existsSync(folder)) continue;
    for (const file of fs.readdirSync(folder).filter((f) => f.endsWith('.html'))) {
      if (applyPage(path.join(folder, file), file, lang)) n++;
    }
  }
  return n;
}

export default function seoIntegration() {
  return {
    name: 'cts-seo',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const n = injectSeo(dir instanceof URL ? dir.pathname : String(dir));
        logger.info(`SEO metadata on ${n} pages`);
      },
    },
  };
}
