// tools/extract-reading-shelf.mjs <delivery folder> <out.json>
// Pull the public-domain shelf out of each delivered reading room into JSON:
// every <article class="entry..."> (the Revelation "views" entries included,
// grouped under their panel), the shelf heading, and each entry's real links.
// Badges saying "in your download" are dropped: nothing is downloadable here.
import fs from 'node:fs';
const dir = process.argv[2]; const out = {};
const span = (html, cls) => { const m = html.match(new RegExp(`<span class="lang-${cls}">([\\s\\S]*?)</span>`)); return m ? m[1].trim() : ''; };
const block = (html, cls) => { const m = html.match(new RegExp(`<p class="caption lang-${cls} block">([\\s\\S]*?)</p>`)); return m ? m[1].trim() : ''; };
const parseEntry = (attrs, body) => {
  const a = k => (attrs.match(new RegExp(`${k}="([^"]*)"`)) || [])[1] || '';
  const title = body.match(/<div class="title">([\s\S]*?)<\/div>/)?.[1] || '';
  const locus = body.match(/<div class="locus">([\s\S]*?)<\/div>/)?.[1] || '';
  const links = [...body.matchAll(/<a class="read-link[^"]*" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(l => ({ href: l[1], en: span(l[2], 'en'), es: span(l[2], 'es') }));
  const badges = [...body.matchAll(/<span class="read-link mod"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/g)].map(b => span(b[1], 'en')).filter(t => !/download|descarga/i.test(t));
  return { id: a('data-id'), titleEn: a('data-title-en'), titleEs: a('data-title-es'), locusEn: span(locus, 'en'), locusEs: span(locus, 'es'),
    nameEn: span(title, 'en'), nameEs: span(title, 'es'), byline: (body.match(/<div class="byline">([\s\S]*?)<\/div>/)?.[1] || '').trim(),
    captionEn: block(body, 'en'), captionEs: block(body, 'es'), links, badges };
};
for (const f of fs.readdirSync(dir).filter(f => /^CTS.*Readings\.html$/.test(f))) {
  const html = fs.readFileSync(`${dir}/${f}`, 'utf8');
  const shelfHtml = html.match(/<div class="shelf-head">[\s\S]*?<h2>([\s\S]*?)<\/h2>/)?.[1] || '';
  const room = { shelfEn: span(shelfHtml, 'en'), shelfEs: span(shelfHtml, 'es'), entries: [], panels: [] };
  // panels (Revelation): a <div class="millennial"> with h2, intro, entries
  const panelsRe = /<div class="millennial">([\s\S]*?)<\/div>\s*\n\s*\n/g;
  const body = html.replace(panelsRe, (m, inner) => {
    const h2 = inner.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] || '';
    const intros = [...inner.matchAll(/<p class="intro lang-(en|es) block">([\s\S]*?)<\/p>/g)];
    const panel = { headEn: span(h2, 'en'), headEs: span(h2, 'es'), introEn: intros.find(i => i[1] === 'en')?.[2].trim() || '', introEs: intros.find(i => i[1] === 'es')?.[2].trim() || '', entries: [] };
    for (const e of inner.matchAll(/<article class="entry[^"]*"([^>]*)>([\s\S]*?)<\/article>/g)) panel.entries.push(parseEntry(e[1], e[2]));
    room.panels.push(panel); return '';
  });
  for (const e of body.matchAll(/<article class="entry[^"]*"([^>]*)>([\s\S]*?)<\/article>/g)) room.entries.push(parseEntry(e[1], e[2]));
  out[f.replace(/\.html$/, '')] = room;
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(`${k}: ${v.entries.length} entries${v.panels.length ? ', panels ' + v.panels.map(p => `"${p.headEn}"(${p.entries.length}, intro ${p.introEn.length}ch)`).join(' ') : ''}, badges ${v.entries.flatMap(e => e.badges).length}, shelf="${v.shelfEn}"`);
