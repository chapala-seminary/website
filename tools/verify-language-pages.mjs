/* Independent checks on the final language pages, after the old bilingual
 * render and prose baselines have checked the pre-language build. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { shell } from '../src/lib/shell.ts';
const dir = process.argv[2] || 'dist';
const languages = ['en', 'es', 'fr'];
const files = fs.readdirSync('.astro/language-base').filter(f => f.endsWith('.html') && !f.startsWith('_'));
const shelf = JSON.parse(fs.readFileSync('src/data/reading-shelf.json', 'utf8')).rooms;
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };
const words = html => parse(html || '').text.replace(/\s+/g, ' ').trim();
// HTML block boundaries separate words even when the source omitted a newline.
const digestWords = html => words((html || '').replace(/<\/(p|div|li|h[1-6]|blockquote|header|footer|section|article)>/gi, '$& '));
for (const file of files) {
  const match = /^(.*)Unit(\d+)\.html$/.exec(file);
  const input = match && `src/content/lessons/${match[1]}/${match[2]}.json`;
  const lesson = input && fs.existsSync(input) ? JSON.parse(fs.readFileSync(input, 'utf8')) : null;
  let wanted, retained;
  if (lesson) {
    // Mark original slots independently of the new language renderer. The
    // established shell determines which blocks are teaching vs old controls.
    const probe = lesson.template.replace(/<!--cts:([\w-]+):([A-Za-z-]+)-->/g,
      (_, id, code) => `<span data-check-block="${id}" data-check-lang="${code}">${lesson.blocks.find(b => b.id === id)?.text[code] || ""}</span>`)
      .replace(/<!--cts-part:[\w-]+-->/g, '');
    const old = shell(probe);
    retained = new Map();
    const originalBlocks = parse(old.masthead + old.content).querySelectorAll('[data-check-block]');
    wanted = new Set(originalBlocks.map(e => e.getAttribute('data-check-block')));
    for (const e of originalBlocks) retained.set(e.getAttribute('data-check-block') + ':' + e.getAttribute('data-check-lang'), e.innerHTML);
  }
  const original = parse(fs.readFileSync(path.join('.astro/language-base', file), 'utf8'), {parseNoneClosedTags: true});
  const sourceDigests = original.querySelectorAll('.dg-block.lang-en');
  const spanishDigests = original.querySelectorAll('.dg-block.lang-es');
  for (const lang of languages) {
    const route = (lang === 'en' ? '' : lang + '/') + file;
    const root = parse(fs.readFileSync(path.join(dir, route), 'utf8'), {parseNoneClosedTags: true});
    const body = root.querySelector('body');
    if (!body) continue;
    ok(root.querySelector('html').getAttribute('lang') === lang, `${route}: html language`);
    ok(body.getAttribute('data-page-lang') === lang, `${route}: page language`);
    ok(root.querySelectorAll('[data-cts-lang]').length === 3, `${route}: three language choices`);
    ok(!root.querySelector('button[data-cts-lang="both"]'), `${route}: obsolete Both control`);
    for (const code of languages) {
      const expected = `https://chapalaseminary.org/${code === 'en' ? '' : code + '/'}${file}`;
      ok(root.querySelector(`link[hreflang="${code}"]`)?.getAttribute('href') === expected, `${route}: ${code} alternate`);
    }
    for (const e of root.querySelectorAll('[href], [src]')) {
      for (const attr of ['href', 'src']) {
        const href = e.getAttribute(attr);
        if (!href || /^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
        const local = href.split(/[?#]/)[0];
        ok(local.startsWith('/'), `${route}: relative ${attr} ${href}`);
        if (local.startsWith('/') && !local.startsWith('/api/') && !local.startsWith('/staff'))
          ok(fs.existsSync(path.join(dir, local === '/' ? 'index.html' : local.slice(1))), `${route}: missing ${href}`);
      }
    }
    if (lesson) for (const b of lesson.blocks.filter(b => wanted.has(b.id))) {
      const rendered = root.querySelectorAll(`[data-cts-block="${b.id}"]`);
      ok(rendered.length === 1, `${route}: block ${b.id} appears ${rendered.length} times`);
      const reading = rendered[0]?.querySelectorAll('.cts-reading').map(el=>el.innerHTML).join('') || '';
      ok(words(reading) === words(retained.get(b.id + ':' + (b.text[lang] ? lang : lesson.sourceLang))), `${route}: block ${b.id} reader words differ`);
      if (lang !== lesson.sourceLang && b.text[lang] && b.text[lesson.sourceLang])
        ok(words(rendered[0]?.querySelectorAll('.cts-source').map(el=>el.innerHTML).join('') || root.querySelector(`[data-cts-source-block="${b.id}"]`)?.innerHTML) === words(retained.get(b.id + ':' + lesson.sourceLang)), `${route}: block ${b.id} source words differ`);
    }
    if (sourceDigests.length) {
      const digests = root.querySelectorAll('.dg-block').filter(el => !el.hasAttribute('hidden'));
      ok(digests.length === sourceDigests.length, `${route}: digests lost or duplicated`);
      for (const [i, digest] of digests.entries()) {
        const wanted = lang === 'es' ? spanishDigests[i] : sourceDigests[i];
        ok(digestWords(digest.querySelectorAll('.cts-reading').map(el => el.innerHTML).join(' ')) === digestWords(wanted?.innerHTML), `${route}: digest ${i + 1} reader wording differs`);
        if (lang === 'es') ok(digestWords(digest.querySelectorAll('.cts-source').map(el => el.innerHTML).join(' ')) === digestWords(sourceDigests[i]?.innerHTML), `${route}: digest ${i + 1} source wording differs`);
      }
    }
    const room = shelf[file.replace(/\.html$/, '')];
    if (room) {
      const count = room.entries.length + (room.panels || []).reduce((n, panel) => n + panel.entries.length, 0);
      ok(root.querySelectorAll('.cts-shelf-entry').length === count, `${route}: shelf cards lost or duplicated`);
      ok(!root.querySelector('.cts-shelf-title article, .cts-shelf-title script, .cts-shelf-title footer'), `${route}: title swallowed later room content`);
    }
    for (const pair of root.querySelectorAll('.dg-block .cts-text-pair')) {
      const reader = pair.querySelector(':scope > .cts-reading'), source = pair.querySelector(':scope > .cts-source');
      if (source) ok((reader?.querySelectorAll('h2').length || 0) <= 1, `${route}: source follows a whole digest instead of its paragraphs`);
    }
    if (lang === 'en') ok(!root.querySelector('#cts-show-source'), `${route}: no source switch on source page`);
    if (lang === 'fr' && !root.querySelector('.cts-reading[lang="fr"]')) {
      ok(!!root.querySelector('.cts-translation-pending'), `${route}: missing fallback notice`);
      ok(!!root.querySelector('meta[name="robots"][content="noindex,follow"]'), `${route}: untranslated fallback indexable`);
    }
  }
}
console.log(`${files.length} pages × ${languages.length} languages; ${checks} checks`);
if (fails.length) { console.error(`FAIL — ${fails.length}:\n` + fails.slice(0, 40).join('\n')); process.exitCode = 1; }
else console.log('PASS — metadata, links and every retained lesson block match their source files.');
