/* Direct public-domain links for the reading-room shelf (Dr. Cook, 4 Oct
 * 2026: "where a stable legal public-domain copy exists, use the direct link
 * rather than a general search link"). Each result names a work by
 * "<nameEn> | <byline>" and gives a verified direct href, or null to keep the
 * search link. Only Google search links are replaced; links the delivery
 * already pointed at a copy are left alone.
 *
 *   node tools/apply-shelf-links.mjs <result.json>...   then: node tools/reading-rooms.mjs
 */
import fs from 'node:fs';
const FILE = 'src/data/reading-shelf.json';
const raw = fs.readFileSync(FILE, 'utf8'), data = JSON.parse(raw);
const found = new Map();
for (const f of process.argv.slice(2)) for (const r of JSON.parse(fs.readFileSync(f, 'utf8')))
  if (r.href && r.verified !== false && /^https:\/\//.test(r.href) && !/google\./.test(r.href)) found.set(r.key, r.href);
let replaced = 0, kept = 0;
for (const room of Object.values(data.rooms)) for (const e of room.entries) {
  const key = (e.nameEn + ' | ' + e.byline).replace(/&middot;/g, '·');
  for (const l of e.links ?? []) {
    if (!/google\.com\/search/.test(l.href)) continue;
    if (found.has(key)) { l.href = found.get(key); replaced++; } else kept++;
  }
}
fs.writeFileSync(FILE, JSON.stringify(data, null, raw.match(/^\{\n( +)/)?.[1].length ?? 2) + (raw.endsWith('\n') ? '\n' : ''));
console.log(`${replaced} search link(s) replaced by a direct copy; ${kept} kept (no dependable direct copy)`);
