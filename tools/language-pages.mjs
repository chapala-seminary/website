/* Build each language from the same canonical pages and lesson files. The
 * old render/prose baselines remain checked against the pre-language build;
 * verify-language-pages checks the final language pages independently. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { shell } from '../src/lib/shell.ts';
import { LANGUAGES, NAMES, localeHref, localizeMarkup, renderLanguageLesson } from '../src/lib/language-content.ts';

const SITE = 'https://chapalaseminary.org';
export const REFERENCE = '.astro/language-base';
function rewriteLinks(root, file, lang, files) {
  for (const node of root.querySelectorAll('[href], [src], [action]')) {
    for (const attr of ['href', 'src', 'action']) {
      const v = node.getAttribute(attr);
      if (!v || /^(?:[a-z]+:|\/\/|#)/i.test(v)) continue;
      const url = new URL(v, `${SITE}/${file}`);
      if (url.origin !== SITE) continue;
      const page = url.pathname.slice(1);
      const local = files.has(page) || page === '';
      node.setAttribute(attr, (attr === 'href' && local ? localeHref(page || 'index.html', lang) : url.pathname) + url.search + url.hash);
    }
  }
}
function control(file, lang, sourceLang, translated) {
  const choices = LANGUAGES.map(l => `<a class="cts-language-choice${l === lang ? ' active' : ''}" data-cts-lang="${l}" aria-current="${l === lang ? 'page' : 'false'}" href="${localeHref(file, l)}?cts_lang=${l}">${NAMES[l]}</a>`).join('');
  const label = lang === 'es' ? `Mostrar ${NAMES[sourceLang] || sourceLang}` : lang === 'fr' ? `Afficher ${NAMES[sourceLang] || sourceLang}` : `Show ${NAMES[sourceLang] || sourceLang}`;
  return `<div class="cts-language-controls"><div class="cts-language-choices" role="group" aria-label="Language">${choices}</div>${lang !== sourceLang ? `<label class="cts-source-control"><input type="checkbox" id="cts-show-source"${translated ? '' : ' disabled'}> ${label}</label>` : ''}</div>`;
}
export function buildLanguagePages(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.startsWith('_'));
  const fileSet = new Set(files);
  fs.rmSync(REFERENCE, { recursive: true, force: true });
  fs.mkdirSync(REFERENCE, { recursive: true });
  for (const file of files) fs.copyFileSync(path.join(dir, file), path.join(REFERENCE, file));
  for (const file of files) {
    const canonical = fs.readFileSync(path.join(REFERENCE, file), 'utf8');
    const m = /^(.*)Unit(\d+)\.html$/.exec(file);
    const lessonFile = m && `src/content/lessons/${m[1]}/${m[2]}.json`;
    const lesson = lessonFile && fs.existsSync(lessonFile) ? JSON.parse(fs.readFileSync(lessonFile, 'utf8')) : null;
    const sourceLang = lesson?.sourceLang || 'en';
    for (const lang of LANGUAGES) {
      let root = parse(canonical, { comment: true, parseNoneClosedTags: true });
      const html = root.querySelector('html'), body = root.querySelector('body'), head = root.querySelector('head');
      if (!html || !body || !head) continue;
      // The legacy controls stay as hidden hooks for old inline scripts. All
      // student interaction goes through the shared URL-based controls.
      for (const old of root.querySelectorAll('.cts-seg, .lang-toggle, .langbar, .lang-buttons, .lang-toggle-group, .toggle, #langToggle, #langBtn, #langToggleBtn, #langBtnEn, #langBtnEs, #langBtnBoth')) old.setAttribute('data-cts-legacy-control', 'true');
      if (lesson) {
        const rendered = shell(renderLanguageLesson(lesson, lang));
        const main = root.querySelector('#lesson');
        if (!main) throw new Error(`unit ${file} has no #lesson`);
        const keep = main.childNodes.filter(n => ['cts-register', 'greeting', 'cts-textbook'].includes(n.id)).map(n => n.toString()).join('');
        main.set_content(keep + rendered.content);
        const header = root.querySelector('.cts-masthead .wrap');
        if (header && rendered.masthead) header.set_content(rendered.masthead);
      }
      root = parse(localizeMarkup(root.toString(), lang, sourceLang), { comment: true, parseNoneClosedTags: true });
      const b = root.querySelector('body'), h = root.querySelector('head');
      const translated = lang === sourceLang || !!root.querySelector(`.cts-reading[lang="${lang}"]:not([data-cts-fallback])`);
      const complete = lang === sourceLang || (lesson
        ? lesson.blocks.filter(block => block.text[sourceLang]).every(block => !!block.text[lang])
        : !root.querySelector('[data-cts-fallback]'));
      root.querySelector('html').setAttribute('lang', lang);
      b.setAttribute('data-page-lang', lang); b.setAttribute('data-source-lang', sourceLang);
      b.setAttribute('data-language-page', file);
      b.setAttribute('data-lang', lang);
      b.setAttribute('class', (b.getAttribute('class') || '').replace(/\b(?:lang-(?:en|es|both|fr)|show-(?:en|es)|spanish)\b/g, '').trim() + ` lang-${lang}`);
      // Metadata is independent of localStorage and available before rendering.
      for (const script of root.querySelectorAll('script')) {
        script.set_content(script.innerHTML.replace(/localStorage\.(getItem|setItem|removeItem)\(location\.pathname/g, 'localStorage.$1(window.CTSLanguage.storagePath'));
        if (script.innerHTML.includes('window.CTS_UNIT =')) {
          script.set_content(script.innerHTML + `\nObject.assign(window.CTS_UNIT, ${JSON.stringify({ sourceLang, langs: LANGUAGES, pageLang: lang })});`);
        }
      }
      rewriteLinks(root, file, lang, fileSet);
      for (const node of h.querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]')) node.remove();
      h.insertAdjacentHTML('beforeend', LANGUAGES.map(l => `<link rel="alternate" hreflang="${l}" href="${SITE}${localeHref(file, l)}">`).join('') + `<link rel="canonical" href="${SITE}${localeHref(file, lang)}"><link rel="stylesheet" href="/assets/css/cts-languages.css">`);
      if (lang === 'fr' && (!translated || !complete)) h.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex,follow">');
      const notice = lang !== sourceLang && !translated ? `<aside class="cts-translation-pending" lang="en">${NAMES[lang]} translation is not available yet. Showing ${NAMES[sourceLang] || sourceLang}.</aside>` : '';
      const controls = control(file, lang, sourceLang, translated);
      const brandRow = root.querySelector('.topbar .wrap');
      const nav = root.querySelector('.cts-nav .wrap');
      if (brandRow) {
        brandRow.classList.add('cts-language-header');
        brandRow.insertAdjacentHTML('beforeend', controls);
      } else if (nav) nav.insertAdjacentHTML('beforeend', controls); else b.insertAdjacentHTML('afterbegin', controls);
      if (notice) { const main = root.querySelector('main'); if (main) main.insertAdjacentHTML('afterbegin', notice); else b.insertAdjacentHTML('afterbegin', notice); }
      // Language script must run before any legacy page initialization.
      for (const script of root.querySelectorAll('script[src]')) if (/\/cts-lang\.js(?:\?|$)|^cts-lang\.js(?:\?|$)/.test(script.getAttribute('src'))) script.remove();
      b.insertAdjacentHTML('afterbegin', '<script src="/cts-lang.js"></script>');
      const target = path.join(dir, lang === 'en' ? '' : lang, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, root.toString());
    }
  }
  // Spanish aliases follow the existing inclusion policy. Untranslated French
  // scaffolds are not indexed; approved French content can be added later.
  const map = path.join(dir, 'sitemap.xml');
  if (fs.existsSync(map)) {
    let xml = fs.readFileSync(map, 'utf8');
    const additions = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => `<url>${m[1].replace(/<loc>https:\/\/chapalaseminary\.org\/([^<]*)<\/loc>/, (_m, page) => `<loc>${SITE}/es/${page || 'index.html'}</loc>`)}</url>`).join('\n');
    xml = xml.replace('</urlset>', additions + '\n</urlset>');
    fs.writeFileSync(map, xml);
  }
  return files.length;
}
export default function languagePagesIntegration() {
  return { name: 'cts-language-pages', hooks: { 'astro:build:done': ({ dir, logger }) => {
    const count = buildLanguagePages(dir instanceof URL ? dir.pathname : String(dir));
    logger.info(`${count} pages per language: ${LANGUAGES.join(', ')}`);
  } } };
}
