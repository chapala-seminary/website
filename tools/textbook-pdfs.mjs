#!/usr/bin/env node
/* PDFs of the CTS textbooks in a later language (French, Swahili), printed
 * from the same body the website shows (src/content/textbooks/<slug>.json,
 * body.<lang>). The English and Spanish PDFs come from the Word masters
 * (tools/import-textbooks.mjs); these have no Word master.
 *
 *   node tools/textbook-pdfs.mjs            # check (writes nothing)
 *   node tools/textbook-pdfs.mjs --write    # print public/textbooks/<slug>-<lang>.pdf, set files.pdf.<lang>
 */
import fs from 'node:fs';
import path from 'node:path';

const WRITE = process.argv.includes('--write');
const LANGS = ['fr', 'sw'];
const DIR = 'src/content/textbooks';
/* Book titles the record does not carry (title has en/es only). */
const TITLES = {
  fr: { counseling: 'Le conseil biblique', cults: 'Les sectes et l’Évangile', deaconship: 'Le diaconat (Howell, adapté)', doctrinal: 'La prédication doctrinale', language: 'Apprécier les langues bibliques', narrative: 'La prédication narrative', pentecostal: 'Théologie pentecôtiste et charismatique', situations: 'Situations de conseil pastoral', worship: 'Le culte chrétien' },
  sw: { counseling: 'Ushauri wa Kibiblia', cults: 'Madhehebu Potofu na Injili', deaconship: 'Ushemasi (Howell, kimerekebishwa)', doctrinal: 'Kuhubiri Mafundisho', language: 'Kuthamini Lugha za Biblia', narrative: 'Kuhubiri kwa Masimulizi', pentecostal: 'Teolojia ya Kipentekoste na ya Karismatiki', situations: 'Hali za Ushauri wa Kichungaji', worship: 'Ibada ya Kikristo' },
};
const WORDS = {
  fr: { kicker: 'Séminaire théologique de Chapala · manuel', edition: 'Édition', note: 'Traduction française du STC, faite à partir de l’édition anglaise. Cette page est aussi lisible en ligne sur chapalaseminary.org.' },
  sw: { kicker: 'Seminari ya Kitheolojia ya Chapala · kitabu cha kiada', edition: 'Toleo', note: 'Tafsiri ya Kiswahili ya CTS, iliyofanywa kutoka toleo la Kiingereza. Kitabu hiki kinasomeka pia mtandaoni katika chapalaseminary.org.' },
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(rec, lang) {
  const w = WORDS[lang];
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(TITLES[lang][rec.slug])}</title><style>
@page { size: Letter; margin: 22mm 20mm 22mm 20mm; }
body { font-family: Georgia, "DejaVu Serif", serif; font-size: 11.5pt; line-height: 1.5; color: #222; }
.cover { text-align: center; padding-top: 50mm; page-break-after: always; }
.kicker { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; color: #6b4a1e; }
h1 { font-size: 26pt; line-height: 1.2; margin: 8mm 0 4mm; }
.sub { font-size: 13pt; font-style: italic; color: #555; margin: 0 0 12mm; }
.credits, .ed { font-size: 10pt; color: #555; }
.note { font-size: 9.5pt; color: #555; margin-top: 30mm; }
h2 { font-size: 15pt; margin: 9mm 0 3mm; page-break-after: avoid; }
h3 { font-size: 12.5pt; margin: 6mm 0 2mm; page-break-after: avoid; }
p { margin: 0 0 3mm; orphans: 3; widows: 3; text-align: left; }
blockquote { margin: 3mm 8mm; font-style: italic; }
table { border-collapse: collapse; width: 100%; margin: 3mm 0; font-size: 10pt; } td, th { border: 1px solid #bbb; padding: 1.5mm 2mm; vertical-align: top; }
ul, ol { margin: 0 0 3mm 6mm; }
</style></head><body>
<section class="cover"><div class="kicker">${esc(w.kicker)}</div><h1>${esc(TITLES[lang][rec.slug])}</h1>
<p class="sub">${esc(rec.subtitle?.[lang] || '')}</p><p class="credits">${esc(rec.credits?.[lang] || '')}</p><p class="note">${esc(w.note)}</p></section>
${rec.body[lang]}
</body></html>`;
}

const todo = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
  const rec = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  if (!rec.files?.pdf) continue;
  for (const lang of LANGS) {
    if (!rec.body?.[lang]) continue;
    if (!TITLES[lang][rec.slug]) { console.error(`FAIL: no ${lang} title for ${rec.slug}`); process.exit(1); }
    todo.push({ f, rec, lang });
  }
}
console.log(`${todo.length} PDF(s): ${todo.map((t) => `${t.rec.slug}-${t.lang}`).join(', ')}`);
if (!WRITE) process.exit(0);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext();
for (const { f, rec, lang } of todo) {
  const out = `textbooks/${rec.slug}-${lang}.pdf`;
  const tab = await ctx.newPage();
  await tab.setContent(page(rec, lang), { waitUntil: 'load' });
  await tab.pdf({ path: path.join('public', out), format: 'Letter', printBackground: false, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font-size:8pt;color:#777;text-align:center;font-family:Arial,sans-serif;">${esc(TITLES[lang][rec.slug])} · <span class="pageNumber"></span></div>` });
  await tab.close();
  const file = path.join(DIR, f);
  const raw = fs.readFileSync(file, 'utf8');
  const fresh = JSON.parse(raw);
  if (fresh.files.pdf[lang] !== out) {
    fresh.files.pdf[lang] = out;
    const indent = /\n {2}"/.test(raw) ? 2 : 1;
    fs.writeFileSync(file, JSON.stringify(fresh, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
  }
  console.log(`  wrote public/${out}`);
}
await browser.close();
