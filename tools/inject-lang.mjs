/* Every student page restores the reader's language (Dr. Cook's beta pass,
 * 30 Sept 2026). cts-lang.js does it, but only the pages that listed it loaded
 * it: the unit layout now does, and this adds it to every other built page --
 * the digests, the certificates (the reading rooms have their own layout
 * now, src/layouts/Room.astro, which loads it) -- straight after <body>,
 * so it runs before the page's own scripts. The pages in public/ stay as the
 * seminary wrote them. Run by astro.config.mjs when a build finishes.
 */
import fs from 'node:fs';
import path from 'node:path';

const TAG = '<script src="/cts-lang.js"></script>';

export function injectLang(dir) {
  let added = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(dir, f);
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes('cts-lang.js')) continue;
    const m = /<body\b[^>]*>/i.exec(html);
    if (!m) continue;
    const at = m.index + m[0].length;
    fs.writeFileSync(file, html.slice(0, at) + '\n' + TAG + html.slice(at));
    added++;
  }
  return added;
}

export default function langIntegration() {
  return {
    name: 'cts-lang',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const n = injectLang(dir instanceof URL ? dir.pathname : String(dir));
        logger.info(`cts-lang.js added to ${n} page(s)`);
      },
    },
  };
}
