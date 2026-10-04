/* Every page gets the seminary's icon in the browser tab (Robert, 4 Oct 2026).
 * The icons are drawn from the seal: the small ones (favicon.ico, 16-48px, and
 * favicon-32.png) are its centre -- cross, open book and lamp in a maroon ring
 * -- because the whole seal's lettering is a blur at tab size; the large ones
 * (icon-192.png, apple-touch-icon.png for a phone's home screen) are the whole
 * seal. Browsers ask for /favicon.ico on their own, but only a page that names
 * its icons gets the sharp PNG and the home-screen one, so this adds the links
 * to every built page before </head>. The pages in public/ stay as the
 * seminary wrote them. Run by astro.config.mjs when a build finishes.
 */
import fs from 'node:fs';
import path from 'node:path';

const TAGS = [
  '<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">',
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">',
  '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
].join('\n');

export function injectIcon(dir) {
  let added = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(dir, f);
    const html = fs.readFileSync(file, 'utf8');
    if (/<link[^>]+rel=["']?(?:shortcut )?icon/i.test(html)) continue;
    const m = /<\/head>/i.exec(html);
    if (!m) continue;
    fs.writeFileSync(file, html.slice(0, m.index) + TAGS + '\n' + html.slice(m.index));
    added++;
  }
  return added;
}

export default function iconIntegration() {
  return {
    name: 'cts-icon',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const n = injectIcon(dir instanceof URL ? dir.pathname : String(dir));
        logger.info(`site icon added to ${n} page(s)`);
      },
    },
  };
}
