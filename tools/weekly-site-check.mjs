// Weekly check of the live site (.github/workflows/weekly-site-check.yml), from the
// 6 Nov 2026 audit. Read only: it loads public pages and /api/health, never signs in,
// never registers, never touches student records. Exit code 1 and a list of problems
// when anything is wrong; the workflow then opens a GitHub issue.
//   node tools/weekly-site-check.mjs [base]
const BASES = process.argv[2] ? [process.argv[2]] : ['https://chapalaseminary.org', 'https://chapala-seminary.chapalatheological.workers.dev'];
const PAGES = [
  'index.html', 'es/index.html', 'fr/index.html', 'sw/index.html',
  'CTSUnit1.html', 'es/CTSUnit1.html', 'fr/CTSJohnUnit1.html', 'sw/CTSRomansUnit1.html',
  'CTSJohnCertificate.html', 'es/CTSJohnCertificate.html', 'CTSCSCertificate.html',
  'ethics_unit01.html', 'CTS_WiseSpeak_Preaching.html', 'CTSCounseling.html',
  'CTSTextbookCultsTest.html', 'CTSAbout.html', 'cts-confirm-email.html',
];
const GARBLED = /Ã[\u0080-¿¡-ÿ]|â€[™œ“”˜¦\u009D]/;          // text pasted with the wrong encoding
const BROKEN_TEMPLATE = /\$%7B|%24%7B/;                               // a script's ${...} turned into a link
const problems = [];
const fail = (msg) => { problems.push(msg); console.log('PROBLEM: ' + msg); };

async function get(base, path) {
  const url = `${base}/${path}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'CTS weekly site check' } });
    return { url, status: r.status, challenged: r.headers.get('cf-mitigated') === 'challenge', text: r.ok ? await r.text() : '' };
  } catch (e) { return { url, status: 0, error: e.message, text: '' }; }
}
async function pickBase() {
  for (const b of BASES) { const h = await get(b, 'api/health'); if (h.status === 200 && !h.challenged) return b; console.log(`(${b} not usable from here: HTTP ${h.status}${h.challenged ? ', Cloudflare challenge' : ''})`); }
  return null;
}
const base = await pickBase();
if (!base) fail('the site could not be reached at all (health check failed on every address)');
else {
  console.log(`Checking ${base}`);
  const health = await get(base, 'api/health');
  try { if (!JSON.parse(health.text).ok) fail('/api/health does not report ok'); } catch { fail('/api/health did not return its usual answer'); }
  const links = new Set();
  for (const pg of PAGES) {
    const r = await get(base, pg);
    if (r.status !== 200) { fail(`${pg} answered HTTP ${r.status}${r.error ? ' (' + r.error + ')' : ''}`); continue; }
    if (BROKEN_TEMPLATE.test(r.text)) fail(`${pg} contains a broken script link ("$%7B")`);
    const g = r.text.match(GARBLED); if (g) fail(`${pg} contains garbled text near "${r.text.slice(Math.max(0, g.index - 30), g.index + 20).replace(/\s+/g, ' ')}"`);
    if (pg.endsWith('index.html')) for (const m of r.text.matchAll(/href="([^"#?]+)/g)) {
      const h = m[1]; if (/^(?:[a-z]+:|\/\/)/i.test(h) || h.includes('${')) continue;
      links.add(h.startsWith('/') ? h.slice(1) : (pg.includes('/') ? pg.split('/')[0] + '/' : '') + h);
    }
  }
  let checked = 0;
  for (const l of links) {
    if (!l || l.endsWith('/')) continue;
    const r = await fetch(`${base}/${l}`, { method: 'HEAD', signal: AbortSignal.timeout(15000) }).catch(() => null);
    checked++;
    if (!r || r.status >= 400) fail(`link on a home page is broken: /${l} (HTTP ${r?.status ?? 'no answer'})`);
  }
  console.log(`${PAGES.length} pages and ${checked} home-page links checked`);
}
if (problems.length) { console.log(`\n${problems.length} problem(s) found.`); process.exit(1); }
console.log('All checks passed.');
