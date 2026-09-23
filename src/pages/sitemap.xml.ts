/* The sitemap, generated from what the build actually produces.
 *
 * The hand-maintained one had drifted badly: CTSPentecostal -- a complete
 * twelve-unit course linked from the front page -- was absent entirely, along
 * with twelve certificate pages and every reading room. None of that is
 * visible by looking at the site, which is exactly why it went unnoticed.
 *
 * Policy, decided deliberately rather than inferred from the old file:
 *
 *   in   every course unit, every certificate, every reading room, and the
 *        standalone pages a student would search for
 *   out  the 205 reading digests -- supporting material behind the reading
 *        rooms rather than pages anyone should land on cold -- and the
 *        utility pages listed in EXCLUDE below
 *
 * No <lastmod>. A git checkout gives every file the same mtime, so any date
 * here would be the build date dressed up as a content date. An absent
 * lastmod is honest; a wrong one spends credibility for nothing.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';

const SITE = 'https://chapalaseminary.org';

/** Pages that exist but are not for search engines, and why. */
const EXCLUDE = new Set([
  'cts-backup.html',            // a student's own save/restore utility
  'CTS_ARCHIVE_INDEX.html',     // internal index of every file in the site
  'START_HERE.html',            // internal note, not student-facing
  'Apologetics_Self_Contained_Unlocked_Preview.html', // ungated duplicate of the ethics course
  'Romans_Digest_01_Haldane_EN.html',                 // a reading digest under an older name
]);

/** Standalone pages worth indexing, with the weight each carries. */
const STANDALONE: Record<string, number> = {
  'CTSAbout.html': 0.7,
  'CTSBeforeYouBegin.html': 0.7,
  'CTSCatalog.html': 0.7,
  'CTSResources.html': 0.7,
  'cts-honors.html': 0.7,
  'CTSCounseling.html': 0.8,              // a course that is one page, not units
  'CTS_Narrative_Preaching.html': 0.8,    // likewise
  'CTS_WiseSpeak_Preaching.html': 0.8,    // likewise — and a foundation course
  /* Indexed deliberately, and low. A student who wants their record deleted
     will search for it rather than hunt through a footer, so this is one of
     the few utility pages that has to be findable from outside the site. */
  'CTSPrivacy.html': 0.3,
};

const isDigest = (f: string) => /_digest\.html$/i.test(f) || /_Digest_/i.test(f);
const isCertificate = (f: string) => /Certificate\.html$/i.test(f);
const isReadingRoom = (f: string) => /Readings\.html$/i.test(f);
const isEthicsUnit = (f: string) => /^ethics_unit\d+\.html$/i.test(f);

export const GET: APIRoute = async () => {
  const urls = new Map<string, number>();
  const add = (path: string, priority: number) => urls.set(path, priority);

  add('', 1.0);                                        // the front page

  // Generated course units, straight from the collection that builds them.
  for (const entry of await getCollection('units'))
    add(`${entry.data.pagePrefix}Unit${entry.data.unit}.html`, 0.8);

  // Everything else is a static page; classify by what it is.
  for (const f of fs.readdirSync('public').filter((f) => f.endsWith('.html'))) {
    if (EXCLUDE.has(f) || isDigest(f)) continue;
    if (f in STANDALONE) add(f, STANDALONE[f]);
    else if (isEthicsUnit(f)) add(f, 0.8);
    else if (isCertificate(f)) add(f, 0.6);
    else if (isReadingRoom(f)) add(f, 0.6);
    // anything unrecognised is left out on purpose: a new kind of page should
    // be classified here deliberately, not swept in by a catch-all
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...urls.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, p]) => `  <url>\n    <loc>${SITE}/${path}</loc>\n    <priority>${p.toFixed(1)}</priority>\n  </url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
