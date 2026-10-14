/* Shared helpers for the French build of the single-page courses (WiseSpeak,
 * Narrative Preaching, Counseling, Christian Ethics). They run on /fr/ only;
 * the English and Spanish pages are never touched.
 *
 * Their inline scripts build interface text as adjacent language spans:
 *   `<span class="lang-en">EN</span><span class="lang-es">ES</span>`
 * frenchRuntimeSpans() turns every such pair into the language-page helper
 * `${frBi(`EN`,`ES`,`FR`)}`, which shows French with English as the source.
 * Every pair must have French: a missing one fails the build. */
const PAIR = /<span class="lang-en">((?:(?!<span class="lang-en">)[\s\S])*?)<\/span>(\s*|`\s*\+\s*`)<span class="lang-es">((?:(?!<span class="lang-es">)[\s\S])*?)<\/span>/g;
export const BI_HELPER = 'function frBi(en,es,fr){return window.CTSLanguage.bi({en,es,fr});}';
export function frenchRuntimeSpans(code, table, label, helper = 'frBi') {
  const missing = new Set();
  const out = code.replace(PAIR, (whole, en, _sep, es) => {
    const fr = table[en];
    if (fr == null) { missing.add(en); return whole; }
    for (const s of [en, es, fr]) if (s.includes('`')) throw new Error(`${label}: backtick in runtime text ${s.slice(0, 60)}`);
    return '${' + helper + '(`' + en + '`,`' + es + '`,`' + fr + '`)}';
  });
  if (missing.size) throw new Error(`${label}: ${missing.size} runtime strings have no French: ${[...missing].map(s => JSON.stringify(s.slice(0, 80))).join(', ')}`);
  return out;
}
/* Exact replacements of English literals (alerts, placeholders) that the page
 * script chooses between with `document.body.classList.contains('spanish')`. */
export function replaceLiterals(code, literals, label) {
  for (const [en, fr] of Object.entries(literals)) {
    if (!code.includes(en)) throw new Error(`${label}: literal not found ${en.slice(0, 80)}`);
    code = code.replaceAll(en, fr);
  }
  return code;
}
export function replaceOnce(code, from, to, label) {
  if (!code.includes(from)) throw new Error(`${label}: expected code not found ${from.slice(0, 80)}`);
  return code.replace(from, to);
}
/* Page chrome shared by the French single-page courses: the browser title and
 * the old bilingual catalog link. */
export function pageChrome(root, title) {
  const t = root.querySelector('title'); if (t && title) t.set_content(title.replaceAll('&', '&amp;'));
  for (const a of root.querySelectorAll('a')) if (a.innerHTML.trim() === '📚 Catalog / Catálogo') a.set_content('📚 Catalogue');
  // Ethics still carries the old bilingual honours box (English over Spanish,
  // unmarked). Give it the shared box's language marking (src/lib/partials.ts
  // honoursBox) so the French interface pass translates it like every unit page.
  for (const box of root.querySelectorAll('[data-cts-rrbox]:not([data-cts-chrome])')) {
    const href = box.querySelector('a')?.getAttribute('href');
    if (!href) continue;
    box.setAttribute('data-cts-chrome', '');
    box.set_content('<div style="font-size:19px;font-weight:700;margin-bottom:8px;">📖 <span class="lang-en">Honors Readings</span><span class="lang-es">Lecturas con Honores</span></div>'
      + '<div style="font-size:14px;line-height:1.5;margin-bottom:14px;"><span class="lang-en">This class has five full readings &mdash; read any three in full to earn it <b>With Honors</b>.</span>'
      + '<span class="lang-es">Esta clase tiene cinco lecturas completas &mdash; lea tres completas para obtenerla <b>con Honores</b>.</span></div>'
      + `<a href="${href}" style="display:inline-block;background:#b08324;color:#3a1a1a;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:26px;font-size:16px;line-height:1.25;"><span class="lang-en">Open the Reading Room &rarr;</span><span class="lang-es">Abrir la Sala de Lecturas &rarr;</span></a>`);
  }
}
